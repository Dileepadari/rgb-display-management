// GENERATED FILE — do not edit by hand.
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
static const CharacterPaletteEntry CAT_PALETTE[] = {{'o', 0x20C2}, {'b', 0xF507}, {'l', 0xFF16}, {'e', 0xFFFF}, {'n', 0xFBD3}, {'w', 0x8EBF}};

static const char *const CAT_IDLE_F0[16] = {
    "...o........o...", "..obo......obo..", ".obbbo....obbbo.", ".obbbboooobbbbo.", ".obbbbbbbbbbbbo.", ".obbeebbbbeebbo.", ".obbeobbbbeobbo.", ".obbbbbnnbbbbbo.", ".obbbbollobbbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", ".....obbbbo.....", "...oobbbbbboo...", "..obbbbbbbbbbo..", "..obbbbbbbbbbo..", "...oo......oo...",
};
static const char *const CAT_IDLE_F1[16] = {
    "...o........o...", "..obo......obo..", ".obbbo....obbbo.", ".obbbboooobbbbo.", ".obbbbbbbbbbbbo.", ".obbeebbbbeebbo.", ".obbeobbbbeobbo.", ".obbbbbnnbbbbbo.", ".obbbbollobbbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", ".....obbbbo.....", "...oobbbbbboo...", "..obbbbbbbbbbo..", "..obbbbbbbbbbo..", "...oo......oo...",
};
static const char *const CAT_IDLE_F2[16] = {
    "...o........o...", "..obo......obo..", ".obbbo....obbbo.", ".obbbboooobbbbo.", ".obbbbbbbbbbbbo.", ".obbeebbbbeebbo.", ".obbeobbbbeobbo.", ".obbbbbnnbbbbbo.", ".obbbbollobbbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", ".....obbbbo.....", "...oobbbbbboo...", "..obbbbbbbbbbo..", "..obbbbbbbbbbo..", "...oo......oo...",
};
static const char *const CAT_IDLE_F3[16] = {
    "...o........o...", "..obo......obo..", ".obbbo....obbbo.", ".obbbboooobbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obboobbbboobbo.", ".obbbbbnnbbbbbo.", ".obbbbollobbbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", ".....obbbbo.....", "...oobbbbbboo...", "..obbbbbbbbbbo..", "..obbbbbbbbbbo..", "...oo......oo...",
};
static const char *const *const CAT_IDLE_FRAMES[] = {CAT_IDLE_F0, CAT_IDLE_F1, CAT_IDLE_F2, CAT_IDLE_F3};

static const char *const CAT_HAPPY_F0[16] = {
    "...o........o...", "..obo......obo..", ".obbbo....obbbo.", ".obbbboooobbbbo.", ".obbbbbbbbbbbbo.", ".obbobbbbbbobbo.", ".obobobbbbobobo.", ".obbbbbnnbbbbbo.", ".obbboloolobbbo.", "..obbboooobbbo..", "...oooooooooo...", ".....obbbbo.....", "...oobbbbbboo...", "..obbbbbbbbbbo..", "..obbbbbbbbbbo..", "...oo......oo...",
};
static const char *const CAT_HAPPY_F1[16] = {
    "................", "...o........o...", "..obo......obo..", ".obbbo....obbbo.", ".obbbboooobbbbo.", ".obbbbbbbbbbbbo.", ".obbobbbbbbobbo.", ".obobobbbbobobo.", ".obbbbbnnbbbbbo.", ".obbboloolobbbo.", "..obbboooobbbo..", "...oooooooooo...", ".....obbbbo.....", "...oobbbbbboo...", "..obbbbbbbbbbo..", "...oo......oo...",
};
static const char *const *const CAT_HAPPY_FRAMES[] = {CAT_HAPPY_F0, CAT_HAPPY_F1};

static const char *const CAT_SAD_F0[16] = {
    "...o........o...", "..obo......obo..", ".obbbo....obbbo.", ".obbbboooobbbbo.", ".obbobbbbbbobbo.", ".obbbeobbobeobo.", ".obbbeebbeebbbo.", ".obbbbbnnbbbbbo.", ".obbbboooobbbbo.", "..obbbobbobbbo..", "...oooooooooo...", ".....obbbbo.....", "...oobbbbbboo...", "..obbbbbbbbbbo..", "..obbbbbbbbbbo..", "...oo......oo...",
};
static const char *const CAT_SAD_F1[16] = {
    "...o........o...", "..obo......obo..", ".obbbo....obbbo.", ".obbbboooobbbbo.", ".obbobbbbbbobbo.", ".obbbeobbobeobo.", ".obbbeebbeebbbo.", ".obbwbbnnbbbbbo.", ".obbwboooobbbbo.", "..obbbobbobbbo..", "...oooooooooo...", ".....obbbbo.....", "...oobbbbbboo...", "..obbbbbbbbbbo..", "..obbbbbbbbbbo..", "...oo......oo...",
};
static const char *const *const CAT_SAD_FRAMES[] = {CAT_SAD_F0, CAT_SAD_F1};

static const char *const CAT_WAVE_F0[16] = {
    "...o........o...", "..obo......obo..", ".obbbo....obbbo.", ".obbbboooobbbbo.", ".obbbbbbbbbbbbo.", ".obbeebbbbeebbo.", ".obbeobbbbeobbo.", ".obbbbbnnbbbbbo.", ".obbboloolbbbbo.", "..obbbbbbbbbbo..", "obooooooooooo...", "obo..obbbbo.....", "obooobbbbbboo...", "..obbbbbbbbbbo..", "..obbbbbbbbbbo..", "...oo......oo...",
};
static const char *const CAT_WAVE_F1[16] = {
    "...o........o...", "..obo......obo..", ".obbbo....obbbo.", ".obbbboooobbbbo.", ".obbbbbbbbbbbbo.", ".obbeebbbbeebbo.", ".obbeobbbbeobbo.", ".obbbbbnnbbbbbo.", ".obbboloolbbbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", ".....obbbbo.....", "obooobbbbbboo...", "obobbbbbbbbbbo..", "obobbbbbbbbbbo..", "...oo......oo...",
};
static const char *const *const CAT_WAVE_FRAMES[] = {CAT_WAVE_F0, CAT_WAVE_F1};

static const char *const CAT_SLEEP_F0[16] = {
    "...o........o...", "..obo......obo..", ".obbbo....obbbo.", ".obbbboooobbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obboobbbboobbo.", ".obbbbbnnbbbbbo.", ".obbbbollobbbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", ".....obbbbo...ww", "...oobbbbbboo.w.", "..obbbbbbbbbboww", "..obbbbbbbbbbo..", "...oo......oo...",
};
static const char *const CAT_SLEEP_F1[16] = {
    "..............ww", "...o........o.w.", "..obo......obeww", ".obbbo....obbbo.", ".obbbboooobbbbo.", ".obbbbbbbbbbbbo.", ".obbbbbbbbbbbbo.", ".obboobbbboobbo.", ".obbbbbnnbbbbbo.", ".obbbbollobbbbo.", "..obbbbbbbbbbo..", "...oooooooooo...", ".....obbbbo.....", "...oobbbbbboo...", "..obbbbbbbbbbo..", "...oo......oo...",
};
static const char *const *const CAT_SLEEP_FRAMES[] = {CAT_SLEEP_F0, CAT_SLEEP_F1};

static const CharacterEmoteDef CAT_EMOTES[] = {
    {"idle", 1, 4, CAT_IDLE_FRAMES},
    {"happy", 4, 2, CAT_HAPPY_FRAMES},
    {"sad", 1, 2, CAT_SAD_FRAMES},
    {"wave", 3, 2, CAT_WAVE_FRAMES},
    {"sleep", 1, 2, CAT_SLEEP_FRAMES},
};

// ── Dog ─────────────────────────────────────────────────────────
static const CharacterPaletteEntry DOG_PALETTE[] = {{'o', 0x28E2}, {'b', 0xCC07}, {'l', 0xF6F7}, {'e', 0xFFFF}, {'n', 0x3943}, {'w', 0x8EBF}};

static const char *const DOG_IDLE_F0[16] = {
    "................", "...oooooooooo...", ".oobbbbbbbbbboo.", "obbobbbbbbbbobbo", "obbobbbbbbbbobbo", "obbobbeebbeebbbo", "obbobbeobbeobbbo", "obbobbbbbbbbobbo", ".oobbblllllbbboo", "...obbbnnnbbbo..", "...obblllllbbo..", "....oooooooooo..", ".....obbbbo.....", "...oobbbbbboo...", "..obbbbbbbbbbo..", "...oo......oo...",
};
static const char *const DOG_IDLE_F1[16] = {
    "................", "...oooooooooo...", ".oobbbbbbbbbboo.", "obbobbbbbbbbobbo", "obbobbbbbbbbobbo", "obbobbeebbeebbbo", "obbobbeobbeobbbo", "obbobbbbbbbbobbo", ".oobbblllllbbboo", "...obbbnnnbbbo..", "...obblllllbbo..", "....oooooooooo..", ".....obbbbo.....", "...oobbbbbboo...", "..obbbbbbbbbbo..", "...oo......oo...",
};
static const char *const DOG_IDLE_F2[16] = {
    "................", "...oooooooooo...", ".oobbbbbbbbbboo.", "obbobbbbbbbbobbo", "obbobbbbbbbbobbo", "obbobbeebbeebbbo", "obbobbeobbeobbbo", "obbobbbbbbbbobbo", ".oobbblllllbbboo", "...obbbnnnbbbo..", "...obblllllbbo..", "....oooooooooo..", ".....obbbbo.....", "...oobbbbbboo...", "..obbbbbbbbbbo..", "...oo......oo...",
};
static const char *const DOG_IDLE_F3[16] = {
    "................", "...oooooooooo...", ".oobbbbbbbbbboo.", "obbobbbbbbbbobbo", "obbobbbbbbbbobbo", "obbobbbbbbbbbbbo", "obbobboobboobbbo", "obbobbbbbbbbobbo", ".oobbblllllbbboo", "...obbbnnnbbbo..", "...obblllllbbo..", "....oooooooooo..", ".....obbbbo.....", "...oobbbbbboo...", "..obbbbbbbbbbo..", "...oo......oo...",
};
static const char *const *const DOG_IDLE_FRAMES[] = {DOG_IDLE_F0, DOG_IDLE_F1, DOG_IDLE_F2, DOG_IDLE_F3};

static const char *const DOG_HAPPY_F0[16] = {
    "................", "...oooooooooo...", ".oobbbbbbbbbboo.", "obbobbbbbbbbobbo", "obbobbbbbbbbobbo", "obbobbobbbbobbbo", "obbobobobbobobbo", "obbobbbbbbbbobbo", ".oobbblllllbbboo", "...obbbnnnbbbo..", "...obbloolbbbo..", "....oooooooooo..", ".....obbbbo.....", "...oobbbbbboo...", "..obbbbbbbbbbo..", "...oo......oo...",
};
static const char *const DOG_HAPPY_F1[16] = {
    "...oooooooooo...", ".oobbbbbbbbbboo.", "obbobbbbbbbbobbo", "obbobbbbbbbbobbo", "obbobbobbbbobbbo", "obbobobobbobobbo", "obbobbbbbbbbobbo", ".oobbblllllbbboo", "...obbbnnnbbbo..", "...obbloolbbbo..", "....oooooooooo..", ".....obbbbo.....", "...oobbbbbboo...", "..obbbbbbbbbbo..", "..obbbbbbbbbbo..", "...oo......oo...",
};
static const char *const *const DOG_HAPPY_FRAMES[] = {DOG_HAPPY_F0, DOG_HAPPY_F1};

static const char *const DOG_SAD_F0[16] = {
    "................", "...oooooooooo...", ".oobbbbbbbbbboo.", "obbobbbbbbbbobbo", "obbobbobbbbobbbo", "obbobbbeobeobbbo", "obbobbbeebeebbbo", "obbobbbbbbbbobbo", ".oobbblllllbbboo", "...obbbnnnbbbo..", "...obbloolbbbo..", "....oooooooooo..", ".....obbbbo.....", "...oobbbbbboo...", "..obbbbbbbbbbo..", "...oo......oo...",
};
static const char *const DOG_SAD_F1[16] = {
    "................", "...oooooooooo...", ".oobbbbbbbbbboo.", "obbobbbbbbbbobbo", "obbobbobbbbobbbo", "obbobbbeobeobbbo", "obbwbbbeebeebbbo", "obbwbbbbbbbbobbo", ".oobbblllllbbboo", "...obbbnnnbbbo..", "...obbloolbbbo..", "....oooooooooo..", ".....obbbbo.....", "...oobbbbbboo...", "..obbbbbbbbbbo..", "...oo......oo...",
};
static const char *const *const DOG_SAD_FRAMES[] = {DOG_SAD_F0, DOG_SAD_F1};

static const char *const DOG_WAVE_F0[16] = {
    "................", "...oooooooooo...", ".oobbbbbbbbbboo.", "obbobbbbbbbbobbo", "obbobbbbbbbbobbo", "obbobbeebbeebbbo", "obbobbeobbeobbbo", "obbobbbbbbbbobbo", ".oobbblllllbbboo", "...obbbnnnbbbo..", "obbobblllllbbo..", "obboooooooooooo.", "obbo.obbbbo.....", "...oobbbbbboo...", "..obbbbbbbbbbo..", "...oo......oo...",
};
static const char *const DOG_WAVE_F1[16] = {
    "................", "...oooooooooo...", ".oobbbbbbbbbboo.", "obbobbbbbbbbobbo", "obbobbbbbbbbobbo", "obbobbeebbeebbbo", "obbobbeobbeobbbo", "obbobbbbbbbbobbo", ".oobbblllllbbboo", "...obbbnnnbbbo..", "...obblllllbbo..", "....oooooooooo..", "obbo.obbbbo.....", "obboobbbbbboo...", "obbbbbbbbbbbbo..", "...oo......oo...",
};
static const char *const *const DOG_WAVE_FRAMES[] = {DOG_WAVE_F0, DOG_WAVE_F1};

static const char *const DOG_SLEEP_F0[16] = {
    "................", "...oooooooooo...", ".oobbbbbbbbbboo.", "obbobbbbbbbbobbo", "obbobbbbbbbbobbo", "obbobbbbbbbbbbbo", "obbobboobboobbbo", "obbobbbbbbbbobbo", ".oobbblllllbbboo", "...obbbnnnbbbo..", "...obblllllbbo..", "....oooooooooo..", ".....obbbbo...ww", "...oobbbbbboo.w.", "..obbbbbbbbbboww", "...oo......oo...",
};
static const char *const DOG_SLEEP_F1[16] = {
    "..............ww", "...oooooooooo.w.", ".oobbbbbbbbbboww", "obbobbbbbbbbobbo", "obbobbbbbbbbobbo", "obbobbbbbbbbbbbo", "obbobboobboobbbo", "obbobbbbbbbbobbo", ".oobbblllllbbboo", "...obbbnnnbbbo..", "...obblllllbbo..", "....oooooooooo..", ".....obbbbo.....", "...oobbbbbboo...", "..obbbbbbbbbbo..", "...oo......oo...",
};
static const char *const *const DOG_SLEEP_FRAMES[] = {DOG_SLEEP_F0, DOG_SLEEP_F1};

static const CharacterEmoteDef DOG_EMOTES[] = {
    {"idle", 1, 4, DOG_IDLE_FRAMES},
    {"happy", 4, 2, DOG_HAPPY_FRAMES},
    {"sad", 1, 2, DOG_SAD_FRAMES},
    {"wave", 3, 2, DOG_WAVE_FRAMES},
    {"sleep", 1, 2, DOG_SLEEP_FRAMES},
};

// ── Person ──────────────────────────────────────────────────────
static const CharacterPaletteEntry PERSON_PALETTE[] = {{'o', 0x20C2}, {'b', 0xF611}, {'h', 0x3922}, {'e', 0xFFFF}, {'l', 0xE2A9}, {'n', 0xBB8B}, {'w', 0x8EBF}};

static const char *const PERSON_IDLE_F0[16] = {
    "....oooooooo....", "...ohhhhhhhho...", "..ohhhhhhhhhho..", "..ohhhhhhhhhho..", "..obbbbbbbbbbo..", "..obbeebbeebbo..", "..obbeobbeobbo..", "..obbbbbbbbbbo..", "..obbbbnnbbbbo..", "..obbbboobbbbo..", "...obbbbbbbbo...", "....oooooooo....", "....ollllllo....", "..oollllllllooo.", "..ollllllllllo..", "...oo......oo...",
};
static const char *const PERSON_IDLE_F1[16] = {
    "....oooooooo....", "...ohhhhhhhho...", "..ohhhhhhhhhho..", "..ohhhhhhhhhho..", "..obbbbbbbbbbo..", "..obbeebbeebbo..", "..obbeobbeobbo..", "..obbbbbbbbbbo..", "..obbbbnnbbbbo..", "..obbbboobbbbo..", "...obbbbbbbbo...", "....oooooooo....", "....ollllllo....", "..oollllllllooo.", "..ollllllllllo..", "...oo......oo...",
};
static const char *const PERSON_IDLE_F2[16] = {
    "....oooooooo....", "...ohhhhhhhho...", "..ohhhhhhhhhho..", "..ohhhhhhhhhho..", "..obbbbbbbbbbo..", "..obbeebbeebbo..", "..obbeobbeobbo..", "..obbbbbbbbbbo..", "..obbbbnnbbbbo..", "..obbbboobbbbo..", "...obbbbbbbbo...", "....oooooooo....", "....ollllllo....", "..oollllllllooo.", "..ollllllllllo..", "...oo......oo...",
};
static const char *const PERSON_IDLE_F3[16] = {
    "....oooooooo....", "...ohhhhhhhho...", "..ohhhhhhhhhho..", "..ohhhhhhhhhho..", "..obbbbbbbbbbo..", "..obbbbbbbbbbo..", "..obboobboobbo..", "..obbbbbbbbbbo..", "..obbbbnnbbbbo..", "..obbbboobbbbo..", "...obbbbbbbbo...", "....oooooooo....", "....ollllllo....", "..oollllllllooo.", "..ollllllllllo..", "...oo......oo...",
};
static const char *const *const PERSON_IDLE_FRAMES[] = {PERSON_IDLE_F0, PERSON_IDLE_F1, PERSON_IDLE_F2, PERSON_IDLE_F3};

static const char *const PERSON_HAPPY_F0[16] = {
    "....oooooooo....", "...ohhhhhhhho...", "..ohhhhhhhhhho..", "..ohhhhhhhhhho..", "..obbbbbbbbbbo..", "..obbobbbbobbo..", "..obobobbobobo..", "..obbbbbbbbbbo..", "..obbonnnnobbo..", "..obbboooobbbo..", "...obbbbbbbbo...", "....oooooooo....", "....ollllllo....", "..oollllllllooo.", "..ollllllllllo..", "...oo......oo...",
};
static const char *const PERSON_HAPPY_F1[16] = {
    "................", "....oooooooo....", "...ohhhhhhhho...", "..ohhhhhhhhhho..", "..ohhhhhhhhhho..", "..obbbbbbbbbbo..", "..obbobbbbobbo..", "..obobobbobobo..", "..obbbbbbbbbbo..", "..obbonnnnobbo..", "..obbboooobbbo..", "...obbbbbbbbo...", "....oooooooo....", "....ollllllo....", "..oollllllllooo.", "..ollllllllllo..",
};
static const char *const *const PERSON_HAPPY_FRAMES[] = {PERSON_HAPPY_F0, PERSON_HAPPY_F1};

static const char *const PERSON_SAD_F0[16] = {
    "....oooooooo....", "...ohhhhhhhho...", "..ohhhhhhhhhho..", "..ohhhhhhhhhho..", "..obbobbbbobbo..", "..obbbeobeobbo..", "..obbbeebeebbo..", "..obbbbbbbbbbo..", "..obbbboobbbbo..", "..obbbonnobbbo..", "...obbbbbbbbo...", "....oooooooo....", "....ollllllo....", "..oollllllllooo.", "..ollllllllllo..", "...oo......oo...",
};
static const char *const PERSON_SAD_F1[16] = {
    "....oooooooo....", "...ohhhhhhhho...", "..ohhhhhhhhhho..", "..ohhhhhhhhhho..", "..obbobbbbobbo..", "..obbbeobeobbo..", "..obwbeebeebbo..", "..obwbbbbbbbbo..", "..obbbboobbbbo..", "..obbbonnobbbo..", "...obbbbbbbbo...", "....oooooooo....", "....ollllllo....", "..oollllllllooo.", "..ollllllllllo..", "...oo......oo...",
};
static const char *const *const PERSON_SAD_FRAMES[] = {PERSON_SAD_F0, PERSON_SAD_F1};

static const char *const PERSON_WAVE_F0[16] = {
    "..bo.oooooooo...", "..bo.hhhhhhhho..", "..booohhhhhhhho.", "...obhhhhhhhhho.", "...obbbbbbbbbbo.", "...obbeebbeebbo.", "...obbeobbeobbo.", "...obbbbbbbbbbo.", "...obbbonnobbbo.", "...obbbboobbbbo.", "....obbbbbbbbo..", ".....oooooooo...", ".....ollllllo...", "...oollllllllo..", "...ollllllllllo.", "....oo......oo..",
};
static const char *const PERSON_WAVE_F1[16] = {
    "....oooooooo....", "...ohhhhhhhho...", "..ohhhhhhhhhho..", "..ohhhhhhhhhho..", "..obbbbbbbbbbo..", "..obbeebbeebbo..", "..obbeobbeobbo..", "..obbbbbbbbbbo..", "..obbbonnobbbo..", "..obbbboobbbbo..", "...obbbbbbbbo...", "....oooooooo....", "obo.ollllllo....", "obooollllllllooo", "obbollllllllllo.", "....oo......oo..",
};
static const char *const *const PERSON_WAVE_FRAMES[] = {PERSON_WAVE_F0, PERSON_WAVE_F1};

static const char *const PERSON_SLEEP_F0[16] = {
    "....oooooooo....", "...ohhhhhhhho...", "..ohhhhhhhhhho..", "..ohhhhhhhhhho..", "..obbbbbbbbbbo..", "..obbbbbbbbbbo..", "..obboobboobbo..", "..obbbbbbbbbbo..", "..obbbbnnbbbbo..", "..obbbboobbbbo..", "...obbbbbbbbo...", "....oooooooo..ww", "....ollllllo.w..", "..oollllllllooww", "..ollllllllllo..", "...oo......oo...",
};
static const char *const PERSON_SLEEP_F1[16] = {
    "..............ww", "....oooooooo.w..", "...ohhhhhhhhoww.", "..ohhhhhhhhhho..", "..ohhhhhhhhhho..", "..obbbbbbbbbbo..", "..obbbbbbbbbbo..", "..obboobboobbo..", "..obbbbbbbbbbo..", "..obbbbnnbbbbo..", "..obbbboobbbbo..", "...obbbbbbbbo...", "....oooooooo....", "....ollllllo....", "..oollllllllooo.", "..ollllllllllo..",
};
static const char *const *const PERSON_SLEEP_FRAMES[] = {PERSON_SLEEP_F0, PERSON_SLEEP_F1};

static const CharacterEmoteDef PERSON_EMOTES[] = {
    {"idle", 1, 4, PERSON_IDLE_FRAMES},
    {"happy", 4, 2, PERSON_HAPPY_FRAMES},
    {"sad", 1, 2, PERSON_SAD_FRAMES},
    {"wave", 3, 2, PERSON_WAVE_FRAMES},
    {"sleep", 1, 2, PERSON_SLEEP_FRAMES},
};

// ── Robot ───────────────────────────────────────────────────────
static const CharacterPaletteEntry ROBOT_PALETTE[] = {{'o', 0x10C4}, {'b', 0x9DB9}, {'l', 0x5BB1}, {'e', 0x5FBF}, {'n', 0xFAEF}, {'w', 0x8EBF}};

static const char *const ROBOT_IDLE_F0[16] = {
    ".......oo.......", ".......oo.......", "....oooooooo....", "...obbbbbbbbo...", "..obbbbbbbbbbo..", "..obeeeeeeeebo..", "..obeoeeeeoebo..", "..obeeeeeeeebo..", "..obbbbbbbbbbo..", "..obbollllobbo..", "...obbbbbbbbo...", "....oooooooo....", "...obbbnnbbbo...", ".oobbbbbbbbbboo.", ".obbbbbbbbbbbbo.", "...oo......oo...",
};
static const char *const ROBOT_IDLE_F1[16] = {
    ".......oo.......", ".......oo.......", "....oooooooo....", "...obbbbbbbbo...", "..obbbbbbbbbbo..", "..obeeeeeeeebo..", "..obeoeeeeoebo..", "..obeeeeeeeebo..", "..obbbbbbbbbbo..", "..obbollllobbo..", "...obbbbbbbbo...", "....oooooooo....", "...obbbnnbbbo...", ".oobbbbbbbbbboo.", ".obbbbbbbbbbbbo.", "...oo......oo...",
};
static const char *const ROBOT_IDLE_F2[16] = {
    ".......oo.......", ".......oo.......", "....oooooooo....", "...obbbbbbbbo...", "..obbbbbbbbbbo..", "..obeeeeeeeebo..", "..obeoeeeeoebo..", "..obeeeeeeeebo..", "..obbbbbbbbbbo..", "..obbollllobbo..", "...obbbbbbbbo...", "....oooooooo....", "...obbbnnbbbo...", ".oobbbbbbbbbboo.", ".obbbbbbbbbbbbo.", "...oo......oo...",
};
static const char *const ROBOT_IDLE_F3[16] = {
    ".......oo.......", ".......oo.......", "....oooooooo....", "...obbbbbbbbo...", "..obbbbbbbbbbo..", "..obllllllllbo..", "..obloollooolbo.", "..obllllllllbo..", "..obbbbbbbbbbo..", "..obbollllobbo..", "...obbbbbbbbo...", "....oooooooo....", "...obbbnnbbbo...", ".oobbbbbbbbbboo.", ".obbbbbbbbbbbbo.", "...oo......oo...",
};
static const char *const *const ROBOT_IDLE_FRAMES[] = {ROBOT_IDLE_F0, ROBOT_IDLE_F1, ROBOT_IDLE_F2, ROBOT_IDLE_F3};

static const char *const ROBOT_HAPPY_F0[16] = {
    ".......oo.......", ".......oo.......", "....oooooooo....", "...obbbbbbbbo...", "..obbbbbbbbbbo..", "..obeeeeeeeebo..", "..obeoeeeeoebo..", "..obeeeeeeeebo..", "..obbbbbbbbbbo..", "..oboeeeeeeobo..", "...obbbbbbbbo...", "....oooooooo....", "...obbbnnbbbo...", ".oobbbbbbbbbboo.", ".obbbbbbbbbbbbo.", "...oo......oo...",
};
static const char *const ROBOT_HAPPY_F1[16] = {
    "................", ".......oo.......", ".......oo.......", "....oooooooo....", "...obbbbbbbbo...", "..obbbbbbbbbbo..", "..obeeeeeeeebo..", "..obeoeeeeoebo..", "..obeeeeeeeebo..", "..obbbbbbbbbbo..", "..oboeeeeeeobo..", "...obbbbbbbbo...", "....oooooooo....", "...obbbnnbbbo...", ".oobbbbbbbbbboo.", ".obbbbbbbbbbbbo.",
};
static const char *const *const ROBOT_HAPPY_FRAMES[] = {ROBOT_HAPPY_F0, ROBOT_HAPPY_F1};

static const char *const ROBOT_SAD_F0[16] = {
    ".......oo.......", ".......oo.......", "....oooooooo....", "...obbbbbbbbo...", "..obbbbbbbbbbo..", "..obllllllllbo..", "..oblleelleelbo.", "..obllllllllbo..", "..obbbbbbbbbbo..", "..obboeeeeobbo..", "...obbbbbbbbo...", "....oooooooo....", "...obbbnnbbbo...", ".oobbbbbbbbbboo.", ".obbbbbbbbbbbbo.", "...oo......oo...",
};
static const char *const ROBOT_SAD_F1[16] = {
    ".......oo.......", ".......oo.......", "....oooooooo....", "...obbbbbbbbo...", "..obbbbbbbbbbo..", "..obllllllllbo..", "..oblleelleelbo.", "..wbllllllllbo..", "..wbbbbbbbbbbo..", "..obboeeeeobbo..", "...obbbbbbbbo...", "....oooooooo....", "...obbbnnbbbo...", ".oobbbbbbbbbboo.", ".obbbbbbbbbbbbo.", "...oo......oo...",
};
static const char *const *const ROBOT_SAD_FRAMES[] = {ROBOT_SAD_F0, ROBOT_SAD_F1};

static const char *const ROBOT_WAVE_F0[16] = {
    "ob.....oo.......", "ob.....oo.......", "ob..oooooooo....", "obooobbbbbbbo...", "obbbbbbbbbbbbo..", "..obeeeeeeeebo..", "..obeoeeeeoebo..", "..obeeeeeeeebo..", "..obbbbbbbbbbo..", "..obbollllobbo..", "...obbbbbbbbo...", "....oooooooo....", "...obbbnnbbbo...", ".oobbbbbbbbbboo.", ".obbbbbbbbbbbbo.", "...oo......oo...",
};
static const char *const ROBOT_WAVE_F1[16] = {
    ".......oo.......", ".......oo.......", "....oooooooo....", "...obbbbbbbbo...", "..obbbbbbbbbbo..", "..obeeeeeeeebo..", "..obeoeeeeoebo..", "..obeeeeeeeebo..", "..obbbbbbbbbbo..", "..obbollllobbo..", "...obbbbbbbbo...", "....oooooooo....", "ob.obbbnnbbbo...", "oboobbbbbbbbboo.", "obbbbbbbbbbbbbo.", "...oo......oo...",
};
static const char *const *const ROBOT_WAVE_FRAMES[] = {ROBOT_WAVE_F0, ROBOT_WAVE_F1};

static const char *const ROBOT_SLEEP_F0[16] = {
    ".......oo.......", ".......oo.......", "....oooooooo....", "...obbbbbbbbo...", "..obbbbbbbbbbo..", "..obllllllllbo..", "..obloollooolbo.", "..obllllllllbo..", "..obbbbbbbbbbo..", "..obbollllobbo..", "...obbbbbbbbo.ww", "....oooooooo.w..", "...obbbnnbbboww.", ".oobbbbbbbbbboo.", ".obbbbbbbbbbbbo.", "...oo......oo...",
};
static const char *const ROBOT_SLEEP_F1[16] = {
    "..............ww", ".......oo....w..", ".......oo...ww..", "....oooooooo....", "...obbbbbbbbo...", "..obbbbbbbbbbo..", "..obllllllllbo..", "..obloollooolbo.", "..obllllllllbo..", "..obbbbbbbbbbo..", "..obbollllobbo..", "...obbbbbbbbo...", "....oooooooo....", "...obbbnnbbbo...", ".oobbbbbbbbbboo.", ".obbbbbbbbbbbbo.",
};
static const char *const *const ROBOT_SLEEP_FRAMES[] = {ROBOT_SLEEP_F0, ROBOT_SLEEP_F1};

static const CharacterEmoteDef ROBOT_EMOTES[] = {
    {"idle", 1, 4, ROBOT_IDLE_FRAMES},
    {"happy", 4, 2, ROBOT_HAPPY_FRAMES},
    {"sad", 1, 2, ROBOT_SAD_FRAMES},
    {"wave", 3, 2, ROBOT_WAVE_FRAMES},
    {"sleep", 1, 2, ROBOT_SLEEP_FRAMES},
};

static const CharacterDef CHARACTERS[] = {
    {"cat", CAT_PALETTE, 6, CAT_EMOTES, 5},
    {"dog", DOG_PALETTE, 6, DOG_EMOTES, 5},
    {"person", PERSON_PALETTE, 7, PERSON_EMOTES, 5},
    {"robot", ROBOT_PALETTE, 6, ROBOT_EMOTES, 5},
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
