// Renders the contents of Arduino_code/include/characters.h from
// lib/character-sprites.ts. scripts/generate-characters-header.ts writes it.
//
// The sprites have to exist in two places - the browser preview draws them
// from TypeScript, the panel draws them from C - and a preview that disagrees
// with the panel defeats the point of previewing. Rather than maintain two
// hand-written copies, the TypeScript file is the single source and this
// script regenerates the header. Run it after any sprite edit:
//
//   npx vite-node scripts/generate-characters-header.ts
//
// scripts/characters-header.test.ts fails if the checked-in header is stale.

import { CHARACTERS, CHARACTER_GRID_SIZE } from "../lib/character-sprites"

function rgb565(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const value = ((r & 0xf8) << 8) | ((g & 0xfc) << 3) | (b >> 3)
  return `0x${value.toString(16).toUpperCase().padStart(4, "0")}`
}

const upper = (s: string) => s.toUpperCase().replace(/[^A-Z0-9]/g, "_")

export function renderHeader(): string {
  const out: string[] = []

  out.push(`// GENERATED FILE - do not edit by hand.`)
  out.push(`// Regenerate with: npx vite-node scripts/generate-characters-header.ts`)
  out.push(`// Source of truth: lib/character-sprites.ts`)
  out.push(`//`)
  out.push(`// Animated ${CHARACTER_GRID_SIZE}x${CHARACTER_GRID_SIZE} pixel characters. Each frame is ${CHARACTER_GRID_SIZE} rows of`)
  out.push(`// ${CHARACTER_GRID_SIZE} legend codes; '.' is transparent, every other code indexes that`)
  out.push(`// character's palette. Colours are RGB565, matching the panel's native format.`)
  out.push(`#pragma once`)
  out.push(`#include <Arduino.h>`)
  out.push(`#include <Adafruit_GFX.h>`)
  out.push(``)
  out.push(`static const uint8_t CHARACTER_GRID_SIZE = ${CHARACTER_GRID_SIZE};`)
  out.push(``)
  out.push(`struct CharacterPaletteEntry {`)
  out.push(`  char code;`)
  out.push(`  uint16_t color;`)
  out.push(`};`)
  out.push(``)
  out.push(`struct CharacterEmoteDef {`)
  out.push(`  const char *id;`)
  out.push(`  uint8_t fps;`)
  out.push(`  uint8_t frameCount;`)
  out.push(`  const char *const *const *frames; // frames[frame][row]`)
  out.push(`};`)
  out.push(``)
  out.push(`struct CharacterDef {`)
  out.push(`  const char *id;`)
  out.push(`  const CharacterPaletteEntry *palette;`)
  out.push(`  uint8_t paletteCount;`)
  out.push(`  const CharacterEmoteDef *emotes;`)
  out.push(`  uint8_t emoteCount;`)
  out.push(`};`)
  out.push(``)

  for (const [charId, def] of Object.entries(CHARACTERS)) {
    const C = upper(charId)

    out.push(`// ── ${def.label} ${"─".repeat(Math.max(0, 60 - def.label.length))}`)
    const paletteEntries = Object.entries(def.legend)
      .map(([code, hex]) => `{'${code}', ${rgb565(hex)}}`)
      .join(", ")
    out.push(`static const CharacterPaletteEntry ${C}_PALETTE[] = {${paletteEntries}};`)
    out.push(``)

    for (const [emoteId, emote] of Object.entries(def.emotes)) {
      const E = upper(emoteId)
      emote.frames.forEach((frame, i) => {
        out.push(`static const char *const ${C}_${E}_F${i}[${CHARACTER_GRID_SIZE}] = {`)
        out.push(`    ${frame.map((row) => `"${row}"`).join(", ")},`)
        out.push(`};`)
      })
      const frameList = emote.frames.map((_, i) => `${C}_${E}_F${i}`).join(", ")
      out.push(`static const char *const *const ${C}_${E}_FRAMES[] = {${frameList}};`)
      out.push(``)
    }

    const emoteDefs = Object.entries(def.emotes)
      .map(
        ([emoteId, emote]) =>
          `    {"${emoteId}", ${emote.fps}, ${emote.frames.length}, ${C}_${upper(emoteId)}_FRAMES},`,
      )
      .join("\n")
    out.push(`static const CharacterEmoteDef ${C}_EMOTES[] = {`)
    out.push(emoteDefs)
    out.push(`};`)
    out.push(``)
  }

  const charDefs = Object.entries(CHARACTERS)
    .map(([charId, def]) => {
      const C = upper(charId)
      const paletteCount = Object.keys(def.legend).length
      const emoteCount = Object.keys(def.emotes).length
      return `    {"${charId}", ${C}_PALETTE, ${paletteCount}, ${C}_EMOTES, ${emoteCount}},`
    })
    .join("\n")

  out.push(`static const CharacterDef CHARACTERS[] = {`)
  out.push(charDefs)
  out.push(`};`)
  out.push(`static const size_t CHARACTERS_COUNT = sizeof(CHARACTERS) / sizeof(CHARACTERS[0]);`)
  out.push(``)
  out.push(`inline const CharacterDef *findCharacter(const char *id) {`)
  out.push(`  for (size_t i = 0; i < CHARACTERS_COUNT; i++) {`)
  out.push(`    if (strcmp(CHARACTERS[i].id, id) == 0) return &CHARACTERS[i];`)
  out.push(`  }`)
  out.push(`  return nullptr;`)
  out.push(`}`)
  out.push(``)
  out.push(`inline const CharacterEmoteDef *findEmote(const CharacterDef *c, const char *emoteId) {`)
  out.push(`  if (!c) return nullptr;`)
  out.push(`  for (uint8_t i = 0; i < c->emoteCount; i++) {`)
  out.push(`    if (strcmp(c->emotes[i].id, emoteId) == 0) return &c->emotes[i];`)
  out.push(`  }`)
  out.push(`  return c->emoteCount > 0 ? &c->emotes[0] : nullptr; // fall back to idle`)
  out.push(`}`)
  out.push(``)
  out.push(`// Mirrors characterFrameIndex() in lib/character-sprites.ts.`)
  out.push(`inline uint8_t characterFrameIndex(uint8_t fps, uint8_t frameCount, unsigned long elapsedMs) {`)
  out.push(`  if (frameCount <= 1) return 0;`)
  out.push(`  return (uint8_t)(((elapsedMs / 1000.0f) * fps)) % frameCount;`)
  out.push(`}`)
  out.push(``)
  out.push(`// Mirrors drawCharacter() in lib/character-sprites.ts.`)
  out.push(`inline void drawCharacter(Adafruit_GFX &d, const char *characterId, const char *emoteId, int16_t x,`)
  out.push(`                          int16_t y, uint8_t scale, unsigned long elapsedMs) {`)
  out.push(`  const CharacterDef *c = findCharacter(characterId);`)
  out.push(`  if (!c) return;`)
  out.push(`  const CharacterEmoteDef *e = findEmote(c, emoteId);`)
  out.push(`  if (!e) return;`)
  out.push(`  const char *const *frame = e->frames[characterFrameIndex(e->fps, e->frameCount, elapsedMs)];`)
  out.push(``)
  out.push(`  for (uint8_t row = 0; row < CHARACTER_GRID_SIZE; row++) {`)
  out.push(`    const char *line = frame[row];`)
  out.push(`    for (uint8_t col = 0; col < CHARACTER_GRID_SIZE; col++) {`)
  out.push(`      const char code = line[col];`)
  out.push(`      if (code == '.' || code == '\\0') continue;`)
  out.push(`      for (uint8_t p = 0; p < c->paletteCount; p++) {`)
  out.push(`        if (c->palette[p].code != code) continue;`)
  out.push(`        if (scale == 1) {`)
  out.push(`          d.drawPixel(x + col, y + row, c->palette[p].color);`)
  out.push(`        } else {`)
  out.push(`          d.fillRect(x + col * scale, y + row * scale, scale, scale, c->palette[p].color);`)
  out.push(`        }`)
  out.push(`        break;`)
  out.push(`      }`)
  out.push(`    }`)
  out.push(`  }`)
  out.push(`}`)
  out.push(``)

  return out.join("\n")
}
