// Curated 16x16 bitmap icon set. Each icon is 16 rows of a uint16_t row-mask
// (bit 15 = leftmost column, bit 0 = rightmost column, 1 = pixel lit).
//
// This is a deliberately small STARTER set built from verifiable geometry
// (circles/lines computed from formulas, not hand-drawn pixel-by-pixel) so
// every icon here is known-correct. Color is applied at draw time by the
// scene author, so one shape covers several meanings — e.g. "dot" in yellow
// reads as a sun, in green as "online", in red as "recording".
//
// To add a new icon: append a `static const uint16_t MY_ICON[16] = {...}`
// below (16 row values, MSB-first) and one line in ICONS[]. Keep the same
// id string used here in sync with the web app's icon manifest
// (lib/icon-manifest.ts) — the editor must never let someone pick an icon
// the firmware can't draw.
#pragma once
#include <Arduino.h>
#include <Adafruit_GFX.h>

// Filled circle.
static const uint16_t ICON_DOT[16] = {
    0x0000, 0x07E0, 0x1FF8, 0x3FFC, 0x7FFE, 0x7FFE, 0xFFFF, 0xFFFF,
    0xFFFF, 0xFFFF, 0x7FFE, 0x7FFE, 0x3FFC, 0x1FF8, 0x07E0, 0x0000,
};

// Hollow circle (2px ring).
static const uint16_t ICON_RING[16] = {
    0x0000, 0x0420, 0x1818, 0x300C, 0x6006, 0x6006, 0xC003, 0xC003,
    0xC003, 0xC003, 0x6006, 0x6006, 0x300C, 0x1818, 0x0420, 0x0000,
};

// X / cross.
static const uint16_t ICON_CROSS[16] = {
    0xC003, 0xE007, 0x700E, 0x381C, 0x1C38, 0x0E70, 0x07E0, 0x03C0,
    0x03C0, 0x07E0, 0x0E70, 0x1C38, 0x381C, 0x700E, 0xE007, 0xC003,
};

// Filled triangle, apex up.
static const uint16_t ICON_TRIANGLE[16] = {
    0x0180, 0x0180, 0x03C0, 0x03C0, 0x07E0, 0x07E0, 0x0FF0, 0x0FF0,
    0x1FF8, 0x1FF8, 0x3FFC, 0x3FFC, 0x7FFE, 0x7FFE, 0xFFFF, 0xFFFF,
};

// Square outline (2px border).
static const uint16_t ICON_SQUARE[16] = {
    0xFFFF, 0xFFFF, 0xC003, 0xC003, 0xC003, 0xC003, 0xC003, 0xC003,
    0xC003, 0xC003, 0xC003, 0xC003, 0xC003, 0xC003, 0xFFFF, 0xFFFF,
};

struct IconDef {
  const char *id;
  const uint16_t *rows;
};

static const IconDef ICONS[] = {
    {"dot", ICON_DOT},
    {"ring", ICON_RING},
    {"cross", ICON_CROSS},
    {"triangle", ICON_TRIANGLE},
    {"square", ICON_SQUARE},
};
static const size_t ICONS_COUNT = sizeof(ICONS) / sizeof(ICONS[0]);

inline const uint16_t *findIcon(const char *id) {
  for (size_t i = 0; i < ICONS_COUNT; i++) {
    if (strcmp(ICONS[i].id, id) == 0) return ICONS[i].rows;
  }
  return nullptr;
}

// Draws a 16x16 icon at (x, y) in the given color, scaled by `scale` (1 = 16px, 2 = 32px, ...).
inline void drawIcon(Adafruit_GFX &d, const uint16_t rows[16], int16_t x, int16_t y, uint16_t color, uint8_t scale = 1) {
  for (int16_t row = 0; row < 16; row++) {
    for (int16_t col = 0; col < 16; col++) {
      if (rows[row] & (1 << (15 - col))) {
        if (scale == 1) {
          d.drawPixel(x + col, y + row, color);
        } else {
          d.fillRect(x + col * scale, y + row * scale, scale, scale, color);
        }
      }
    }
  }
}
