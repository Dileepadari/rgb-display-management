// RGB panel controller firmware.
//
// Architecture (see repo root plan / Arduino_code/SETUP.md):
//   ThingSpeak field1 is ONLY a revision counter the web app bumps whenever
//   this device's assigned scene/playlist changes. This firmware polls it
//   every ~10s; when it changes, it fetches the FULL scene/playlist content
//   (arbitrary size, unlike ThingSpeak's field limits) from the web app's
//   own /api/device-feed/[token] endpoint, caches it, and renders+animates
//   it entirely locally from then on — no further network traffic is needed
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

// ---------- WiFi ----------
const char *ssid = WIFI_SSID;
const char *wpa2Username = WIFI_USERNAME; // leave secrets.h's value empty for plain WPA2-Personal networks
const char *wifiPassword = WIFI_PASSWORD;

// ---------- ThingSpeak (trigger channel only — no scene content ever goes through this) ----------
const char *thingSpeakReadKey = THINGSPEAK_READ_API_KEY;
const char *thingSpeakWriteKey = THINGSPEAK_WRITE_API_KEY;
const char *thingSpeakChannelId = THINGSPEAK_CHANNEL_ID;

// ---------- NTP ----------
const char *ntpServer = "pool.ntp.org";
const long gmtOffsetSec = 19800; // IST (UTC+5:30) — change for your timezone
const int daylightOffsetSec = 0;

// ---------- Matrix ----------
MatrixPanel_I2S_DMA *dma_display = nullptr;
VirtualMatrixPanel_T<PANEL_CHAIN_TYPE> *display = nullptr;

// ---------- Content state ----------
DeviceFeed feed;
uint32_t appliedRevision = 0;
bool haveFeed = false;
uint8_t currentPlaylistIndex = 0;
unsigned long playlistItemStartMs = 0;

// ---------- Timers ----------
unsigned long lastRevisionCheckMs = 0;
const unsigned long REVISION_CHECK_INTERVAL_MS = 10000;
unsigned long lastRenderMs = 0;
const unsigned long RENDER_INTERVAL_MS = 60; // ~16fps local animation — no network cost per frame
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
void showBootMessage(const char *msg, uint8_t r, uint8_t g, uint8_t b);

void setup() {
  Serial.begin(115200);
  delay(500);
  Serial.println("\n---------- Boot ----------");

  setupMatrix();
  showBootMessage("Booting...", 255, 255, 0);

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

  if (WiFi.status() != WL_CONNECTED && now - lastWiFiRetryMs > 15000) {
    lastWiFiRetryMs = now;
    Serial.println("[main] WiFi disconnected, reconnecting...");
    WiFi.reconnect();
  }

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
  // Values below are the existing physical wiring (see SETUP.md) — unchanged from before this migration.
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

void setupTime() {
  configTime(gmtOffsetSec, daylightOffsetSec, ntpServer);
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
  return true;
}

void applyNewFeed() {
  currentPlaylistIndex = 0;
  playlistItemStartMs = millis();
  loadSceneAssets(currentScene());
}

Scene &currentScene() {
  if (feed.isPlaylist) return feed.playlist.items[currentPlaylistIndex].scene;
  return feed.scene;
}

void advancePlaylistIfNeeded(unsigned long now) {
  if (!feed.isPlaylist || feed.playlist.itemCount == 0) return;

  PlaylistItem &item = feed.playlist.items[currentPlaylistIndex];
  if (now - playlistItemStartMs < item.durationMs) return;

  bool atEnd = (currentPlaylistIndex + 1 >= feed.playlist.itemCount);
  if (atEnd && !feed.playlist.loop) {
    playlistItemStartMs = now; // avoid re-checking every loop(); stay on the last item
    return;
  }

  freeSceneAssets(item.scene);
  currentPlaylistIndex = feed.playlist.shuffle
                              ? (uint8_t)random(feed.playlist.itemCount)
                              : (uint8_t)((currentPlaylistIndex + 1) % feed.playlist.itemCount);
  playlistItemStartMs = now;
  loadSceneAssets(feed.playlist.items[currentPlaylistIndex].scene);
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
