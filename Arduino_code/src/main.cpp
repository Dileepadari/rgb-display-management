#include <Arduino.h>
#include <WiFi.h>
#include "esp_wpa2.h"
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <SPIFFS.h>
#include "GPxMatrix.h"
#include "secrets.h"

// ---------- WiFi ----------
const char* ssid = WIFI_SSID;
const char* username = WIFI_USERNAME; // your IIITH ID
const char* password = WIFI_PASSWORD;

// ---------- ThingSpeak ----------
const char* readAPIKey  = THINGSPEAK_READ_API_KEY;
const char* writeAPIKey = THINGSPEAK_WRITE_API_KEY;
const char* channelID   = THINGSPEAK_CHANNEL_ID;

// ---------- Matrix ----------
#define P_A    32
#define P_B    17
#define P_C    33
#define P_D    16
#define P_E    5
#define P_CLK  1
#define P_LAT  2
#define P_OE   4
uint8_t listrgbpins[6] = {27, 26, 14, 12, 25, 15};
GPxMatrix matrix(P_A, P_B, P_C, P_D, P_E, P_CLK, P_LAT, P_OE, true, 64, listrgbpins);

unsigned long lastCheck = 0;
const unsigned long checkInterval = 10000; // 10 sec
bool displayOn = true;
bool initial = true;

// ---------- Function declarations ----------
void checkThingSpeak();
void applyScene(JsonObject scene);
void renderObject(JsonObject obj);
void renderText(JsonObject obj);
void renderImage(JsonObject obj);
void sendStatus(int status = 0, String msg = "", String commandStr = "");
String urlEncode(String str);

void setup() {
  Serial.begin(115200);
  delay(500);
  Serial.println("\n---------- Boot ----------");

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid);

  esp_wifi_sta_wpa2_ent_set_identity((uint8_t *)username, strlen(username));
  esp_wifi_sta_wpa2_ent_set_username((uint8_t *)username, strlen(username));
  esp_wifi_sta_wpa2_ent_set_password((uint8_t *)password, strlen(password));
  esp_wifi_sta_wpa2_ent_enable();
  Serial.print("Connecting WiFi");
  WiFi.begin(ssid);
  unsigned long start = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - start < 15000) {
    delay(500);
    Serial.print(".");
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nConnected!");
    Serial.println(WiFi.localIP());
  }
  // Initialize matrix
  matrix.begin();
  matrix.fillScreen(0);
  matrix.swapBuffers(true);
}

// ---------- Loop ----------
void loop() {
  unsigned long now = millis();
  if (now - lastCheck > checkInterval) {
    lastCheck = now;
    checkThingSpeak();
  }
  delay(100);
}

// ---------- Fetch command ----------
void checkThingSpeak() {
  if (WiFi.status() != WL_CONNECTED) return;

  HTTPClient http;
  String url = "https://api.thingspeak.com/channels/" + String(channelID) +
               "/feeds/last.json?api_key=" + String(readAPIKey);
  http.begin(url);
  int httpCode = http.GET();
  if (httpCode != 200) {
    http.end();
    return;
  }

  String payload = http.getString();
  http.end();

  JsonDocument doc;
  if (deserializeJson(doc, payload)) {
    return;
  }

  String updateFlag = doc["field1"] | "";
  String commandStr = doc["field2"] | "";

  if (updateFlag == "1" && commandStr.length() > 0) {
    initial = false;
    JsonDocument sceneDoc;
    if (deserializeJson(sceneDoc, commandStr) == DeserializationError::Ok) {
      applyScene(sceneDoc["scene"]);
      sendStatus(0, "Scene rendered", commandStr);
    } else {
      sendStatus(0, "Scene parse error", commandStr);
    }
  } else if (initial == true) {
    sendStatus(1, "Device online", commandStr);
  }
}

// ---------- Apply scene ----------
void applyScene(JsonObject scene) {
  if (!scene.containsKey("objects")) {
    return;
  }

  matrix.fillScreen(0);
  JsonArray objects = scene["objects"].as<JsonArray>();
  for (JsonObject obj : objects) {
    renderObject(obj);
  }
  matrix.swapBuffers(true);
}

// ---------- Render object ----------
void renderObject(JsonObject obj) {
  String type = obj["type"] | "";
  if (type == "text") renderText(obj);
  else if (type == "image") renderImage(obj);
}

// ---------- Render text ----------
void renderText(JsonObject obj) {
  int x = obj["x"] | 0;
  int y = obj["y"] | 0;
  int size = obj["size"] | 1;
  const char* text = obj["text"] | "";
  JsonArray color = obj["color"];
  int r = color[0] | 255;
  int g = color[1] | 255;
  int b = color[2] | 255;

  matrix.setTextSize(size);
  matrix.setTextColor(matrix.Color888(r, g, b));
  matrix.setCursor(x, y);
  matrix.print(text);
}

uint8_t gammaCorrect(uint8_t val) {
  float gamma = 2.2;
  return pow(val / 255.0, gamma) * 255;
}

uint8_t clampLow(uint8_t val, uint8_t threshold = 8) {
  return val < threshold ? 0 : val;
}

void renderImage(JsonObject obj) {
  const char* url = obj["url"] | "";
  int x0 = obj["x"] | 0;
  int y0 = obj["y"] | 0;

  if (!WiFi.isConnected() || strlen(url) == 0) {
    return;
  }

  WiFiClientSecure client;
  client.setInsecure();  // Skip cert verification for now (test only)
  HTTPClient http;
  http.begin(client, url);
  int httpCode = http.GET();

  if (httpCode != HTTP_CODE_OK) {
    http.end();
    return;
  }

  WiFiClient *stream = http.getStreamPtr();
  uint8_t rgb[3];
  matrix.fillScreen(0);
  matrix.swapBuffers(true);

  for (int y = 0; y < 64; y++) {
    for (int x = 0; x < 64; x++) {
      if (stream->readBytes(rgb, 3) != 3) break;
      matrix.drawPixel(x, y, matrix.Color888(
        clampLow(gammaCorrect(rgb[0]) * 0.7),  // R
        clampLow(gammaCorrect(rgb[1]) * 0.7),  // G
        clampLow(gammaCorrect(rgb[2]) * 0.7)   // B
      ));

    }
  }

  http.end();
}

// ---------- URL Encoder ----------
String urlEncode(String str) {
  String encoded = "";
  char c;
  char hex[4];
  for (int i = 0; i < str.length(); i++) {
    c = str.charAt(i);
    if (isalnum(c)) encoded += c;
    else if (c == ' ') encoded += "%20";
    else { sprintf(hex, "%%%02X", c); encoded += hex; }
  }
  return encoded;
}

// ---------- Send status ----------
void sendStatus(int status, String msg, String commandStr) {
  if (WiFi.status() != WL_CONNECTED) return;

  HTTPClient http;
  String url = "https://api.thingspeak.com/update?api_key=" + String(writeAPIKey) +
               "&field1=" + String(status) + "&field2=" + urlEncode(commandStr) +
               "&field3=" + urlEncode(msg);
  http.begin(url);
  int httpCode = http.GET();
  http.end();
}
