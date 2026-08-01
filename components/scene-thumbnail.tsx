"use client"

import { useEffect, useRef } from "react"

import type { SceneElement } from "@/lib/scene-schema"
import {
  createRuntimeState,
  renderScene,
  tickAnimations,
  type AnimRuntime,
  type RenderCaches,
} from "@/lib/scene-compositor"

// Small animated preview of a scene, driven by the same compositor the editor
// and the firmware agree on. Used for dashboard device tiles and the scene
// template gallery.
export function SceneThumbnail({
  width,
  height,
  elements,
  className,
  animated = true,
  fit = "width",
}: {
  width: number
  height: number
  elements: SceneElement[]
  className?: string
  animated?: boolean
  /**
   * "width" fills the container and lets height follow the wall's shape.
   * "contain" fits inside a fixed-height box instead, so a 1x1 wall and a
   * 4x1 wall produce cards of the same height in a list.
   */
  fit?: "width" | "contain"
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const runtimeRef = useRef<AnimRuntime[]>(createRuntimeState(elements.length))
  const cachesRef = useRef<RenderCaches>({ images: new Map(), weather: new Map() })

  useEffect(() => {
    if (runtimeRef.current.length !== elements.length) {
      runtimeRef.current = createRuntimeState(elements.length)
    }
  }, [elements.length])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    if (!animated) {
      renderScene(ctx, width, height, elements, runtimeRef.current, cachesRef.current, performance.now())
      return
    }

    let rafId: number
    const frame = (now: number) => {
      tickAnimations(elements, runtimeRef.current, now)
      renderScene(ctx, width, height, elements, runtimeRef.current, cachesRef.current, now)
      rafId = requestAnimationFrame(frame)
    }
    rafId = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(rafId)
  }, [elements, width, height, animated])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
      style={
        fit === "contain"
          ? {
              maxWidth: "100%",
              maxHeight: "100%",
              height: "100%",
              width: "auto",
              aspectRatio: `${width} / ${height}`,
              imageRendering: "pixelated",
            }
          : {
              width: "100%",
              aspectRatio: `${width} / ${height}`,
              imageRendering: "pixelated",
            }
      }
    />
  )
}
