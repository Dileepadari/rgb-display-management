// The mood reaction lifecycle, defined once.
//
// A mood is a character that arrives on top of whatever scene is playing,
// performs an emote, then either stays or leaves. The panel runs this on its
// own clock (nothing streams frames to it), and the web preview has to agree
// exactly or "design it here, watch it there" stops being true. So the phase
// maths lives here and Arduino_code/src/mood.cpp mirrors it line for line -
// the same arrangement lib/scene-compositor.ts already has with elements.cpp.

export const MOOD_ENTRANCE_MS = 600
export const MOOD_EXIT_MS = 600

export type MoodEntrance = "slide-left" | "slide-right" | "drop" | "fade" | "pop"
export type MoodAfter = "stay" | "leave"
export type MoodPosition = "bottom-left" | "bottom-right" | "top-left" | "top-right" | "center"

export interface MoodReaction {
  character: string
  emote: string
  entrance: MoodEntrance
  holdSeconds: number
  after: MoodAfter
  position: MoodPosition
  scale: number
  /** Tint colour as [r,g,b]; washed over the scene beneath the character. */
  tint: [number, number, number]
  /** 0-100. */
  tintStrength: number
}

export type MoodPhase = "entering" | "holding" | "leaving" | "resting" | "gone"

export interface MoodFrameState {
  phase: MoodPhase
  /** Where to draw the sprite's top-left, in panel pixels. */
  x: number
  y: number
  /** 0-1, multiplies both the sprite and the tint. */
  opacity: number
  /** Sprite scale for this frame; `pop` grows into place. */
  scale: number
  /** False once a "leave" reaction has finished - draw nothing. */
  visible: boolean
}

/** Where the character comes to rest, given the panel size. */
export function moodRestPosition(
  position: MoodPosition,
  panelWidth: number,
  panelHeight: number,
  spritePx: number,
): { x: number; y: number } {
  const margin = 1
  const right = panelWidth - spritePx - margin
  const bottom = panelHeight - spritePx - margin
  switch (position) {
    case "bottom-left":
      return { x: margin, y: bottom }
    case "bottom-right":
      return { x: right, y: bottom }
    case "top-left":
      return { x: margin, y: margin }
    case "top-right":
      return { x: right, y: margin }
    case "center":
      return { x: Math.round((panelWidth - spritePx) / 2), y: Math.round((panelHeight - spritePx) / 2) }
  }
}

/** Linear 0..1 progress, clamped. */
function progress(elapsed: number, duration: number): number {
  if (duration <= 0) return 1
  const t = elapsed / duration
  return t < 0 ? 0 : t > 1 ? 1 : t
}

// Ease-out cubic. Gives the arrival some weight instead of a linear slide,
// and is cheap enough to be identical in C.
function ease(t: number): number {
  const inv = 1 - t
  return 1 - inv * inv * inv
}

/**
 * The whole lifecycle: entrance -> hold -> (stay | leave).
 * `elapsedMs` is time since the mood was applied.
 */
export function moodFrameState(
  reaction: MoodReaction,
  panelWidth: number,
  panelHeight: number,
  elapsedMs: number,
): MoodFrameState {
  const spritePx = 16 * reaction.scale
  const rest = moodRestPosition(reaction.position, panelWidth, panelHeight, spritePx)
  const holdMs = reaction.holdSeconds * 1000

  // Entrance
  if (elapsedMs < MOOD_ENTRANCE_MS) {
    const t = ease(progress(elapsedMs, MOOD_ENTRANCE_MS))
    return {
      phase: "entering",
      ...offsetFor(reaction.entrance, rest, t, panelWidth, spritePx),
      opacity: reaction.entrance === "fade" ? t : 1,
      scale: reaction.entrance === "pop" ? Math.max(1, Math.round(reaction.scale * t)) : reaction.scale,
      visible: true,
    }
  }

  // Hold - sitting at rest, playing the emote.
  if (elapsedMs < MOOD_ENTRANCE_MS + holdMs) {
    return { phase: "holding", x: rest.x, y: rest.y, opacity: 1, scale: reaction.scale, visible: true }
  }

  // A "stay" mood never leaves; it just keeps performing until cleared.
  if (reaction.after === "stay") {
    return { phase: "resting", x: rest.x, y: rest.y, opacity: 1, scale: reaction.scale, visible: true }
  }

  // Exit - the entrance played backwards.
  const exitElapsed = elapsedMs - MOOD_ENTRANCE_MS - holdMs
  if (exitElapsed < MOOD_EXIT_MS) {
    const t = ease(progress(exitElapsed, MOOD_EXIT_MS))
    return {
      phase: "leaving",
      ...offsetFor(reaction.entrance, rest, 1 - t, panelWidth, spritePx),
      opacity: reaction.entrance === "fade" ? 1 - t : 1,
      scale: reaction.entrance === "pop" ? Math.max(1, Math.round(reaction.scale * (1 - t))) : reaction.scale,
      visible: true,
    }
  }

  return { phase: "gone", x: rest.x, y: rest.y, opacity: 0, scale: reaction.scale, visible: false }
}

/** Position at progress `t` (0 = fully off-stage, 1 = at rest). */
function offsetFor(
  entrance: MoodEntrance,
  rest: { x: number; y: number },
  t: number,
  panelWidth: number,
  spritePx: number,
): { x: number; y: number } {
  switch (entrance) {
    case "slide-left": {
      const from = -spritePx
      return { x: Math.round(from + (rest.x - from) * t), y: rest.y }
    }
    case "slide-right": {
      const from = panelWidth
      return { x: Math.round(from + (rest.x - from) * t), y: rest.y }
    }
    case "drop": {
      const from = -spritePx
      return { x: rest.x, y: Math.round(from + (rest.y - from) * t) }
    }
    // fade and pop arrive in place; their motion is opacity/scale.
    case "fade":
    case "pop":
      return { x: rest.x, y: rest.y }
  }
}

/** Total wall-clock life of a reaction, or null when it never ends. */
export function moodTotalMs(reaction: MoodReaction): number | null {
  if (reaction.after === "stay") return null
  return MOOD_ENTRANCE_MS + reaction.holdSeconds * 1000 + MOOD_EXIT_MS
}
