// RGB panel controller firmware.
//
// Architecture (see repo root plan / Arduino_code/SETUP.md):
//   ThingSpeak field1 is ONLY a revision counter the web app bumps whenever
//   this device's assigned scene/playlist changes. This firmware polls it
//   every ~10s; when it changes, it fetches the FULL scene/playlist content
//   (arbitrary size, unlike ThingSpeak's field limits) from the web app's
//   own /api/device-feed/[token] endpoint, caches it, and renders+animates
//   it entirely locally from then on - no further network traffic is needed
//   to animate. Playlists rotate on-device via local timers.
#include <Arduino.h>
#include <WiFi.h>
#include "esp_wpa2.h"
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <time.h>

#include <ESP32-HUB75-MatrixPanel-I2S-DMA.h>
#include <ESP32-HUB75-VirtualMatrixPanel_T.hpp>

#include "secrets.h"
#include "panel_config.h"
#include "elements.h"
#include "mood.h"

// ---------- WiFi ----------
const char *ssid = WIFI_SSID;
const char *wpa2Username = WIFI_USERNAME; // leave secrets.h's value empty for plain WPA2-Personal networks
const char *wifiPassword = WIFI_PASSWORD;

// ---------- ThingSpeak (trigger channel only - no scene content ever goes through this) ----------
const char *thingSpeakReadKey = THINGSPEAK_READ_API_KEY;
const char *thingSpeakWriteKey = THINGSPEAK_WRITE_API_KEY;
const char *thingSpeakChannelId = THINGSPEAK_CHANNEL_ID;

// ---------- NTP ----------
const char *ntpServer = "pool.ntp.org";
const long gmtOffsetSec = 19800; // IST (UTC+5:30) - change for your timezone
const int daylightOffsetSec = 0;

// ---------- Matrix ----------
MatrixPanel_I2S_DMA *dma_display = nullptr;
VirtualMatrixPanel_T<PANEL_CHAIN_TYPE> *display = nullptr;

// ---------- Content state ----------
DeviceFeed feed;
// The mood currently performing over the scene; inactive when none is set.
Mood activeMood;
uint32_t appliedRevision = 0;
bool haveFeed = false;
uint8_t currentPlaylistIndex = 0;
unsigned long playlistItemStartMs = 0;

// Shuffle resolves a whole pass up front rather than picking at random on each
// advance. Independent random picks can repeat a scene back-to-back and can
// starve others entirely; a shuffled order guarantees every scene plays once
// per cycle. Mirrors the web preview's behaviour in components/playlist-preview.tsx.
uint8_t playlistOrder[MAX_PLAYLIST_ITEMS];
uint8_t playlistPosition = 0;

// Applied settings, so we only touch the hardware when they actually change.
uint8_t appliedBrightness = 255;
String appliedTimezone = "";
bool timeConfigured = false;
bool wifiWasConnected = false;

// ---------- Timers ----------
unsigned long lastRevisionCheckMs = 0;
const unsigned long REVISION_CHECK_INTERVAL_MS = 10000;
unsigned long lastRenderMs = 0;
const unsigned long RENDER_INTERVAL_MS = 60; // ~16fps local animation - no network cost per frame
unsigned long lastHeartbeatMs = 0;
const unsigned long HEARTBEAT_INTERVAL_MS = 60000;
unsigned long lastWiFiRetryMs = 0;

void setupMatrix();
void setupWiFi();
void connectWiFiBlocking();
void setupTime();
uint32_t checkThingSpeakRevision();
bool fetchDeviceFeed();
void applyNewFeed();
Scene &currentScene();
void advancePlaylistIfNeeded(unsigned long now);
void sendHeartbeat();
String urlEncode(const String &str);
void applyDeviceSettings(const DeviceSettings &settings);
void buildPlaylistOrder();
void advanceToPlaylistItem(uint8_t orderPosition, unsigned long now);
void showBootMessage(const char *msg, uint8_t r, uint8_t g, uint8_t b);

void setup() {
  Serial.begin(115200);
  delay(500);
  Serial.println("\n---------- Boot ----------");

  setupMatrix();
  showBootMessage("Booting...", 255, 255, 0);

  // Without a seed, random() returns the same sequence after every reset, so
  // a shuffled playlist would play in the same "random" order forever.
  randomSeed((uint32_t)esp_random());

  setupWiFi();
  connectWiFiBlocking();
  if (WiFi.status() == WL_CONNECTED) {
    showBootMessage("WiFi OK", 0, 255, 0);
    setupTime();
  } else {
    showBootMessage("WiFi FAIL", 255, 0, 0);
  }
  delay(1000);
  display->clearScreen();
}

void loop() {
  unsigned long now = millis();

  const bool wifiUp = WiFi.status() == WL_CONNECTED;
  if (!wifiUp && now - lastWiFiRetryMs > 15000) {
    lastWiFiRetryMs = now;
    Serial.println("[main] WiFi disconnected, reconnecting...");
    WiFi.reconnect();
  }

  // NTP was previously configured once in setup(), so a device that booted
  // without WiFi never got the time and every clock element stayed blank.
  // Re-run it on each transition into "connected".
  if (wifiUp && !wifiWasConnected) {
    Serial.println("[main] WiFi up, (re)configuring time");
    setupTime();
  }
  wifiWasConnected = wifiUp;

  if (now - lastRevisionCheckMs > REVISION_CHECK_INTERVAL_MS) {
    lastRevisionCheckMs = now;
    uint32_t rev = checkThingSpeakRevision();
    if (rev != 0 && rev != appliedRevision) {
      Serial.printf("[main] revision changed %u -> %u, fetching content\n", appliedRevision, rev);
      if (fetchDeviceFeed()) {
        applyNewFeed();
        appliedRevision = rev;
      }
    }
  }

  if (haveFeed) {
    advancePlaylistIfNeeded(now);
    Scene &scene = currentScene();
    tickAnimations(scene, now);

    if (now - lastRenderMs > RENDER_INTERVAL_MS) {
      lastRenderMs = now;
      display->clearScreen();
      renderScene(*display, scene, now);
      // Composited last so the character and tint sit on top of the scene.
      renderMood(*display, activeMood, scene.width, scene.height, now);
    }
  }

  if (now - lastHeartbeatMs > HEARTBEAT_INTERVAL_MS) {
    lastHeartbeatMs = now;
    sendHeartbeat();
  }
}

// ---------- Setup helpers ----------

void setupMatrix() {
  // Field order is fixed by HUB75_I2S_CFG::i2s_pins: r1,g1,b1,r2,g2,b2,a,b,c,d,e,lat,oe,clk.
  // Values below are the existing physical wiring (see SETUP.md) - unchanged from before this migration.
  HUB75_I2S_CFG::i2s_pins pins = {
      27, 26, 14, // r1, g1, b1
      12, 25, 15, // r2, g2, b2
      32, 17, 33, 16, 5, // a, b, c, d, e
      2, 4, 1 // lat, oe, clk
  };
  HUB75_I2S_CFG mxconfig(PANEL_RES_X, PANEL_RES_Y, PANEL_CHAIN_LEN, pins);
  mxconfig.clkphase = false;

  dma_display = new MatrixPanel_I2S_DMA(mxconfig);
  dma_display->begin();
  dma_display->setBrightness8(128);
  dma_display->clearScreen();

  display = new VirtualMatrixPanel_T<PANEL_CHAIN_TYPE>(PANEL_GRID_ROWS, PANEL_GRID_COLS, PANEL_RES_X, PANEL_RES_Y);
  display->setDisplay(*dma_display);
  display->setTextWrap(false);
}

void setupWiFi() {
  WiFi.mode(WIFI_STA);
  if (strlen(wpa2Username) > 0) {
    // WPA2-Enterprise (e.g. university/office networks)
    esp_wifi_sta_wpa2_ent_set_identity((uint8_t *)wpa2Username, strlen(wpa2Username));
    esp_wifi_sta_wpa2_ent_set_username((uint8_t *)wpa2Username, strlen(wpa2Username));
    esp_wifi_sta_wpa2_ent_set_password((uint8_t *)wifiPassword, strlen(wifiPassword));
    esp_wifi_sta_wpa2_ent_enable();
    WiFi.begin(ssid);
  } else {
    // Plain WPA2-Personal
    WiFi.begin(ssid, wifiPassword);
  }
}

void connectWiFiBlocking() {
  Serial.print("Connecting WiFi");
  unsigned long start = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - start < 20000) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("WiFi connected: " + WiFi.localIP().toString());
  } else {
    Serial.println("WiFi connect failed (will keep retrying in loop())");
  }
}

// Timezone comes from the device's row in the web app, so changing it never
// needs a reflash. setenv("TZ") + tzset() is what makes localtime_r() (and so
// getLocalTime(), used by the clock element) honour it, including DST rules.
void setupTime() {
  configTime(0, 0, ntpServer, "time.nist.gov");

  // The web app stores POSIX TZ strings (see lib/timezones.ts) precisely
  // because this chip has no tzdata to resolve an IANA name like
  // "Asia/Kolkata" with. If one arrives anyway - an older row, or a hand-edited
  // value - say so rather than silently running on UTC.
  if (appliedTimezone.length() > 0 && appliedTimezone.indexOf('/') < 0) {
    setenv("TZ", appliedTimezone.c_str(), 1);
  } else {
    if (appliedTimezone.indexOf('/') >= 0) {
      Serial.printf("[main] timezone \"%s\" is an IANA name, which this device can't resolve; "
                    "set a POSIX TZ string in the web app instead. Falling back to the built-in offset.\n",
                    appliedTimezone.c_str());
    }
    // No usable value yet - fall back to the compile-time offset so a device
    // with no assignment still shows a plausible clock.
    static char fallback[32];
    snprintf(fallback, sizeof(fallback), "UTC%+ld", -gmtOffsetSec / 3600);
    setenv("TZ", fallback, 1);
  }
  tzset();
  timeConfigured = true;
}

// Brightness and timezone arrive with the content. Only touched when they
// change: setBrightness8() reprograms the DMA driver, and re-running tzset()
// on every fetch would be pointless churn.
void applyDeviceSettings(const DeviceSettings &settings) {
  const uint8_t scaled = (uint8_t)constrain((int)settings.brightness * 255 / 100, 1, 255);
  if (scaled != appliedBrightness) {
    appliedBrightness = scaled;
    dma_display->setBrightness8(scaled);
    Serial.printf("[main] brightness -> %u%% (%u/255)\n", settings.brightness, scaled);
  }

  if (settings.timezone != appliedTimezone) {
    appliedTimezone = settings.timezone;
    Serial.printf("[main] timezone -> %s\n", appliedTimezone.c_str());
    if (WiFi.status() == WL_CONNECTED) setupTime();
  }
}

void showBootMessage(const char *msg, uint8_t r, uint8_t g, uint8_t b) {
  display->clearScreen();
  display->setCursor(2, 2);
  display->setTextSize(1);
  display->setTextColor(display->color565(r, g, b));
  display->print(msg);
}

// ---------- ThingSpeak / device-feed ----------

uint32_t checkThingSpeakRevision() {
  if (WiFi.status() != WL_CONNECTED) return 0;

  HTTPClient http;
  String url = "https://api.thingspeak.com/channels/" + String(thingSpeakChannelId) +
               "/feeds/last.json?api_key=" + String(thingSpeakReadKey);
  http.begin(url);
  int httpCode = http.GET();
  if (httpCode != 200) {
    http.end();
    return 0;
  }
  String payload = http.getString();
  http.end();

  JsonDocument doc;
  if (deserializeJson(doc, payload)) return 0;

  const char *field1 = doc["field1"] | (const char *)nullptr;
  if (!field1) return 0;
  return (uint32_t)strtoul(field1, nullptr, 10);
}

bool fetchDeviceFeed() {
  if (WiFi.status() != WL_CONNECTED) return false;

  String url = String(BACKEND_BASE_URL) + "/api/device-feed/" + String(DEVICE_API_TOKEN);
  HTTPClient http;
  WiFiClientSecure secureClient;
  bool began;
  if (url.startsWith("https")) {
    secureClient.setInsecure();
    began = http.begin(secureClient, url);
  } else {
    began = http.begin(url);
  }
  if (!began) return false;

  int httpCode = http.GET();
  if (httpCode != 200) {
    Serial.printf("[main] device-feed fetch failed: %d\n", httpCode);
    http.end();
    return false;
  }
  String payload = http.getString();
  http.end();

  JsonDocument doc;
  DeserializationError err = deserializeJson(doc, payload);
  if (err) {
    Serial.printf("[main] device-feed JSON parse error: %s\n", err.c_str());
    return false;
  }

  DeviceFeed newFeed;
  if (!parseDeviceFeed(doc.as<JsonObjectConst>(), newFeed)) {
    Serial.println("[main] device-feed parsed but content was invalid/empty");
    return false;
  }

  // Free whatever image buffers the old feed was holding before we drop it.
  if (feed.isPlaylist) {
    for (uint8_t i = 0; i < feed.playlist.itemCount; i++) {
      freeSceneAssets(feed.playlist.items[i].scene);
    }
  } else {
    freeSceneAssets(feed.scene);
  }

  feed = newFeed;
  haveFeed = true;

  // The mood rides along in the same payload; its lifecycle clock starts now,
  // when the device applies it (the server's timestamp is on a different
  // clock, and the ESP32 has no reliable shared time base with it).
  parseMood(doc["mood"].as<JsonObjectConst>(), activeMood);
  if (activeMood.active) {
    Serial.printf("[main] mood: %s/%s for %us\n", activeMood.character.c_str(),
                  activeMood.emote.c_str(), activeMood.holdSeconds);
  }

  return true;
}

void applyNewFeed() {
  applyDeviceSettings(feed.settings);
  buildPlaylistOrder();
  playlistPosition = 0;
  currentPlaylistIndex = feed.isPlaylist && feed.playlist.itemCount > 0 ? playlistOrder[0] : 0;
  playlistItemStartMs = millis();
  loadSceneAssets(currentScene());
}

// Fills playlistOrder with 0..n-1, shuffled when the playlist asks for it.
// Fisher-Yates, same as components/playlist-preview.tsx - every scene plays
// once per cycle instead of independent picks that can repeat or starve.
void buildPlaylistOrder() {
  const uint8_t n = feed.isPlaylist ? feed.playlist.itemCount : 0;
  for (uint8_t i = 0; i < n; i++) playlistOrder[i] = i;
  if (!feed.playlist.shuffle || n < 2) return;

  for (uint8_t i = n - 1; i > 0; i--) {
    uint8_t j = (uint8_t)random(i + 1);
    uint8_t tmp = playlistOrder[i];
    playlistOrder[i] = playlistOrder[j];
    playlistOrder[j] = tmp;
  }
}

void advanceToPlaylistItem(uint8_t orderPosition, unsigned long now) {
  freeSceneAssets(feed.playlist.items[currentPlaylistIndex].scene);
  playlistPosition = orderPosition;
  currentPlaylistIndex = playlistOrder[playlistPosition];
  playlistItemStartMs = now;
  loadSceneAssets(feed.playlist.items[currentPlaylistIndex].scene);
}

Scene &currentScene() {
  if (feed.isPlaylist) return feed.playlist.items[currentPlaylistIndex].scene;
  return feed.scene;
}

void advancePlaylistIfNeeded(unsigned long now) {
  if (!feed.isPlaylist || feed.playlist.itemCount == 0) return;

  PlaylistItem &item = feed.playlist.items[currentPlaylistIndex];
  if (now - playlistItemStartMs < item.durationMs) return;

  const bool atEnd = (playlistPosition + 1 >= feed.playlist.itemCount);
  if (atEnd && !feed.playlist.loop) {
    playlistItemStartMs = now; // avoid re-checking every loop(); stay on the last item
    return;
  }

  if (atEnd) {
    // Reshuffle each lap, so a looping shuffled playlist doesn't repeat the
    // same "random" order forever.
    buildPlaylistOrder();
    advanceToPlaylistItem(0, now);
  } else {
    advanceToPlaylistItem(playlistPosition + 1, now);
  }
}

// ---------- Heartbeat ----------

void sendHeartbeat() {
  if (WiFi.status() != WL_CONNECTED) return;

  String msg = "up:" + String(millis() / 1000) + "s heap:" + String(ESP.getFreeHeap()) +
               " rssi:" + String(WiFi.RSSI());
  HTTPClient http;
  String url = "https://api.thingspeak.com/update?api_key=" + String(thingSpeakWriteKey) +
               "&field3=" + urlEncode(msg);
  http.begin(url);
  http.GET();
  http.end();
}

String urlEncode(const String &str) {
  String encoded;
  char hex[4];
  for (size_t i = 0; i < str.length(); i++) {
    char c = str.charAt(i);
    if (isalnum(c)) {
      encoded += c;
    } else if (c == ' ') {
      encoded += "%20";
    } else {
      sprintf(hex, "%%%02X", c);
      encoded += hex;
    }
  }
  return encoded;
}
