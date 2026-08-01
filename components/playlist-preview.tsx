"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { createRuntimeState, renderScene, tickAnimations, type RenderCaches } from "@/lib/scene-compositor"
import type { SceneElement } from "@/lib/scene-schema"

export interface PlaylistPreviewItem {
  sceneName: string
  durationSeconds: number
  width: number
  height: number
  elements: SceneElement[]
}

/**
 * Runs a playlist the way the panel will: each scene animating for its own
 * duration, then advancing, honouring loop and shuffle.
 *
 * A still thumbnail can't show what a playlist *is* — the rotation and the
 * timing are the whole point of the feature, so the preview performs them.
 */
export function PlaylistPreview({
  items,
  loop = true,
  shuffle = false,
  px = 200,
}: {
  items: PlaylistPreviewItem[]
  loop?: boolean
  shuffle?: boolean
  px?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cachesRef = useRef<RenderCaches>({ images: new Map(), weather: new Map() })
  const [index, setIndex] = useState(0)

  // Shuffle is resolved once per pass rather than per advance, so a scene
  // can't repeat back-to-back the way independent random picks would allow.
  // Derived during render rather than stashed in a ref: a ref read at render
  // time isn't safe under concurrent rendering, and this needs no reset effect
  // because `index` is taken modulo the order's length below.
  const order = useMemo(() => {
    const next = items.map((_, i) => i)
    if (shuffle) {
      for (let i = next.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[next[i], next[j]] = [next[j], next[i]]
      }
    }
    return next
  }, [items, shuffle])

  const position = order.length > 0 ? index % order.length : 0
  const current = items[order[position] ?? 0]

  // Advance on the current scene's own duration.
  useEffect(() => {
    if (items.length <= 1 || !current) return
    const atEnd = position >= items.length - 1
    if (atEnd && !loop) return

    const timer = setTimeout(
      () => setIndex((i) => i + 1),
      Math.max(1, current.durationSeconds) * 1000,
    )
    return () => clearTimeout(timer)
  }, [position, items.length, loop, current])

  // Render loop for whichever scene is showing.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !current) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const runtime = createRuntimeState(current.elements.length)
    let raf = 0
    const draw = (now: number) => {
      tickAnimations(current.elements, runtime, now)
      renderScene(ctx, current.width, current.height, current.elements, runtime, cachesRef.current, now)
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [current])

  if (items.length === 0) {
    return (
      <div
        className="text-muted-foreground flex items-center justify-center rounded-md border border-dashed border-border text-xs"
        style={{ width: px, height: px }}
      >
        No scenes yet
      </div>
    )
  }

  // `px` is the width budget; height follows the wall's real aspect ratio so a
  // 2-panel-wide scene renders wide instead of being squashed into a square.
  const aspect = (current?.width ?? 64) / (current?.height ?? 64)

  return (
    <div className="space-y-1.5" style={{ width: px }}>
      <div className="scanlines relative overflow-hidden rounded-md border border-border bg-black">
        <canvas
          ref={canvasRef}
          width={current?.width ?? 64}
          height={current?.height ?? 64}
          style={{ width: px, height: px / aspect, imageRendering: "pixelated", display: "block" }}
        />
      </div>
      <div className="flex items-center justify-between gap-2">
        <p className="text-muted-foreground truncate text-[11px]">{current?.sceneName}</p>
        <p className="text-muted-foreground shrink-0 font-mono text-[11px]">
          {position + 1}/{items.length}
        </p>
      </div>
      {/* Progress pips double as a map of the rotation. */}
      <div className="flex gap-1">
        {items.map((item, i) => (
          <span
            key={i}
            title={`${item.sceneName} — ${item.durationSeconds}s`}
            className={`h-1 flex-1 rounded-full transition-colors ${i === position ? "bg-primary" : "bg-border"}`}
          />
        ))}
      </div>
    </div>
  )
}
