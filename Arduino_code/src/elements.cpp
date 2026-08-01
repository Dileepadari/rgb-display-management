#include "elements.h"
#include "icons.h"
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <time.h>
#include <math.h>

static const unsigned long WEATHER_REFRESH_MS = 20UL * 60UL * 1000UL; // 20 min

static inline uint16_t rgb565(uint8_t r, uint8_t g, uint8_t b) {
  return ((r & 0xF8) << 8) | ((g & 0xFC) << 3) | (b >> 3);
}

// Gamma-correct + clamp low values so dim colors don't look muddy/off on HUB75 panels.
static uint8_t gammaCorrect(uint8_t val) {
  return (uint8_t)(powf(val / 255.0f, 2.2f) * 255.0f);
}
static uint8_t clampLow(uint8_t val, uint8_t threshold = 8) {
  return val < threshold ? 0 : val;
}

static void hsvToRgb(float hueDeg, uint8_t &r, uint8_t &g, uint8_t &b) {
  hueDeg = fmodf(hueDeg, 360.0f);
  if (hueDeg < 0) hueDeg += 360.0f;
  float c = 255.0f;
  float x = c * (1 - fabsf(fmodf(hueDeg / 60.0f, 2.0f) - 1));
  float rf, gf, bf;
  if (hueDeg < 60) { rf = c; gf = x; bf = 0; }
  else if (hueDeg < 120) { rf = x; gf = c; bf = 0; }
  else if (hueDeg < 180) { rf = 0; gf = c; bf = x; }
  else if (hueDeg < 240) { rf = 0; gf = x; bf = c; }
  else if (hueDeg < 300) { rf = x; gf = 0; bf = c; }
  else { rf = c; gf = 0; bf = x; }
  r = (uint8_t)rf;
  g = (uint8_t)gf;
  b = (uint8_t)bf;
}

static ElementType parseType(const char *s) {
  if (!s) return ElementType::UNKNOWN;
  if (strcmp(s, "text") == 0) return ElementType::TEXT;
  if (strcmp(s, "scrollText") == 0) return ElementType::SCROLL_TEXT;
  if (strcmp(s, "image") == 0) return ElementType::IMAGE;
  if (strcmp(s, "clock") == 0) return ElementType::CLOCK;
  if (strcmp(s, "weather") == 0) return ElementType::WEATHER;
  if (strcmp(s, "icon") == 0) return ElementType::ICON;
  return ElementType::UNKNOWN;
}

static AnimType parseAnimType(const char *s) {
  if (!s) return AnimType::NONE;
  if (strcmp(s, "scroll") == 0) return AnimType::SCROLL;
  if (strcmp(s, "blink") == 0) return AnimType::BLINK;
  if (strcmp(s, "pulse") == 0) return AnimType::PULSE;
  if (strcmp(s, "rainbow") == 0) return AnimType::RAINBOW;
  if (strcmp(s, "bounce") == 0) return AnimType::BOUNCE;
  return AnimType::NONE;
}

bool parseElement(JsonObjectConst obj, Element &out) {
  out = Element(); // reset to defaults
  out.type = parseType(obj["type"] | (const char *)nullptr);
  if (out.type == ElementType::UNKNOWN) return false;

  out.x = obj["x"] | 0;
  out.y = obj["y"] | 0;
  out.visible = obj["visible"] | true;

  if (obj["color"].is<JsonArrayConst>()) {
    JsonArrayConst c = obj["color"];
    if (c.size() >= 3) {
      out.r = c[0] | 255;
      out.g = c[1] | 255;
      out.b = c[2] | 255;
    }
  }

  if (obj["animation"].is<JsonObjectConst>()) {
    JsonObjectConst anim = obj["animation"];
    out.animType = parseAnimType(anim["type"] | (const char *)nullptr);
    out.animSpeed = anim["speed"] | 0.0f;
  }

  switch (out.type) {
    case ElementType::TEXT:
    case ElementType::SCROLL_TEXT:
      out.text = String((const char *)(obj["text"] | ""));
      out.size = obj["size"] | 1;
      break;
    case ElementType::IMAGE:
      out.url = String((const char *)(obj["url"] | ""));
      out.imgWidth = obj["width"] | 0;
      out.imgHeight = obj["height"] | 0;
      break;
    case ElementType::CLOCK:
      out.format = String((const char *)(obj["format"] | "HH:mm"));
      out.size = obj["size"] | 1;
      break;
    case ElementType::WEATHER:
      out.lat = obj["lat"] | 0.0f;
      out.lon = obj["lon"] | 0.0f;
      out.size = obj["size"] | 1;
      break;
    case ElementType::ICON:
      out.iconId = String((const char *)(obj["id"] | ""));
      out.scale = obj["scale"] | 1;
      break;
    default:
      break;
  }
  return true;
}

bool parseScene(JsonObjectConst obj, Scene &out) {
  out = Scene();
  out.width = obj["width"] | 64;
  out.height = obj["height"] | 64;

  if (!obj["elements"].is<JsonArrayConst>()) return true; // empty scene is valid
  JsonArrayConst arr = obj["elements"];
  for (JsonObjectConst el : arr) {
    if (out.elementCount >= MAX_ELEMENTS) {
      Serial.println("[elements] scene has more elements than MAX_ELEMENTS, truncating");
      break;
    }
    if (parseElement(el, out.elements[out.elementCount])) {
      out.elementCount++;
    }
  }
  return true;
}

bool parseDeviceFeed(JsonObjectConst obj, DeviceFeed &out) {
  out = DeviceFeed();
  out.revision = obj["revision"] | 0;
  const char *feedType = obj["type"] | "scene";

  if (strcmp(feedType, "playlist") == 0 && obj["playlist"].is<JsonObjectConst>()) {
    out.isPlaylist = true;
    JsonObjectConst pl = obj["playlist"];
    out.playlist.loop = pl["loop"] | true;
    out.playlist.shuffle = pl["shuffle"] | false;

    if (pl["items"].is<JsonArrayConst>()) {
      JsonArrayConst items = pl["items"];
      for (JsonObjectConst item : items) {
        if (out.playlist.itemCount >= MAX_PLAYLIST_ITEMS) {
          Serial.println("[elements] playlist has more items than MAX_PLAYLIST_ITEMS, truncating");
          break;
        }
        PlaylistItem &dest = out.playlist.items[out.playlist.itemCount];
        dest.durationMs = (uint32_t)((item["duration"] | 10) * 1000UL);
        if (item["scene"].is<JsonObjectConst>()) {
          parseScene(item["scene"], dest.scene);
        }
        out.playlist.itemCount++;
      }
    }
    out.valid = out.playlist.itemCount > 0;
  } else if (obj["scene"].is<JsonObjectConst>()) {
    out.isPlaylist = false;
    out.valid = parseScene(obj["scene"], out.scene);
  }
  return out.valid;
}

void freeSceneAssets(Scene &scene) {
  for (uint8_t i = 0; i < scene.elementCount; i++) {
    Element &el = scene.elements[i];
    if (el.pixels) {
      free(el.pixels);
      el.pixels = nullptr;
    }
  }
}

void loadSceneAssets(Scene &scene) {
  freeSceneAssets(scene);
  if (WiFi.status() != WL_CONNECTED) return;

  for (uint8_t i = 0; i < scene.elementCount; i++) {
    Element &el = scene.elements[i];
    if (el.type != ElementType::IMAGE || el.url.length() == 0) continue;
    if (el.imgWidth == 0 || el.imgHeight == 0) continue;

    uint32_t pixelCount = (uint32_t)el.imgWidth * el.imgHeight;
    uint16_t *buf = (uint16_t *)malloc(pixelCount * sizeof(uint16_t));
    if (!buf) {
      Serial.println("[elements] out of memory decoding image element, skipping");
      continue;
    }

    WiFiClientSecure client;
    client.setInsecure(); // matches existing firmware's approach for image fetches
    HTTPClient http;
    http.begin(client, el.url);
    int httpCode = http.GET();
    if (httpCode != HTTP_CODE_OK) {
      Serial.printf("[elements] image fetch failed (%d): %s\n", httpCode, el.url.c_str());
      http.end();
      free(buf);
      continue;
    }

    WiFiClient *stream = http.getStreamPtr();
    uint8_t rgb[3];
    for (uint32_t p = 0; p < pixelCount; p++) {
      if (stream->readBytes(rgb, 3) != 3) break;
      uint8_t r = clampLow((uint8_t)(gammaCorrect(rgb[0]) * 0.9f));
      uint8_t g = clampLow((uint8_t)(gammaCorrect(rgb[1]) * 0.9f));
      uint8_t b = clampLow((uint8_t)(gammaCorrect(rgb[2]) * 0.9f));
      buf[p] = rgb565(r, g, b);
    }
    http.end();
    el.pixels = buf;
  }
}

static void fetchWeather(Element &el) {
  if (WiFi.status() != WL_CONNECTED) return;

  WiFiClientSecure client;
  client.setInsecure();
  HTTPClient http;
  char url[160];
  snprintf(url, sizeof(url),
           "https://api.open-meteo.com/v1/forecast?latitude=%.4f&longitude=%.4f&current=temperature_2m",
           el.lat, el.lon);
  http.begin(client, url);
  int httpCode = http.GET();
  if (httpCode == HTTP_CODE_OK) {
    JsonDocument doc;
    if (deserializeJson(doc, http.getString()) == DeserializationError::Ok) {
      el.weatherTempC = doc["current"]["temperature_2m"] | NAN;
    }
  } else {
    Serial.printf("[elements] weather fetch failed (%d)\n", httpCode);
  }
  http.end();
}

void tickAnimations(Scene &scene, unsigned long nowMs) {
  for (uint8_t i = 0; i < scene.elementCount; i++) {
    Element &el = scene.elements[i];

    unsigned long last = el.lastTickMs == 0 ? nowMs : el.lastTickMs;
    float dtSec = (nowMs - last) / 1000.0f;
    el.lastTickMs = nowMs;

    if (el.animType != AnimType::NONE) {
      el.animPhase += el.animSpeed * dtSec;
    }

    if (el.type == ElementType::WEATHER) {
      if (el.weatherLastFetchMs == 0 || (nowMs - el.weatherLastFetchMs) > WEATHER_REFRESH_MS) {
        fetchWeather(el);
        el.weatherLastFetchMs = nowMs;
      }
    }
  }
}

void renderScene(Adafruit_GFX &display, Scene &scene, unsigned long nowMs) {
  for (uint8_t i = 0; i < scene.elementCount; i++) {
    Element &el = scene.elements[i];
    if (!el.visible) continue;

    uint8_t rr = el.r, gg = el.g, bb = el.b;
    if (el.animType == AnimType::RAINBOW) {
      hsvToRgb(el.animPhase, rr, gg, bb);
    } else if (el.animType == AnimType::PULSE) {
      float factor = (sinf(el.animPhase * 2.0f * PI) + 1.0f) / 2.0f * 0.8f + 0.2f;
      rr = (uint8_t)(rr * factor);
      gg = (uint8_t)(gg * factor);
      bb = (uint8_t)(bb * factor);
    } else if (el.animType == AnimType::BLINK) {
      float onPhase = el.animPhase - floorf(el.animPhase);
      if (onPhase > 0.5f) continue; // blinked off this frame
    }
    uint16_t color = rgb565(rr, gg, bb);

    int16_t drawX = el.x, drawY = el.y;
    if (el.animType == AnimType::BOUNCE) {
      drawY += (int16_t)roundf(sinf(el.animPhase * 2.0f * PI) * 4.0f);
    }

    switch (el.type) {
      case ElementType::TEXT: {
        display.setTextSize(el.size);
        display.setTextColor(color);
        display.setCursor(drawX, drawY);
        display.print(el.text);
        break;
      }
      case ElementType::SCROLL_TEXT: {
        display.setTextSize(el.size);
        int16_t bx, by;
        uint16_t tw, th;
        display.getTextBounds(el.text, 0, 0, &bx, &by, &tw, &th);
        float totalTravel = tw + scene.width;
        float offset = fmodf(el.animPhase, totalTravel);
        int16_t sx = el.x + scene.width - (int16_t)offset;
        display.setTextColor(color);
        display.setCursor(sx, drawY);
        display.print(el.text);
        break;
      }
      case ElementType::IMAGE: {
        if (!el.pixels) break;
        for (uint16_t py = 0; py < el.imgHeight; py++) {
          for (uint16_t px = 0; px < el.imgWidth; px++) {
            display.drawPixel(drawX + px, drawY + py, el.pixels[(uint32_t)py * el.imgWidth + px]);
          }
        }
        break;
      }
      case ElementType::CLOCK: {
        struct tm timeinfo;
        if (getLocalTime(&timeinfo, 0)) {
          char buf[16];
          const char *fmt = el.format == "HH:mm:ss" ? "%H:%M:%S" : "%H:%M";
          strftime(buf, sizeof(buf), fmt, &timeinfo);
          display.setTextSize(el.size);
          display.setTextColor(color);
          display.setCursor(drawX, drawY);
          display.print(buf);
        }
        break;
      }
      case ElementType::WEATHER: {
        char buf[12];
        if (isnan(el.weatherTempC)) {
          strcpy(buf, "--");
        } else {
          snprintf(buf, sizeof(buf), "%.0fC", el.weatherTempC);
        }
        display.setTextSize(el.size);
        display.setTextColor(color);
        display.setCursor(drawX, drawY);
        display.print(buf);
        break;
      }
      case ElementType::ICON: {
        const uint16_t *rows = findIcon(el.iconId.c_str());
        if (rows) drawIcon(display, rows, drawX, drawY, color, el.scale);
        break;
      }
      default:
        break;
    }
  }
}
