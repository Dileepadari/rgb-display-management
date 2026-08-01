"use client"

import { useEffect, useRef } from "react"
import { CHARACTER_GRID_SIZE, drawCharacter } from "@/lib/character-sprites"
import { moodFrameState, moodTotalMs, type MoodReaction } from "@/lib/mood-reaction"
import { createRuntimeState, renderScene, tickAnimations, type RenderCaches } from "@/lib/scene-compositor"
import type { SceneElement } from "@/lib/scene-schema"

// Plays a mood reaction the way the panel will: the character enters, performs
// its emote, then stays or leaves - over a mock scene so the tint and the
// "sits on top of your content" behaviour are both visible.
//
// Uses the same lib/mood-reaction.ts lifecycle the firmware mirrors, so what
// you watch here is what the panel does.
export function MoodReactionPreview({
  reaction,
  panelWidth: panelWidthProp,
  panelHeight: panelHeightProp,
  px = 128,
  /** Restart the loop this many ms after a "leave" reaction finishes. */
  replayDelayMs = 900,
  /**
   * The scene this reaction will actually play over. Passing the device's real
   * assigned scene is the point of the preview - you're checking the character
   * doesn't land on your clock. Omitted, a neutral stand-in is drawn instead.
   */
  scene,
}: {
  reaction: MoodReaction
  panelWidth?: number
  panelHeight?: number
  px?: number
  replayDelayMs?: number
  scene?: { width: number; height: number; elements: SceneElement[] } | null
}) {
  // Default to a single 64x64 module when no wall size is known. Passing the
  // real size matters: the canvas is sized in scene pixels, so a 128-wide wall
  // rendered into a 64-wide canvas loses its right half.
  const panelWidth = panelWidthProp ?? 64
  const panelHeight = panelHeightProp ?? 64

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cachesRef = useRef<RenderCaches>({ images: new Map(), weather: new Map() })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const total = moodTotalMs(reaction)
    const loopMs = total === null ? null : total + replayDelayMs
    const start = performance.now()
    const runtime = createRuntimeState(scene?.elements.length ?? 0)
    let raf = 0

    const draw = (now: number) => {
      const sinceStart = now - start
      const elapsed = loopMs === null ? sinceStart : sinceStart % loopMs

      ctx.fillStyle = "#0a0a0a"
      ctx.fillRect(0, 0, panelWidth, panelHeight)

      if (scene && scene.elements.length > 0) {
        // The real content, animating, underneath - so the preview answers
        // "what will my panel look like" rather than "what does this sprite do".
        tickAnimations(scene.elements, runtime, now)
        renderScene(ctx, panelWidth, panelHeight, scene.elements, runtime, cachesRef.current, now)
      } else {
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
  }, [reaction, panelWidth, panelHeight, replayDelayMs, scene])

  // `px` is the width budget; height follows the panel's aspect ratio.
  return (
    <canvas
      ref={canvasRef}
      width={panelWidth}
      height={panelHeight}
      className="rounded-md border border-border"
      style={{
        width: px,
        height: px * (panelHeight / panelWidth),
        imageRendering: "pixelated",
      }}
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
