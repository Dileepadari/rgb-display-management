// Mood reactions: a character that arrives on top of whatever scene is
// playing, performs an emote, then either stays or leaves.
//
// The lifecycle maths here mirrors lib/mood-reaction.ts exactly. That file is
// the written spec and the web preview's implementation; this is the panel's.
// If you change a duration or easing curve, change it in both - the whole
// point of previewing a mood in the browser is that the panel does the same
// thing.
//
// JSON contract (the `mood` object from /api/device-feed/[token]):
//   { "character":"cat", "emote":"wave", "entrance":"slide-left",
//     "hold_seconds":5, "after":"leave", "position":"bottom-left",
//     "scale":2, "tint":"#FFD23F", "tint_strength":20,
//     "started_at":"2026-08-01T12:00:00Z" }
#pragma once
#include <Arduino.h>
#include <ArduinoJson.h>
#include <Adafruit_GFX.h>

static const uint16_t MOOD_ENTRANCE_MS = 600;
static const uint16_t MOOD_EXIT_MS = 600;

enum class MoodEntrance { SLIDE_LEFT, SLIDE_RIGHT, DROP, FADE, POP };
enum class MoodAfter { STAY, LEAVE };
enum class MoodPosition { BOTTOM_LEFT, BOTTOM_RIGHT, TOP_LEFT, TOP_RIGHT, CENTER };
enum class MoodPhase { ENTERING, HOLDING, LEAVING, RESTING, GONE };

struct Mood {
  bool active = false;
  String character;
  String emote;
  MoodEntrance entrance = MoodEntrance::SLIDE_LEFT;
  uint16_t holdSeconds = 5;
  MoodAfter after = MoodAfter::LEAVE;
  MoodPosition position = MoodPosition::BOTTOM_LEFT;
  uint8_t scale = 2;
  uint8_t tintR = 255, tintG = 255, tintB = 255;
  uint8_t tintStrength = 0; // 0-100

  // millis() at which this reaction began on-device. The server sends an
  // absolute timestamp, but the ESP32 has no reliable shared clock with it,
  // so the reaction starts when the device applies it.
  unsigned long startedAtMs = 0;
};

struct MoodFrameState {
  MoodPhase phase;
  int16_t x;
  int16_t y;
  float opacity;
  uint8_t scale;
  bool visible;
};

bool parseMood(JsonObjectConst obj, Mood &out);

// Mirrors moodFrameState() in lib/mood-reaction.ts.
MoodFrameState moodFrameState(const Mood &mood, uint16_t panelWidth, uint16_t panelHeight,
                              unsigned long elapsedMs);

// Composites the tint wash and the character over the already-rendered scene.
// Call after renderScene(), every frame.
void renderMood(Adafruit_GFX &display, const Mood &mood, uint16_t panelWidth, uint16_t panelHeight,
                unsigned long nowMs);
