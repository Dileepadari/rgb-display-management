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
    "..o........o....", "..oo......oo....", ".obbo....obbo...", ".obbboooobbbo...", ".obeeebbbbeeeo..", ".obepebbbbepeo..", ".obeeebbbbeeeo..", ".obbbbbnnbbbbo..", ".obbbbllllbbbo..", "..obbbbbbbbbo...", "...ooooooooo....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const CAT_IDLE_F1[16] = {
    "..o........o....", "..oo......oo....", ".obbo....obbo...", ".obbboooobbbo...", ".obeeebbbbeeeo..", ".obepebbbbepeo..", ".obeeebbbbeeeo..", ".obbbbbnnbbbbo..", ".obbbbllllbbbo..", "..obbbbbbbbbo...", "...ooooooooo....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const CAT_IDLE_F2[16] = {
    "..o........o....", "..oo......oo....", ".obbo....obbo...", ".obbboooobbbo...", ".obeeebbbbeeeo..", ".obepebbbbepeo..", ".obeeebbbbeeeo..", ".obbbbbnnbbbbo..", ".obbbbllllbbbo..", "..obbbbbbbbbo...", "...ooooooooo....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const CAT_IDLE_F3[16] = {
    "..o........o....", "..oo......oo....", ".obbo....obbo...", ".obbboooobbbo...", ".obeeebbbbeeeo..", ".obepebbbbepeo..", ".obeeebbbbeeeo..", ".obbbbbnnbbbbo..", ".obbbbllllbbbo..", "..obbbbbbbbbo...", "...ooooooooo....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const CAT_IDLE_F4[16] = {
    "..o........o....", "..oo......oo....", ".obbo....obbo...", ".obbboooobbbo...", ".obeeebbbbeeeo..", ".obepebbbbepeo..", ".obeeebbbbeeeo..", ".obbbbbnnbbbbo..", ".obbbbllllbbbo..", "..obbbbbbbbbo...", "...ooooooooo....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const CAT_IDLE_F5[16] = {
    "..o........o....", "..oo......oo....", ".obbo....obbo...", ".obbboooobbbo...", ".obbbbbbbbbbbo..", ".obooobbbboooo..", ".obbbbbbbbbbbo..", ".obbbbbnnbbbbo..", ".obbbbllllbbbo..", "..obbbbbbbbbo...", "...ooooooooo....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const *const CAT_IDLE_FRAMES[] = {CAT_IDLE_F0, CAT_IDLE_F1, CAT_IDLE_F2, CAT_IDLE_F3, CAT_IDLE_F4, CAT_IDLE_F5};

static const char *const CAT_HAPPY_F0[16] = {
    "..o........o....", "..oo......oo....", ".obbo....obbo...", ".obbboooobbbo...", ".obbobobbobobo..", ".obobbbobobbbo..", ".obbbbbbbbbbbo..", ".obbbbbnnbbbbo..", ".obbboooooobbo..", "..obbbbbbbbbo...", "...ooooooooo....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const CAT_HAPPY_F1[16] = {
    "..oo......oo....", ".obbo....obbo...", ".obbboooobbbo...", ".obbobobbobobo..", ".obobbbobobbbo..", ".obbbbbbbbbbbo..", ".obbbbbnnbbbbo..", ".obbboooooobbo..", "..obbbbbbbbbo...", "...ooooooooo....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....", "................",
};
static const char *const *const CAT_HAPPY_FRAMES[] = {CAT_HAPPY_F0, CAT_HAPPY_F1};

static const char *const CAT_SAD_F0[16] = {
    "..o........o....", "..oo......oo....", ".obbo....obbo...", ".obbboooobbbo...", ".oboobbbbbbooo..", ".obbeebbbbeebo..", ".obbepbbbbpebo..", ".obbbbbnnbbbbo..", ".obwbboooobbbo..", "..owbbbbbbbbo...", "...ooooooooo....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const CAT_SAD_F1[16] = {
    "..o........o....", "..oo......oo....", ".obbo....obbo...", ".obbboooobbbo...", ".oboobbbbbbooo..", ".obbeebbbbeebo..", ".obbepbbbbpebo..", ".obbbbbnnbbbbo..", ".obbbboooobbbo..", "..obbbbbbbbbo...", "...woooooooo....", "...wobbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const *const CAT_SAD_FRAMES[] = {CAT_SAD_F0, CAT_SAD_F1};

static const char *const CAT_WAVE_F0[16] = {
    "..o........o....", "..oo......oo....", ".obbo....obbo...", ".obbboooobbbo...", ".obbobobbobobo..", ".obobbbobobbbo..", ".obbbbbbbbbbbo..", ".obbbbbnnbbbbo..", ".obbboooooobobb.", "..obbbbbbbbbobb.", "...ooooooooo.bo.", "....obbbbbo..bo.", "...obbbbbbbo.bo.", "...obbbbbbbo.bo.", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const CAT_WAVE_F1[16] = {
    "..o........o....", "..oo......oo....", ".obbo....obbo...", ".obbboooobbbo...", ".obbobobbobobo..", ".obobbbobobbbo..", ".obbbbbbbbbbbo..", ".obbbbbnnbbbbo..", ".obbboooooobbo..", "..obbbbbbbbbo...", "...ooooooooo....", "....obbbbbo..bo.", "...obbbbbbbo.bo.", "...obbbbbbboobb.", "...obbbbbbboobb.", "...oo.....oo....",
};
static const char *const *const CAT_WAVE_FRAMES[] = {CAT_WAVE_F0, CAT_WAVE_F1};

static const char *const CAT_SLEEP_F0[16] = {
    "..o........o....", "..oo......oo....", ".obbo....obbo...", ".obbboooobbbo.ww", ".obbbbbbbbbbbw..", ".obooobbbbooww..", ".obbbbbbbbbbbo..", ".obbbbbnnbbbbo..", ".obbbbboobbbbo..", "..obbbbbbbbbo...", "...ooooooooo....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const CAT_SLEEP_F1[16] = {
    "..o........o..ww", "..oo......oo.w..", ".obbo....obbww..", ".obbboooobbbo...", ".obbbbbbbbbbbo..", ".obooobbbboooo..", ".obbbbbbbbbbbo..", ".obbbbbnnbbbbo..", ".obbbbboobbbbo..", "..obbbbbbbbbo...", "...ooooooooo....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const *const CAT_SLEEP_FRAMES[] = {CAT_SLEEP_F0, CAT_SLEEP_F1};

static const char *const CAT_LOVE_F0[16] = {
    "..o........o....", "h.ho......oo....", "hhhbo....obbo...", ".hbbboooobbbo...", ".obhbhbbbbhbho..", ".obhhhbbbbhhho..", ".obbhbbbbbbhbo..", ".obbbbbnnbbbbo..", ".obbboooooobbo..", "..obbbbbbbbbo...", "...ooooooooo....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const CAT_LOVE_F1[16] = {
    "..o........o.h.h", "..oo......oo.hhh", ".obbo....obbo.h.", ".obbboooobbbo...", ".obhbhbbbbhbho..", ".obhhhbbbbhhho..", ".obbhbbbbbbhbo..", ".obbbbbnnbbbbo..", ".obbboooooobbo..", "..obbbbbbbbbo...", "...ooooooooo....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const *const CAT_LOVE_FRAMES[] = {CAT_LOVE_F0, CAT_LOVE_F1};

static const char *const CAT_ANGRY_F0[16] = {
    "..o........o....", "..oo......oo....", ".obbo....obbo...", ".obbboooobbbo...", ".obobbbbbbbboo..", ".obboobbbboobo..", ".obbeebbbbeebo..", ".obbbbbnnbbbbo..", ".bboboooooobobb.", ".bbobbbbbbbbobb.", ".obooooooooo.bo.", ".ob.obbbbbo..bo.", ".obobbbbbbbo.bo.", ".obobbbbbbbo.bo.", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const CAT_ANGRY_F1[16] = {
    "..o........o....", "..oo......oo....", ".obbo....obbo...", ".obbboooobbbo...", ".obobbbbbbbboo..", ".obboobbbboobo..", ".obbeebbbbeebo..", ".obbbbbnnbbbbo..", ".obbboooooobbo..", "..obbbbbbbbbo...", "...ooooooooo....", ".ob.obbbbbo..bo.", ".obobbbbbbbo.bo.", ".bbobbbbbbboobb.", ".bbobbbbbbboobb.", "...oo.....oo....",
};
static const char *const *const CAT_ANGRY_FRAMES[] = {CAT_ANGRY_F0, CAT_ANGRY_F1};

static const char *const CAT_DANCE_F0[16] = {
    "..oo......oo....", ".obbo....obbo...", ".obbboooobbbo...", ".obbobobbobobo..", ".obobbbobobbbo..", ".obbbbbbbbbbbo..", ".obbbbbnnbbbbo..", ".bbobboooobbbo..", ".bbobbbbbbbbo...", ".obooooooooo....", ".ob.obbbbbo..bo.", ".obobbbbbbbo.bo.", ".obobbbbbbboobb.", "...obbbbbbboobb.", "...oo.....oo....", "................",
};
static const char *const CAT_DANCE_F1[16] = {
    "................", "..o........o....", "..oo......oo....", ".obbo....obbo...", ".obbboooobbbo...", ".obeeebbbbbbbo..", ".obepebbbboooo..", ".obeeebbbbbbbo..", ".obbbbbnnbbbbo..", ".obbboooooobobb.", "..obbbbbbbbbobb.", "...ooooooooo.bo.", ".ob.obbbbbo..bo.", ".obobbbbbbbo.bo.", ".bbobbbbbbbo.bo.", ".bbobbbbbbbo....",
};
static const char *const *const CAT_DANCE_FRAMES[] = {CAT_DANCE_F0, CAT_DANCE_F1};

static const char *const CAT_THINK_F0[16] = {
    "..o........o....", "..oo......oo...w", ".obbo....obbo.ww", ".obbboooobbbowww", ".obeeebbbboooo..", ".obepebbbbbbbo..", ".obeeebbbbbbbo..", ".obbbbbnnbbbbo..", ".obbbbbbooobbo..", "..obbbbbbbbbo...", "...ooooooooo....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const CAT_THINK_F1[16] = {
    "..o........o..ww", "..oo......oo.www", ".obbo....obbwwww", ".obbboooobbbo...", ".obeeebbbboooo..", ".obepebbbbbbbo..", ".obeeebbbbbbbo..", ".obbbbbnnbbbbo..", ".obbbbbbooobbo..", "..obbbbbbbbbo...", "...ooooooooo....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
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
    "...ooooooooo....", "..obbbbbbbbbo...", "obbobbbbbbbobbo.", "obbobbbbbbbobbo.", "obbeeebbbbeeebo.", "obbepebbbbepebo.", "obbeeebbbbeeebo.", "obbobbbnnbbobbo.", ".oobbbllllbboo..", "..obbbbbbbbbo...", "...ooooooooo....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const DOG_IDLE_F1[16] = {
    "...ooooooooo....", "..obbbbbbbbbo...", "obbobbbbbbbobbo.", "obbobbbbbbbobbo.", "obbeeebbbbeeebo.", "obbepebbbbepebo.", "obbeeebbbbeeebo.", "obbobbbnnbbobbo.", ".oobbbllllbboo..", "..obbbbbbbbbo...", "...ooooooooo....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const DOG_IDLE_F2[16] = {
    "...ooooooooo....", "..obbbbbbbbbo...", "obbobbbbbbbobbo.", "obbobbbbbbbobbo.", "obbeeebbbbeeebo.", "obbepebbbbepebo.", "obbeeebbbbeeebo.", "obbobbbnnbbobbo.", ".oobbbllllbboo..", "..obbbbbbbbbo...", "...ooooooooo....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const DOG_IDLE_F3[16] = {
    "...ooooooooo....", "..obbbbbbbbbo...", "obbobbbbbbbobbo.", "obbobbbbbbbobbo.", "obbeeebbbbeeebo.", "obbepebbbbepebo.", "obbeeebbbbeeebo.", "obbobbbnnbbobbo.", ".oobbbllllbboo..", "..obbbbbbbbbo...", "...ooooooooo....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const DOG_IDLE_F4[16] = {
    "...ooooooooo....", "..obbbbbbbbbo...", "obbobbbbbbbobbo.", "obbobbbbbbbobbo.", "obbeeebbbbeeebo.", "obbepebbbbepebo.", "obbeeebbbbeeebo.", "obbobbbnnbbobbo.", ".oobbbllllbboo..", "..obbbbbbbbbo...", "...ooooooooo....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const DOG_IDLE_F5[16] = {
    "...ooooooooo....", "..obbbbbbbbbo...", "obbobbbbbbbobbo.", "obbobbbbbbbobbo.", "obbobbbbbbbobbo.", "obbooobbbbooobo.", "obbobbbbbbbobbo.", "obbobbbnnbbobbo.", ".oobbbllllbboo..", "..obbbbbbbbbo...", "...ooooooooo....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const *const DOG_IDLE_FRAMES[] = {DOG_IDLE_F0, DOG_IDLE_F1, DOG_IDLE_F2, DOG_IDLE_F3, DOG_IDLE_F4, DOG_IDLE_F5};

static const char *const DOG_HAPPY_F0[16] = {
    "...ooooooooo....", "..obbbbbbbbbo...", "obbobbbbbbbobbo.", "obbobbbbbbbobbo.", "obboobobbobobbo.", "obbobbboboboboo.", "obbobbbbbbbobbo.", "obbobbbnnbbobbo.", ".oobbooooooboo..", "..obbbbbbbbbo...", "...ooooooooo....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const DOG_HAPPY_F1[16] = {
    "..obbbbbbbbbo...", "obbobbbbbbbobbo.", "obbobbbbbbbobbo.", "obboobobbobobbo.", "obbobbboboboboo.", "obbobbbbbbbobbo.", "obbobbbnnbbobbo.", ".oobbooooooboo..", "..obbbbbbbbbo...", "...ooooooooo....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....", "................",
};
static const char *const *const DOG_HAPPY_FRAMES[] = {DOG_HAPPY_F0, DOG_HAPPY_F1};

static const char *const DOG_SAD_F0[16] = {
    "...ooooooooo....", "..obbbbbbbbbo...", "obbobbbbbbbobbo.", "obbobbbbbbbobbo.", "obboobbbbbboobo.", "obboeebbbbeebbo.", "obboepbbbbpebbo.", "obbobbbnnbbobbo.", ".oowbboooobboo..", "..owbbbbbbbbo...", "...ooooooooo....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const DOG_SAD_F1[16] = {
    "...ooooooooo....", "..obbbbbbbbbo...", "obbobbbbbbbobbo.", "obbobbbbbbbobbo.", "obboobbbbbboobo.", "obboeebbbbeebbo.", "obboepbbbbpebbo.", "obbobbbnnbbobbo.", ".oobbboooobboo..", "..obbbbbbbbbo...", "...woooooooo....", "...wobbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const *const DOG_SAD_FRAMES[] = {DOG_SAD_F0, DOG_SAD_F1};

static const char *const DOG_WAVE_F0[16] = {
    "...ooooooooo....", "..obbbbbbbbbo...", "obbobbbbbbbobbo.", "obbobbbbbbbobbo.", "obboobobbobobbo.", "obbobbboboboboo.", "obbobbbbbbbobbo.", "obbobbbnnbbobbo.", ".oobboooooobobb.", "..obbbbbbbbbobb.", "...ooooooooo.bo.", "....obbbbbo..bo.", "...obbbbbbbo.bo.", "...obbbbbbbo.bo.", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const DOG_WAVE_F1[16] = {
    "...ooooooooo....", "..obbbbbbbbbo...", "obbobbbbbbbobbo.", "obbobbbbbbbobbo.", "obboobobbobobbo.", "obbobbboboboboo.", "obbobbbbbbbobbo.", "obbobbbnnbbobbo.", ".oobbooooooboo..", "..obbbbbbbbbo...", "...ooooooooo....", "....obbbbbo..bo.", "...obbbbbbbo.bo.", "...obbbbbbboobb.", "...obbbbbbboobb.", "...oo.....oo....",
};
static const char *const *const DOG_WAVE_FRAMES[] = {DOG_WAVE_F0, DOG_WAVE_F1};

static const char *const DOG_SLEEP_F0[16] = {
    "...ooooooooo....", "..obbbbbbbbbo...", "obbobbbbbbbobbo.", "obbobbbbbbbobbww", "obbobbbbbbbobwo.", "obbooobbbboowwo.", "obbobbbbbbbobbo.", "obbobbbnnbbobbo.", ".oobbbboobbboo..", "..obbbbbbbbbo...", "...ooooooooo....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const DOG_SLEEP_F1[16] = {
    "...ooooooooo..ww", "..obbbbbbbbbow..", "obbobbbbbbbowwo.", "obbobbbbbbbobbo.", "obbobbbbbbbobbo.", "obbooobbbbooobo.", "obbobbbbbbbobbo.", "obbobbbnnbbobbo.", ".oobbbboobbboo..", "..obbbbbbbbbo...", "...ooooooooo....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const *const DOG_SLEEP_FRAMES[] = {DOG_SLEEP_F0, DOG_SLEEP_F1};

static const char *const DOG_LOVE_F0[16] = {
    "...ooooooooo....", "h.hbbbbbbbbbo...", "hhhobbbbbbbobbo.", "ohbobbbbbbbobbo.", "obbhbhbbbbhohbo.", "obbhhhbbbbhhhbo.", "obbohbbbbbbhbbo.", "obbobbbnnbbobbo.", ".oobbooooooboo..", "..obbbbbbbbbo...", "...ooooooooo....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const DOG_LOVE_F1[16] = {
    "...ooooooooo.h.h", "..obbbbbbbbbohhh", "obbobbbbbbbobbh.", "obbobbbbbbbobbo.", "obbhbhbbbbhohbo.", "obbhhhbbbbhhhbo.", "obbohbbbbbbhbbo.", "obbobbbnnbbobbo.", ".oobbooooooboo..", "..obbbbbbbbbo...", "...ooooooooo....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const *const DOG_LOVE_FRAMES[] = {DOG_LOVE_F0, DOG_LOVE_F1};

static const char *const DOG_ANGRY_F0[16] = {
    "...ooooooooo....", "..obbbbbbbbbo...", "obbobbbbbbbobbo.", "obbobbbbbbbobbo.", "obbobbbbbbboobo.", "obbooobbbboobbo.", "obboeebbbbeebbo.", "obbobbbnnbbobbo.", ".bboboooooobobb.", ".bbobbbbbbbbobb.", ".obooooooooo.bo.", ".ob.obbbbbo..bo.", ".obobbbbbbbo.bo.", ".obobbbbbbbo.bo.", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const DOG_ANGRY_F1[16] = {
    "...ooooooooo....", "..obbbbbbbbbo...", "obbobbbbbbbobbo.", "obbobbbbbbbobbo.", "obbobbbbbbboobo.", "obbooobbbboobbo.", "obboeebbbbeebbo.", "obbobbbnnbbobbo.", ".oobbooooooboo..", "..obbbbbbbbbo...", "...ooooooooo....", ".ob.obbbbbo..bo.", ".obobbbbbbbo.bo.", ".bbobbbbbbboobb.", ".bbobbbbbbboobb.", "...oo.....oo....",
};
static const char *const *const DOG_ANGRY_FRAMES[] = {DOG_ANGRY_F0, DOG_ANGRY_F1};

static const char *const DOG_DANCE_F0[16] = {
    "..obbbbbbbbbo...", "obbobbbbbbbobbo.", "obbobbbbbbbobbo.", "obboobobbobobbo.", "obbobbboboboboo.", "obbobbbbbbbobbo.", "obbobbbnnbbobbo.", ".bbobboooobboo..", ".bbobbbbbbbbo...", ".obooooooooo....", ".ob.obbbbbo..bo.", ".obobbbbbbbo.bo.", ".obobbbbbbboobb.", "...obbbbbbboobb.", "...oo.....oo....", "................",
};
static const char *const DOG_DANCE_F1[16] = {
    "................", "...ooooooooo....", "..obbbbbbbbbo...", "obbobbbbbbbobbo.", "obbobbbbbbbobbo.", "obbeeebbbbbobbo.", "obbepebbbbooobo.", "obbeeebbbbbobbo.", "obbobbbnnbbobbo.", ".oobboooooobobb.", "..obbbbbbbbbobb.", "...ooooooooo.bo.", ".ob.obbbbbo..bo.", ".obobbbbbbbo.bo.", ".bbobbbbbbbo.bo.", ".bbobbbbbbbo....",
};
static const char *const *const DOG_DANCE_FRAMES[] = {DOG_DANCE_F0, DOG_DANCE_F1};

static const char *const DOG_THINK_F0[16] = {
    "...ooooooooo....", "..obbbbbbbbbo..w", "obbobbbbbbbobbww", "obbobbbbbbbobwww", "obbeeebbbbooobo.", "obbepebbbbbobbo.", "obbeeebbbbbobbo.", "obbobbbnnbbobbo.", ".oobbbbboooboo..", "..obbbbbbbbbo...", "...ooooooooo....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const DOG_THINK_F1[16] = {
    "...ooooooooo..ww", "..obbbbbbbbbowww", "obbobbbbbbbowwww", "obbobbbbbbbobbo.", "obbeeebbbbooobo.", "obbepebbbbbobbo.", "obbeeebbbbbobbo.", "obbobbbnnbbobbo.", ".oobbbbboooboo..", "..obbbbbbbbbo...", "...ooooooooo....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
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
    "...oo...oo......", "..obbo.obbo.....", "..obbo.obbo.....", "..obbooobbo.....", ".obeeebbbbeee...", ".obepebbbbepe...", ".obeeebbbbeee...", ".obbbbbnnbbbo...", ".obbbbllllbbo...", "..obbbbbbbbo....", "...ooooooooo....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const BUNNY_IDLE_F1[16] = {
    "...oo...oo......", "..obbo.obbo.....", "..obbo.obbo.....", "..obbooobbo.....", ".obeeebbbbeee...", ".obepebbbbepe...", ".obeeebbbbeee...", ".obbbbbnnbbbo...", ".obbbbllllbbo...", "..obbbbbbbbo....", "...ooooooooo....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const BUNNY_IDLE_F2[16] = {
    "...oo...oo......", "..obbo.obbo.....", "..obbo.obbo.....", "..obbooobbo.....", ".obeeebbbbeee...", ".obepebbbbepe...", ".obeeebbbbeee...", ".obbbbbnnbbbo...", ".obbbbllllbbo...", "..obbbbbbbbo....", "...ooooooooo....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const BUNNY_IDLE_F3[16] = {
    "...oo...oo......", "..obbo.obbo.....", "..obbo.obbo.....", "..obbooobbo.....", ".obeeebbbbeee...", ".obepebbbbepe...", ".obeeebbbbeee...", ".obbbbbnnbbbo...", ".obbbbllllbbo...", "..obbbbbbbbo....", "...ooooooooo....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const BUNNY_IDLE_F4[16] = {
    "...oo...oo......", "..obbo.obbo.....", "..obbo.obbo.....", "..obbooobbo.....", ".obeeebbbbeee...", ".obepebbbbepe...", ".obeeebbbbeee...", ".obbbbbnnbbbo...", ".obbbbllllbbo...", "..obbbbbbbbo....", "...ooooooooo....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const BUNNY_IDLE_F5[16] = {
    "...oo...oo......", "..obbo.obbo.....", "..obbo.obbo.....", "..obbooobbo.....", ".obbbbbbbbbo....", ".obooobbbbooo...", ".obbbbbbbbbbo...", ".obbbbbnnbbbo...", ".obbbbllllbbo...", "..obbbbbbbbo....", "...ooooooooo....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const *const BUNNY_IDLE_FRAMES[] = {BUNNY_IDLE_F0, BUNNY_IDLE_F1, BUNNY_IDLE_F2, BUNNY_IDLE_F3, BUNNY_IDLE_F4, BUNNY_IDLE_F5};

static const char *const BUNNY_HAPPY_F0[16] = {
    "...oo...oo......", "..obbo.obbo.....", "..obbo.obbo.....", "..obbooobbo.....", ".obbobobbobo....", ".obobbbobobboo..", ".obbbbbbbbbbo...", ".obbbbbnnbbbo...", ".obbboooooobo...", "..obbbbbbbbo....", "...ooooooooo....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const BUNNY_HAPPY_F1[16] = {
    "..obbo.obbo.....", "..obbo.obbo.....", "..obbooobbo.....", ".obbobobbobo....", ".obobbbobobboo..", ".obbbbbbbbbbo...", ".obbbbbnnbbbo...", ".obbboooooobo...", "..obbbbbbbbo....", "...ooooooooo....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....", "................",
};
static const char *const *const BUNNY_HAPPY_FRAMES[] = {BUNNY_HAPPY_F0, BUNNY_HAPPY_F1};

static const char *const BUNNY_SAD_F0[16] = {
    "...oo...oo......", "..obbo.obbo.....", "..obbo.obbo.....", "..obbooobbo.....", ".oboobbbbbboo...", ".obbeebbbbeeo...", ".obbepbbbbpeo...", ".obbbbbnnbbbo...", ".obwbboooobbo...", "..owbbbbbbbo....", "...ooooooooo....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const BUNNY_SAD_F1[16] = {
    "...oo...oo......", "..obbo.obbo.....", "..obbo.obbo.....", "..obbooobbo.....", ".oboobbbbbboo...", ".obbeebbbbeeo...", ".obbepbbbbpeo...", ".obbbbbnnbbbo...", ".obbbboooobbo...", "..obbbbbbbbo....", "...woooooooo....", "...wobbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const *const BUNNY_SAD_FRAMES[] = {BUNNY_SAD_F0, BUNNY_SAD_F1};

static const char *const BUNNY_WAVE_F0[16] = {
    "...oo...oo......", "..obbo.obbo.....", "..obbo.obbo.....", "..obbooobbo.....", ".obbobobbobo....", ".obobbbobobboo..", ".obbbbbbbbbbo...", ".obbbbbnnbbbo...", ".obbboooooobobb.", "..obbbbbbbboobb.", "...ooooooooo.bo.", "....obbbbbo..bo.", "...obbbbbbbo.bo.", "...obbbbbbbo.bo.", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const BUNNY_WAVE_F1[16] = {
    "...oo...oo......", "..obbo.obbo.....", "..obbo.obbo.....", "..obbooobbo.....", ".obbobobbobo....", ".obobbbobobboo..", ".obbbbbbbbbbo...", ".obbbbbnnbbbo...", ".obbboooooobo...", "..obbbbbbbbo....", "...ooooooooo....", "....obbbbbo..bo.", "...obbbbbbbo.bo.", "...obbbbbbboobb.", "...obbbbbbboobb.", "...oo.....oo....",
};
static const char *const *const BUNNY_WAVE_FRAMES[] = {BUNNY_WAVE_F0, BUNNY_WAVE_F1};

static const char *const BUNNY_SLEEP_F0[16] = {
    "...oo...oo......", "..obbo.obbo.....", "..obbo.obbo.....", "..obbooobbo...ww", ".obbbbbbbbbo.w..", ".obooobbbbooww..", ".obbbbbbbbbbo...", ".obbbbbnnbbbo...", ".obbbbboobbbo...", "..obbbbbbbbo....", "...ooooooooo....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const BUNNY_SLEEP_F1[16] = {
    "...oo...oo....ww", "..obbo.obbo..w..", "..obbo.obbo.ww..", "..obbooobbo.....", ".obbbbbbbbbo....", ".obooobbbbooo...", ".obbbbbbbbbbo...", ".obbbbbnnbbbo...", ".obbbbboobbbo...", "..obbbbbbbbo....", "...ooooooooo....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const *const BUNNY_SLEEP_FRAMES[] = {BUNNY_SLEEP_F0, BUNNY_SLEEP_F1};

static const char *const BUNNY_LOVE_F0[16] = {
    "...oo...oo......", "h.hbbo.obbo.....", "hhhbbo.obbo.....", ".hobbooobbo.....", ".obhbhbbbbhoh...", ".obhhhbbbbhhh...", ".obbhbbbbbbho...", ".obbbbbnnbbbo...", ".obbboooooobo...", "..obbbbbbbbo....", "...ooooooooo....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const BUNNY_LOVE_F1[16] = {
    "...oo...oo...h.h", "..obbo.obbo..hhh", "..obbo.obbo...h.", "..obbooobbo.....", ".obhbhbbbbhoh...", ".obhhhbbbbhhh...", ".obbhbbbbbbho...", ".obbbbbnnbbbo...", ".obbboooooobo...", "..obbbbbbbbo....", "...ooooooooo....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const *const BUNNY_LOVE_FRAMES[] = {BUNNY_LOVE_F0, BUNNY_LOVE_F1};

static const char *const BUNNY_ANGRY_F0[16] = {
    "...oo...oo......", "..obbo.obbo.....", "..obbo.obbo.....", "..obbooobbo.....", ".obobbbbbbboo...", ".obboobbbbooo...", ".obbeebbbbeeo...", ".obbbbbnnbbbo...", ".bboboooooobobb.", ".bbobbbbbbboobb.", ".obooooooooo.bo.", ".ob.obbbbbo..bo.", ".obobbbbbbbo.bo.", ".obobbbbbbbo.bo.", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const BUNNY_ANGRY_F1[16] = {
    "...oo...oo......", "..obbo.obbo.....", "..obbo.obbo.....", "..obbooobbo.....", ".obobbbbbbboo...", ".obboobbbbooo...", ".obbeebbbbeeo...", ".obbbbbnnbbbo...", ".obbboooooobo...", "..obbbbbbbbo....", "...ooooooooo....", ".ob.obbbbbo..bo.", ".obobbbbbbbo.bo.", ".bbobbbbbbboobb.", ".bbobbbbbbboobb.", "...oo.....oo....",
};
static const char *const *const BUNNY_ANGRY_FRAMES[] = {BUNNY_ANGRY_F0, BUNNY_ANGRY_F1};

static const char *const BUNNY_DANCE_F0[16] = {
    "..obbo.obbo.....", "..obbo.obbo.....", "..obbooobbo.....", ".obbobobbobo....", ".obobbbobobboo..", ".obbbbbbbbbbo...", ".obbbbbnnbbbo...", ".bbobboooobbo...", ".bbobbbbbbbo....", ".obooooooooo....", ".ob.obbbbbo..bo.", ".obobbbbbbbo.bo.", ".obobbbbbbboobb.", "...obbbbbbboobb.", "...oo.....oo....", "................",
};
static const char *const BUNNY_DANCE_F1[16] = {
    "................", "...oo...oo......", "..obbo.obbo.....", "..obbo.obbo.....", "..obbooobbo.....", ".obeeebbbbbo....", ".obepebbbbooo...", ".obeeebbbbbbo...", ".obbbbbnnbbbo...", ".obbboooooobobb.", "..obbbbbbbboobb.", "...ooooooooo.bo.", ".ob.obbbbbo..bo.", ".obobbbbbbbo.bo.", ".bbobbbbbbbo.bo.", ".bbobbbbbbbo....",
};
static const char *const *const BUNNY_DANCE_FRAMES[] = {BUNNY_DANCE_F0, BUNNY_DANCE_F1};

static const char *const BUNNY_THINK_F0[16] = {
    "...oo...oo......", "..obbo.obbo....w", "..obbo.obbo...ww", "..obbooobbo..www", ".obeeebbbbooo...", ".obepebbbbbbo...", ".obeeebbbbbbo...", ".obbbbbnnbbbo...", ".obbbbbbooobo...", "..obbbbbbbbo....", "...ooooooooo....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const BUNNY_THINK_F1[16] = {
    "...oo...oo....ww", "..obbo.obbo..www", "..obbo.obbo.wwww", "..obbooobbo.....", ".obeeebbbbooo...", ".obepebbbbbbo...", ".obeeebbbbbbo...", ".obbbbbnnbbbo...", ".obbbbbbooobo...", "..obbbbbbbbo....", "...ooooooooo....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
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
static const CharacterPaletteEntry PERSON_PALETTE[] = {{'o', 0x20C2}, {'b', 0xF611}, {'l', 0xE2A9}, {'e', 0xFFFF}, {'p', 0x20C2}, {'n', 0xBB8B}, {'w', 0x8EBF}, {'h', 0xFAF1}};

static const char *const PERSON_IDLE_F0[16] = {
    "...ohhhhhho.....", "..ohhhhhhhho....", "..ohhhhhhhho....", "..obbbbbbbbo....", "..oeeebbbbeee...", "..oepebbbbepe...", "..oeeebbbbeee...", "..obbbbnnbbbo...", "..obbbllllbbo...", "...obbbbbbbo....", "....ooooooo.....", "....ollllo......", "...ollllllo.....", "...ollllllo.....", "...ollllllo.....", "...oo....oo.....",
};
static const char *const PERSON_IDLE_F1[16] = {
    "...ohhhhhho.....", "..ohhhhhhhho....", "..ohhhhhhhho....", "..obbbbbbbbo....", "..oeeebbbbeee...", "..oepebbbbepe...", "..oeeebbbbeee...", "..obbbbnnbbbo...", "..obbbllllbbo...", "...obbbbbbbo....", "....ooooooo.....", "....ollllo......", "...ollllllo.....", "...ollllllo.....", "...ollllllo.....", "...oo....oo.....",
};
static const char *const PERSON_IDLE_F2[16] = {
    "...ohhhhhho.....", "..ohhhhhhhho....", "..ohhhhhhhho....", "..obbbbbbbbo....", "..oeeebbbbeee...", "..oepebbbbepe...", "..oeeebbbbeee...", "..obbbbnnbbbo...", "..obbbllllbbo...", "...obbbbbbbo....", "....ooooooo.....", "....ollllo......", "...ollllllo.....", "...ollllllo.....", "...ollllllo.....", "...oo....oo.....",
};
static const char *const PERSON_IDLE_F3[16] = {
    "...ohhhhhho.....", "..ohhhhhhhho....", "..ohhhhhhhho....", "..obbbbbbbbo....", "..oeeebbbbeee...", "..oepebbbbepe...", "..oeeebbbbeee...", "..obbbbnnbbbo...", "..obbbllllbbo...", "...obbbbbbbo....", "....ooooooo.....", "....ollllo......", "...ollllllo.....", "...ollllllo.....", "...ollllllo.....", "...oo....oo.....",
};
static const char *const PERSON_IDLE_F4[16] = {
    "...ohhhhhho.....", "..ohhhhhhhho....", "..ohhhhhhhho....", "..obbbbbbbbo....", "..oeeebbbbeee...", "..oepebbbbepe...", "..oeeebbbbeee...", "..obbbbnnbbbo...", "..obbbllllbbo...", "...obbbbbbbo....", "....ooooooo.....", "....ollllo......", "...ollllllo.....", "...ollllllo.....", "...ollllllo.....", "...oo....oo.....",
};
static const char *const PERSON_IDLE_F5[16] = {
    "...ohhhhhho.....", "..ohhhhhhhho....", "..ohhhhhhhho....", "..obbbbbbbbo....", "..obbbbbbbbbo...", "..oooobbbbooo...", "..obbbbbbbbbo...", "..obbbbnnbbbo...", "..obbbllllbbo...", "...obbbbbbbo....", "....ooooooo.....", "....ollllo......", "...ollllllo.....", "...ollllllo.....", "...ollllllo.....", "...oo....oo.....",
};
static const char *const *const PERSON_IDLE_FRAMES[] = {PERSON_IDLE_F0, PERSON_IDLE_F1, PERSON_IDLE_F2, PERSON_IDLE_F3, PERSON_IDLE_F4, PERSON_IDLE_F5};

static const char *const PERSON_HAPPY_F0[16] = {
    "...ohhhhhho.....", "..ohhhhhhhho....", "..ohhhhhhhho....", "..obbbbbbbbo....", "..obobobboboo...", "..oobbbobobboo..", "..obbbbbbbbbo...", "..obbbbnnbbbo...", "..obboooooobo...", "...obbbbbbbo....", "....ooooooo.....", "....ollllo......", "...ollllllo.....", "...ollllllo.....", "...ollllllo.....", "...oo....oo.....",
};
static const char *const PERSON_HAPPY_F1[16] = {
    "..ohhhhhhhho....", "..ohhhhhhhho....", "..obbbbbbbbo....", "..obobobboboo...", "..oobbbobobboo..", "..obbbbbbbbbo...", "..obbbbnnbbbo...", "..obboooooobo...", "...obbbbbbbo....", "....ooooooo.....", "....ollllo......", "...ollllllo.....", "...ollllllo.....", "...ollllllo.....", "...oo....oo.....", "................",
};
static const char *const *const PERSON_HAPPY_FRAMES[] = {PERSON_HAPPY_F0, PERSON_HAPPY_F1};

static const char *const PERSON_SAD_F0[16] = {
    "...ohhhhhho.....", "..ohhhhhhhho....", "..ohhhhhhhho....", "..obbbbbbbbo....", "..ooobbbbbboo...", "..obeebbbbeeo...", "..obepbbbbpeo...", "..obbbbnnbbbo...", "..owbboooobbo...", "...wbbbbbbbo....", "....ooooooo.....", "....ollllo......", "...ollllllo.....", "...ollllllo.....", "...ollllllo.....", "...oo....oo.....",
};
static const char *const PERSON_SAD_F1[16] = {
    "...ohhhhhho.....", "..ohhhhhhhho....", "..ohhhhhhhho....", "..obbbbbbbbo....", "..ooobbbbbboo...", "..obeebbbbeeo...", "..obepbbbbpeo...", "..obbbbnnbbbo...", "..obbboooobbo...", "...obbbbbbbo....", "...wooooooo.....", "...wollllo......", "...ollllllo.....", "...ollllllo.....", "...ollllllo.....", "...oo....oo.....",
};
static const char *const *const PERSON_SAD_FRAMES[] = {PERSON_SAD_F0, PERSON_SAD_F1};

static const char *const PERSON_WAVE_F0[16] = {
    "...ohhhhhho.....", "..ohhhhhhhho....", "..ohhhhhhhho....", "..obbbbbbbbo....", "..obobobboboo...", "..oobbbobobboo..", "..obbbbbbbbbo...", "..obbbbnnbbbo...", "..obboooooobobb.", "...obbbbbbboobb.", "....ooooooo..bo.", "....ollllo...bo.", "...ollllllo..bo.", "...ollllllo..bo.", "...ollllllo.....", "...oo....oo.....",
};
static const char *const PERSON_WAVE_F1[16] = {
    "...ohhhhhho.....", "..ohhhhhhhho....", "..ohhhhhhhho....", "..obbbbbbbbo....", "..obobobboboo...", "..oobbbobobboo..", "..obbbbbbbbbo...", "..obbbbnnbbbo...", "..obboooooobo...", "...obbbbbbbo....", "....ooooooo.....", "....ollllo...bo.", "...ollllllo..bo.", "...ollllllo.obb.", "...ollllllo.obb.", "...oo....oo.....",
};
static const char *const *const PERSON_WAVE_FRAMES[] = {PERSON_WAVE_F0, PERSON_WAVE_F1};

static const char *const PERSON_SLEEP_F0[16] = {
    "...ohhhhhho.....", "..ohhhhhhhho....", "..ohhhhhhhho....", "..obbbbbbbbo..ww", "..obbbbbbbbbow..", "..oooobbbbooww..", "..obbbbbbbbbo...", "..obbbbnnbbbo...", "..obbbboobbbo...", "...obbbbbbbo....", "....ooooooo.....", "....ollllo......", "...ollllllo.....", "...ollllllo.....", "...ollllllo.....", "...oo....oo.....",
};
static const char *const PERSON_SLEEP_F1[16] = {
    "...ohhhhhho...ww", "..ohhhhhhhho.w..", "..ohhhhhhhhoww..", "..obbbbbbbbo....", "..obbbbbbbbbo...", "..oooobbbbooo...", "..obbbbbbbbbo...", "..obbbbnnbbbo...", "..obbbboobbbo...", "...obbbbbbbo....", "....ooooooo.....", "....ollllo......", "...ollllllo.....", "...ollllllo.....", "...ollllllo.....", "...oo....oo.....",
};
static const char *const *const PERSON_SLEEP_FRAMES[] = {PERSON_SLEEP_F0, PERSON_SLEEP_F1};

static const char *const PERSON_LOVE_F0[16] = {
    "...ohhhhhho.....", "h.hhhhhhhhho....", "hhhhhhhhhhho....", ".hobbbbbbbbo....", "..ohbhbbbbhbh...", "..ohhhbbbbhhh...", "..obhbbbbbbho...", "..obbbbnnbbbo...", "..obboooooobo...", "...obbbbbbbo....", "....ooooooo.....", "....ollllo......", "...ollllllo.....", "...ollllllo.....", "...ollllllo.....", "...oo....oo.....",
};
static const char *const PERSON_LOVE_F1[16] = {
    "...ohhhhhho..h.h", "..ohhhhhhhho.hhh", "..ohhhhhhhho..h.", "..obbbbbbbbo....", "..ohbhbbbbhbh...", "..ohhhbbbbhhh...", "..obhbbbbbbho...", "..obbbbnnbbbo...", "..obboooooobo...", "...obbbbbbbo....", "....ooooooo.....", "....ollllo......", "...ollllllo.....", "...ollllllo.....", "...ollllllo.....", "...oo....oo.....",
};
static const char *const *const PERSON_LOVE_FRAMES[] = {PERSON_LOVE_F0, PERSON_LOVE_F1};

static const char *const PERSON_ANGRY_F0[16] = {
    "...ohhhhhho.....", "..ohhhhhhhho....", "..ohhhhhhhho....", "..obbbbbbbbo....", "..oobbbbbbbbo...", "..oboobbbbooo...", "..obeebbbbeeo...", "..obbbbnnbbbo...", ".bboboooooobobb.", ".bbobbbbbbboobb.", ".ob.ooooooo..bo.", ".ob.ollllo...bo.", ".obollllllo..bo.", ".obollllllo..bo.", "...ollllllo.....", "...oo....oo.....",
};
static const char *const PERSON_ANGRY_F1[16] = {
    "...ohhhhhho.....", "..ohhhhhhhho....", "..ohhhhhhhho....", "..obbbbbbbbo....", "..oobbbbbbbbo...", "..oboobbbbooo...", "..obeebbbbeeo...", "..obbbbnnbbbo...", "..obboooooobo...", "...obbbbbbbo....", "....ooooooo.....", ".ob.ollllo...bo.", ".obollllllo..bo.", ".bbollllllo.obb.", ".bbollllllo.obb.", "...oo....oo.....",
};
static const char *const *const PERSON_ANGRY_FRAMES[] = {PERSON_ANGRY_F0, PERSON_ANGRY_F1};

static const char *const PERSON_DANCE_F0[16] = {
    "..ohhhhhhhho....", "..ohhhhhhhho....", "..obbbbbbbbo....", "..obobobboboo...", "..oobbbobobboo..", "..obbbbbbbbbo...", "..obbbbnnbbbo...", ".bbobboooobbo...", ".bbobbbbbbbo....", ".ob.ooooooo.....", ".ob.ollllo...bo.", ".obollllllo..bo.", ".obollllllo.obb.", "...ollllllo.obb.", "...oo....oo.....", "................",
};
static const char *const PERSON_DANCE_F1[16] = {
    "................", "...ohhhhhho.....", "..ohhhhhhhho....", "..ohhhhhhhho....", "..obbbbbbbbo....", "..oeeebbbbbbo...", "..oepebbbbooo...", "..oeeebbbbbbo...", "..obbbbnnbbbo...", "..obboooooobobb.", "...obbbbbbboobb.", "....ooooooo..bo.", ".ob.ollllo...bo.", ".obollllllo..bo.", ".bbollllllo..bo.", ".bbollllllo.....",
};
static const char *const *const PERSON_DANCE_FRAMES[] = {PERSON_DANCE_F0, PERSON_DANCE_F1};

static const char *const PERSON_THINK_F0[16] = {
    "...ohhhhhho.....", "..ohhhhhhhho...w", "..ohhhhhhhho..ww", "..obbbbbbbbo.www", "..oeeebbbbooo...", "..oepebbbbbbo...", "..oeeebbbbbbo...", "..obbbbnnbbbo...", "..obbbbbooobo...", "...obbbbbbbo....", "....ooooooo.....", "....ollllo......", "...ollllllo.....", "...ollllllo.....", "...ollllllo.....", "...oo....oo.....",
};
static const char *const PERSON_THINK_F1[16] = {
    "...ohhhhhho...ww", "..ohhhhhhhho.www", "..ohhhhhhhhowwww", "..obbbbbbbbo....", "..oeeebbbbooo...", "..oepebbbbbbo...", "..oeeebbbbbbo...", "..obbbbnnbbbo...", "..obbbbbooobo...", "...obbbbbbbo....", "....ooooooo.....", "....ollllo......", "...ollllllo.....", "...ollllllo.....", "...ollllllo.....", "...oo....oo.....",
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
    ".......oo.......", "......obbo......", "...ooooooooo....", "..obbbbbbbbbo...", "..oeeeebbeeee...", "..oeppebbeppe...", "..oeeeebbeeee...", "..obbbbbbbbbo...", "..obbllllllbo...", "...obbbbbbbo....", "...ooooooooo....", "....obbbbbo.....", "..oobbbbbbboo...", "..obbbbbbbbbo...", "..obbbbbbbbbo...", "...oo.....oo....",
};
static const char *const ROBOT_IDLE_F1[16] = {
    ".......oo.......", "......obbo......", "...ooooooooo....", "..obbbbbbbbbo...", "..oeeeebbeeee...", "..oeppebbeppe...", "..oeeeebbeeee...", "..obbbbbbbbbo...", "..obbllllllbo...", "...obbbbbbbo....", "...ooooooooo....", "....obbbbbo.....", "..oobbbbbbboo...", "..obbbbbbbbbo...", "..obbbbbbbbbo...", "...oo.....oo....",
};
static const char *const ROBOT_IDLE_F2[16] = {
    ".......oo.......", "......obbo......", "...ooooooooo....", "..obbbbbbbbbo...", "..oeeeebbeeee...", "..oeppebbeppe...", "..oeeeebbeeee...", "..obbbbbbbbbo...", "..obbllllllbo...", "...obbbbbbbo....", "...ooooooooo....", "....obbbbbo.....", "..oobbbbbbboo...", "..obbbbbbbbbo...", "..obbbbbbbbbo...", "...oo.....oo....",
};
static const char *const ROBOT_IDLE_F3[16] = {
    ".......oo.......", "......obbo......", "...ooooooooo....", "..obbbbbbbbbo...", "..oeeeebbeeee...", "..oeppebbeppe...", "..oeeeebbeeee...", "..obbbbbbbbbo...", "..obbllllllbo...", "...obbbbbbbo....", "...ooooooooo....", "....obbbbbo.....", "..oobbbbbbboo...", "..obbbbbbbbbo...", "..obbbbbbbbbo...", "...oo.....oo....",
};
static const char *const ROBOT_IDLE_F4[16] = {
    ".......oo.......", "......obbo......", "...ooooooooo....", "..obbbbbbbbbo...", "..oeeeebbeeee...", "..oeppebbeppe...", "..oeeeebbeeee...", "..obbbbbbbbbo...", "..obbllllllbo...", "...obbbbbbbo....", "...ooooooooo....", "....obbbbbo.....", "..oobbbbbbboo...", "..obbbbbbbbbo...", "..obbbbbbbbbo...", "...oo.....oo....",
};
static const char *const ROBOT_IDLE_F5[16] = {
    ".......oo.......", "......obbo......", "...ooooooooo....", "..obbbbbbbbbo...", "..obbbbbbbbbo...", "..ollllbbllll...", "..obbbbbbbbbo...", "..obbbbbbbbbo...", "..obbllllllbo...", "...obbbbbbbo....", "...ooooooooo....", "....obbbbbo.....", "..oobbbbbbboo...", "..obbbbbbbbbo...", "..obbbbbbbbbo...", "...oo.....oo....",
};
static const char *const *const ROBOT_IDLE_FRAMES[] = {ROBOT_IDLE_F0, ROBOT_IDLE_F1, ROBOT_IDLE_F2, ROBOT_IDLE_F3, ROBOT_IDLE_F4, ROBOT_IDLE_F5};

static const char *const ROBOT_HAPPY_F0[16] = {
    ".......oo.......", "......obbo......", "...ooooooooo....", "..obbbbbbbbbo...", "..obobobboboo...", "..oobbbobobboo..", "..obbbbbbbbbo...", "..obbbbnnbbbo...", "..obboooooobo...", "...obbbbbbbo....", "...ooooooooo....", "....obbbbbo.....", "..oobbbbbbboo...", "..obbbbbbbbbo...", "..obbbbbbbbbo...", "...oo.....oo....",
};
static const char *const ROBOT_HAPPY_F1[16] = {
    "......obbo......", "...ooooooooo....", "..obbbbbbbbbo...", "..obobobboboo...", "..oobbbobobboo..", "..obbbbbbbbbo...", "..obbbbnnbbbo...", "..obboooooobo...", "...obbbbbbbo....", "...ooooooooo....", "....obbbbbo.....", "..oobbbbbbboo...", "..obbbbbbbbbo...", "..obbbbbbbbbo...", "...oo.....oo....", "................",
};
static const char *const *const ROBOT_HAPPY_FRAMES[] = {ROBOT_HAPPY_F0, ROBOT_HAPPY_F1};

static const char *const ROBOT_SAD_F0[16] = {
    ".......oo.......", "......obbo......", "...ooooooooo....", "..obbbbbbbbbo...", "..ooobbbbbboo...", "..obeebbbbeeo...", "..obepbbbbpeo...", "..obbbbnnbbbo...", "..owbboooobbo...", "...wbbbbbbbo....", "...ooooooooo....", "....obbbbbo.....", "..oobbbbbbboo...", "..obbbbbbbbbo...", "..obbbbbbbbbo...", "...oo.....oo....",
};
static const char *const ROBOT_SAD_F1[16] = {
    ".......oo.......", "......obbo......", "...ooooooooo....", "..obbbbbbbbbo...", "..ooobbbbbboo...", "..obeebbbbeeo...", "..obepbbbbpeo...", "..obbbbnnbbbo...", "..obbboooobbo...", "...obbbbbbbo....", "...woooooooo....", "...wobbbbbo.....", "..oobbbbbbboo...", "..obbbbbbbbbo...", "..obbbbbbbbbo...", "...oo.....oo....",
};
static const char *const *const ROBOT_SAD_FRAMES[] = {ROBOT_SAD_F0, ROBOT_SAD_F1};

static const char *const ROBOT_WAVE_F0[16] = {
    ".......oo.......", "......obbo......", "...ooooooooo....", "..obbbbbbbbbo...", "..obobobboboo...", "..oobbbobobboo..", "..obbbbbbbbbo...", "..obbbbnnbbbo...", "..obboooooobobb.", "...obbbbbbboobb.", "...ooooooooo.bo.", "....obbbbbo..bo.", "..oobbbbbbboobo.", "..obbbbbbbbbobo.", "..obbbbbbbbbo...", "...oo.....oo....",
};
static const char *const ROBOT_WAVE_F1[16] = {
    ".......oo.......", "......obbo......", "...ooooooooo....", "..obbbbbbbbbo...", "..obobobboboo...", "..oobbbobobboo..", "..obbbbbbbbbo...", "..obbbbnnbbbo...", "..obboooooobo...", "...obbbbbbbo....", "...ooooooooo....", "....obbbbbo..bo.", "..oobbbbbbboobo.", "..obbbbbbbbbobb.", "..obbbbbbbbbobb.", "...oo.....oo....",
};
static const char *const *const ROBOT_WAVE_FRAMES[] = {ROBOT_WAVE_F0, ROBOT_WAVE_F1};

static const char *const ROBOT_SLEEP_F0[16] = {
    ".......oo.......", "......obbo......", "...ooooooooo....", "..obbbbbbbbbo.ww", "..obbbbbbbbbow..", "..ollllbblllww..", "..obbbbbbbbbo...", "..obbbbbbbbbo...", "..obbbllllbbo...", "...obbbbbbbo....", "...ooooooooo....", "....obbbbbo.....", "..oobbbbbbboo...", "..obbbbbbbbbo...", "..obbbbbbbbbo...", "...oo.....oo....",
};
static const char *const ROBOT_SLEEP_F1[16] = {
    ".......oo.....ww", "......obbo...w..", "...oooooooooww..", "..obbbbbbbbbo...", "..obbbbbbbbbo...", "..ollllbbllll...", "..obbbbbbbbbo...", "..obbbbbbbbbo...", "..obbbllllbbo...", "...obbbbbbbo....", "...ooooooooo....", "....obbbbbo.....", "..oobbbbbbboo...", "..obbbbbbbbbo...", "..obbbbbbbbbo...", "...oo.....oo....",
};
static const char *const *const ROBOT_SLEEP_FRAMES[] = {ROBOT_SLEEP_F0, ROBOT_SLEEP_F1};

static const char *const ROBOT_LOVE_F0[16] = {
    ".......oo.......", "h.h...obbo......", "hhhooooooooo....", ".hobbbbbbbbbo...", "..ohbhbbbbhbh...", "..ohhhbbbbhhh...", "..obhbbbbbbho...", "..obbbbnnbbbo...", "..obboooooobo...", "...obbbbbbbo....", "...ooooooooo....", "....obbbbbo.....", "..oobbbbbbboo...", "..obbbbbbbbbo...", "..obbbbbbbbbo...", "...oo.....oo....",
};
static const char *const ROBOT_LOVE_F1[16] = {
    ".......oo....h.h", "......obbo...hhh", "...ooooooooo..h.", "..obbbbbbbbbo...", "..ohbhbbbbhbh...", "..ohhhbbbbhhh...", "..obhbbbbbbho...", "..obbbbnnbbbo...", "..obboooooobo...", "...obbbbbbbo....", "...ooooooooo....", "....obbbbbo.....", "..oobbbbbbboo...", "..obbbbbbbbbo...", "..obbbbbbbbbo...", "...oo.....oo....",
};
static const char *const *const ROBOT_LOVE_FRAMES[] = {ROBOT_LOVE_F0, ROBOT_LOVE_F1};

static const char *const ROBOT_ANGRY_F0[16] = {
    ".......oo.......", "......obbo......", "...ooooooooo....", "..obbbbbbbbbo...", "..oobbbbbbbbo...", "..oboobbbbooo...", "..obeebbbbeeo...", "..obbbbnnbbbo...", ".bboboooooobobb.", ".bbobbbbbbboobb.", ".obooooooooo.bo.", ".ob.obbbbbo..bo.", ".obobbbbbbboobo.", ".obbbbbbbbbbobo.", "..obbbbbbbbbo...", "...oo.....oo....",
};
static const char *const ROBOT_ANGRY_F1[16] = {
    ".......oo.......", "......obbo......", "...ooooooooo....", "..obbbbbbbbbo...", "..oobbbbbbbbo...", "..oboobbbbooo...", "..obeebbbbeeo...", "..obbbbnnbbbo...", "..obboooooobo...", "...obbbbbbbo....", "...ooooooooo....", ".ob.obbbbbo..bo.", ".obobbbbbbboobo.", ".bbobbbbbbbbobb.", ".bbobbbbbbbbobb.", "...oo.....oo....",
};
static const char *const *const ROBOT_ANGRY_FRAMES[] = {ROBOT_ANGRY_F0, ROBOT_ANGRY_F1};

static const char *const ROBOT_DANCE_F0[16] = {
    "......obbo......", "...ooooooooo....", "..obbbbbbbbbo...", "..obobobboboo...", "..oobbbobobboo..", "..obbbbbbbbbo...", "..obbbbnnbbbo...", ".bbobboooobbo...", ".bbobbbbbbbo....", ".obooooooooo....", ".ob.obbbbbo..bo.", ".obobbbbbbboobo.", ".obbbbbbbbbbobb.", "..obbbbbbbbbobb.", "...oo.....oo....", "................",
};
static const char *const ROBOT_DANCE_F1[16] = {
    "................", ".......oo.......", "......obbo......", "...ooooooooo....", "..obbbbbbbbbo...", "..oeeebbbbbbo...", "..oepebbbbooo...", "..oeeebbbbbbo...", "..obbbbnnbbbo...", "..obboooooobobb.", "...obbbbbbboobb.", "...ooooooooo.bo.", ".ob.obbbbbo..bo.", ".obobbbbbbboobo.", ".bbobbbbbbbbobo.", ".bbobbbbbbbbo...",
};
static const char *const *const ROBOT_DANCE_FRAMES[] = {ROBOT_DANCE_F0, ROBOT_DANCE_F1};

static const char *const ROBOT_THINK_F0[16] = {
    ".......oo.......", "......obbo.....w", "...ooooooooo..ww", "..obbbbbbbbbowww", "..oeeebbbbooo...", "..oepebbbbbbo...", "..oeeebbbbbbo...", "..obbbbnnbbbo...", "..obbbbbooobo...", "...obbbbbbbo....", "...ooooooooo....", "....obbbbbo.....", "..oobbbbbbboo...", "..obbbbbbbbbo...", "..obbbbbbbbbo...", "...oo.....oo....",
};
static const char *const ROBOT_THINK_F1[16] = {
    ".......oo.....ww", "......obbo...www", "...ooooooooowwww", "..obbbbbbbbbo...", "..oeeebbbbooo...", "..oepebbbbbbo...", "..oeeebbbbbbo...", "..obbbbnnbbbo...", "..obbbbbooobo...", "...obbbbbbbo....", "...ooooooooo....", "....obbbbbo.....", "..oobbbbbbboo...", "..obbbbbbbbbo...", "..obbbbbbbbbo...", "...oo.....oo....",
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
    "......ooo.......", ".....obbbo......", "....obbbbbo.....", "...obbbbbbbo....", "..oeeebbbbeee...", "..oepebbbbepe...", "..oeeebbbbeee...", "..obbbbnnbbbo...", "..obbbllllbbo...", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "....obbbbbo.....", ".....ooooo......", "....oo...oo.....", "...oo.....oo....",
};
static const char *const BIRD_IDLE_F1[16] = {
    "......ooo.......", ".....obbbo......", "....obbbbbo.....", "...obbbbbbbo....", "..oeeebbbbeee...", "..oepebbbbepe...", "..oeeebbbbeee...", "..obbbbnnbbbo...", "..obbbllllbbo...", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "....obbbbbo.....", ".....ooooo......", "....oo...oo.....", "...oo.....oo....",
};
static const char *const BIRD_IDLE_F2[16] = {
    "......ooo.......", ".....obbbo......", "....obbbbbo.....", "...obbbbbbbo....", "..oeeebbbbeee...", "..oepebbbbepe...", "..oeeebbbbeee...", "..obbbbnnbbbo...", "..obbbllllbbo...", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "....obbbbbo.....", ".....ooooo......", "....oo...oo.....", "...oo.....oo....",
};
static const char *const BIRD_IDLE_F3[16] = {
    "......ooo.......", ".....obbbo......", "....obbbbbo.....", "...obbbbbbbo....", "..oeeebbbbeee...", "..oepebbbbepe...", "..oeeebbbbeee...", "..obbbbnnbbbo...", "..obbbllllbbo...", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "....obbbbbo.....", ".....ooooo......", "....oo...oo.....", "...oo.....oo....",
};
static const char *const BIRD_IDLE_F4[16] = {
    "......ooo.......", ".....obbbo......", "....obbbbbo.....", "...obbbbbbbo....", "..oeeebbbbeee...", "..oepebbbbepe...", "..oeeebbbbeee...", "..obbbbnnbbbo...", "..obbbllllbbo...", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "....obbbbbo.....", ".....ooooo......", "....oo...oo.....", "...oo.....oo....",
};
static const char *const BIRD_IDLE_F5[16] = {
    "......ooo.......", ".....obbbo......", "....obbbbbo.....", "...obbbbbbbo....", "..obbbbbbbbbo...", "..oooobbbbooo...", "..obbbbbbbbbo...", "..obbbbnnbbbo...", "..obbbllllbbo...", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "....obbbbbo.....", ".....ooooo......", "....oo...oo.....", "...oo.....oo....",
};
static const char *const *const BIRD_IDLE_FRAMES[] = {BIRD_IDLE_F0, BIRD_IDLE_F1, BIRD_IDLE_F2, BIRD_IDLE_F3, BIRD_IDLE_F4, BIRD_IDLE_F5};

static const char *const BIRD_HAPPY_F0[16] = {
    "......ooo.......", ".....obbbo......", "....obbbbbo.....", "...obbbbbbbo....", "..obobobboboo...", "..oobbbobobboo..", "..obbbbbbbbbo...", "..obbbbnnbbbo...", "..obboooooobo...", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "....obbbbbo.....", ".....ooooo......", "....oo...oo.....", "...oo.....oo....",
};
static const char *const BIRD_HAPPY_F1[16] = {
    ".....obbbo......", "....obbbbbo.....", "...obbbbbbbo....", "..obobobboboo...", "..oobbbobobboo..", "..obbbbbbbbbo...", "..obbbbnnbbbo...", "..obboooooobo...", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "....obbbbbo.....", ".....ooooo......", "....oo...oo.....", "...oo.....oo....", "................",
};
static const char *const *const BIRD_HAPPY_FRAMES[] = {BIRD_HAPPY_F0, BIRD_HAPPY_F1};

static const char *const BIRD_SAD_F0[16] = {
    "......ooo.......", ".....obbbo......", "....obbbbbo.....", "...obbbbbbbo....", "..ooobbbbbboo...", "..obeebbbbeeo...", "..obepbbbbpeo...", "..obbbbnnbbbo...", "..owbboooobbo...", "...wbbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "....obbbbbo.....", ".....ooooo......", "....oo...oo.....", "...oo.....oo....",
};
static const char *const BIRD_SAD_F1[16] = {
    "......ooo.......", ".....obbbo......", "....obbbbbo.....", "...obbbbbbbo....", "..ooobbbbbboo...", "..obeebbbbeeo...", "..obepbbbbpeo...", "..obbbbnnbbbo...", "..obbboooobbo...", "...obbbbbbbo....", "...wbbbbbbbo....", "...wbbbbbbbo....", "....obbbbbo.....", ".....ooooo......", "....oo...oo.....", "...oo.....oo....",
};
static const char *const *const BIRD_SAD_FRAMES[] = {BIRD_SAD_F0, BIRD_SAD_F1};

static const char *const BIRD_WAVE_F0[16] = {
    "......ooo.......", ".....obbbo......", "....obbbbbo.....", "...obbbbbbbo....", "..obobobboboo...", "..oobbbobobboo..", "..obbbbbbbbbo...", "..obbbbnnbbbo...", "..obboooooobobb.", "...obbbbbbboobb.", "...obbbbbbbo.bo.", "...obbbbbbbo.bo.", "....obbbbbo..bo.", ".....ooooo...bo.", "....oo...oo.....", "...oo.....oo....",
};
static const char *const BIRD_WAVE_F1[16] = {
    "......ooo.......", ".....obbbo......", "....obbbbbo.....", "...obbbbbbbo....", "..obobobboboo...", "..oobbbobobboo..", "..obbbbbbbbbo...", "..obbbbnnbbbo...", "..obboooooobo...", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo.bo.", "....obbbbbo..bo.", ".....ooooo..obb.", "....oo...oo.obb.", "...oo.....oo....",
};
static const char *const *const BIRD_WAVE_FRAMES[] = {BIRD_WAVE_F0, BIRD_WAVE_F1};

static const char *const BIRD_SLEEP_F0[16] = {
    "......ooo.......", ".....obbbo......", "....obbbbbo.....", "...obbbbbbbo..ww", "..obbbbbbbbbow..", "..oooobbbbooww..", "..obbbbbbbbbo...", "..obbbbnnbbbo...", "..obbbboobbbo...", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "....obbbbbo.....", ".....ooooo......", "....oo...oo.....", "...oo.....oo....",
};
static const char *const BIRD_SLEEP_F1[16] = {
    "......ooo.....ww", ".....obbbo...w..", "....obbbbbo.ww..", "...obbbbbbbo....", "..obbbbbbbbbo...", "..oooobbbbooo...", "..obbbbbbbbbo...", "..obbbbnnbbbo...", "..obbbboobbbo...", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "....obbbbbo.....", ".....ooooo......", "....oo...oo.....", "...oo.....oo....",
};
static const char *const *const BIRD_SLEEP_FRAMES[] = {BIRD_SLEEP_F0, BIRD_SLEEP_F1};

static const char *const BIRD_LOVE_F0[16] = {
    "......ooo.......", "h.h..obbbo......", "hhh.obbbbbo.....", ".h.obbbbbbbo....", "..ohbhbbbbhbh...", "..ohhhbbbbhhh...", "..obhbbbbbbho...", "..obbbbnnbbbo...", "..obboooooobo...", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "....obbbbbo.....", ".....ooooo......", "....oo...oo.....", "...oo.....oo....",
};
static const char *const BIRD_LOVE_F1[16] = {
    "......ooo....h.h", ".....obbbo...hhh", "....obbbbbo...h.", "...obbbbbbbo....", "..ohbhbbbbhbh...", "..ohhhbbbbhhh...", "..obhbbbbbbho...", "..obbbbnnbbbo...", "..obboooooobo...", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "....obbbbbo.....", ".....ooooo......", "....oo...oo.....", "...oo.....oo....",
};
static const char *const *const BIRD_LOVE_FRAMES[] = {BIRD_LOVE_F0, BIRD_LOVE_F1};

static const char *const BIRD_ANGRY_F0[16] = {
    "......ooo.......", ".....obbbo......", "....obbbbbo.....", "...obbbbbbbo....", "..oobbbbbbbbo...", "..oboobbbbooo...", "..obeebbbbeeo...", "..obbbbnnbbbo...", ".bboboooooobobb.", ".bbobbbbbbboobb.", ".obobbbbbbbo.bo.", ".obobbbbbbbo.bo.", ".ob.obbbbbo..bo.", ".ob..ooooo...bo.", "....oo...oo.....", "...oo.....oo....",
};
static const char *const BIRD_ANGRY_F1[16] = {
    "......ooo.......", ".....obbbo......", "....obbbbbo.....", "...obbbbbbbo....", "..oobbbbbbbbo...", "..oboobbbbooo...", "..obeebbbbeeo...", "..obbbbnnbbbo...", "..obboooooobo...", "...obbbbbbbo....", "...obbbbbbbo....", ".obobbbbbbbo.bo.", ".ob.obbbbbo..bo.", ".bbo.ooooo..obb.", ".bbooo...oo.obb.", "...oo.....oo....",
};
static const char *const *const BIRD_ANGRY_FRAMES[] = {BIRD_ANGRY_F0, BIRD_ANGRY_F1};

static const char *const BIRD_DANCE_F0[16] = {
    ".....obbbo......", "....obbbbbo.....", "...obbbbbbbo....", "..obobobboboo...", "..oobbbobobboo..", "..obbbbbbbbbo...", "..obbbbnnbbbo...", ".bbobboooobbo...", ".bbobbbbbbbo....", ".obobbbbbbbo....", ".obobbbbbbbo.bo.", ".ob.obbbbbo..bo.", ".ob..ooooo..obb.", "....oo...oo.obb.", "...oo.....oo....", "................",
};
static const char *const BIRD_DANCE_F1[16] = {
    "................", "......ooo.......", ".....obbbo......", "....obbbbbo.....", "...obbbbbbbo....", "..oeeebbbbbbo...", "..oepebbbbooo...", "..oeeebbbbbbo...", "..obbbbnnbbbo...", "..obboooooobobb.", "...obbbbbbboobb.", "...obbbbbbbo.bo.", ".obobbbbbbbo.bo.", ".ob.obbbbbo..bo.", ".bbo.ooooo...bo.", ".bbooo...oo.....",
};
static const char *const *const BIRD_DANCE_FRAMES[] = {BIRD_DANCE_F0, BIRD_DANCE_F1};

static const char *const BIRD_THINK_F0[16] = {
    "......ooo.......", ".....obbbo.....w", "....obbbbbo...ww", "...obbbbbbbo.www", "..oeeebbbbooo...", "..oepebbbbbbo...", "..oeeebbbbbbo...", "..obbbbnnbbbo...", "..obbbbbooobo...", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "....obbbbbo.....", ".....ooooo......", "....oo...oo.....", "...oo.....oo....",
};
static const char *const BIRD_THINK_F1[16] = {
    "......ooo.....ww", ".....obbbo...www", "....obbbbbo.wwww", "...obbbbbbbo....", "..oeeebbbbooo...", "..oepebbbbbbo...", "..oeeebbbbbbo...", "..obbbbnnbbbo...", "..obbbbbooobo...", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "....obbbbbo.....", ".....ooooo......", "....oo...oo.....", "...oo.....oo....",
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
    ".....ooooo......", "...oobbbbboo....", "..obbbbbbbbbo...", "..obbbbbbbbbo...", ".obooobbbboooo..", ".obooobbbboooo..", ".obooobbbboooo..", ".obbbbbbbbbbbo..", ".obbbboooobbbo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbo..", ".obbobbbobbbbo..", ".obo.obo.obbbo..", "..o...o...ooo...",
};
static const char *const GHOST_IDLE_F1[16] = {
    ".....ooooo......", "...oobbbbboo....", "..obbbbbbbbbo...", "..obbbbbbbbbo...", ".obooobbbboooo..", ".obooobbbboooo..", ".obooobbbboooo..", ".obbbbbbbbbbbo..", ".obbbboooobbbo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbo..", ".obbobbbobbbbo..", ".obo.obo.obbbo..", "..o...o...ooo...",
};
static const char *const GHOST_IDLE_F2[16] = {
    ".....ooooo......", "...oobbbbboo....", "..obbbbbbbbbo...", "..obbbbbbbbbo...", ".obooobbbboooo..", ".obooobbbboooo..", ".obooobbbboooo..", ".obbbbbbbbbbbo..", ".obbbboooobbbo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbo..", ".obbobbbobbbbo..", ".obo.obo.obbbo..", "..o...o...ooo...",
};
static const char *const GHOST_IDLE_F3[16] = {
    ".....ooooo......", "...oobbbbboo....", "..obbbbbbbbbo...", "..obbbbbbbbbo...", ".obooobbbboooo..", ".obooobbbboooo..", ".obooobbbboooo..", ".obbbbbbbbbbbo..", ".obbbboooobbbo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbo..", ".obbobbbobbbbo..", ".obo.obo.obbbo..", "..o...o...ooo...",
};
static const char *const GHOST_IDLE_F4[16] = {
    ".....ooooo......", "...oobbbbboo....", "..obbbbbbbbbo...", "..obbbbbbbbbo...", ".obooobbbboooo..", ".obooobbbboooo..", ".obooobbbboooo..", ".obbbbbbbbbbbo..", ".obbbboooobbbo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbo..", ".obbobbbobbbbo..", ".obo.obo.obbbo..", "..o...o...ooo...",
};
static const char *const GHOST_IDLE_F5[16] = {
    ".....ooooo......", "...oobbbbboo....", "..obbbbbbbbbo...", "..obbbbbbbbbo...", ".obbbbbbbbbbbo..", ".obooobbbboooo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbo..", ".obbbboooobbbo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbo..", ".obbobbbobbbbo..", ".obo.obo.obbbo..", "..o...o...ooo...",
};
static const char *const *const GHOST_IDLE_FRAMES[] = {GHOST_IDLE_F0, GHOST_IDLE_F1, GHOST_IDLE_F2, GHOST_IDLE_F3, GHOST_IDLE_F4, GHOST_IDLE_F5};

static const char *const GHOST_HAPPY_F0[16] = {
    ".....ooooo......", "...oobbbbboo....", "..obbbbbbbbbo...", "..obbbbbbbbbo...", ".obbobobbobobo..", ".obobbbobobbbo..", ".obbbbbbbbbbbo..", ".obbbbbnnbbbbo..", ".obbboooooobbo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbo..", ".obbobbbobbbbo..", ".obo.obo.obbbo..", "..o...o...ooo...",
};
static const char *const GHOST_HAPPY_F1[16] = {
    "...oobbbbboo....", "..obbbbbbbbbo...", "..obbbbbbbbbo...", ".obbobobbobobo..", ".obobbbobobbbo..", ".obbbbbbbbbbbo..", ".obbbbbnnbbbbo..", ".obbboooooobbo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbo..", ".obbobbbobbbbo..", ".obo.obo.obbbo..", "..o...o...ooo...", "................",
};
static const char *const *const GHOST_HAPPY_FRAMES[] = {GHOST_HAPPY_F0, GHOST_HAPPY_F1};

static const char *const GHOST_SAD_F0[16] = {
    ".....ooooo......", "...oobbbbboo....", "..obbbbbbbbbo...", "..obbbbbbbbbo...", ".oboobbbbbbooo..", ".obbeebbbbeebo..", ".obbepbbbbpebo..", ".obbbbbnnbbbbo..", ".obwbboooobbbo..", ".obwbbbbbbbbbo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbo..", ".obbobbbobbbbo..", ".obo.obo.obbbo..", "..o...o...ooo...",
};
static const char *const GHOST_SAD_F1[16] = {
    ".....ooooo......", "...oobbbbboo....", "..obbbbbbbbbo...", "..obbbbbbbbbo...", ".oboobbbbbbooo..", ".obbeebbbbeebo..", ".obbepbbbbpebo..", ".obbbbbnnbbbbo..", ".obbbboooobbbo..", ".obbbbbbbbbbbo..", ".obwbbbbbbbbbo..", ".obwbbbbbbbbbo..", ".obbbbbbbbbbbo..", ".obbobbbobbbbo..", ".obo.obo.obbbo..", "..o...o...ooo...",
};
static const char *const *const GHOST_SAD_FRAMES[] = {GHOST_SAD_F0, GHOST_SAD_F1};

static const char *const GHOST_WAVE_F0[16] = {
    ".....ooooo......", "...oobbbbboo....", "..obbbbbbbbbo...", "..obbbbbbbbbo...", ".obbobobbobobo..", ".obobbbobobbbo..", ".obbbbbbbbbbbo..", ".obbbbbnnbbbbo..", ".obbboooooobobb.", ".obbbbbbbbbbobb.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbobbbobbbbbo.", ".obo.obo.obbbo..", "..o...o...ooo...",
};
static const char *const GHOST_WAVE_F1[16] = {
    ".....ooooo......", "...oobbbbboo....", "..obbbbbbbbbo...", "..obbbbbbbbbo...", ".obbobobbobobo..", ".obobbbobobbbo..", ".obbbbbbbbbbbo..", ".obbbbbnnbbbbo..", ".obbboooooobbo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbobbbobbbobb.", ".obo.obo.obbobb.", "..o...o...ooo...",
};
static const char *const *const GHOST_WAVE_FRAMES[] = {GHOST_WAVE_F0, GHOST_WAVE_F1};

static const char *const GHOST_SLEEP_F0[16] = {
    ".....ooooo......", "...oobbbbboo....", "..obbbbbbbbbo...", "..obbbbbbbbbo.ww", ".obbbbbbbbbbbw..", ".obooobbbbooww..", ".obbbbbbbbbbbo..", ".obbbbbnnbbbbo..", ".obbbbboobbbbo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbo..", ".obbobbbobbbbo..", ".obo.obo.obbbo..", "..o...o...ooo...",
};
static const char *const GHOST_SLEEP_F1[16] = {
    ".....ooooo....ww", "...oobbbbboo.w..", "..obbbbbbbbbww..", "..obbbbbbbbbo...", ".obbbbbbbbbbbo..", ".obooobbbboooo..", ".obbbbbbbbbbbo..", ".obbbbbnnbbbbo..", ".obbbbboobbbbo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbo..", ".obbobbbobbbbo..", ".obo.obo.obbbo..", "..o...o...ooo...",
};
static const char *const *const GHOST_SLEEP_FRAMES[] = {GHOST_SLEEP_F0, GHOST_SLEEP_F1};

static const char *const GHOST_LOVE_F0[16] = {
    ".....ooooo......", "h.hoobbbbboo....", "hhhbbbbbbbbbo...", ".hobbbbbbbbbo...", ".obhbhbbbbhbho..", ".obhhhbbbbhhho..", ".obbhbbbbbbhbo..", ".obbbbbnnbbbbo..", ".obbboooooobbo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbo..", ".obbobbbobbbbo..", ".obo.obo.obbbo..", "..o...o...ooo...",
};
static const char *const GHOST_LOVE_F1[16] = {
    ".....ooooo...h.h", "...oobbbbboo.hhh", "..obbbbbbbbbo.h.", "..obbbbbbbbbo...", ".obhbhbbbbhbho..", ".obhhhbbbbhhho..", ".obbhbbbbbbhbo..", ".obbbbbnnbbbbo..", ".obbboooooobbo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbo..", ".obbobbbobbbbo..", ".obo.obo.obbbo..", "..o...o...ooo...",
};
static const char *const *const GHOST_LOVE_FRAMES[] = {GHOST_LOVE_F0, GHOST_LOVE_F1};

static const char *const GHOST_ANGRY_F0[16] = {
    ".....ooooo......", "...oobbbbboo....", "..obbbbbbbbbo...", "..obbbbbbbbbo...", ".obobbbbbbbboo..", ".obboobbbboobo..", ".obbeebbbbeebo..", ".obbbbbnnbbbbo..", ".bboboooooobobb.", ".bbobbbbbbbbobb.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbobbbobbbbbo.", ".obo.obo.obbbo..", "..o...o...ooo...",
};
static const char *const GHOST_ANGRY_F1[16] = {
    ".....ooooo......", "...oobbbbboo....", "..obbbbbbbbbo...", "..obbbbbbbbbo...", ".obobbbbbbbboo..", ".obboobbbboobo..", ".obbeebbbbeebo..", ".obbbbbnnbbbbo..", ".obbboooooobbo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".bboobbbobbbobb.", ".bbo.obo.obbobb.", "..o...o...ooo...",
};
static const char *const *const GHOST_ANGRY_FRAMES[] = {GHOST_ANGRY_F0, GHOST_ANGRY_F1};

static const char *const GHOST_DANCE_F0[16] = {
    "...oobbbbboo....", "..obbbbbbbbbo...", "..obbbbbbbbbo...", ".obbobobbobobo..", ".obobbbobobbbo..", ".obbbbbbbbbbbo..", ".obbbbbnnbbbbo..", ".bbobboooobbbo..", ".bbobbbbbbbbbo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbobbbobbbobb.", ".obo.obo.obbobb.", "..o...o...ooo...", "................",
};
static const char *const GHOST_DANCE_F1[16] = {
    "................", ".....ooooo......", "...oobbbbboo....", "..obbbbbbbbbo...", "..obbbbbbbbbo...", ".obeeebbbbbbbo..", ".obepebbbboooo..", ".obeeebbbbbbbo..", ".obbbbbnnbbbbo..", ".obbboooooobobb.", ".obbbbbbbbbbobb.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".bboobbbobbbbbo.", ".bbo.obo.obbbo..",
};
static const char *const *const GHOST_DANCE_FRAMES[] = {GHOST_DANCE_F0, GHOST_DANCE_F1};

static const char *const GHOST_THINK_F0[16] = {
    ".....ooooo......", "...oobbbbboo...w", "..obbbbbbbbbo.ww", "..obbbbbbbbbowww", ".obeeebbbboooo..", ".obepebbbbbbbo..", ".obeeebbbbbbbo..", ".obbbbbnnbbbbo..", ".obbbbbbooobbo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbo..", ".obbobbbobbbbo..", ".obo.obo.obbbo..", "..o...o...ooo...",
};
static const char *const GHOST_THINK_F1[16] = {
    ".....ooooo....ww", "...oobbbbboo.www", "..obbbbbbbbbwwww", "..obbbbbbbbbo...", ".obeeebbbboooo..", ".obepebbbbbbbo..", ".obeeebbbbbbbo..", ".obbbbbnnbbbbo..", ".obbbbbbooobbo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbo..", ".obbbbbbbbbbbo..", ".obbobbbobbbbo..", ".obo.obo.obbbo..", "..o...o...ooo...",
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
    "..o.........o...", "...o.......o....", "....ooooooo.....", "...obbbbbbbo....", "..oeeebbbbeee...", ".obepebbbbepeo..", ".obeeebbbbeeeo..", ".obbbbbnnbbbbo..", "..obbbllllbbo...", "...obbbbbbbo....", "....ooooooo.....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const ALIEN_IDLE_F1[16] = {
    "..o.........o...", "...o.......o....", "....ooooooo.....", "...obbbbbbbo....", "..oeeebbbbeee...", ".obepebbbbepeo..", ".obeeebbbbeeeo..", ".obbbbbnnbbbbo..", "..obbbllllbbo...", "...obbbbbbbo....", "....ooooooo.....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const ALIEN_IDLE_F2[16] = {
    "..o.........o...", "...o.......o....", "....ooooooo.....", "...obbbbbbbo....", "..oeeebbbbeee...", ".obepebbbbepeo..", ".obeeebbbbeeeo..", ".obbbbbnnbbbbo..", "..obbbllllbbo...", "...obbbbbbbo....", "....ooooooo.....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const ALIEN_IDLE_F3[16] = {
    "..o.........o...", "...o.......o....", "....ooooooo.....", "...obbbbbbbo....", "..oeeebbbbeee...", ".obepebbbbepeo..", ".obeeebbbbeeeo..", ".obbbbbnnbbbbo..", "..obbbllllbbo...", "...obbbbbbbo....", "....ooooooo.....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const ALIEN_IDLE_F4[16] = {
    "..o.........o...", "...o.......o....", "....ooooooo.....", "...obbbbbbbo....", "..oeeebbbbeee...", ".obepebbbbepeo..", ".obeeebbbbeeeo..", ".obbbbbnnbbbbo..", "..obbbllllbbo...", "...obbbbbbbo....", "....ooooooo.....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const ALIEN_IDLE_F5[16] = {
    "..o.........o...", "...o.......o....", "....ooooooo.....", "...obbbbbbbo....", "..obbbbbbbbbo...", ".obooobbbboooo..", ".obbbbbbbbbbbo..", ".obbbbbnnbbbbo..", "..obbbllllbbo...", "...obbbbbbbo....", "....ooooooo.....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const *const ALIEN_IDLE_FRAMES[] = {ALIEN_IDLE_F0, ALIEN_IDLE_F1, ALIEN_IDLE_F2, ALIEN_IDLE_F3, ALIEN_IDLE_F4, ALIEN_IDLE_F5};

static const char *const ALIEN_HAPPY_F0[16] = {
    "..o.........o...", "...o.......o....", "....ooooooo.....", "...obbbbbbbo....", "..obobobboboo...", ".obobbbobobbbo..", ".obbbbbbbbbbbo..", ".obbbbbnnbbbbo..", "..obboooooobo...", "...obbbbbbbo....", "....ooooooo.....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const ALIEN_HAPPY_F1[16] = {
    "...o.......o....", "....ooooooo.....", "...obbbbbbbo....", "..obobobboboo...", ".obobbbobobbbo..", ".obbbbbbbbbbbo..", ".obbbbbnnbbbbo..", "..obboooooobo...", "...obbbbbbbo....", "....ooooooo.....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....", "................",
};
static const char *const *const ALIEN_HAPPY_FRAMES[] = {ALIEN_HAPPY_F0, ALIEN_HAPPY_F1};

static const char *const ALIEN_SAD_F0[16] = {
    "..o.........o...", "...o.......o....", "....ooooooo.....", "...obbbbbbbo....", "..ooobbbbbboo...", ".obbeebbbbeebo..", ".obbepbbbbpebo..", ".obbbbbnnbbbbo..", "..owbboooobbo...", "...wbbbbbbbo....", "....ooooooo.....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const ALIEN_SAD_F1[16] = {
    "..o.........o...", "...o.......o....", "....ooooooo.....", "...obbbbbbbo....", "..ooobbbbbboo...", ".obbeebbbbeebo..", ".obbepbbbbpebo..", ".obbbbbnnbbbbo..", "..obbboooobbo...", "...obbbbbbbo....", "...wooooooo.....", "...wobbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const *const ALIEN_SAD_FRAMES[] = {ALIEN_SAD_F0, ALIEN_SAD_F1};

static const char *const ALIEN_WAVE_F0[16] = {
    "..o.........o...", "...o.......o....", "....ooooooo.....", "...obbbbbbbo....", "..obobobboboo...", ".obobbbobobbbo..", ".obbbbbbbbbbbo..", ".obbbbbnnbbbbo..", "..obboooooobobb.", "...obbbbbbboobb.", "....ooooooo..bo.", "....obbbbbo..bo.", "...obbbbbbbo.bo.", "...obbbbbbbo.bo.", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const ALIEN_WAVE_F1[16] = {
    "..o.........o...", "...o.......o....", "....ooooooo.....", "...obbbbbbbo....", "..obobobboboo...", ".obobbbobobbbo..", ".obbbbbbbbbbbo..", ".obbbbbnnbbbbo..", "..obboooooobo...", "...obbbbbbbo....", "....ooooooo.....", "....obbbbbo..bo.", "...obbbbbbbo.bo.", "...obbbbbbboobb.", "...obbbbbbboobb.", "...oo.....oo....",
};
static const char *const *const ALIEN_WAVE_FRAMES[] = {ALIEN_WAVE_F0, ALIEN_WAVE_F1};

static const char *const ALIEN_SLEEP_F0[16] = {
    "..o.........o...", "...o.......o....", "....ooooooo.....", "...obbbbbbbo..ww", "..obbbbbbbbbow..", ".obooobbbbooww..", ".obbbbbbbbbbbo..", ".obbbbbnnbbbbo..", "..obbbboobbbo...", "...obbbbbbbo....", "....ooooooo.....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const ALIEN_SLEEP_F1[16] = {
    "..o.........o.ww", "...o.......o.w..", "....ooooooo.ww..", "...obbbbbbbo....", "..obbbbbbbbbo...", ".obooobbbboooo..", ".obbbbbbbbbbbo..", ".obbbbbnnbbbbo..", "..obbbboobbbo...", "...obbbbbbbo....", "....ooooooo.....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const *const ALIEN_SLEEP_FRAMES[] = {ALIEN_SLEEP_F0, ALIEN_SLEEP_F1};

static const char *const ALIEN_LOVE_F0[16] = {
    "..o.........o...", "h.ho.......o....", "hhh.ooooooo.....", ".h.obbbbbbbo....", "..ohbhbbbbhbh...", ".obhhhbbbbhhho..", ".obbhbbbbbbhbo..", ".obbbbbnnbbbbo..", "..obboooooobo...", "...obbbbbbbo....", "....ooooooo.....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const ALIEN_LOVE_F1[16] = {
    "..o.........oh.h", "...o.......o.hhh", "....ooooooo...h.", "...obbbbbbbo....", "..ohbhbbbbhbh...", ".obhhhbbbbhhho..", ".obbhbbbbbbhbo..", ".obbbbbnnbbbbo..", "..obboooooobo...", "...obbbbbbbo....", "....ooooooo.....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const *const ALIEN_LOVE_FRAMES[] = {ALIEN_LOVE_F0, ALIEN_LOVE_F1};

static const char *const ALIEN_ANGRY_F0[16] = {
    "..o.........o...", "...o.......o....", "....ooooooo.....", "...obbbbbbbo....", "..oobbbbbbbbo...", ".obboobbbboobo..", ".obbeebbbbeebo..", ".obbbbbnnbbbbo..", ".bboboooooobobb.", ".bbobbbbbbboobb.", ".ob.ooooooo..bo.", ".ob.obbbbbo..bo.", ".obobbbbbbbo.bo.", ".obobbbbbbbo.bo.", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const ALIEN_ANGRY_F1[16] = {
    "..o.........o...", "...o.......o....", "....ooooooo.....", "...obbbbbbbo....", "..oobbbbbbbbo...", ".obboobbbboobo..", ".obbeebbbbeebo..", ".obbbbbnnbbbbo..", "..obboooooobo...", "...obbbbbbbo....", "....ooooooo.....", ".ob.obbbbbo..bo.", ".obobbbbbbbo.bo.", ".bbobbbbbbboobb.", ".bbobbbbbbboobb.", "...oo.....oo....",
};
static const char *const *const ALIEN_ANGRY_FRAMES[] = {ALIEN_ANGRY_F0, ALIEN_ANGRY_F1};

static const char *const ALIEN_DANCE_F0[16] = {
    "...o.......o....", "....ooooooo.....", "...obbbbbbbo....", "..obobobboboo...", ".obobbbobobbbo..", ".obbbbbbbbbbbo..", ".obbbbbnnbbbbo..", ".bbobboooobbo...", ".bbobbbbbbbo....", ".ob.ooooooo.....", ".ob.obbbbbo..bo.", ".obobbbbbbbo.bo.", ".obobbbbbbboobb.", "...obbbbbbboobb.", "...oo.....oo....", "................",
};
static const char *const ALIEN_DANCE_F1[16] = {
    "................", "..o.........o...", "...o.......o....", "....ooooooo.....", "...obbbbbbbo....", "..oeeebbbbbbo...", ".obepebbbboooo..", ".obeeebbbbbbbo..", ".obbbbbnnbbbbo..", "..obboooooobobb.", "...obbbbbbboobb.", "....ooooooo..bo.", ".ob.obbbbbo..bo.", ".obobbbbbbbo.bo.", ".bbobbbbbbbo.bo.", ".bbobbbbbbbo....",
};
static const char *const *const ALIEN_DANCE_FRAMES[] = {ALIEN_DANCE_F0, ALIEN_DANCE_F1};

static const char *const ALIEN_THINK_F0[16] = {
    "..o.........o...", "...o.......o...w", "....ooooooo...ww", "...obbbbbbbo.www", "..oeeebbbbooo...", ".obepebbbbbbbo..", ".obeeebbbbbbbo..", ".obbbbbnnbbbbo..", "..obbbbbooobo...", "...obbbbbbbo....", "....ooooooo.....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
};
static const char *const ALIEN_THINK_F1[16] = {
    "..o.........o.ww", "...o.......o.www", "....ooooooo.wwww", "...obbbbbbbo....", "..oeeebbbbooo...", ".obepebbbbbbbo..", ".obeeebbbbbbbo..", ".obbbbbnnbbbbo..", "..obbbbbooobo...", "...obbbbbbbo....", "....ooooooo.....", "....obbbbbo.....", "...obbbbbbbo....", "...obbbbbbbo....", "...obbbbbbbo....", "...oo.....oo....",
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
    {"person", PERSON_PALETTE, 8, PERSON_EMOTES, 9},
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
