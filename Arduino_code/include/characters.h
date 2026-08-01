// GENERATED FILE - do not edit by hand.
// Regenerate with: npx vite-node scripts/generate-characters-header.ts
// Source of truth: lib/character-sprites.ts
//
// Animated 16x16 pixel characters. Each frame is 16 rows of
// 16 legend codes; '.' is transparent, every other code indexes that
// character's palette. Colours are RGB565, matching the panel's native format.
#pragma once
#include <Arduino.h>
#include <Adafruit_GFX.h>

static const uint8_t CHARACTER_GRID_SIZE = 16;

struct CharacterPaletteEntry {
  char code;
  uint16_t color;
};

struct CharacterEmoteDef {
  const char *id;
  uint8_t fps;
  uint8_t frameCount;
  const char *const *const *frames; // frames[frame][row]
};

struct CharacterDef {
  const char *id;
  const CharacterPaletteEntry *palette;
  uint8_t paletteCount;
  const CharacterEmoteDef *emotes;
  uint8_t emoteCount;
};

// ── Cat ─────────────────────────────────────────────────────────
static const CharacterPaletteEntry CAT_PALETTE[] = {{'o', 0x20C2}, {'b', 0xF507}, {'l', 0xFF16}, {'e', 0xFFFF}, {'p', 0x20C2}, {'n', 0xFBD3}, {'w', 0x8EBF}, {'h', 0xFAF1}};

static const char *const CAT_IDLE_F0[16] = {
    "..o.........o...", "..oo.......oo...", ".obbo.....obbo..", ".obbboooooobbbo.", ".obbbbbbbbbbbbo.", ".obeeebbbbeeebo.", ".obepebbbbepebo.", ".obeeebbbbeeebo.", ".obbbbbnnbbbbbo.", ".obbbboooobbbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const CAT_IDLE_F1[16] = {
    "..o.........o...", "..oo.......oo...", ".obbo.....obbo..", ".obbboooooobbbo.", ".obbbbbbbbbbbbo.", ".obeeebbbbeeebo.", ".obepebbbbepebo.", ".obeeebbbbeeebo.", ".obbbbbnnbbbbbo.", ".obbbboooobbbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const CAT_IDLE_F2[16] = {
    "..o.........o...", "..oo.......oo...", ".obbo.....obbo..", ".obbboooooobbbo.", ".obbbbbbbbbbbbo.", ".obeeebbbbeeebo.", ".obepebbbbepebo.", ".obeeebbbbeeebo.", ".obbbbbnnbbbbbo.", ".obbbboooobbbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const CAT_IDLE_F3[16] = {
    "..o.........o...", "..oo.......oo...", ".obbo.....obbo..", ".obbboooooobbbo.", ".obbbbbbbbbbbbo.", ".obeeebbbbeeebo.", ".obepebbbbepebo.", ".obeeebbbbeeebo.", ".obbbbbnnbbbbbo.", ".obbbboooobbbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const CAT_IDLE_F4[16] = {
    "..o.........o...", "..oo.......oo...", ".obbo.....obbo..", ".obbboooooobbbo.", ".obbbbbbbbbbbbo.", ".obeeebbbbeeebo.", ".obepebbbbepebo.", ".obeeebbbbeeebo.", ".obbbbbnnbbbbbo.", ".obbbboooobbbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const CAT_IDLE_F5[16] = {
    "..o.........o...", "..oo.......oo...", ".obbo.....obbo..", ".obbboooooobbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obooobbbbooobo.", ".obbbbbbbbbbbbo.", ".obbbbbnnbbbbbo.", ".obbbboooobbbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const *const CAT_IDLE_FRAMES[] = {CAT_IDLE_F0, CAT_IDLE_F1, CAT_IDLE_F2, CAT_IDLE_F3, CAT_IDLE_F4, CAT_IDLE_F5};

static const char *const CAT_HAPPY_F0[16] = {
    "..o.........o...", "..oo.......oo...", ".obbo.....obbo..", ".obbboooooobbbo.", ".obbbbbbbbbbbbo.", ".obbobobbobobbo.", ".obobbbobobbboo.", ".ohbbbbbbbbbbho.", ".obbbbbnnbbbbbo.", ".obbboooooobbbo.", "..obbbllllbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const CAT_HAPPY_F1[16] = {
    "..oo.......oo...", ".obbo.....obbo..", ".obbboooooobbbo.", ".obbbbbbbbbbbbo.", ".obbobobbobobbo.", ".obobbbobobbboo.", ".ohbbbbbbbbbbho.", ".obbbbbnnbbbbbo.", ".obbboooooobbbo.", "..obbbllllbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...", "................",
};
static const char *const *const CAT_HAPPY_FRAMES[] = {CAT_HAPPY_F0, CAT_HAPPY_F1};

static const char *const CAT_SAD_F0[16] = {
    "..o.........o...", "..oo.......oo...", ".obbo.....obbo..", ".obbboooooobbbo.", ".obbbobbbbobbbo.", ".oboobbbbbboobo.", ".obeeebbbbeeebo.", ".obepebbbbepebo.", ".obbbbbnnbbbbbo.", ".obwbboooobbbbo.", "..owbobbbbobbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const CAT_SAD_F1[16] = {
    "..o.........o...", "..oo.......oo...", ".obbo.....obbo..", ".obbboooooobbbo.", ".obbbobbbbobbbo.", ".oboobbbbbboobo.", ".obeeebbbbeeebo.", ".obepebbbbepebo.", ".obbbbbnnbbbbbo.", ".obbbboooobbbbo.", "..obbobbbbobbo..", "...wooooooooo...", "...wobbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const *const CAT_SAD_FRAMES[] = {CAT_SAD_F0, CAT_SAD_F1};

static const char *const CAT_WAVE_F0[16] = {
    "..o.........o...", "..oo.......oo...", ".obbo.....obbo..", ".obbboooooobbbo.", ".obbbbbbbbbbbbo.", ".obbobobbobobbo.", ".obobbbobobbboo.", ".ohbbbbbbbbbbho.", ".obbbbbnnbbbbbo.", ".obbboooooobobb.", "..obbbllllbbobb.", "...oooooooooobo.", "....obbbbbbo.bo.", "...obbbbbbbbobo.", "...obbbbbbbbobo.", "...oo......oo...",
};
static const char *const CAT_WAVE_F1[16] = {
    "..o.........o...", "..oo.......oo...", ".obbo.....obbo..", ".obbboooooobbbo.", ".obbbbbbbbbbbbo.", ".obbobobbobobbo.", ".obobbbobobbboo.", ".ohbbbbbbbbbbho.", ".obbbbbnnbbbbbo.", ".obbboooooobbbo.", "..obbbllllbbbo..", "...oooooooooo...", "....obbbbbbo.bo.", "...obbbbbbbbobo.", "...obbbbbbbbobb.", "...oo......oobb.",
};
static const char *const *const CAT_WAVE_FRAMES[] = {CAT_WAVE_F0, CAT_WAVE_F1};

static const char *const CAT_SLEEP_F0[16] = {
    "..o.........o...", "..oo.......oo...", ".obbo.....obbo..", ".obbboooooobbbww", ".obbbbbbbbbbbwo.", ".obbbbbbbbbbwwo.", ".obooobbbbooobo.", ".obbbbbbbbbbbbo.", ".obbbbbnnbbbbbo.", ".obbbbboobbbbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const CAT_SLEEP_F1[16] = {
    "..o.........o.ww", "..oo.......oow..", ".obbo.....obww..", ".obbboooooobbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obooobbbbooobo.", ".obbbbbbbbbbbbo.", ".obbbbbnnbbbbbo.", ".obbbbboobbbbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const *const CAT_SLEEP_FRAMES[] = {CAT_SLEEP_F0, CAT_SLEEP_F1};

static const char *const CAT_LOVE_F0[16] = {
    "..o.........o...", "h.ho.......oo...", "hhhbo.....obbo..", ".hbbboooooobbbo.", ".obbbbbbbbbbbbo.", ".obhbhbbbbhbhbo.", ".obhhhbbbbhhhbo.", ".obbhbbbbbbhbbo.", ".obbbbbnnbbbbbo.", ".obbboooooobbbo.", "..obbbllllbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const CAT_LOVE_F1[16] = {
    "..o.........oh.h", "..oo.......oohhh", ".obbo.....obboh.", ".obbboooooobbbo.", ".obbbbbbbbbbbbo.", ".obhbhbbbbhbhbo.", ".obhhhbbbbhhhbo.", ".obbhbbbbbbhbbo.", ".obbbbbnnbbbbbo.", ".obbboooooobbbo.", "..obbbllllbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const *const CAT_LOVE_FRAMES[] = {CAT_LOVE_F0, CAT_LOVE_F1};

static const char *const CAT_ANGRY_F0[16] = {
    "..o.........o...", "..oo.......oo...", ".obbo.....obbo..", ".obbboooooobbbo.", ".oboobbbbbboobo.", ".obbbobbbbobbbo.", ".obeeebbbbeeebo.", ".obepebbbbepebo.", ".obbbbbnnbbbbbo.", ".bboboooooobobb.", ".bboboboobobobb.", ".oboooooooooobo.", ".ob.obbbbbbo.bo.", ".obobbbbbbbbobo.", ".obobbbbbbbbobo.", "...oo......oo...",
};
static const char *const CAT_ANGRY_F1[16] = {
    "..o.........o...", "..oo.......oo...", ".obbo.....obbo..", ".obbboooooobbbo.", ".oboobbbbbboobo.", ".obbbobbbbobbbo.", ".obeeebbbbeeebo.", ".obepebbbbepebo.", ".obbbbbnnbbbbbo.", ".obbboooooobbbo.", "..obboboobobbo..", "...oooooooooo...", ".ob.obbbbbbo.bo.", ".obobbbbbbbbobo.", ".bbobbbbbbbbobb.", ".bboo......oobb.",
};
static const char *const *const CAT_ANGRY_FRAMES[] = {CAT_ANGRY_F0, CAT_ANGRY_F1};

static const char *const CAT_DANCE_F0[16] = {
    "..oo.......oo...", ".obbo.....obbo..", ".obbboooooobbbo.", ".obbbbbbbbbbbbo.", ".obbobobbbbbbbo.", ".obobbbobbeeebo.", ".obbbbbbbbepebo.", ".obbbbbnnbbbbbo.", ".bboboooooobbbo.", ".bbobbllllbbbo..", ".oboooooooooo...", ".ob.obbbbbbo.bo.", ".obobbbbbbbbobo.", ".obobbbbbbbbobb.", "...oo......oobb.", "................",
};
static const char *const CAT_DANCE_F1[16] = {
    "................", "..o.........o...", "..oo.......oo...", ".obbo.....obbo..", ".obbboooooobbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obeeebbbbooobo.", ".obepebbbbbbbbo.", ".obbbbbnnbbbbbo.", ".obbbobbbbobobb.", "..obbboooobbobb.", "...oooooooooobo.", ".ob.obbbbbbo.bo.", ".obobbbbbbbbobo.", ".bbobbbbbbbbobo.",
};
static const char *const *const CAT_DANCE_FRAMES[] = {CAT_DANCE_F0, CAT_DANCE_F1};

static const char *const CAT_THINK_F0[16] = {
    "..o.........o...", "..oo.......oo..w", ".obbo.....obboww", ".obbboooooobbwww", ".oboobbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obeeebbbbooobo.", ".obepebbbbbbbbo.", ".obbbbbnnbbbbbo.", ".obbbbbbooobbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const CAT_THINK_F1[16] = {
    "..o.........o.ww", "..oo.......oowww", ".obbo.....obwwww", ".obbboooooobbbo.", ".oboobbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obeeebbbbooobo.", ".obepebbbbbbbbo.", ".obbbbbnnbbbbbo.", ".obbbbbbooobbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const *const CAT_THINK_FRAMES[] = {CAT_THINK_F0, CAT_THINK_F1};

static const CharacterEmoteDef CAT_EMOTES[] = {
    {"idle", 2, 6, CAT_IDLE_FRAMES},
    {"happy", 4, 2, CAT_HAPPY_FRAMES},
    {"sad", 2, 2, CAT_SAD_FRAMES},
    {"wave", 3, 2, CAT_WAVE_FRAMES},
    {"sleep", 1, 2, CAT_SLEEP_FRAMES},
    {"love", 3, 2, CAT_LOVE_FRAMES},
    {"angry", 6, 2, CAT_ANGRY_FRAMES},
    {"dance", 5, 2, CAT_DANCE_FRAMES},
    {"think", 2, 2, CAT_THINK_FRAMES},
};

// ── Dog ─────────────────────────────────────────────────────────
static const CharacterPaletteEntry DOG_PALETTE[] = {{'o', 0x28E2}, {'b', 0xCC07}, {'l', 0xF6F7}, {'e', 0xFFFF}, {'p', 0x28E2}, {'n', 0x3943}, {'w', 0x8EBF}, {'h', 0xFAF1}};

static const char *const DOG_IDLE_F0[16] = {
    "...oooooooooo...", "..obbbbbbbbbbo..", "obbobbbbbbbbobbo", "obbobbbbbbbbobbo", "obbobbbbbbbbobbo", "obbeeebbbbeeebbo", "obbepebbbbepebbo", "obbeeebbbbeeebbo", "obbobbbnnbbbobbo", ".oobbboooobbboo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const DOG_IDLE_F1[16] = {
    "...oooooooooo...", "..obbbbbbbbbbo..", "obbobbbbbbbbobbo", "obbobbbbbbbbobbo", "obbobbbbbbbbobbo", "obbeeebbbbeeebbo", "obbepebbbbepebbo", "obbeeebbbbeeebbo", "obbobbbnnbbbobbo", ".oobbboooobbboo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const DOG_IDLE_F2[16] = {
    "...oooooooooo...", "..obbbbbbbbbbo..", "obbobbbbbbbbobbo", "obbobbbbbbbbobbo", "obbobbbbbbbbobbo", "obbeeebbbbeeebbo", "obbepebbbbepebbo", "obbeeebbbbeeebbo", "obbobbbnnbbbobbo", ".oobbboooobbboo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const DOG_IDLE_F3[16] = {
    "...oooooooooo...", "..obbbbbbbbbbo..", "obbobbbbbbbbobbo", "obbobbbbbbbbobbo", "obbobbbbbbbbobbo", "obbeeebbbbeeebbo", "obbepebbbbepebbo", "obbeeebbbbeeebbo", "obbobbbnnbbbobbo", ".oobbboooobbboo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const DOG_IDLE_F4[16] = {
    "...oooooooooo...", "..obbbbbbbbbbo..", "obbobbbbbbbbobbo", "obbobbbbbbbbobbo", "obbobbbbbbbbobbo", "obbeeebbbbeeebbo", "obbepebbbbepebbo", "obbeeebbbbeeebbo", "obbobbbnnbbbobbo", ".oobbboooobbboo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const DOG_IDLE_F5[16] = {
    "...oooooooooo...", "..obbbbbbbbbbo..", "obbobbbbbbbbobbo", "obbobbbbbbbbobbo", "obbobbbbbbbbobbo", "obbobbbbbbbbobbo", "obbooobbbbooobbo", "obbobbbbbbbbobbo", "obbobbbnnbbbobbo", ".oobbboooobbboo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const *const DOG_IDLE_FRAMES[] = {DOG_IDLE_F0, DOG_IDLE_F1, DOG_IDLE_F2, DOG_IDLE_F3, DOG_IDLE_F4, DOG_IDLE_F5};

static const char *const DOG_HAPPY_F0[16] = {
    "...oooooooooo...", "..obbbbbbbbbbo..", "obbobbbbbbbbobbo", "obbobbbbbbbbobbo", "obbobbbbbbbbobbo", "obboobobboboobbo", "obbobbbobobboobo", "obhobbbbbbbbohbo", "obbobbbnnbbbobbo", ".oobboooooobboo.", "..obbbllllbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const DOG_HAPPY_F1[16] = {
    "..obbbbbbbbbbo..", "obbobbbbbbbbobbo", "obbobbbbbbbbobbo", "obbobbbbbbbbobbo", "obboobobboboobbo", "obbobbbobobboobo", "obhobbbbbbbbohbo", "obbobbbnnbbbobbo", ".oobboooooobboo.", "..obbbllllbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...", "................",
};
static const char *const *const DOG_HAPPY_FRAMES[] = {DOG_HAPPY_F0, DOG_HAPPY_F1};

static const char *const DOG_SAD_F0[16] = {
    "...oooooooooo...", "..obbbbbbbbbbo..", "obbobbbbbbbbobbo", "obbobbbbbbbbobbo", "obbobobbbbobobbo", "obboobbbbbboobbo", "obbeeebbbbeeebbo", "obbepebbbbepebbo", "obbobbbnnbbbobbo", ".oowbboooobbboo.", "..owbobbbbobbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const DOG_SAD_F1[16] = {
    "...oooooooooo...", "..obbbbbbbbbbo..", "obbobbbbbbbbobbo", "obbobbbbbbbbobbo", "obbobobbbbobobbo", "obboobbbbbboobbo", "obbeeebbbbeeebbo", "obbepebbbbepebbo", "obbobbbnnbbbobbo", ".oobbboooobbboo.", "..obbobbbbobbo..", "...wooooooooo...", "...wobbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const *const DOG_SAD_FRAMES[] = {DOG_SAD_F0, DOG_SAD_F1};

static const char *const DOG_WAVE_F0[16] = {
    "...oooooooooo...", "..obbbbbbbbbbo..", "obbobbbbbbbbobbo", "obbobbbbbbbbobbo", "obbobbbbbbbbobbo", "obboobobboboobbo", "obbobbbobobboobo", "obhobbbbbbbbohbo", "obbobbbnnbbbobbo", ".oobboooooobobb.", "..obbbllllbbobb.", "...oooooooooobo.", "....obbbbbbo.bo.", "...obbbbbbbbobo.", "...obbbbbbbbobo.", "...oo......oo...",
};
static const char *const DOG_WAVE_F1[16] = {
    "...oooooooooo...", "..obbbbbbbbbbo..", "obbobbbbbbbbobbo", "obbobbbbbbbbobbo", "obbobbbbbbbbobbo", "obboobobboboobbo", "obbobbbobobboobo", "obhobbbbbbbbohbo", "obbobbbnnbbbobbo", ".oobboooooobboo.", "..obbbllllbbbo..", "...oooooooooo...", "....obbbbbbo.bo.", "...obbbbbbbbobo.", "...obbbbbbbbobb.", "...oo......oobb.",
};
static const char *const *const DOG_WAVE_FRAMES[] = {DOG_WAVE_F0, DOG_WAVE_F1};

static const char *const DOG_SLEEP_F0[16] = {
    "...oooooooooo...", "..obbbbbbbbbbo..", "obbobbbbbbbbobbo", "obbobbbbbbbbobww", "obbobbbbbbbbowbo", "obbobbbbbbbbwwbo", "obbooobbbbooobbo", "obbobbbbbbbbobbo", "obbobbbnnbbbobbo", ".oobbbboobbbboo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const DOG_SLEEP_F1[16] = {
    "...oooooooooo.ww", "..obbbbbbbbbbw..", "obbobbbbbbbbwwbo", "obbobbbbbbbbobbo", "obbobbbbbbbbobbo", "obbobbbbbbbbobbo", "obbooobbbbooobbo", "obbobbbbbbbbobbo", "obbobbbnnbbbobbo", ".oobbbboobbbboo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const *const DOG_SLEEP_FRAMES[] = {DOG_SLEEP_F0, DOG_SLEEP_F1};

static const char *const DOG_LOVE_F0[16] = {
    "...oooooooooo...", "h.hbbbbbbbbbbo..", "hhhobbbbbbbbobbo", "ohbobbbbbbbbobbo", "obbobbbbbbbbobbo", "obbhbhbbbbhbhbbo", "obbhhhbbbbhhhbbo", "obbohbbbbbbhobbo", "obbobbbnnbbbobbo", ".oobboooooobboo.", "..obbbllllbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const DOG_LOVE_F1[16] = {
    "...ooooooooooh.h", "..obbbbbbbbbbhhh", "obbobbbbbbbbobho", "obbobbbbbbbbobbo", "obbobbbbbbbbobbo", "obbhbhbbbbhbhbbo", "obbhhhbbbbhhhbbo", "obbohbbbbbbhobbo", "obbobbbnnbbbobbo", ".oobboooooobboo.", "..obbbllllbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const *const DOG_LOVE_FRAMES[] = {DOG_LOVE_F0, DOG_LOVE_F1};

static const char *const DOG_ANGRY_F0[16] = {
    "...oooooooooo...", "..obbbbbbbbbbo..", "obbobbbbbbbbobbo", "obbobbbbbbbbobbo", "obboobbbbbboobbo", "obbobobbbbobobbo", "obbeeebbbbeeebbo", "obbepebbbbepebbo", "obbobbbnnbbbobbo", ".bboboooooobobb.", ".bboboboobobobb.", ".oboooooooooobo.", ".ob.obbbbbbo.bo.", ".obobbbbbbbbobo.", ".obobbbbbbbbobo.", "...oo......oo...",
};
static const char *const DOG_ANGRY_F1[16] = {
    "...oooooooooo...", "..obbbbbbbbbbo..", "obbobbbbbbbbobbo", "obbobbbbbbbbobbo", "obboobbbbbboobbo", "obbobobbbbobobbo", "obbeeebbbbeeebbo", "obbepebbbbepebbo", "obbobbbnnbbbobbo", ".oobboooooobboo.", "..obboboobobbo..", "...oooooooooo...", ".ob.obbbbbbo.bo.", ".obobbbbbbbbobo.", ".bbobbbbbbbbobb.", ".bboo......oobb.",
};
static const char *const *const DOG_ANGRY_FRAMES[] = {DOG_ANGRY_F0, DOG_ANGRY_F1};

static const char *const DOG_DANCE_F0[16] = {
    "..obbbbbbbbbbo..", "obbobbbbbbbbobbo", "obbobbbbbbbbobbo", "obbobbbbbbbbobbo", "obboobobbbbbobbo", "obbobbbobbeeebbo", "obbobbbbbbepebbo", "obbobbbnnbbbobbo", ".bboboooooobboo.", ".bbobbllllbbbo..", ".oboooooooooo...", ".ob.obbbbbbo.bo.", ".obobbbbbbbbobo.", ".obobbbbbbbbobb.", "...oo......oobb.", "................",
};
static const char *const DOG_DANCE_F1[16] = {
    "................", "...oooooooooo...", "..obbbbbbbbbbo..", "obbobbbbbbbbobbo", "obbobbbbbbbbobbo", "obbobbbbbbbbobbo", "obbobbbbbbbbobbo", "obbeeebbbbooobbo", "obbepebbbbbbobbo", "obbobbbnnbbbobbo", ".oobbobbbbobobb.", "..obbboooobbobb.", "...oooooooooobo.", ".ob.obbbbbbo.bo.", ".obobbbbbbbbobo.", ".bbobbbbbbbbobo.",
};
static const char *const *const DOG_DANCE_FRAMES[] = {DOG_DANCE_F0, DOG_DANCE_F1};

static const char *const DOG_THINK_F0[16] = {
    "...oooooooooo...", "..obbbbbbbbbbo.w", "obbobbbbbbbbobww", "obbobbbbbbbbowww", "obboobbbbbbbobbo", "obbobbbbbbbbobbo", "obbeeebbbbooobbo", "obbepebbbbbbobbo", "obbobbbnnbbbobbo", ".oobbbbbooobboo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const DOG_THINK_F1[16] = {
    "...oooooooooo.ww", "..obbbbbbbbbbwww", "obbobbbbbbbbwwww", "obbobbbbbbbbobbo", "obboobbbbbbbobbo", "obbobbbbbbbbobbo", "obbeeebbbbooobbo", "obbepebbbbbbobbo", "obbobbbnnbbbobbo", ".oobbbbbooobboo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const *const DOG_THINK_FRAMES[] = {DOG_THINK_F0, DOG_THINK_F1};

static const CharacterEmoteDef DOG_EMOTES[] = {
    {"idle", 2, 6, DOG_IDLE_FRAMES},
    {"happy", 4, 2, DOG_HAPPY_FRAMES},
    {"sad", 2, 2, DOG_SAD_FRAMES},
    {"wave", 3, 2, DOG_WAVE_FRAMES},
    {"sleep", 1, 2, DOG_SLEEP_FRAMES},
    {"love", 3, 2, DOG_LOVE_FRAMES},
    {"angry", 6, 2, DOG_ANGRY_FRAMES},
    {"dance", 5, 2, DOG_DANCE_FRAMES},
    {"think", 2, 2, DOG_THINK_FRAMES},
};

// ── Bunny ───────────────────────────────────────────────────────
static const CharacterPaletteEntry BUNNY_PALETTE[] = {{'o', 0x3988}, {'b', 0xEF1D}, {'l', 0xFEBC}, {'e', 0xFFFF}, {'p', 0x3988}, {'n', 0xFBD3}, {'w', 0x8EBF}, {'h', 0xFAF1}};

static const char *const BUNNY_IDLE_F0[16] = {
    "..oo.......oo...", ".obbo.....obbo..", ".obbo.....obbo..", ".obbooooooobbo..", ".obbbbbbbbbbbo..", ".obeeebbbbeeebo.", ".obepebbbbepebo.", ".obeeebbbbeeebo.", ".obbbbbnnbbbbbo.", ".obbbboooobbbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const BUNNY_IDLE_F1[16] = {
    "..oo.......oo...", ".obbo.....obbo..", ".obbo.....obbo..", ".obbooooooobbo..", ".obbbbbbbbbbbo..", ".obeeebbbbeeebo.", ".obepebbbbepebo.", ".obeeebbbbeeebo.", ".obbbbbnnbbbbbo.", ".obbbboooobbbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const BUNNY_IDLE_F2[16] = {
    "..oo.......oo...", ".obbo.....obbo..", ".obbo.....obbo..", ".obbooooooobbo..", ".obbbbbbbbbbbo..", ".obeeebbbbeeebo.", ".obepebbbbepebo.", ".obeeebbbbeeebo.", ".obbbbbnnbbbbbo.", ".obbbboooobbbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const BUNNY_IDLE_F3[16] = {
    "..oo.......oo...", ".obbo.....obbo..", ".obbo.....obbo..", ".obbooooooobbo..", ".obbbbbbbbbbbo..", ".obeeebbbbeeebo.", ".obepebbbbepebo.", ".obeeebbbbeeebo.", ".obbbbbnnbbbbbo.", ".obbbboooobbbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const BUNNY_IDLE_F4[16] = {
    "..oo.......oo...", ".obbo.....obbo..", ".obbo.....obbo..", ".obbooooooobbo..", ".obbbbbbbbbbbo..", ".obeeebbbbeeebo.", ".obepebbbbepebo.", ".obeeebbbbeeebo.", ".obbbbbnnbbbbbo.", ".obbbboooobbbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const BUNNY_IDLE_F5[16] = {
    "..oo.......oo...", ".obbo.....obbo..", ".obbo.....obbo..", ".obbooooooobbo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obooobbbbooobo.", ".obbbbbbbbbbbbo.", ".obbbbbnnbbbbbo.", ".obbbboooobbbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const *const BUNNY_IDLE_FRAMES[] = {BUNNY_IDLE_F0, BUNNY_IDLE_F1, BUNNY_IDLE_F2, BUNNY_IDLE_F3, BUNNY_IDLE_F4, BUNNY_IDLE_F5};

static const char *const BUNNY_HAPPY_F0[16] = {
    "..oo.......oo...", ".obbo.....obbo..", ".obbo.....obbo..", ".obbooooooobbo..", ".obbbbbbbbbbbo..", ".obbobobbobobbo.", ".obobbbobobbboo.", ".ohbbbbbbbbbbho.", ".obbbbbnnbbbbbo.", ".obbboooooobbbo.", "..obbbllllbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const BUNNY_HAPPY_F1[16] = {
    ".obbo.....obbo..", ".obbo.....obbo..", ".obbooooooobbo..", ".obbbbbbbbbbbo..", ".obbobobbobobbo.", ".obobbbobobbboo.", ".ohbbbbbbbbbbho.", ".obbbbbnnbbbbbo.", ".obbboooooobbbo.", "..obbbllllbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...", "................",
};
static const char *const *const BUNNY_HAPPY_FRAMES[] = {BUNNY_HAPPY_F0, BUNNY_HAPPY_F1};

static const char *const BUNNY_SAD_F0[16] = {
    "..oo.......oo...", ".obbo.....obbo..", ".obbo.....obbo..", ".obbooooooobbo..", ".obbbobbbbobbo..", ".oboobbbbbboobo.", ".obeeebbbbeeebo.", ".obepebbbbepebo.", ".obbbbbnnbbbbbo.", ".obwbboooobbbbo.", "..owbobbbbobbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const BUNNY_SAD_F1[16] = {
    "..oo.......oo...", ".obbo.....obbo..", ".obbo.....obbo..", ".obbooooooobbo..", ".obbbobbbbobbo..", ".oboobbbbbboobo.", ".obeeebbbbeeebo.", ".obepebbbbepebo.", ".obbbbbnnbbbbbo.", ".obbbboooobbbbo.", "..obbobbbbobbo..", "...wooooooooo...", "...wobbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const *const BUNNY_SAD_FRAMES[] = {BUNNY_SAD_F0, BUNNY_SAD_F1};

static const char *const BUNNY_WAVE_F0[16] = {
    "..oo.......oo...", ".obbo.....obbo..", ".obbo.....obbo..", ".obbooooooobbo..", ".obbbbbbbbbbbo..", ".obbobobbobobbo.", ".obobbbobobbboo.", ".ohbbbbbbbbbbho.", ".obbbbbnnbbbbbo.", ".obbboooooobobb.", "..obbbllllbbobb.", "...oooooooooobo.", "....obbbbbbo.bo.", "...obbbbbbbbobo.", "...obbbbbbbbobo.", "...oo......oo...",
};
static const char *const BUNNY_WAVE_F1[16] = {
    "..oo.......oo...", ".obbo.....obbo..", ".obbo.....obbo..", ".obbooooooobbo..", ".obbbbbbbbbbbo..", ".obbobobbobobbo.", ".obobbbobobbboo.", ".ohbbbbbbbbbbho.", ".obbbbbnnbbbbbo.", ".obbboooooobbbo.", "..obbbllllbbbo..", "...oooooooooo...", "....obbbbbbo.bo.", "...obbbbbbbbobo.", "...obbbbbbbbobb.", "...oo......oobb.",
};
static const char *const *const BUNNY_WAVE_FRAMES[] = {BUNNY_WAVE_F0, BUNNY_WAVE_F1};

static const char *const BUNNY_SLEEP_F0[16] = {
    "..oo.......oo...", ".obbo.....obbo..", ".obbo.....obbo..", ".obbooooooobboww", ".obbbbbbbbbbbw..", ".obbbbbbbbbbwwo.", ".obooobbbbooobo.", ".obbbbbbbbbbbbo.", ".obbbbbnnbbbbbo.", ".obbbbboobbbbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const BUNNY_SLEEP_F1[16] = {
    "..oo.......oo.ww", ".obbo.....obbw..", ".obbo.....obww..", ".obbooooooobbo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obooobbbbooobo.", ".obbbbbbbbbbbbo.", ".obbbbbnnbbbbbo.", ".obbbbboobbbbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const *const BUNNY_SLEEP_FRAMES[] = {BUNNY_SLEEP_F0, BUNNY_SLEEP_F1};

static const char *const BUNNY_LOVE_F0[16] = {
    "..oo.......oo...", "hohbo.....obbo..", "hhhbo.....obbo..", ".hbbooooooobbo..", ".obbbbbbbbbbbo..", ".obhbhbbbbhbhbo.", ".obhhhbbbbhhhbo.", ".obbhbbbbbbhbbo.", ".obbbbbnnbbbbbo.", ".obbboooooobbbo.", "..obbbllllbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const BUNNY_LOVE_F1[16] = {
    "..oo.......ooh.h", ".obbo.....obbhhh", ".obbo.....obboh.", ".obbooooooobbo..", ".obbbbbbbbbbbo..", ".obhbhbbbbhbhbo.", ".obhhhbbbbhhhbo.", ".obbhbbbbbbhbbo.", ".obbbbbnnbbbbbo.", ".obbboooooobbbo.", "..obbbllllbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const *const BUNNY_LOVE_FRAMES[] = {BUNNY_LOVE_F0, BUNNY_LOVE_F1};

static const char *const BUNNY_ANGRY_F0[16] = {
    "..oo.......oo...", ".obbo.....obbo..", ".obbo.....obbo..", ".obbooooooobbo..", ".oboobbbbbbooo..", ".obbbobbbbobbbo.", ".obeeebbbbeeebo.", ".obepebbbbepebo.", ".obbbbbnnbbbbbo.", ".bboboooooobobb.", ".bboboboobobobb.", ".oboooooooooobo.", ".ob.obbbbbbo.bo.", ".obobbbbbbbbobo.", ".obobbbbbbbbobo.", "...oo......oo...",
};
static const char *const BUNNY_ANGRY_F1[16] = {
    "..oo.......oo...", ".obbo.....obbo..", ".obbo.....obbo..", ".obbooooooobbo..", ".oboobbbbbbooo..", ".obbbobbbbobbbo.", ".obeeebbbbeeebo.", ".obepebbbbepebo.", ".obbbbbnnbbbbbo.", ".obbboooooobbbo.", "..obboboobobbo..", "...oooooooooo...", ".ob.obbbbbbo.bo.", ".obobbbbbbbbobo.", ".bbobbbbbbbbobb.", ".bboo......oobb.",
};
static const char *const *const BUNNY_ANGRY_FRAMES[] = {BUNNY_ANGRY_F0, BUNNY_ANGRY_F1};

static const char *const BUNNY_DANCE_F0[16] = {
    ".obbo.....obbo..", ".obbo.....obbo..", ".obbooooooobbo..", ".obbbbbbbbbbbo..", ".obbobobbbbbbbo.", ".obobbbobbeeebo.", ".obbbbbbbbepebo.", ".obbbbbnnbbbbbo.", ".bboboooooobbbo.", ".bbobbllllbbbo..", ".oboooooooooo...", ".ob.obbbbbbo.bo.", ".obobbbbbbbbobo.", ".obobbbbbbbbobb.", "...oo......oobb.", "................",
};
static const char *const BUNNY_DANCE_F1[16] = {
    "................", "..oo.......oo...", ".obbo.....obbo..", ".obbo.....obbo..", ".obbooooooobbo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obeeebbbbooobo.", ".obepebbbbbbbbo.", ".obbbbbnnbbbbbo.", ".obbbobbbbobobb.", "..obbboooobbobb.", "...oooooooooobo.", ".ob.obbbbbbo.bo.", ".obobbbbbbbbobo.", ".bbobbbbbbbbobo.",
};
static const char *const *const BUNNY_DANCE_FRAMES[] = {BUNNY_DANCE_F0, BUNNY_DANCE_F1};

static const char *const BUNNY_THINK_F0[16] = {
    "..oo.......oo...", ".obbo.....obbo.w", ".obbo.....obboww", ".obbooooooobbwww", ".oboobbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obeeebbbbooobo.", ".obepebbbbbbbbo.", ".obbbbbnnbbbbbo.", ".obbbbbbooobbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const BUNNY_THINK_F1[16] = {
    "..oo.......oo.ww", ".obbo.....obbwww", ".obbo.....obwwww", ".obbooooooobbo..", ".oboobbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obeeebbbbooobo.", ".obepebbbbbbbbo.", ".obbbbbnnbbbbbo.", ".obbbbbbooobbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const *const BUNNY_THINK_FRAMES[] = {BUNNY_THINK_F0, BUNNY_THINK_F1};

static const CharacterEmoteDef BUNNY_EMOTES[] = {
    {"idle", 2, 6, BUNNY_IDLE_FRAMES},
    {"happy", 4, 2, BUNNY_HAPPY_FRAMES},
    {"sad", 2, 2, BUNNY_SAD_FRAMES},
    {"wave", 3, 2, BUNNY_WAVE_FRAMES},
    {"sleep", 1, 2, BUNNY_SLEEP_FRAMES},
    {"love", 3, 2, BUNNY_LOVE_FRAMES},
    {"angry", 6, 2, BUNNY_ANGRY_FRAMES},
    {"dance", 5, 2, BUNNY_DANCE_FRAMES},
    {"think", 2, 2, BUNNY_THINK_FRAMES},
};

// ── Person ──────────────────────────────────────────────────────
static const CharacterPaletteEntry PERSON_PALETTE[] = {{'o', 0x20C2}, {'b', 0xF611}, {'l', 0xE2A9}, {'e', 0xFFFF}, {'p', 0x20C2}, {'n', 0xBB8B}, {'w', 0x8EBF}, {'h', 0xFAF1}, {'r', 0x3922}};

static const char *const PERSON_IDLE_F0[16] = {
    "...orrrrrrrro...", "..orrrrrrrrrro..", ".orrrrrrrrrrrro.", ".orrrrrrrrrrrro.", ".obbbbbbbbbbbbo.", ".obeeebbbbeeebo.", ".obepebbbbepebo.", ".obeeebbbbeeebo.", ".obbbbbnnbbbbbo.", ".obbbboooobbbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....ollllllo....", "...ollllllllo...", "...ollllllllo...", "...oo......oo...",
};
static const char *const PERSON_IDLE_F1[16] = {
    "...orrrrrrrro...", "..orrrrrrrrrro..", ".orrrrrrrrrrrro.", ".orrrrrrrrrrrro.", ".obbbbbbbbbbbbo.", ".obeeebbbbeeebo.", ".obepebbbbepebo.", ".obeeebbbbeeebo.", ".obbbbbnnbbbbbo.", ".obbbboooobbbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....ollllllo....", "...ollllllllo...", "...ollllllllo...", "...oo......oo...",
};
static const char *const PERSON_IDLE_F2[16] = {
    "...orrrrrrrro...", "..orrrrrrrrrro..", ".orrrrrrrrrrrro.", ".orrrrrrrrrrrro.", ".obbbbbbbbbbbbo.", ".obeeebbbbeeebo.", ".obepebbbbepebo.", ".obeeebbbbeeebo.", ".obbbbbnnbbbbbo.", ".obbbboooobbbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....ollllllo....", "...ollllllllo...", "...ollllllllo...", "...oo......oo...",
};
static const char *const PERSON_IDLE_F3[16] = {
    "...orrrrrrrro...", "..orrrrrrrrrro..", ".orrrrrrrrrrrro.", ".orrrrrrrrrrrro.", ".obbbbbbbbbbbbo.", ".obeeebbbbeeebo.", ".obepebbbbepebo.", ".obeeebbbbeeebo.", ".obbbbbnnbbbbbo.", ".obbbboooobbbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....ollllllo....", "...ollllllllo...", "...ollllllllo...", "...oo......oo...",
};
static const char *const PERSON_IDLE_F4[16] = {
    "...orrrrrrrro...", "..orrrrrrrrrro..", ".orrrrrrrrrrrro.", ".orrrrrrrrrrrro.", ".obbbbbbbbbbbbo.", ".obeeebbbbeeebo.", ".obepebbbbepebo.", ".obeeebbbbeeebo.", ".obbbbbnnbbbbbo.", ".obbbboooobbbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....ollllllo....", "...ollllllllo...", "...ollllllllo...", "...oo......oo...",
};
static const char *const PERSON_IDLE_F5[16] = {
    "...orrrrrrrro...", "..orrrrrrrrrro..", ".orrrrrrrrrrrro.", ".orrrrrrrrrrrro.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obooobbbbooobo.", ".obbbbbbbbbbbbo.", ".obbbbbnnbbbbbo.", ".obbbboooobbbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....ollllllo....", "...ollllllllo...", "...ollllllllo...", "...oo......oo...",
};
static const char *const *const PERSON_IDLE_FRAMES[] = {PERSON_IDLE_F0, PERSON_IDLE_F1, PERSON_IDLE_F2, PERSON_IDLE_F3, PERSON_IDLE_F4, PERSON_IDLE_F5};

static const char *const PERSON_HAPPY_F0[16] = {
    "...orrrrrrrro...", "..orrrrrrrrrro..", ".orrrrrrrrrrrro.", ".orrrrrrrrrrrro.", ".obbbbbbbbbbbbo.", ".obbobobbobobbo.", ".obobbbobobbboo.", ".ohbbbbbbbbbbho.", ".obbbbbnnbbbbbo.", ".obbboooooobbbo.", "..obbbllllbbbo..", "...oooooooooo...", "....ollllllo....", "...ollllllllo...", "...ollllllllo...", "...oo......oo...",
};
static const char *const PERSON_HAPPY_F1[16] = {
    "..orrrrrrrrrro..", ".orrrrrrrrrrrro.", ".orrrrrrrrrrrro.", ".obbbbbbbbbbbbo.", ".obbobobbobobbo.", ".obobbbobobbboo.", ".ohbbbbbbbbbbho.", ".obbbbbnnbbbbbo.", ".obbboooooobbbo.", "..obbbllllbbbo..", "...oooooooooo...", "....ollllllo....", "...ollllllllo...", "...ollllllllo...", "...oo......oo...", "................",
};
static const char *const *const PERSON_HAPPY_FRAMES[] = {PERSON_HAPPY_F0, PERSON_HAPPY_F1};

static const char *const PERSON_SAD_F0[16] = {
    "...orrrrrrrro...", "..orrrrrrrrrro..", ".orrrrrrrrrrrro.", ".orrrrrrrrrrrro.", ".obbbobbbbobbbo.", ".oboobbbbbboobo.", ".obeeebbbbeeebo.", ".obepebbbbepebo.", ".obbbbbnnbbbbbo.", ".obwbboooobbbbo.", "..owbobbbbobbo..", "...oooooooooo...", "....ollllllo....", "...ollllllllo...", "...ollllllllo...", "...oo......oo...",
};
static const char *const PERSON_SAD_F1[16] = {
    "...orrrrrrrro...", "..orrrrrrrrrro..", ".orrrrrrrrrrrro.", ".orrrrrrrrrrrro.", ".obbbobbbbobbbo.", ".oboobbbbbboobo.", ".obeeebbbbeeebo.", ".obepebbbbepebo.", ".obbbbbnnbbbbbo.", ".obbbboooobbbbo.", "..obbobbbbobbo..", "...wooooooooo...", "...wollllllo....", "...ollllllllo...", "...ollllllllo...", "...oo......oo...",
};
static const char *const *const PERSON_SAD_FRAMES[] = {PERSON_SAD_F0, PERSON_SAD_F1};

static const char *const PERSON_WAVE_F0[16] = {
    "...orrrrrrrro...", "..orrrrrrrrrro..", ".orrrrrrrrrrrro.", ".orrrrrrrrrrrro.", ".obbbbbbbbbbbbo.", ".obbobobbobobbo.", ".obobbbobobbboo.", ".ohbbbbbbbbbbho.", ".obbbbbnnbbbbbo.", ".obbboooooobobb.", "..obbbllllbbobb.", "...oooooooooobo.", "....ollllllo.bo.", "...ollllllllobo.", "...ollllllllobo.", "...oo......oo...",
};
static const char *const PERSON_WAVE_F1[16] = {
    "...orrrrrrrro...", "..orrrrrrrrrro..", ".orrrrrrrrrrrro.", ".orrrrrrrrrrrro.", ".obbbbbbbbbbbbo.", ".obbobobbobobbo.", ".obobbbobobbboo.", ".ohbbbbbbbbbbho.", ".obbbbbnnbbbbbo.", ".obbboooooobbbo.", "..obbbllllbbbo..", "...oooooooooo...", "....ollllllo.bo.", "...ollllllllobo.", "...ollllllllobb.", "...oo......oobb.",
};
static const char *const *const PERSON_WAVE_FRAMES[] = {PERSON_WAVE_F0, PERSON_WAVE_F1};

static const char *const PERSON_SLEEP_F0[16] = {
    "...orrrrrrrro...", "..orrrrrrrrrro..", ".orrrrrrrrrrrro.", ".orrrrrrrrrrrrww", ".obbbbbbbbbbbwo.", ".obbbbbbbbbbwwo.", ".obooobbbbooobo.", ".obbbbbbbbbbbbo.", ".obbbbbnnbbbbbo.", ".obbbbboobbbbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....ollllllo....", "...ollllllllo...", "...ollllllllo...", "...oo......oo...",
};
static const char *const PERSON_SLEEP_F1[16] = {
    "...orrrrrrrro.ww", "..orrrrrrrrrrw..", ".orrrrrrrrrrwwo.", ".orrrrrrrrrrrro.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obooobbbbooobo.", ".obbbbbbbbbbbbo.", ".obbbbbnnbbbbbo.", ".obbbbboobbbbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....ollllllo....", "...ollllllllo...", "...ollllllllo...", "...oo......oo...",
};
static const char *const *const PERSON_SLEEP_FRAMES[] = {PERSON_SLEEP_F0, PERSON_SLEEP_F1};

static const char *const PERSON_LOVE_F0[16] = {
    "...orrrrrrrro...", "h.hrrrrrrrrrro..", "hhhrrrrrrrrrrro.", ".hrrrrrrrrrrrro.", ".obbbbbbbbbbbbo.", ".obhbhbbbbhbhbo.", ".obhhhbbbbhhhbo.", ".obbhbbbbbbhbbo.", ".obbbbbnnbbbbbo.", ".obbboooooobbbo.", "..obbbllllbbbo..", "...oooooooooo...", "....ollllllo....", "...ollllllllo...", "...ollllllllo...", "...oo......oo...",
};
static const char *const PERSON_LOVE_F1[16] = {
    "...orrrrrrrroh.h", "..orrrrrrrrrrhhh", ".orrrrrrrrrrrrh.", ".orrrrrrrrrrrro.", ".obbbbbbbbbbbbo.", ".obhbhbbbbhbhbo.", ".obhhhbbbbhhhbo.", ".obbhbbbbbbhbbo.", ".obbbbbnnbbbbbo.", ".obbboooooobbbo.", "..obbbllllbbbo..", "...oooooooooo...", "....ollllllo....", "...ollllllllo...", "...ollllllllo...", "...oo......oo...",
};
static const char *const *const PERSON_LOVE_FRAMES[] = {PERSON_LOVE_F0, PERSON_LOVE_F1};

static const char *const PERSON_ANGRY_F0[16] = {
    "...orrrrrrrro...", "..orrrrrrrrrro..", ".orrrrrrrrrrrro.", ".orrrrrrrrrrrro.", ".oboobbbbbboobo.", ".obbbobbbbobbbo.", ".obeeebbbbeeebo.", ".obepebbbbepebo.", ".obbbbbnnbbbbbo.", ".bboboooooobobb.", ".bboboboobobobb.", ".oboooooooooobo.", ".ob.ollllllo.bo.", ".obollllllllobo.", ".obollllllllobo.", "...oo......oo...",
};
static const char *const PERSON_ANGRY_F1[16] = {
    "...orrrrrrrro...", "..orrrrrrrrrro..", ".orrrrrrrrrrrro.", ".orrrrrrrrrrrro.", ".oboobbbbbboobo.", ".obbbobbbbobbbo.", ".obeeebbbbeeebo.", ".obepebbbbepebo.", ".obbbbbnnbbbbbo.", ".obbboooooobbbo.", "..obboboobobbo..", "...oooooooooo...", ".ob.ollllllo.bo.", ".obollllllllobo.", ".bbollllllllobb.", ".bboo......oobb.",
};
static const char *const *const PERSON_ANGRY_FRAMES[] = {PERSON_ANGRY_F0, PERSON_ANGRY_F1};

static const char *const PERSON_DANCE_F0[16] = {
    "..orrrrrrrrrro..", ".orrrrrrrrrrrro.", ".orrrrrrrrrrrro.", ".obbbbbbbbbbbbo.", ".obbobobbbbbbbo.", ".obobbbobbeeebo.", ".obbbbbbbbepebo.", ".obbbbbnnbbbbbo.", ".bboboooooobbbo.", ".bbobbllllbbbo..", ".oboooooooooo...", ".ob.ollllllo.bo.", ".obollllllllobo.", ".obollllllllobb.", "...oo......oobb.", "................",
};
static const char *const PERSON_DANCE_F1[16] = {
    "................", "...orrrrrrrro...", "..orrrrrrrrrro..", ".orrrrrrrrrrrro.", ".orrrrrrrrrrrro.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obeeebbbbooobo.", ".obepebbbbbbbbo.", ".obbbbbnnbbbbbo.", ".obbbobbbbobobb.", "..obbboooobbobb.", "...oooooooooobo.", ".ob.ollllllo.bo.", ".obollllllllobo.", ".bbollllllllobo.",
};
static const char *const *const PERSON_DANCE_FRAMES[] = {PERSON_DANCE_F0, PERSON_DANCE_F1};

static const char *const PERSON_THINK_F0[16] = {
    "...orrrrrrrro...", "..orrrrrrrrrro.w", ".orrrrrrrrrrrrww", ".orrrrrrrrrrrwww", ".oboobbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obeeebbbbooobo.", ".obepebbbbbbbbo.", ".obbbbbnnbbbbbo.", ".obbbbbbooobbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....ollllllo....", "...ollllllllo...", "...ollllllllo...", "...oo......oo...",
};
static const char *const PERSON_THINK_F1[16] = {
    "...orrrrrrrro.ww", "..orrrrrrrrrrwww", ".orrrrrrrrrrwwww", ".orrrrrrrrrrrro.", ".oboobbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obeeebbbbooobo.", ".obepebbbbbbbbo.", ".obbbbbnnbbbbbo.", ".obbbbbbooobbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....ollllllo....", "...ollllllllo...", "...ollllllllo...", "...oo......oo...",
};
static const char *const *const PERSON_THINK_FRAMES[] = {PERSON_THINK_F0, PERSON_THINK_F1};

static const CharacterEmoteDef PERSON_EMOTES[] = {
    {"idle", 2, 6, PERSON_IDLE_FRAMES},
    {"happy", 4, 2, PERSON_HAPPY_FRAMES},
    {"sad", 2, 2, PERSON_SAD_FRAMES},
    {"wave", 3, 2, PERSON_WAVE_FRAMES},
    {"sleep", 1, 2, PERSON_SLEEP_FRAMES},
    {"love", 3, 2, PERSON_LOVE_FRAMES},
    {"angry", 6, 2, PERSON_ANGRY_FRAMES},
    {"dance", 5, 2, PERSON_DANCE_FRAMES},
    {"think", 2, 2, PERSON_THINK_FRAMES},
};

// ── Robot ───────────────────────────────────────────────────────
static const CharacterPaletteEntry ROBOT_PALETTE[] = {{'o', 0x10C4}, {'b', 0x9DB9}, {'l', 0x5BB1}, {'e', 0x5FBF}, {'p', 0x0946}, {'n', 0xFAEF}, {'w', 0x8EBF}, {'h', 0xFAF1}};

static const char *const ROBOT_IDLE_F0[16] = {
    ".......oo.......", "......obbo......", "...oooooooooo...", "..obbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obeeeebbeeeebo.", ".obeppebbeppebo.", ".obeeeebbeeeebo.", ".obbbbbbbbbbbbo.", ".obbbllllllbbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....obnnnbbo....", "..oobbbbbbbboo..", "..obbbbbbbbbbo..", "...oo......oo...",
};
static const char *const ROBOT_IDLE_F1[16] = {
    ".......oo.......", "......obbo......", "...oooooooooo...", "..obbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obeeeebbeeeebo.", ".obeppebbeppebo.", ".obeeeebbeeeebo.", ".obbbbbbbbbbbbo.", ".obbbllllllbbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....obnnnbbo....", "..oobbbbbbbboo..", "..obbbbbbbbbbo..", "...oo......oo...",
};
static const char *const ROBOT_IDLE_F2[16] = {
    ".......oo.......", "......obbo......", "...oooooooooo...", "..obbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obeeeebbeeeebo.", ".obeppebbeppebo.", ".obeeeebbeeeebo.", ".obbbbbbbbbbbbo.", ".obbbllllllbbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....obnnnbbo....", "..oobbbbbbbboo..", "..obbbbbbbbbbo..", "...oo......oo...",
};
static const char *const ROBOT_IDLE_F3[16] = {
    ".......oo.......", "......obbo......", "...oooooooooo...", "..obbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obeeeebbeeeebo.", ".obeppebbeppebo.", ".obeeeebbeeeebo.", ".obbbbbbbbbbbbo.", ".obbbllllllbbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....obnnnbbo....", "..oobbbbbbbboo..", "..obbbbbbbbbbo..", "...oo......oo...",
};
static const char *const ROBOT_IDLE_F4[16] = {
    ".......oo.......", "......obbo......", "...oooooooooo...", "..obbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obeeeebbeeeebo.", ".obeppebbeppebo.", ".obeeeebbeeeebo.", ".obbbbbbbbbbbbo.", ".obbbllllllbbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....obnnnbbo....", "..oobbbbbbbboo..", "..obbbbbbbbbbo..", "...oo......oo...",
};
static const char *const ROBOT_IDLE_F5[16] = {
    ".......oo.......", "......obbo......", "...oooooooooo...", "..obbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obllllbbllllbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbbllllllbbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....obnnnbbo....", "..oobbbbbbbboo..", "..obbbbbbbbbbo..", "...oo......oo...",
};
static const char *const *const ROBOT_IDLE_FRAMES[] = {ROBOT_IDLE_F0, ROBOT_IDLE_F1, ROBOT_IDLE_F2, ROBOT_IDLE_F3, ROBOT_IDLE_F4, ROBOT_IDLE_F5};

static const char *const ROBOT_HAPPY_F0[16] = {
    ".......oo.......", "......obbo......", "...oooooooooo...", "..obbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obbebebbebebbo.", ".obebbbebebbbeo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbbeeeeeebbbo.", "..obbbllllbbbo..", "...oooooooooo...", "....obnnnbbo....", "..oobbbbbbbboo..", "..obbbbbbbbbbo..", "...oo......oo...",
};
static const char *const ROBOT_HAPPY_F1[16] = {
    "......obbo......", "...oooooooooo...", "..obbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obbebebbebebbo.", ".obebbbebebbbeo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbbeeeeeebbbo.", "..obbbllllbbbo..", "...oooooooooo...", "....obnnnbbo....", "..oobbbbbbbboo..", "..obbbbbbbbbbo..", "...oo......oo...", "................",
};
static const char *const *const ROBOT_HAPPY_FRAMES[] = {ROBOT_HAPPY_F0, ROBOT_HAPPY_F1};

static const char *const ROBOT_SAD_F0[16] = {
    ".......oo.......", "......obbo......", "...oooooooooo...", "..obbbbbbbbbbo..", ".obbblbbbblbbbo.", ".obllbbbbbbllbo.", ".obllllbbllllbo.", ".oblpplbblpplbo.", ".obbbbbbbbbbbbo.", ".obwbbllllbbbbo.", "..owblbbbblbbo..", "...oooooooooo...", "....obnnnbbo....", "..oobbbbbbbboo..", "..obbbbbbbbbbo..", "...oo......oo...",
};
static const char *const ROBOT_SAD_F1[16] = {
    ".......oo.......", "......obbo......", "...oooooooooo...", "..obbbbbbbbbbo..", ".obbblbbbblbbbo.", ".obllbbbbbbllbo.", ".obllllbbllllbo.", ".oblpplbblpplbo.", ".obbbbbbbbbbbbo.", ".obbbbllllbbbbo.", "..obblbbbblbbo..", "...wooooooooo...", "...wobnnnbbo....", "..oobbbbbbbboo..", "..obbbbbbbbbbo..", "...oo......oo...",
};
static const char *const *const ROBOT_SAD_FRAMES[] = {ROBOT_SAD_F0, ROBOT_SAD_F1};

static const char *const ROBOT_WAVE_F0[16] = {
    ".......oo.......", "......obbo......", "...oooooooooo...", "..obbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obbebebbebebbo.", ".obebbbebebbbeo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbbeeeeeebobb.", "..obbbllllbbobb.", "...oooooooooobo.", "....obnnnbbo.bo.", "..oobbbbbbbbobo.", "..obbbbbbbbbbbo.", "...oo......oo...",
};
static const char *const ROBOT_WAVE_F1[16] = {
    ".......oo.......", "......obbo......", "...oooooooooo...", "..obbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obbebebbebebbo.", ".obebbbebebbbeo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbbeeeeeebbbo.", "..obbbllllbbbo..", "...oooooooooo...", "....obnnnbbo.bo.", "..oobbbbbbbbobo.", "..obbbbbbbbbobb.", "...oo......oobb.",
};
static const char *const *const ROBOT_WAVE_FRAMES[] = {ROBOT_WAVE_F0, ROBOT_WAVE_F1};

static const char *const ROBOT_SLEEP_F0[16] = {
    ".......oo.......", "......obbo......", "...oooooooooo...", "..obbbbbbbbbboww", ".obbbbbbbbbbbwo.", ".obbbbbbbbbbwwo.", ".obllllbbllllbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbbbllllbbbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....obnnnbbo....", "..oobbbbbbbboo..", "..obbbbbbbbbbo..", "...oo......oo...",
};
static const char *const ROBOT_SLEEP_F1[16] = {
    ".......oo.....ww", "......obbo...w..", "...oooooooooww..", "..obbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obllllbbllllbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbbbllllbbbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....obnnnbbo....", "..oobbbbbbbboo..", "..obbbbbbbbbbo..", "...oo......oo...",
};
static const char *const *const ROBOT_SLEEP_FRAMES[] = {ROBOT_SLEEP_F0, ROBOT_SLEEP_F1};

static const char *const ROBOT_LOVE_F0[16] = {
    ".......oo.......", "h.h...obbo......", "hhhoooooooooo...", ".hobbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obhbhbbbbhbhbo.", ".obhhhbbbbhhhbo.", ".obbhbbbbbbhbbo.", ".obbbbbnnbbbbbo.", ".obbboooooobbbo.", "..obbbllllbbbo..", "...oooooooooo...", "....obnnnbbo....", "..oobbbbbbbboo..", "..obbbbbbbbbbo..", "...oo......oo...",
};
static const char *const ROBOT_LOVE_F1[16] = {
    ".......oo....h.h", "......obbo...hhh", "...oooooooooo.h.", "..obbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obhbhbbbbhbhbo.", ".obhhhbbbbhhhbo.", ".obbhbbbbbbhbbo.", ".obbbbbnnbbbbbo.", ".obbboooooobbbo.", "..obbbllllbbbo..", "...oooooooooo...", "....obnnnbbo....", "..oobbbbbbbboo..", "..obbbbbbbbbbo..", "...oo......oo...",
};
static const char *const *const ROBOT_LOVE_FRAMES[] = {ROBOT_LOVE_F0, ROBOT_LOVE_F1};

static const char *const ROBOT_ANGRY_F0[16] = {
    ".......oo.......", "......obbo......", "...oooooooooo...", "..obbbbbbbbbbo..", ".obllbbbbbbllbo.", ".obbblbbbblbbbo.", ".obeeeebbeeeebo.", ".obeppebbeppebo.", ".obbbbbbbbbbbbo.", ".bbobllllllbobb.", ".bboblbllblbobb.", ".oboooooooooobo.", ".ob.obnnnbbo.bo.", ".obobbbbbbbbobo.", ".obbbbbbbbbbbbo.", "...oo......oo...",
};
static const char *const ROBOT_ANGRY_F1[16] = {
    ".......oo.......", "......obbo......", "...oooooooooo...", "..obbbbbbbbbbo..", ".obllbbbbbbllbo.", ".obbblbbbblbbbo.", ".obeeeebbeeeebo.", ".obeppebbeppebo.", ".obbbbbbbbbbbbo.", ".obbbllllllbbbo.", "..obblbllblbbo..", "...oooooooooo...", ".ob.obnnnbbo.bo.", ".obobbbbbbbbobo.", ".bbobbbbbbbbobb.", ".bboo......oobb.",
};
static const char *const *const ROBOT_ANGRY_FRAMES[] = {ROBOT_ANGRY_F0, ROBOT_ANGRY_F1};

static const char *const ROBOT_DANCE_F0[16] = {
    "......obbo......", "...oooooooooo...", "..obbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obbobobbbbbbbo.", ".obobbbobbeeebo.", ".obbbbbbbbepebo.", ".obbbbbnnbbbbbo.", ".bboboooooobbbo.", ".bbobbllllbbbo..", ".oboooooooooo...", ".ob.obnnnbbo.bo.", ".obobbbbbbbbobo.", ".obbbbbbbbbbobb.", "...oo......oobb.", "................",
};
static const char *const ROBOT_DANCE_F1[16] = {
    "................", ".......oo.......", "......obbo......", "...oooooooooo...", "..obbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obeeebbbbooobo.", ".obepebbbbbbbbo.", ".obbbbbnnbbbbbo.", ".obbbobbbbobobb.", "..obbboooobbobb.", "...oooooooooobo.", ".ob.obnnnbbo.bo.", ".obobbbbbbbbobo.", ".bbobbbbbbbbbbo.",
};
static const char *const *const ROBOT_DANCE_FRAMES[] = {ROBOT_DANCE_F0, ROBOT_DANCE_F1};

static const char *const ROBOT_THINK_F0[16] = {
    ".......oo.......", "......obbo.....w", "...oooooooooo.ww", "..obbbbbbbbbbwww", ".oboobbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obeeebbbbooobo.", ".obepebbbbbbbbo.", ".obbbbbnnbbbbbo.", ".obbbbbbooobbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....obnnnbbo....", "..oobbbbbbbboo..", "..obbbbbbbbbbo..", "...oo......oo...",
};
static const char *const ROBOT_THINK_F1[16] = {
    ".......oo.....ww", "......obbo...www", "...ooooooooowwww", "..obbbbbbbbbbo..", ".oboobbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obeeebbbbooobo.", ".obepebbbbbbbbo.", ".obbbbbnnbbbbbo.", ".obbbbbbooobbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....obnnnbbo....", "..oobbbbbbbboo..", "..obbbbbbbbbbo..", "...oo......oo...",
};
static const char *const *const ROBOT_THINK_FRAMES[] = {ROBOT_THINK_F0, ROBOT_THINK_F1};

static const CharacterEmoteDef ROBOT_EMOTES[] = {
    {"idle", 2, 6, ROBOT_IDLE_FRAMES},
    {"happy", 4, 2, ROBOT_HAPPY_FRAMES},
    {"sad", 2, 2, ROBOT_SAD_FRAMES},
    {"wave", 3, 2, ROBOT_WAVE_FRAMES},
    {"sleep", 1, 2, ROBOT_SLEEP_FRAMES},
    {"love", 3, 2, ROBOT_LOVE_FRAMES},
    {"angry", 6, 2, ROBOT_ANGRY_FRAMES},
    {"dance", 5, 2, ROBOT_DANCE_FRAMES},
    {"think", 2, 2, ROBOT_THINK_FRAMES},
};

// ── Bird ────────────────────────────────────────────────────────
static const CharacterPaletteEntry BIRD_PALETTE[] = {{'o', 0x1947}, {'b', 0x4E1E}, {'l', 0xFE4A}, {'e', 0xFFFF}, {'p', 0x1947}, {'n', 0xFE4A}, {'w', 0x8EBF}, {'h', 0xFAF1}};

static const char *const BIRD_IDLE_F0[16] = {
    ".....oooooo.....", "....obbbbbbo....", "...obbbbbbbbo...", "..obbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obeeebbbbeeebo.", ".obepebbbbepebo.", ".obeeebbbbeeebo.", ".obbbbbnnbbbbbo.", ".obbbboooobbbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "....oooooooo....", "....oo....oo....",
};
static const char *const BIRD_IDLE_F1[16] = {
    ".....oooooo.....", "....obbbbbbo....", "...obbbbbbbbo...", "..obbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obeeebbbbeeebo.", ".obepebbbbepebo.", ".obeeebbbbeeebo.", ".obbbbbnnbbbbbo.", ".obbbboooobbbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "....oooooooo....", "....oo....oo....",
};
static const char *const BIRD_IDLE_F2[16] = {
    ".....oooooo.....", "....obbbbbbo....", "...obbbbbbbbo...", "..obbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obeeebbbbeeebo.", ".obepebbbbepebo.", ".obeeebbbbeeebo.", ".obbbbbnnbbbbbo.", ".obbbboooobbbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "....oooooooo....", "....oo....oo....",
};
static const char *const BIRD_IDLE_F3[16] = {
    ".....oooooo.....", "....obbbbbbo....", "...obbbbbbbbo...", "..obbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obeeebbbbeeebo.", ".obepebbbbepebo.", ".obeeebbbbeeebo.", ".obbbbbnnbbbbbo.", ".obbbboooobbbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "....oooooooo....", "....oo....oo....",
};
static const char *const BIRD_IDLE_F4[16] = {
    ".....oooooo.....", "....obbbbbbo....", "...obbbbbbbbo...", "..obbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obeeebbbbeeebo.", ".obepebbbbepebo.", ".obeeebbbbeeebo.", ".obbbbbnnbbbbbo.", ".obbbboooobbbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "....oooooooo....", "....oo....oo....",
};
static const char *const BIRD_IDLE_F5[16] = {
    ".....oooooo.....", "....obbbbbbo....", "...obbbbbbbbo...", "..obbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obooobbbbooobo.", ".obbbbbbbbbbbbo.", ".obbbbbnnbbbbbo.", ".obbbboooobbbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "....oooooooo....", "....oo....oo....",
};
static const char *const *const BIRD_IDLE_FRAMES[] = {BIRD_IDLE_F0, BIRD_IDLE_F1, BIRD_IDLE_F2, BIRD_IDLE_F3, BIRD_IDLE_F4, BIRD_IDLE_F5};

static const char *const BIRD_HAPPY_F0[16] = {
    ".....oooooo.....", "....obbbbbbo....", "...obbbbbbbbo...", "..obbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obbobobbobobbo.", ".obobbbobobbboo.", ".ohbbbbbbbbbbho.", ".obbbbbnnbbbbbo.", ".obbboooooobbbo.", "..obbbllllbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "....oooooooo....", "....oo....oo....",
};
static const char *const BIRD_HAPPY_F1[16] = {
    "....obbbbbbo....", "...obbbbbbbbo...", "..obbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obbobobbobobbo.", ".obobbbobobbboo.", ".ohbbbbbbbbbbho.", ".obbbbbnnbbbbbo.", ".obbboooooobbbo.", "..obbbllllbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "....oooooooo....", "....oo....oo....", "................",
};
static const char *const *const BIRD_HAPPY_FRAMES[] = {BIRD_HAPPY_F0, BIRD_HAPPY_F1};

static const char *const BIRD_SAD_F0[16] = {
    ".....oooooo.....", "....obbbbbbo....", "...obbbbbbbbo...", "..obbbbbbbbbbo..", ".obbbobbbbobbbo.", ".oboobbbbbboobo.", ".obeeebbbbeeebo.", ".obepebbbbepebo.", ".obbbbbnnbbbbbo.", ".obwbboooobbbbo.", "..owbobbbbobbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "....oooooooo....", "....oo....oo....",
};
static const char *const BIRD_SAD_F1[16] = {
    ".....oooooo.....", "....obbbbbbo....", "...obbbbbbbbo...", "..obbbbbbbbbbo..", ".obbbobbbbobbbo.", ".oboobbbbbboobo.", ".obeeebbbbeeebo.", ".obepebbbbepebo.", ".obbbbbnnbbbbbo.", ".obbbboooobbbbo.", "..obbobbbbobbo..", "...wooooooooo...", "...wobbbbbbo....", "...obbbbbbbbo...", "....oooooooo....", "....oo....oo....",
};
static const char *const *const BIRD_SAD_FRAMES[] = {BIRD_SAD_F0, BIRD_SAD_F1};

static const char *const BIRD_WAVE_F0[16] = {
    ".....oooooo.....", "....obbbbbbo....", "...obbbbbbbbo...", "..obbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obbobobbobobbo.", ".obobbbobobbboo.", ".ohbbbbbbbbbbho.", ".obbbbbnnbbbbbo.", ".obbboooooobobb.", "..obbbllllbbobb.", "...oooooooooobo.", "....obbbbbbo.bo.", "...obbbbbbbbobo.", "....oooooooo.bo.", "....oo....oo....",
};
static const char *const BIRD_WAVE_F1[16] = {
    ".....oooooo.....", "....obbbbbbo....", "...obbbbbbbbo...", "..obbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obbobobbobobbo.", ".obobbbobobbboo.", ".ohbbbbbbbbbbho.", ".obbbbbnnbbbbbo.", ".obbboooooobbbo.", "..obbbllllbbbo..", "...oooooooooo...", "....obbbbbbo.bo.", "...obbbbbbbbobo.", "....ooooooooobb.", "....oo....ooobb.",
};
static const char *const *const BIRD_WAVE_FRAMES[] = {BIRD_WAVE_F0, BIRD_WAVE_F1};

static const char *const BIRD_SLEEP_F0[16] = {
    ".....oooooo.....", "....obbbbbbo....", "...obbbbbbbbo...", "..obbbbbbbbbboww", ".obbbbbbbbbbbwo.", ".obbbbbbbbbbwwo.", ".obooobbbbooobo.", ".obbbbbbbbbbbbo.", ".obbbbbnnbbbbbo.", ".obbbbboobbbbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "....oooooooo....", "....oo....oo....",
};
static const char *const BIRD_SLEEP_F1[16] = {
    ".....oooooo...ww", "....obbbbbbo.w..", "...obbbbbbbbww..", "..obbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obooobbbbooobo.", ".obbbbbbbbbbbbo.", ".obbbbbnnbbbbbo.", ".obbbbboobbbbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "....oooooooo....", "....oo....oo....",
};
static const char *const *const BIRD_SLEEP_FRAMES[] = {BIRD_SLEEP_F0, BIRD_SLEEP_F1};

static const char *const BIRD_LOVE_F0[16] = {
    ".....oooooo.....", "h.h.obbbbbbo....", "hhhobbbbbbbbo...", ".hobbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obhbhbbbbhbhbo.", ".obhhhbbbbhhhbo.", ".obbhbbbbbbhbbo.", ".obbbbbnnbbbbbo.", ".obbboooooobbbo.", "..obbbllllbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "....oooooooo....", "....oo....oo....",
};
static const char *const BIRD_LOVE_F1[16] = {
    ".....oooooo..h.h", "....obbbbbbo.hhh", "...obbbbbbbbo.h.", "..obbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obhbhbbbbhbhbo.", ".obhhhbbbbhhhbo.", ".obbhbbbbbbhbbo.", ".obbbbbnnbbbbbo.", ".obbboooooobbbo.", "..obbbllllbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "....oooooooo....", "....oo....oo....",
};
static const char *const *const BIRD_LOVE_FRAMES[] = {BIRD_LOVE_F0, BIRD_LOVE_F1};

static const char *const BIRD_ANGRY_F0[16] = {
    ".....oooooo.....", "....obbbbbbo....", "...obbbbbbbbo...", "..obbbbbbbbbbo..", ".oboobbbbbboobo.", ".obbbobbbbobbbo.", ".obeeebbbbeeebo.", ".obepebbbbepebo.", ".obbbbbnnbbbbbo.", ".bboboooooobobb.", ".bboboboobobobb.", ".oboooooooooobo.", ".ob.obbbbbbo.bo.", ".obobbbbbbbbobo.", ".ob.oooooooo.bo.", "....oo....oo....",
};
static const char *const BIRD_ANGRY_F1[16] = {
    ".....oooooo.....", "....obbbbbbo....", "...obbbbbbbbo...", "..obbbbbbbbbbo..", ".oboobbbbbboobo.", ".obbbobbbbobbbo.", ".obeeebbbbeeebo.", ".obepebbbbepebo.", ".obbbbbnnbbbbbo.", ".obbboooooobbbo.", "..obboboobobbo..", "...oooooooooo...", ".ob.obbbbbbo.bo.", ".obobbbbbbbbobo.", ".bboooooooooobb.", ".bbooo....ooobb.",
};
static const char *const *const BIRD_ANGRY_FRAMES[] = {BIRD_ANGRY_F0, BIRD_ANGRY_F1};

static const char *const BIRD_DANCE_F0[16] = {
    "....obbbbbbo....", "...obbbbbbbbo...", "..obbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obbobobbbbbbbo.", ".obobbbobbeeebo.", ".obbbbbbbbepebo.", ".obbbbbnnbbbbbo.", ".bboboooooobbbo.", ".bbobbllllbbbo..", ".oboooooooooo...", ".ob.obbbbbbo.bo.", ".obobbbbbbbbobo.", ".ob.ooooooooobb.", "....oo....ooobb.", "................",
};
static const char *const BIRD_DANCE_F1[16] = {
    "................", ".....oooooo.....", "....obbbbbbo....", "...obbbbbbbbo...", "..obbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obeeebbbbooobo.", ".obepebbbbbbbbo.", ".obbbbbnnbbbbbo.", ".obbbobbbbobobb.", "..obbboooobbobb.", "...oooooooooobo.", ".ob.obbbbbbo.bo.", ".obobbbbbbbbobo.", ".bbooooooooo.bo.",
};
static const char *const *const BIRD_DANCE_FRAMES[] = {BIRD_DANCE_F0, BIRD_DANCE_F1};

static const char *const BIRD_THINK_F0[16] = {
    ".....oooooo.....", "....obbbbbbo...w", "...obbbbbbbbo.ww", "..obbbbbbbbbbwww", ".oboobbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obeeebbbbooobo.", ".obepebbbbbbbbo.", ".obbbbbnnbbbbbo.", ".obbbbbbooobbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "....oooooooo....", "....oo....oo....",
};
static const char *const BIRD_THINK_F1[16] = {
    ".....oooooo...ww", "....obbbbbbo.www", "...obbbbbbbbwwww", "..obbbbbbbbbbo..", ".oboobbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obeeebbbbooobo.", ".obepebbbbbbbbo.", ".obbbbbnnbbbbbo.", ".obbbbbbooobbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "....oooooooo....", "....oo....oo....",
};
static const char *const *const BIRD_THINK_FRAMES[] = {BIRD_THINK_F0, BIRD_THINK_F1};

static const CharacterEmoteDef BIRD_EMOTES[] = {
    {"idle", 2, 6, BIRD_IDLE_FRAMES},
    {"happy", 4, 2, BIRD_HAPPY_FRAMES},
    {"sad", 2, 2, BIRD_SAD_FRAMES},
    {"wave", 3, 2, BIRD_WAVE_FRAMES},
    {"sleep", 1, 2, BIRD_SLEEP_FRAMES},
    {"love", 3, 2, BIRD_LOVE_FRAMES},
    {"angry", 6, 2, BIRD_ANGRY_FRAMES},
    {"dance", 5, 2, BIRD_DANCE_FRAMES},
    {"think", 2, 2, BIRD_THINK_FRAMES},
};

// ── Ghost ───────────────────────────────────────────────────────
static const CharacterPaletteEntry GHOST_PALETTE[] = {{'o', 0x2928}, {'b', 0xDEBE}, {'l', 0xAD1A}, {'e', 0xFFFF}, {'p', 0x2928}, {'n', 0xAD1A}, {'w', 0x8EBF}, {'h', 0xFAF1}};

static const char *const GHOST_IDLE_F0[16] = {
    ".....oooooo.....", "...oobbbbbbooo..", "..obbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obooobbbbooobo.", ".obooobbbbooobo.", ".obooobbbbooobo.", ".obbbbbbbbbbbbo.", ".obbbboooobbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbobbbobbbbbo.", "..o..o.o...ooo..",
};
static const char *const GHOST_IDLE_F1[16] = {
    ".....oooooo.....", "...oobbbbbbooo..", "..obbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obooobbbbooobo.", ".obooobbbbooobo.", ".obooobbbbooobo.", ".obbbbbbbbbbbbo.", ".obbbboooobbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbobbbobbbbbo.", "..o..o.o...ooo..",
};
static const char *const GHOST_IDLE_F2[16] = {
    ".....oooooo.....", "...oobbbbbbooo..", "..obbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obooobbbbooobo.", ".obooobbbbooobo.", ".obooobbbbooobo.", ".obbbbbbbbbbbbo.", ".obbbboooobbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbobbbobbbbbo.", "..o..o.o...ooo..",
};
static const char *const GHOST_IDLE_F3[16] = {
    ".....oooooo.....", "...oobbbbbbooo..", "..obbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obooobbbbooobo.", ".obooobbbbooobo.", ".obooobbbbooobo.", ".obbbbbbbbbbbbo.", ".obbbboooobbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbobbbobbbbbo.", "..o..o.o...ooo..",
};
static const char *const GHOST_IDLE_F4[16] = {
    ".....oooooo.....", "...oobbbbbbooo..", "..obbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obooobbbbooobo.", ".obooobbbbooobo.", ".obooobbbbooobo.", ".obbbbbbbbbbbbo.", ".obbbboooobbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbobbbobbbbbo.", "..o..o.o...ooo..",
};
static const char *const GHOST_IDLE_F5[16] = {
    ".....oooooo.....", "...oobbbbbbooo..", "..obbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obooobbbbooobo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbbboooobbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbobbbobbbbbo.", "..o..o.o...ooo..",
};
static const char *const *const GHOST_IDLE_FRAMES[] = {GHOST_IDLE_F0, GHOST_IDLE_F1, GHOST_IDLE_F2, GHOST_IDLE_F3, GHOST_IDLE_F4, GHOST_IDLE_F5};

static const char *const GHOST_HAPPY_F0[16] = {
    ".....oooooo.....", "...oobbbbbbooo..", "..obbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbobobbobobbo.", ".obobbbobobbboo.", ".ohbbbbbbbbbbho.", ".obbbbbnnbbbbbo.", ".obbboooooobbbo.", ".obbbbllllbbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbobbbobbbbbo.", "..o..o.o...ooo..",
};
static const char *const GHOST_HAPPY_F1[16] = {
    "...oobbbbbbooo..", "..obbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbobobbobobbo.", ".obobbbobobbboo.", ".ohbbbbbbbbbbho.", ".obbbbbnnbbbbbo.", ".obbboooooobbbo.", ".obbbbllllbbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbobbbobbbbbo.", "..o..o.o...ooo..", "................",
};
static const char *const *const GHOST_HAPPY_FRAMES[] = {GHOST_HAPPY_F0, GHOST_HAPPY_F1};

static const char *const GHOST_SAD_F0[16] = {
    ".....oooooo.....", "...oobbbbbbooo..", "..obbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obbbobbbbobbbo.", ".oboobbbbbboobo.", ".obeeebbbbeeebo.", ".obepebbbbepebo.", ".obbbbbnnbbbbbo.", ".obwbboooobbbbo.", ".obwbobbbbobbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbobbbobbbbbo.", "..o..o.o...ooo..",
};
static const char *const GHOST_SAD_F1[16] = {
    ".....oooooo.....", "...oobbbbbbooo..", "..obbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obbbobbbbobbbo.", ".oboobbbbbboobo.", ".obeeebbbbeeebo.", ".obepebbbbepebo.", ".obbbbbnnbbbbbo.", ".obbbboooobbbbo.", ".obbbobbbbobbbo.", ".obwbbbbbbbbbbo.", ".obwbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbobbbobbbbbo.", "..o..o.o...ooo..",
};
static const char *const *const GHOST_SAD_FRAMES[] = {GHOST_SAD_F0, GHOST_SAD_F1};

static const char *const GHOST_WAVE_F0[16] = {
    ".....oooooo.....", "...oobbbbbbooo..", "..obbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbobobbobobbo.", ".obobbbobobbboo.", ".ohbbbbbbbbbbho.", ".obbbbbnnbbbbbo.", ".obbboooooobobb.", ".obbbbllllbbobb.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbobbbobbbbbo.", "..o..o.o...ooo..",
};
static const char *const GHOST_WAVE_F1[16] = {
    ".....oooooo.....", "...oobbbbbbooo..", "..obbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbobobbobobbo.", ".obobbbobobbboo.", ".ohbbbbbbbbbbho.", ".obbbbbnnbbbbbo.", ".obbboooooobbbo.", ".obbbbllllbbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbobbbobbbobb.", "..o..o.o...oobb.",
};
static const char *const *const GHOST_WAVE_FRAMES[] = {GHOST_WAVE_F0, GHOST_WAVE_F1};

static const char *const GHOST_SLEEP_F0[16] = {
    ".....oooooo.....", "...oobbbbbbooo..", "..obbbbbbbbbbo..", ".obbbbbbbbbbbbww", ".obbbbbbbbbbbwo.", ".obbbbbbbbbbwwo.", ".obooobbbbooobo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbbbboobbbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbobbbobbbbbo.", "..o..o.o...ooo..",
};
static const char *const GHOST_SLEEP_F1[16] = {
    ".....oooooo...ww", "...oobbbbbboow..", "..obbbbbbbbbww..", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obooobbbbooobo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbbbboobbbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbobbbobbbbbo.", "..o..o.o...ooo..",
};
static const char *const *const GHOST_SLEEP_FRAMES[] = {GHOST_SLEEP_F0, GHOST_SLEEP_F1};

static const char *const GHOST_LOVE_F0[16] = {
    ".....oooooo.....", "h.hoobbbbbbooo..", "hhhbbbbbbbbbbo..", ".hbbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obhbhbbbbhbhbo.", ".obhhhbbbbhhhbo.", ".obbhbbbbbbhbbo.", ".obbbbbnnbbbbbo.", ".obbboooooobbbo.", ".obbbbllllbbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbobbbobbbbbo.", "..o..o.o...ooo..",
};
static const char *const GHOST_LOVE_F1[16] = {
    ".....oooooo..h.h", "...oobbbbbboohhh", "..obbbbbbbbbboh.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obhbhbbbbhbhbo.", ".obhhhbbbbhhhbo.", ".obbhbbbbbbhbbo.", ".obbbbbnnbbbbbo.", ".obbboooooobbbo.", ".obbbbllllbbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbobbbobbbbbo.", "..o..o.o...ooo..",
};
static const char *const *const GHOST_LOVE_FRAMES[] = {GHOST_LOVE_F0, GHOST_LOVE_F1};

static const char *const GHOST_ANGRY_F0[16] = {
    ".....oooooo.....", "...oobbbbbbooo..", "..obbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".oboobbbbbboobo.", ".obbbobbbbobbbo.", ".obeeebbbbeeebo.", ".obepebbbbepebo.", ".obbbbbnnbbbbbo.", ".bboboooooobobb.", ".bboboboobobobb.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbobbbobbbbbo.", "..o..o.o...ooo..",
};
static const char *const GHOST_ANGRY_F1[16] = {
    ".....oooooo.....", "...oobbbbbbooo..", "..obbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".oboobbbbbboobo.", ".obbbobbbbobbbo.", ".obeeebbbbeeebo.", ".obepebbbbepebo.", ".obbbbbnnbbbbbo.", ".obbboooooobbbo.", ".obbboboobobbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".bboobbbobbbobb.", ".bbo.o.o...oobb.",
};
static const char *const *const GHOST_ANGRY_FRAMES[] = {GHOST_ANGRY_F0, GHOST_ANGRY_F1};

static const char *const GHOST_DANCE_F0[16] = {
    "...oobbbbbbooo..", "..obbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbobobbbbbbbo.", ".obobbbobbeeebo.", ".obbbbbbbbepebo.", ".obbbbbnnbbbbbo.", ".bboboooooobbbo.", ".bbobbllllbbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbobbbobbbobb.", "..o..o.o...oobb.", "................",
};
static const char *const GHOST_DANCE_F1[16] = {
    "................", ".....oooooo.....", "...oobbbbbbooo..", "..obbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obeeebbbbooobo.", ".obepebbbbbbbbo.", ".obbbbbnnbbbbbo.", ".obbbobbbbobobb.", ".obbbboooobbobb.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".bboobbbobbbbbo.",
};
static const char *const *const GHOST_DANCE_FRAMES[] = {GHOST_DANCE_F0, GHOST_DANCE_F1};

static const char *const GHOST_THINK_F0[16] = {
    ".....oooooo.....", "...oobbbbbbooo.w", "..obbbbbbbbbboww", ".obbbbbbbbbbbwww", ".oboobbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obooobbbbooobo.", ".obooobbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbooobbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbobbbobbbbbo.", "..o..o.o...ooo..",
};
static const char *const GHOST_THINK_F1[16] = {
    ".....oooooo...ww", "...oobbbbbboowww", "..obbbbbbbbbwwww", ".obbbbbbbbbbbbo.", ".oboobbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obooobbbbooobo.", ".obooobbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbooobbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbobbbobbbbbo.", "..o..o.o...ooo..",
};
static const char *const *const GHOST_THINK_FRAMES[] = {GHOST_THINK_F0, GHOST_THINK_F1};

static const CharacterEmoteDef GHOST_EMOTES[] = {
    {"idle", 2, 6, GHOST_IDLE_FRAMES},
    {"happy", 4, 2, GHOST_HAPPY_FRAMES},
    {"sad", 2, 2, GHOST_SAD_FRAMES},
    {"wave", 3, 2, GHOST_WAVE_FRAMES},
    {"sleep", 1, 2, GHOST_SLEEP_FRAMES},
    {"love", 3, 2, GHOST_LOVE_FRAMES},
    {"angry", 6, 2, GHOST_ANGRY_FRAMES},
    {"dance", 5, 2, GHOST_DANCE_FRAMES},
    {"think", 2, 2, GHOST_THINK_FRAMES},
};

// ── Alien ───────────────────────────────────────────────────────
static const CharacterPaletteEntry ALIEN_PALETTE[] = {{'o', 0x1184}, {'b', 0x7F10}, {'l', 0xCFB8}, {'e', 0x08C2}, {'p', 0x7F10}, {'n', 0x1184}, {'w', 0x8EBF}, {'h', 0xFAF1}};

static const char *const ALIEN_IDLE_F0[16] = {
    "..o.........o...", "...o.......o....", "....ooooooo.....", "..oobbbbbbboo...", ".obbbbbbbbbbbo..", ".obeeebbbbeeebo.", ".obeeebbbbeeebo.", ".obbebbbbbbebbo.", ".obbbbbbbbbbbbo.", "..obbboooobbbo..", "..obbbbbbbbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const ALIEN_IDLE_F1[16] = {
    "..o.........o...", "...o.......o....", "....ooooooo.....", "..oobbbbbbboo...", ".obbbbbbbbbbbo..", ".obeeebbbbeeebo.", ".obeeebbbbeeebo.", ".obbebbbbbbebbo.", ".obbbbbbbbbbbbo.", "..obbboooobbbo..", "..obbbbbbbbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const ALIEN_IDLE_F2[16] = {
    "..o.........o...", "...o.......o....", "....ooooooo.....", "..oobbbbbbboo...", ".obbbbbbbbbbbo..", ".obeeebbbbeeebo.", ".obeeebbbbeeebo.", ".obbebbbbbbebbo.", ".obbbbbbbbbbbbo.", "..obbboooobbbo..", "..obbbbbbbbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const ALIEN_IDLE_F3[16] = {
    "..o.........o...", "...o.......o....", "....ooooooo.....", "..oobbbbbbboo...", ".obbbbbbbbbbbo..", ".obeeebbbbeeebo.", ".obeeebbbbeeebo.", ".obbebbbbbbebbo.", ".obbbbbbbbbbbbo.", "..obbboooobbbo..", "..obbbbbbbbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const ALIEN_IDLE_F4[16] = {
    "..o.........o...", "...o.......o....", "....ooooooo.....", "..oobbbbbbboo...", ".obbbbbbbbbbbo..", ".obeeebbbbeeebo.", ".obeeebbbbeeebo.", ".obbebbbbbbebbo.", ".obbbbbbbbbbbbo.", "..obbboooobbbo..", "..obbbbbbbbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const ALIEN_IDLE_F5[16] = {
    "..o.........o...", "...o.......o....", "....ooooooo.....", "..oobbbbbbboo...", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obeeebbbbeeebo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", "..obbboooobbbo..", "..obbbbbbbbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const *const ALIEN_IDLE_FRAMES[] = {ALIEN_IDLE_F0, ALIEN_IDLE_F1, ALIEN_IDLE_F2, ALIEN_IDLE_F3, ALIEN_IDLE_F4, ALIEN_IDLE_F5};

static const char *const ALIEN_HAPPY_F0[16] = {
    "..o.........o...", "...o.......o....", "....ooooooo.....", "..oobbbbbbboo...", ".obbbbbbbbbbbo..", ".obbobobbobobbo.", ".obobbbobobbboo.", ".ohbbbbbbbbbbho.", ".obbbbbnnbbbbbo.", "..obboooooobbo..", "..obbbllllbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const ALIEN_HAPPY_F1[16] = {
    "...o.......o....", "....ooooooo.....", "..oobbbbbbboo...", ".obbbbbbbbbbbo..", ".obbobobbobobbo.", ".obobbbobobbboo.", ".ohbbbbbbbbbbho.", ".obbbbbnnbbbbbo.", "..obboooooobbo..", "..obbbllllbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...", "................",
};
static const char *const *const ALIEN_HAPPY_FRAMES[] = {ALIEN_HAPPY_F0, ALIEN_HAPPY_F1};

static const char *const ALIEN_SAD_F0[16] = {
    "..o.........o...", "...o.......o....", "....ooooooo.....", "..oobbbbbbboo...", ".obbbobbbbobbo..", ".oboobbbbbboobo.", ".obeeebbbbeeebo.", ".obbebbbbbbebbo.", ".obbbbbbbbbbbbo.", "..owbboooobbbo..", "..owbobbbbobbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const ALIEN_SAD_F1[16] = {
    "..o.........o...", "...o.......o....", "....ooooooo.....", "..oobbbbbbboo...", ".obbbobbbbobbo..", ".oboobbbbbboobo.", ".obeeebbbbeeebo.", ".obbebbbbbbebbo.", ".obbbbbbbbbbbbo.", "..obbboooobbbo..", "..obbobbbbobbo..", "...wooooooooo...", "...wobbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const *const ALIEN_SAD_FRAMES[] = {ALIEN_SAD_F0, ALIEN_SAD_F1};

static const char *const ALIEN_WAVE_F0[16] = {
    "..o.........o...", "...o.......o....", "....ooooooo.....", "..oobbbbbbboo...", ".obbbbbbbbbbbo..", ".obbobobbobobbo.", ".obobbbobobbboo.", ".ohbbbbbbbbbbho.", ".obbbbbnnbbbbbo.", "..obboooooobobb.", "..obbbllllbbobb.", "...oooooooooobo.", "....obbbbbbo.bo.", "...obbbbbbbbobo.", "...obbbbbbbbobo.", "...oo......oo...",
};
static const char *const ALIEN_WAVE_F1[16] = {
    "..o.........o...", "...o.......o....", "....ooooooo.....", "..oobbbbbbboo...", ".obbbbbbbbbbbo..", ".obbobobbobobbo.", ".obobbbobobbboo.", ".ohbbbbbbbbbbho.", ".obbbbbnnbbbbbo.", "..obboooooobbo..", "..obbbllllbbbo..", "...oooooooooo...", "....obbbbbbo.bo.", "...obbbbbbbbobo.", "...obbbbbbbbobb.", "...oo......oobb.",
};
static const char *const *const ALIEN_WAVE_FRAMES[] = {ALIEN_WAVE_F0, ALIEN_WAVE_F1};

static const char *const ALIEN_SLEEP_F0[16] = {
    "..o.........o...", "...o.......o....", "....ooooooo.....", "..oobbbbbbboo.ww", ".obbbbbbbbbbbw..", ".obbbbbbbbbbwwo.", ".obooobbbbooobo.", ".obbbbbbbbbbbbo.", ".obbbbbnnbbbbbo.", "..obbbboobbbbo..", "..obbbbbbbbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const ALIEN_SLEEP_F1[16] = {
    "..o.........o.ww", "...o.......o.w..", "....ooooooo.ww..", "..oobbbbbbboo...", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obooobbbbooobo.", ".obbbbbbbbbbbbo.", ".obbbbbnnbbbbbo.", "..obbbboobbbbo..", "..obbbbbbbbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const *const ALIEN_SLEEP_FRAMES[] = {ALIEN_SLEEP_F0, ALIEN_SLEEP_F1};

static const char *const ALIEN_LOVE_F0[16] = {
    "..o.........o...", "h.ho.......o....", "hhh.ooooooo.....", ".hoobbbbbbboo...", ".obbbbbbbbbbbo..", ".obhbhbbbbhbhbo.", ".obhhhbbbbhhhbo.", ".obbhbbbbbbhbbo.", ".obbbbbnnbbbbbo.", "..obboooooobbo..", "..obbbllllbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const ALIEN_LOVE_F1[16] = {
    "..o.........oh.h", "...o.......o.hhh", "....ooooooo...h.", "..oobbbbbbboo...", ".obbbbbbbbbbbo..", ".obhbhbbbbhbhbo.", ".obhhhbbbbhhhbo.", ".obbhbbbbbbhbbo.", ".obbbbbnnbbbbbo.", "..obboooooobbo..", "..obbbllllbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const *const ALIEN_LOVE_FRAMES[] = {ALIEN_LOVE_F0, ALIEN_LOVE_F1};

static const char *const ALIEN_ANGRY_F0[16] = {
    "..o.........o...", "...o.......o....", "....ooooooo.....", "..oobbbbbbboo...", ".oboobbbbbbooo..", ".obbbobbbbobbbo.", ".obeeebbbbeeebo.", ".obbebbbbbbebbo.", ".obbbbbbbbbbbbo.", ".bboboooooobobb.", ".bboboboobobobb.", ".oboooooooooobo.", ".ob.obbbbbbo.bo.", ".obobbbbbbbbobo.", ".obobbbbbbbbobo.", "...oo......oo...",
};
static const char *const ALIEN_ANGRY_F1[16] = {
    "..o.........o...", "...o.......o....", "....ooooooo.....", "..oobbbbbbboo...", ".oboobbbbbbooo..", ".obbbobbbbobbbo.", ".obeeebbbbeeebo.", ".obbebbbbbbebbo.", ".obbbbbbbbbbbbo.", "..obboooooobbo..", "..obboboobobbo..", "...oooooooooo...", ".ob.obbbbbbo.bo.", ".obobbbbbbbbobo.", ".bbobbbbbbbbobb.", ".bboo......oobb.",
};
static const char *const *const ALIEN_ANGRY_FRAMES[] = {ALIEN_ANGRY_F0, ALIEN_ANGRY_F1};

static const char *const ALIEN_DANCE_F0[16] = {
    "...o.......o....", "....ooooooo.....", "..oobbbbbbboo...", ".obbbbbbbbbbbo..", ".obbobobbbbbbbo.", ".obobbbobbeeebo.", ".obbbbbbbbepebo.", ".obbbbbnnbbbbbo.", ".bboboooooobbo..", ".bbobbllllbbbo..", ".oboooooooooo...", ".ob.obbbbbbo.bo.", ".obobbbbbbbbobo.", ".obobbbbbbbbobb.", "...oo......oobb.", "................",
};
static const char *const ALIEN_DANCE_F1[16] = {
    "................", "..o.........o...", "...o.......o....", "....ooooooo.....", "..oobbbbbbboo...", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obeeebbbbooobo.", ".obepebbbbbbbbo.", ".obbbbbnnbbbbbo.", "..obbobbbbobobb.", "..obbboooobbobb.", "...oooooooooobo.", ".ob.obbbbbbo.bo.", ".obobbbbbbbbobo.", ".bbobbbbbbbbobo.",
};
static const char *const *const ALIEN_DANCE_FRAMES[] = {ALIEN_DANCE_F0, ALIEN_DANCE_F1};

static const char *const ALIEN_THINK_F0[16] = {
    "..o.........o...", "...o.......o...w", "....ooooooo...ww", "..oobbbbbbboowww", ".oboobbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obeeebbbbooobo.", ".obepebbbbbbbbo.", ".obbbbbnnbbbbbo.", "..obbbbbooobbo..", "..obbbbbbbbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const ALIEN_THINK_F1[16] = {
    "..o.........o.ww", "...o.......o.www", "....ooooooo.wwww", "..oobbbbbbboo...", ".oboobbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obeeebbbbooobo.", ".obepebbbbbbbbo.", ".obbbbbnnbbbbbo.", "..obbbbbooobbo..", "..obbbbbbbbbbo..", "...oooooooooo...", "....obbbbbbo....", "...obbbbbbbbo...", "...obbbbbbbbo...", "...oo......oo...",
};
static const char *const *const ALIEN_THINK_FRAMES[] = {ALIEN_THINK_F0, ALIEN_THINK_F1};

static const CharacterEmoteDef ALIEN_EMOTES[] = {
    {"idle", 2, 6, ALIEN_IDLE_FRAMES},
    {"happy", 4, 2, ALIEN_HAPPY_FRAMES},
    {"sad", 2, 2, ALIEN_SAD_FRAMES},
    {"wave", 3, 2, ALIEN_WAVE_FRAMES},
    {"sleep", 1, 2, ALIEN_SLEEP_FRAMES},
    {"love", 3, 2, ALIEN_LOVE_FRAMES},
    {"angry", 6, 2, ALIEN_ANGRY_FRAMES},
    {"dance", 5, 2, ALIEN_DANCE_FRAMES},
    {"think", 2, 2, ALIEN_THINK_FRAMES},
};

static const CharacterDef CHARACTERS[] = {
    {"cat", CAT_PALETTE, 8, CAT_EMOTES, 9},
    {"dog", DOG_PALETTE, 8, DOG_EMOTES, 9},
    {"bunny", BUNNY_PALETTE, 8, BUNNY_EMOTES, 9},
    {"person", PERSON_PALETTE, 9, PERSON_EMOTES, 9},
    {"robot", ROBOT_PALETTE, 8, ROBOT_EMOTES, 9},
    {"bird", BIRD_PALETTE, 8, BIRD_EMOTES, 9},
    {"ghost", GHOST_PALETTE, 8, GHOST_EMOTES, 9},
    {"alien", ALIEN_PALETTE, 8, ALIEN_EMOTES, 9},
};
static const size_t CHARACTERS_COUNT = sizeof(CHARACTERS) / sizeof(CHARACTERS[0]);

inline const CharacterDef *findCharacter(const char *id) {
  for (size_t i = 0; i < CHARACTERS_COUNT; i++) {
    if (strcmp(CHARACTERS[i].id, id) == 0) return &CHARACTERS[i];
  }
  return nullptr;
}

inline const CharacterEmoteDef *findEmote(const CharacterDef *c, const char *emoteId) {
  if (!c) return nullptr;
  for (uint8_t i = 0; i < c->emoteCount; i++) {
    if (strcmp(c->emotes[i].id, emoteId) == 0) return &c->emotes[i];
  }
  return c->emoteCount > 0 ? &c->emotes[0] : nullptr; // fall back to idle
}

// Mirrors characterFrameIndex() in lib/character-sprites.ts.
inline uint8_t characterFrameIndex(uint8_t fps, uint8_t frameCount, unsigned long elapsedMs) {
  if (frameCount <= 1) return 0;
  return (uint8_t)(((elapsedMs / 1000.0f) * fps)) % frameCount;
}

// Mirrors drawCharacter() in lib/character-sprites.ts.
inline void drawCharacter(Adafruit_GFX &d, const char *characterId, const char *emoteId, int16_t x,
                          int16_t y, uint8_t scale, unsigned long elapsedMs) {
  const CharacterDef *c = findCharacter(characterId);
  if (!c) return;
  const CharacterEmoteDef *e = findEmote(c, emoteId);
  if (!e) return;
  const char *const *frame = e->frames[characterFrameIndex(e->fps, e->frameCount, elapsedMs)];

  for (uint8_t row = 0; row < CHARACTER_GRID_SIZE; row++) {
    const char *line = frame[row];
    for (uint8_t col = 0; col < CHARACTER_GRID_SIZE; col++) {
      const char code = line[col];
      if (code == '.' || code == '\0') continue;
      for (uint8_t p = 0; p < c->paletteCount; p++) {
        if (c->palette[p].code != code) continue;
        if (scale == 1) {
          d.drawPixel(x + col, y + row, c->palette[p].color);
        } else {
          d.fillRect(x + col * scale, y + row * scale, scale, scale, c->palette[p].color);
        }
        break;
      }
    }
  }
}
