import { describe, expect, it } from "vitest"
import {
  MOOD_ENTRANCE_MS,
  MOOD_EXIT_MS,
  moodFrameState,
  moodRestPosition,
  moodTotalMs,
  type MoodReaction,
} from "./mood-reaction"

// This lifecycle is implemented twice - here and in Arduino_code/src/mood.cpp.
// These lock down the boundaries the two must agree on.
const base: MoodReaction = {
  character: "cat",
  emote: "wave",
  entrance: "slide-left",
  holdSeconds: 5,
  after: "leave",
  position: "bottom-left",
  scale: 2,
  tint: [255, 210, 63],
  tintStrength: 20,
}

const W = 64
const H = 64

describe("mood reaction lifecycle", () => {
  it("enters, holds, then leaves", () => {
    expect(moodFrameState(base, W, H, 0).phase).toBe("entering")
    expect(moodFrameState(base, W, H, MOOD_ENTRANCE_MS - 1).phase).toBe("entering")
    expect(moodFrameState(base, W, H, MOOD_ENTRANCE_MS).phase).toBe("holding")
    expect(moodFrameState(base, W, H, MOOD_ENTRANCE_MS + 4999).phase).toBe("holding")
    expect(moodFrameState(base, W, H, MOOD_ENTRANCE_MS + 5000).phase).toBe("leaving")
    expect(moodFrameState(base, W, H, moodTotalMs(base)!).phase).toBe("gone")
  })

  it("stops drawing only once it is gone", () => {
    expect(moodFrameState(base, W, H, moodTotalMs(base)! - 1).visible).toBe(true)
    expect(moodFrameState(base, W, H, moodTotalMs(base)!).visible).toBe(false)
  })

  it("a 'stay' reaction rests forever and never ends", () => {
    const stay: MoodReaction = { ...base, after: "stay" }
    expect(moodTotalMs(stay)).toBeNull()
    const late = moodFrameState(stay, W, H, 60 * 60 * 1000)
    expect(late.phase).toBe("resting")
    expect(late.visible).toBe(true)
    expect(late).toMatchObject(moodRestPosition("bottom-left", W, H, 32))
  })

  it("slides in from off-stage and lands exactly on the rest position", () => {
    const start = moodFrameState(base, W, H, 0)
    expect(start.x).toBeLessThan(0) // fully off the left edge

    const landed = moodFrameState(base, W, H, MOOD_ENTRANCE_MS)
    expect(landed).toMatchObject(moodRestPosition("bottom-left", W, H, 32))
  })

  it("exits back the way it came in", () => {
    const exitMid = moodFrameState(base, W, H, MOOD_ENTRANCE_MS + 5000 + MOOD_EXIT_MS / 2)
    const rest = moodRestPosition("bottom-left", W, H, 32)
    expect(exitMid.x).toBeLessThan(rest.x)
  })

  it("keeps the sprite inside the panel for every corner", () => {
    const spritePx = 32
    for (const position of ["bottom-left", "bottom-right", "top-left", "top-right", "center"] as const) {
      const { x, y } = moodRestPosition(position, W, H, spritePx)
      expect(x).toBeGreaterThanOrEqual(0)
      expect(y).toBeGreaterThanOrEqual(0)
      expect(x + spritePx).toBeLessThanOrEqual(W)
      expect(y + spritePx).toBeLessThanOrEqual(H)
    }
  })

  it("fades by opacity and pops by scale, without moving", () => {
    const rest = moodRestPosition("bottom-left", W, H, 32)

    const fade = moodFrameState({ ...base, entrance: "fade" }, W, H, MOOD_ENTRANCE_MS / 2)
    expect(fade).toMatchObject(rest)
    expect(fade.opacity).toBeGreaterThan(0)
    expect(fade.opacity).toBeLessThan(1)

    const pop = moodFrameState({ ...base, entrance: "pop" }, W, H, 1)
    expect(pop).toMatchObject(rest)
    expect(pop.scale).toBeLessThanOrEqual(base.scale)
    expect(pop.scale).toBeGreaterThanOrEqual(1) // never collapses to nothing
  })
})
