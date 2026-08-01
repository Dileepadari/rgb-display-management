// Copy this file to secrets.h (gitignored) and fill in your real values.
#pragma once

#define WIFI_SSID "your-wifi-ssid"
#define WIFI_USERNAME "your-username"       // only needed for WPA2-Enterprise networks
#define WIFI_PASSWORD "your-wifi-password"

#define THINGSPEAK_READ_API_KEY "your-thingspeak-read-key"
#define THINGSPEAK_WRITE_API_KEY "your-thingspeak-write-key"
#define THINGSPEAK_CHANNEL_ID "your-channel-id"

// Base URL of the deployed web app (no trailing slash), e.g. "https://your-app.vercel.app"
// or "http://192.168.1.50:3000" for local-network testing.
#define BACKEND_BASE_URL "http://your-backend-host:3000"

// Per-device token from the devices.device_api_token column (set when the device
// row is created in the web app). Authenticates /api/device-feed/[token].
#define DEVICE_API_TOKEN "your-device-api-token"
