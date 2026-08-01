// Scene element model: parsing, per-element local animation, and rendering.
// This is the module that lets the website author "text + image + clock +
// weather + icon, all at once, animated" and have the ESP32 render and
// animate it entirely on its own, with no further network traffic beyond
// occasional weather refreshes and the image fetch done once per scene load.
//
// JSON contract (matches the web app's scene.elements shape):
//   { "type": "text", "x":0,"y":0,"size":2,"text":"Hi","color":[255,255,255],
//     "animation": {"type":"none","speed":0} }
//   { "type": "scrollText", ... same as text, animation.type usually "scroll" }
//   { "type": "image", "x":0,"y":0,"width":64,"height":64,"url":"https://.../f.raw" }
//   { "type": "clock", "x":0,"y":0,"size":2,"format":"HH:mm","color":[...] }
//   { "type": "weather", "x":0,"y":0,"size":1,"lat":17.4,"lon":78.3,"color":[...] }
//   { "type": "icon", "x":0,"y":0,"id":"dot","scale":2,"color":[...] }
//
// animation.type: "none" | "scroll" | "blink" | "pulse" | "rainbow" | "bounce"
// animation.speed: meaning depends on type (px/sec for scroll, Hz for
//   blink/pulse, degrees/sec of hue rotation for rainbow, px amplitude
//   cycles/sec for bounce). See tickAnimation() for the exact formula —
//   the web preview (lib/scene-compositor.ts, built against this same spec)
//   must match these formulas exactly.
#pragma once
#include <Arduino.h>
#include <ArduinoJson.h>
#include <Adafruit_GFX.h>

#define MAX_ELEMENTS 12
#define MAX_PLAYLIST_ITEMS 6

// If you enlarge these, re-check free heap (Serial prints it every heartbeat)
// — a plain ESP32 WROOM has ~320KB RAM total, shared with WiFi/TLS buffers
// and any in-flight image pixel buffers.

enum class ElementType { TEXT, SCROLL_TEXT, IMAGE, CLOCK, WEATHER, ICON, UNKNOWN };
enum class AnimType { NONE, SCROLL, BLINK, PULSE, RAINBOW, BOUNCE };

struct Element {
  ElementType type = ElementType::UNKNOWN;
  int16_t x = 0, y = 0;
  uint8_t r = 255, g = 255, b = 255;
  bool visible = true;
  AnimType animType = AnimType::NONE;
  float animSpeed = 0;

  // text / scrollText
  String text;
  uint8_t size = 1; // Adafruit_GFX text-size multiplier (1 unit ~= 8px tall)

  // image
  String url;
  uint16_t imgWidth = 0, imgHeight = 0;
  uint16_t *pixels = nullptr; // populated by loadSceneAssets(), owns this memory

  // clock
  String format = "HH:mm"; // supported: "HH:mm" or "HH:mm:ss"

  // weather
  float lat = 0, lon = 0;
  float weatherTempC = NAN;
  unsigned long weatherLastFetchMs = 0;

  // icon
  String iconId;
  uint8_t scale = 1;

  // shared animation runtime state
  float animPhase = 0;
  unsigned long lastTickMs = 0;
};

struct Scene {
  uint16_t width = 0, height = 0;
  uint8_t elementCount = 0;
  Element elements[MAX_ELEMENTS];
};

struct PlaylistItem {
  uint32_t durationMs = 10000;
  Scene scene;
};

struct Playlist {
  bool loop = true;
  bool shuffle = false;
  uint8_t itemCount = 0;
  PlaylistItem items[MAX_PLAYLIST_ITEMS];
};

struct DeviceFeed {
  bool valid = false;
  bool isPlaylist = false;
  uint32_t revision = 0;
  Scene scene;
  Playlist playlist;
};

// Parses one element from JSON into `out`. Returns false (and leaves `out`
// as ElementType::UNKNOWN) if the type is unrecognized — callers should skip
// unknown elements rather than fail the whole scene, so a firmware that's a
// version behind the web app degrades gracefully instead of showing nothing.
bool parseElement(JsonObjectConst obj, Element &out);

// Parses a full scene object ({"width","height","elements":[...]}) into `out`.
bool parseScene(JsonObjectConst obj, Scene &out);

// Parses the full /api/device-feed/[token] response into `out`.
bool parseDeviceFeed(JsonObjectConst obj, DeviceFeed &out);

// Fetches each image element's raw pixel bytes once and decodes into `pixels`.
// Call once per scene load (not per frame). Frees any previously-loaded
// buffers in `scene` first, so it's safe to call repeatedly.
void loadSceneAssets(Scene &scene);
void freeSceneAssets(Scene &scene);

// Advances animation state for every element in the scene. Call every loop()
// iteration; internally rate-limits per element so this is cheap to call often.
void tickAnimations(Scene &scene, unsigned long nowMs);

// Renders every visible element of the scene to the display. Does not clear
// the screen or call show()/flush() — caller controls that.
void renderScene(Adafruit_GFX &display, Scene &scene, unsigned long nowMs);
