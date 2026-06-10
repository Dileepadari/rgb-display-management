// 64x64 HUB75 Panel Example (By Bitluni + modified for 64 height)

#include <Arduino.h>
#include <WiFi.h>
#include <time.h>
#include "GPxMatrix.h"

#define P_A    32
#define P_B    17
#define P_C    33
#define P_D    16
#define P_E    5
#define P_CLK  1 
#define P_LAT  2 
#define P_OE   4

// RGB pins for HUB75
// R1, G1, B1, R2, G2, B2
uint8_t listrgbpins[6] = {27, 26, 14, 12, 25, 15};

// Now tell the library it's 64x64 (width=64, height=64)
GPxMatrix matrix(
  P_A, P_B, P_C, P_D, P_E,
  P_CLK, P_LAT, P_OE,
  true,        // double buffering on/off
  64,          // width only (library decides height/chaining)
  listrgbpins  // array of 6 rgb pins
);

// WiFi credentials - UPDATE THESE WITH YOUR NETWORK INFO
const char* ssid = "charan's galaxy";
const char* password = "REDACTED";

// NTP server settings for IST (Indian Standard Time)
const char* ntpServer = "pool.ntp.org";
const long gmtOffset_sec = 19800;  // IST is UTC+5:30 (5.5 * 3600 = 19800 seconds)
const int daylightOffset_sec = 0;  // IST doesn't use daylight saving

// Time variables
struct tm timeinfo;
bool time_set = false;

uint32_t lastTime; 
#define clear()  fillScreen(0)
#define show()   swapBuffers(true)
int16_t          hue = 0;
bool flasher = true;

void setup()
{
  Serial.begin(115200);
  delay(1000);

  // Initialize matrix
  matrix.begin();
  matrix.setTextWrap(false);
  matrix.setTextSize(2);

  // Connect to WiFi
  Serial.print("Connecting to WiFi");
  WiFi.begin(ssid, password);
  
  // Display connection status on matrix
  matrix.clear();
  matrix.setCursor(2, 2);
  matrix.setTextColor(matrix.Color888(255, 255, 0)); // Yellow
  matrix.print("WiFi...");
  matrix.show();
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println();
  Serial.println("WiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  // Initialize and get the time from NTP server
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  
  // Display syncing message
  matrix.clear();
  matrix.setCursor(2, 2);
  matrix.setTextColor(matrix.Color888(0, 255, 0)); // Green
  matrix.print("Sync...");
  matrix.show();
  
  // Wait for time synchronization
  Serial.print("Synchronizing time");
  int attempts = 0;
  while (!getLocalTime(&timeinfo) && attempts < 10) {
    Serial.print(".");
    delay(1000);
    attempts++;
  }
  
  if (attempts < 10) {
    Serial.println();
    Serial.println("Time synchronized!");
    Serial.print("Current time: ");
    Serial.println(&timeinfo, "%A, %B %d %Y %H:%M:%S");
    time_set = true;
    
    // Show success message
    matrix.clear();
    matrix.setCursor(2, 2);
    matrix.setTextColor(matrix.Color888(0, 255, 0)); // Green
    matrix.print("Ready!");
    matrix.show();
    delay(2000);
  } else {
    Serial.println();
    Serial.println("Failed to synchronize time!");
    
    // Show error message
    matrix.clear();
    matrix.setCursor(2, 2);
    matrix.setTextColor(matrix.Color888(255, 0, 0)); // Red
    matrix.print("Error!");
    matrix.show();
    delay(2000);
  }
}

/// Draw bouncing balls
void balls()
{
  static const uint16_t c[4] = {
    matrix.Color888(0, 255, 0),
    matrix.Color888(0, 255, 255),
    matrix.Color888(255, 0, 255),
    matrix.Color888(255, 255, 0)
  };
  
  static float y[4] = {32, 32, 32, 32};
  static float x[4] = {32, 32, 32, 32};
  static float vx[4] = {.02, -0.14, .10, -.06};
  static float vy[4] = {0, 2, 4, 6};
  static unsigned long lastT = 0;
  
  unsigned long t = millis();
  float dt = (t - lastT) * 0.001f;
  lastT = t;
  const int r = 8;
  
  for (int i = 0; i < 4; i++)
  {
    int rx = r;
    int ry = r;
    vy[i] += -9.81f * dt * 100;
    x[i] += vx[i];
    y[i] += vy[i] * dt;

    if (y[i] < r && vy[i] < 0) {
      vy[i] = 200 + i * 12;
      ry = y[i];
    }
    if (x[i] < r && vx[i] < 0) {
      vx[i] = -vx[i];
      rx = x[i];
    }
    if (x[i] >= matrix.width() - r && vx[i] > 0) {
      vx[i] = -vx[i];
      rx = matrix.width() - x[i];
    }

    matrix.fillEllipse(x[i], matrix.height() - y[i] - 1, rx, ry, c[i]);
    matrix.ellipse(x[i], matrix.height() - y[i] - 1, rx, ry,
                   matrix.ColorHSV(hue*(i+1), 255, 255, true));
  }
}

// Function to get formatted time string
String getTimeString(bool showColon) {
  if (!time_set) return "00:00:00";
  
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    return "00:00:00";
  }
  
  char timeStringBuff[50];
  if (showColon) {
    strftime(timeStringBuff, sizeof(timeStringBuff), "%H:%M:%S", &timeinfo);
  } else {
    strftime(timeStringBuff, sizeof(timeStringBuff), "%H %M:%S", &timeinfo);
  }
  return String(timeStringBuff);
}

// Main loop
void loop()
{
  if (millis() - lastTime >= 1000) {
    flasher = !flasher;
    lastTime = millis();
  }
  
  matrix.clear();
  matrix.setCursor(2, 2);  // adjusted for 64x64
  matrix.setTextColor(matrix.ColorHSV(hue, 255, 255, true));
  matrix.print(getTimeString(flasher));
  
  balls();
  matrix.show();
  
  hue++;
  if (hue >= 1536) hue -= 1536;
}
