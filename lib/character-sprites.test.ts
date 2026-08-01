import { describe, expect, it } from "vitest"
import { CHARACTERS, CHARACTER_GRID_SIZE, characterFrameIndex } from "./character-sprites"

// Sprites are hand-authored ASCII grids kept in sync with a second copy in
// Arduino_code/include/characters.h. A miscounted row is invisible in review
// but shows up as a torn sprite on the panel, so the shape is asserted here.
describe("character sprites", () => {
  for (const [characterId, def] of Object.entries(CHARACTERS)) {
    describe(characterId, () => {
      const legendCodes = new Set(Object.keys(def.legend))

      it("declares a legend without transparent-code collisions", () => {
        expect(legendCodes.has(".")).toBe(false)
        for (const colour of Object.values(def.legend)) {
          expect(colour).toMatch(/^#[0-9a-f]{6}$/i)
        }
      })

      for (const [emoteId, emote] of Object.entries(def.emotes)) {
        it(`${emoteId} frames are ${CHARACTER_GRID_SIZE}x${CHARACTER_GRID_SIZE} and use known codes`, () => {
          expect(emote.frames.length).toBeGreaterThan(0)
          expect(emote.fps).toBeGreaterThan(0)

          emote.frames.forEach((frame, frameIndex) => {
            expect(frame, `${emoteId} frame ${frameIndex} row count`).toHaveLength(CHARACTER_GRID_SIZE)

            frame.forEach((row, rowIndex) => {
              expect(row.length, `${emoteId} frame ${frameIndex} row ${rowIndex}: "${row}"`).toBe(
                CHARACTER_GRID_SIZE,
              )

              for (const code of row) {
                expect(
                  code === "." || legendCodes.has(code),
                  `${emoteId} frame ${frameIndex} row ${rowIndex} uses undeclared code "${code}"`,
                ).toBe(true)
              }
            })
          })
        })

        it(`${emoteId} draws something on every frame`, () => {
          for (const frame of emote.frames) {
            expect(frame.some((row) => /[^.]/.test(row))).toBe(true)
          }
        })
      }
    })
  }

  // An emote that looks like idle is worse than no emote — you set a mood and
  // nothing appears to happen. These assert each one is actually distinct.
  describe("emotes are visually distinguishable", () => {
    const differingPixels = (a: string[], b: string[]) => {
      let n = 0
      for (let row = 0; row < CHARACTER_GRID_SIZE; row++) {
        for (let col = 0; col < CHARACTER_GRID_SIZE; col++) {
          if (a[row][col] !== b[row][col]) n++
        }
      }
      return n
    }

    for (const [characterId, def] of Object.entries(CHARACTERS)) {
      const idle = def.emotes.idle.frames[0]

      for (const [emoteId, emote] of Object.entries(def.emotes)) {
        if (emoteId === "idle") continue
        it(`${characterId}/${emoteId} differs from idle`, () => {
          expect(differingPixels(idle, emote.frames[0])).toBeGreaterThanOrEqual(6)
        })
      }

      it(`${characterId} animates on every multi-frame emote`, () => {
        for (const [emoteId, emote] of Object.entries(def.emotes)) {
          if (emote.frames.length < 2) continue
          const moved = emote.frames.some((f) => differingPixels(emote.frames[0], f) > 0)
          expect(moved, `${characterId}/${emoteId} frames are all identical`).toBe(true)
        }
      })
    }
  })

  it("cycles frames at the emote's fps and wraps", () => {
    expect(characterFrameIndex(4, 2, 0)).toBe(0)
    expect(characterFrameIndex(4, 2, 250)).toBe(1)
    expect(characterFrameIndex(4, 2, 500)).toBe(0)
    // A single-frame emote never advances, whatever the clock says.
    expect(characterFrameIndex(4, 1, 99999)).toBe(0)
  })
})
