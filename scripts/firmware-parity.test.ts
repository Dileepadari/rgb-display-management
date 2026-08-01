import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

import { CHARACTER_IDS, EMOTE_IDS } from "../lib/character-sprites"
import { MOOD_ENTRANCE_MS, MOOD_EXIT_MS } from "../lib/mood-reaction"
import { MAX_PLAYLIST_ITEMS } from "../lib/playlist-schema"
import { sceneElementSchema } from "../lib/scene-schema"

// The firmware and the web app implement the same feature set twice, in two
// languages. Nothing but discipline keeps them together, and a drift shows up
// only on real hardware - where it looks like "the panel is broken" rather
// than "someone added an enum value in one place".
//
// These read the actual firmware sources and assert the contracts match. They
// are deliberately string-based: a proper binding would be more work to
// maintain than the thing it protects.

const here = dirname(fileURLToPath(import.meta.url))
const firmware = (...parts: string[]) => readFileSync(join(here, "..", "Arduino_code", ...parts), "utf8")

const elementsH = firmware("include", "elements.h")
const elementsCpp = firmware("src", "elements.cpp")
const moodH = firmware("include", "mood.h")
const moodCpp = firmware("src", "mood.cpp")
const charactersH = firmware("include", "characters.h")

describe("firmware/web parity", () => {
  it("firmware parses every element type the schema allows", () => {
    // Pull the literal union out of the discriminated union's options.
    const types = sceneElementSchema.options.map((o) => o.shape.type.value as string)
    expect(types.length).toBeGreaterThan(0)

    for (const type of types) {
      expect(elementsCpp, `parseType() has no case for "${type}"`).toContain(`"${type}"`)
    }
  })

  it("firmware handles every animation type", () => {
    const animations = ["none", "scroll", "blink", "pulse", "rainbow", "bounce"]
    for (const anim of animations) {
      if (anim === "none") continue // the default, not a parsed string
      expect(elementsCpp, `parseAnimType() has no case for "${anim}"`).toContain(`"${anim}"`)
    }
  })

  it("firmware ships every character and emote the editor can pick", () => {
    for (const id of CHARACTER_IDS) {
      expect(charactersH, `characters.h is missing character "${id}"`).toContain(`{"${id}", `)
    }
    for (const id of EMOTE_IDS) {
      expect(charactersH, `characters.h is missing emote "${id}"`).toContain(`{"${id}", `)
    }
  })

  it("firmware handles every mood entrance and position", () => {
    for (const entrance of ["slide-right", "drop", "fade", "pop"]) {
      expect(moodCpp, `parseEntrance() has no case for "${entrance}"`).toContain(`"${entrance}"`)
    }
    for (const position of ["bottom-right", "top-left", "top-right", "center"]) {
      expect(moodCpp, `parsePosition() has no case for "${position}"`).toContain(`"${position}"`)
    }
    expect(moodCpp).toContain('"stay"')
  })

  it("mood timings match lib/mood-reaction.ts", () => {
    expect(moodH).toContain(`MOOD_ENTRANCE_MS = ${MOOD_ENTRANCE_MS}`)
    expect(moodH).toContain(`MOOD_EXIT_MS = ${MOOD_EXIT_MS}`)
  })

  it("playlist capacity matches the schema's cap", () => {
    expect(elementsH).toContain(`#define MAX_PLAYLIST_ITEMS ${MAX_PLAYLIST_ITEMS}`)
  })

  it("element capacity matches the scene schema's cap", () => {
    // sceneContentSchema caps elements at 12; the firmware allocates a fixed
    // array, so a larger scene would be silently truncated on the panel.
    const match = elementsH.match(/#define MAX_ELEMENTS (\d+)/)
    expect(match, "MAX_ELEMENTS not found in elements.h").toBeTruthy()
    expect(Number(match![1])).toBeGreaterThanOrEqual(12)
  })

  it("firmware reads the device settings the feed sends", () => {
    const feedRoute = readFileSync(
      join(here, "..", "app", "api", "device-feed", "[token]", "route.ts"),
      "utf8",
    )
    for (const key of ["brightness", "timezone", "panel_cols", "panel_rows", "panel_unit_size"]) {
      expect(feedRoute, `feed does not send "${key}"`).toContain(key)
      expect(elementsCpp, `firmware does not read "${key}"`).toContain(`"${key}"`)
    }
  })

  it("firmware reads every mood field the feed sends", () => {
    for (const key of ["character", "emote", "entrance", "hold_seconds", "after", "position", "scale", "tint_strength"]) {
      expect(moodCpp, `parseMood() does not read "${key}"`).toContain(`"${key}"`)
    }
  })
})
