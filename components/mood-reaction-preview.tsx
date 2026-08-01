"use client"

import { useEffect, useRef } from "react"
import { CHARACTER_GRID_SIZE, drawCharacter } from "@/lib/character-sprites"
import { moodFrameState, moodTotalMs, type MoodReaction } from "@/lib/mood-reaction"

// Plays a mood reaction the way the panel will: the character enters, performs
// its emote, then stays or leaves — over a mock scene so the tint and the
// "sits on top of your content" behaviour are both visible.
//
// Uses the same lib/mood-reaction.ts lifecycle the firmware mirrors, so what
// you watch here is what the panel does.
export function MoodReactionPreview({
  reaction,
  panelWidth = 64,
  panelHeight = 64,
  px = 128,
  /** Restart the loop this many ms after a "leave" reaction finishes. */
  replayDelayMs = 900,
  backdrop = true,
}: {
  reaction: MoodReaction
  panelWidth?: number
  panelHeight?: number
  px?: number
  replayDelayMs?: number
  backdrop?: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const total = moodTotalMs(reaction)
    const loopMs = total === null ? null : total + replayDelayMs
    const start = performance.now()
    let raf = 0

    const draw = (now: number) => {
      const sinceStart = now - start
      const elapsed = loopMs === null ? sinceStart : sinceStart % loopMs

      ctx.fillStyle = "#0a0a0a"
      ctx.fillRect(0, 0, panelWidth, panelHeight)

      if (backdrop) {
        // Stand-in for "whatever scene is playing", so it's obvious the mood
        // layers on top rather than replacing the content.
        ctx.fillStyle = "#1d2740"
        ctx.fillRect(0, 0, panelWidth, panelHeight)
        ctx.fillStyle = "#33415f"
        for (let y = 4; y < panelHeight; y += 12) {
          ctx.fillRect(4, y, panelWidth - 8, 2)
        }
      }

      const state = moodFrameState(reaction, panelWidth, panelHeight, elapsed)

      if (state.visible && reaction.tintStrength > 0) {
        const [r, g, b] = reaction.tint
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${(reaction.tintStrength / 100) * state.opacity})`
        ctx.fillRect(0, 0, panelWidth, panelHeight)
      }

      if (state.visible) {
        ctx.globalAlpha = state.opacity
        drawCharacter(ctx, reaction.character, reaction.emote, state.x, state.y, state.scale, elapsed)
        ctx.globalAlpha = 1
      }

      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [reaction, panelWidth, panelHeight, replayDelayMs, backdrop])

  return (
    <canvas
      ref={canvasRef}
      width={panelWidth}
      height={panelHeight}
      className="rounded-md border border-border"
      style={{ width: px, height: px, imageRendering: "pixelated" }}
    />
  )
}

/** Turns an API mood row into the shape the lifecycle functions expect. */
export function toReaction(mood: {
  character?: string
  emote?: string
  entrance?: string
  hold_seconds?: number
  after_reaction?: string
  position?: string
  scale?: number
  color?: string
  tint_strength?: number
}): MoodReaction {
  const hex = mood.color ?? "#ffffff"
  const tint: [number, number, number] = [
    parseInt(hex.slice(1, 3), 16) || 255,
    parseInt(hex.slice(3, 5), 16) || 255,
    parseInt(hex.slice(5, 7), 16) || 255,
  ]
  return {
    character: mood.character ?? "cat",
    emote: mood.emote ?? "happy",
    entrance: (mood.entrance ?? "slide-left") as MoodReaction["entrance"],
    holdSeconds: mood.hold_seconds ?? 5,
    after: (mood.after_reaction ?? "leave") as MoodReaction["after"],
    position: (mood.position ?? "bottom-left") as MoodReaction["position"],
    scale: mood.scale ?? 2,
    tint,
    tintStrength: mood.tint_strength ?? 20,
  }
}
