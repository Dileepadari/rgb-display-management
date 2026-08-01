"use client"

import { useEffect, useRef } from "react"
import { CHARACTER_GRID_SIZE, drawCharacter } from "@/lib/character-sprites"

export type MascotState = "idle" | "happy" | "sleep" | "sad" | "wave" | "think"

/**
 * One of the panel's own characters, living in the app chrome and reacting to
 * what's actually happening - asleep when every panel is offline, waving when
 * something's live. It's the same sprite renderer the panels use, so the app
 * and the hardware share a personality instead of the app being a generic
 * control surface bolted onto them.
 */
export function Mascot({
  state = "idle",
  character = "cat",
  px = 64,
  className,
}: {
  state?: MascotState
  character?: string
  px?: number
  className?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      ctx.clearRect(0, 0, CHARACTER_GRID_SIZE, CHARACTER_GRID_SIZE)
      drawCharacter(ctx, character, state, 0, 0, 1, 0)
      return
    }

    let raf = 0
    const loop = () => {
      ctx.clearRect(0, 0, CHARACTER_GRID_SIZE, CHARACTER_GRID_SIZE)
      drawCharacter(ctx, character, state, 0, 0, 1, performance.now())
      raf = requestAnimationFrame(loop)
    }
    loop()
    return () => cancelAnimationFrame(raf)
  }, [state, character])

  return (
    <canvas
      ref={canvasRef}
      width={CHARACTER_GRID_SIZE}
      height={CHARACTER_GRID_SIZE}
      aria-hidden
      className={className}
      style={{ width: px, height: px, imageRendering: "pixelated" }}
    />
  )
}
