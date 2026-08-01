#include "mood.h"
#include "characters.h"
#include <math.h>

// ── Parsing ───────────────────────────────────────────────────────────────

static MoodEntrance parseEntrance(const char *s) {
  if (!s) return MoodEntrance::SLIDE_LEFT;
  if (strcmp(s, "slide-right") == 0) return MoodEntrance::SLIDE_RIGHT;
  if (strcmp(s, "drop") == 0) return MoodEntrance::DROP;
  if (strcmp(s, "fade") == 0) return MoodEntrance::FADE;
  if (strcmp(s, "pop") == 0) return MoodEntrance::POP;
  return MoodEntrance::SLIDE_LEFT;
}

static MoodPosition parsePosition(const char *s) {
  if (!s) return MoodPosition::BOTTOM_LEFT;
  if (strcmp(s, "bottom-right") == 0) return MoodPosition::BOTTOM_RIGHT;
  if (strcmp(s, "top-left") == 0) return MoodPosition::TOP_LEFT;
  if (strcmp(s, "top-right") == 0) return MoodPosition::TOP_RIGHT;
  if (strcmp(s, "center") == 0) return MoodPosition::CENTER;
  return MoodPosition::BOTTOM_LEFT;
}

// "#RRGGBB" -> components. Anything unparseable stays white, which with a low
// tint strength is close to a no-op rather than a visible glitch.
static void parseHexColor(const char *hex, uint8_t &r, uint8_t &g, uint8_t &b) {
  if (!hex || strlen(hex) < 7 || hex[0] != '#') return;
  auto nib = [](char c) -> uint8_t {
    if (c >= '0' && c <= '9') return c - '0';
    if (c >= 'a' && c <= 'f') return c - 'a' + 10;
    if (c >= 'A' && c <= 'F') return c - 'A' + 10;
    return 0;
  };
  r = (nib(hex[1]) << 4) | nib(hex[2]);
  g = (nib(hex[3]) << 4) | nib(hex[4]);
  b = (nib(hex[5]) << 4) | nib(hex[6]);
}

bool parseMood(JsonObjectConst obj, Mood &out) {
  if (obj.isNull()) {
    out.active = false;
    return false;
  }

  out.active = true;
  out.character = String((const char *)(obj["character"] | "cat"));
  out.emote = String((const char *)(obj["emote"] | "happy"));
  out.entrance = parseEntrance(obj["entrance"] | "slide-left");
  out.holdSeconds = obj["hold_seconds"] | 5;
  out.after = strcmp(obj["after"] | "leave", "stay") == 0 ? MoodAfter::STAY : MoodAfter::LEAVE;
  out.position = parsePosition(obj["position"] | "bottom-left");
  out.scale = obj["scale"] | 2;
  out.tintStrength = obj["tint_strength"] | 0;
  parseHexColor(obj["tint"] | "#ffffff", out.tintR, out.tintG, out.tintB);
  out.startedAtMs = millis();
  return true;
}

// ── Lifecycle (mirrors lib/mood-reaction.ts) ──────────────────────────────

static void restPosition(MoodPosition position, uint16_t panelWidth, uint16_t panelHeight,
                         uint16_t spritePx, int16_t &x, int16_t &y) {
  const int16_t margin = 1;
  const int16_t right = (int16_t)panelWidth - (int16_t)spritePx - margin;
  const int16_t bottom = (int16_t)panelHeight - (int16_t)spritePx - margin;
  switch (position) {
    case MoodPosition::BOTTOM_LEFT: x = margin; y = bottom; break;
    case MoodPosition::BOTTOM_RIGHT: x = right; y = bottom; break;
    case MoodPosition::TOP_LEFT: x = margin; y = margin; break;
    case MoodPosition::TOP_RIGHT: x = right; y = margin; break;
    case MoodPosition::CENTER:
      x = (int16_t)roundf(((float)panelWidth - spritePx) / 2.0f);
      y = (int16_t)roundf(((float)panelHeight - spritePx) / 2.0f);
      break;
  }
}

static float progress(float elapsed, float duration) {
  if (duration <= 0) return 1.0f;
  float t = elapsed / duration;
  return t < 0 ? 0 : (t > 1 ? 1 : t);
}

// Ease-out cubic, same curve as the web preview.
static float ease(float t) {
  float inv = 1.0f - t;
  return 1.0f - inv * inv * inv;
}

static void offsetFor(MoodEntrance entrance, int16_t restX, int16_t restY, float t,
                      uint16_t panelWidth, uint16_t spritePx, int16_t &x, int16_t &y) {
  switch (entrance) {
    case MoodEntrance::SLIDE_LEFT: {
      float from = -(float)spritePx;
      x = (int16_t)roundf(from + (restX - from) * t);
      y = restY;
      break;
    }
    case MoodEntrance::SLIDE_RIGHT: {
      float from = (float)panelWidth;
      x = (int16_t)roundf(from + (restX - from) * t);
      y = restY;
      break;
    }
    case MoodEntrance::DROP: {
      float from = -(float)spritePx;
      x = restX;
      y = (int16_t)roundf(from + (restY - from) * t);
      break;
    }
    // fade and pop arrive in place; their motion is opacity/scale.
    case MoodEntrance::FADE:
    case MoodEntrance::POP:
      x = restX;
      y = restY;
      break;
  }
}

MoodFrameState moodFrameState(const Mood &mood, uint16_t panelWidth, uint16_t panelHeight,
                              unsigned long elapsedMs) {
  MoodFrameState s;
  const uint16_t spritePx = CHARACTER_GRID_SIZE * mood.scale;
  int16_t restX, restY;
  restPosition(mood.position, panelWidth, panelHeight, spritePx, restX, restY);
  const unsigned long holdMs = (unsigned long)mood.holdSeconds * 1000UL;

  if (elapsedMs < MOOD_ENTRANCE_MS) {
    float t = ease(progress((float)elapsedMs, (float)MOOD_ENTRANCE_MS));
    offsetFor(mood.entrance, restX, restY, t, panelWidth, spritePx, s.x, s.y);
    s.phase = MoodPhase::ENTERING;
    s.opacity = mood.entrance == MoodEntrance::FADE ? t : 1.0f;
    s.scale = mood.entrance == MoodEntrance::POP
                  ? (uint8_t)max(1, (int)roundf(mood.scale * t))
                  : mood.scale;
    s.visible = true;
    return s;
  }

  if (elapsedMs < MOOD_ENTRANCE_MS + holdMs) {
    s.phase = MoodPhase::HOLDING;
    s.x = restX;
    s.y = restY;
    s.opacity = 1.0f;
    s.scale = mood.scale;
    s.visible = true;
    return s;
  }

  if (mood.after == MoodAfter::STAY) {
    s.phase = MoodPhase::RESTING;
    s.x = restX;
    s.y = restY;
    s.opacity = 1.0f;
    s.scale = mood.scale;
    s.visible = true;
    return s;
  }

  const unsigned long exitElapsed = elapsedMs - MOOD_ENTRANCE_MS - holdMs;
  if (exitElapsed < MOOD_EXIT_MS) {
    float t = ease(progress((float)exitElapsed, (float)MOOD_EXIT_MS));
    offsetFor(mood.entrance, restX, restY, 1.0f - t, panelWidth, spritePx, s.x, s.y);
    s.phase = MoodPhase::LEAVING;
    s.opacity = mood.entrance == MoodEntrance::FADE ? 1.0f - t : 1.0f;
    s.scale = mood.entrance == MoodEntrance::POP
                  ? (uint8_t)max(1, (int)roundf(mood.scale * (1.0f - t)))
                  : mood.scale;
    s.visible = true;
    return s;
  }

  s.phase = MoodPhase::GONE;
  s.x = restX;
  s.y = restY;
  s.opacity = 0.0f;
  s.scale = mood.scale;
  s.visible = false;
  return s;
}

// ── Rendering ─────────────────────────────────────────────────────────────

static uint16_t rgb565(uint8_t r, uint8_t g, uint8_t b) {
  return ((r & 0xF8) << 8) | ((g & 0xFC) << 3) | (b >> 3);
}

void renderMood(Adafruit_GFX &display, const Mood &mood, uint16_t panelWidth, uint16_t panelHeight,
                unsigned long nowMs) {
  if (!mood.active) return;

  const unsigned long elapsed = nowMs - mood.startedAtMs;
  MoodFrameState s = moodFrameState(mood, panelWidth, panelHeight, elapsed);
  if (!s.visible) return;

  // Tint wash. Adafruit_GFX has no read-back, so this can't blend with what's
  // underneath — instead it lays down a sparse dither of the tint colour whose
  // density tracks tint_strength. At panel distance that reads as a colour
  // wash while leaving most of the scene visible through the gaps.
  const uint8_t strength = (uint8_t)(mood.tintStrength * s.opacity);
  if (strength > 0) {
    const uint16_t tint = rgb565(mood.tintR, mood.tintG, mood.tintB);
    // step 2 => every other pixel (~50%), rising to every pixel at 100%.
    const uint8_t step = strength >= 100 ? 1 : (uint8_t)max(2, (int)roundf(100.0f / strength));
    for (uint16_t y = 0; y < panelHeight; y++) {
      for (uint16_t x = (y % step); x < panelWidth; x += step) {
        display.drawPixel(x, y, tint);
      }
    }
  }

  drawCharacter(display, mood.character.c_str(), mood.emote.c_str(), s.x, s.y, s.scale, elapsed);
}
