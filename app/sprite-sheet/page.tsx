"use client"

// Dev-only contact sheet: every character x every emote, animating, at both
// the sizes they actually get used at. Reviewing sprites one dropdown at a
// time in the editor is how unreadable art ships.
import { useEffect, useRef } from "react"
import {
  CHARACTERS,
  CHARACTER_GRID_SIZE,
  CHARACTER_MANIFEST,
  drawCharacter,
} from "@/lib/character-sprites"

function Sprite({ characterId, emoteId, px }: { characterId: string; emoteId: string; px: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const ctx = ref.current?.getContext("2d")
    if (!ctx) return
    let raf = 0
    const loop = () => {
      ctx.clearRect(0, 0, CHARACTER_GRID_SIZE, CHARACTER_GRID_SIZE)
      drawCharacter(ctx, characterId, emoteId, 0, 0, 1, performance.now())
      raf = requestAnimationFrame(loop)
    }
    loop()
    return () => cancelAnimationFrame(raf)
  }, [characterId, emoteId])
  return (
    <canvas
      ref={ref}
      width={CHARACTER_GRID_SIZE}
      height={CHARACTER_GRID_SIZE}
      style={{ width: px, height: px, imageRendering: "pixelated", background: "#0a0a0a" }}
    />
  )
}

export default function SpriteSheet() {
  const emotes = CHARACTER_MANIFEST[0].emotes
  return (
    <div className="min-h-screen bg-background p-6 text-foreground">
      <h1 className="mb-1 text-2xl font-bold">Sprite contact sheet</h1>
      <p className="text-muted-foreground mb-6 text-sm">
        {Object.keys(CHARACTERS).length} characters &times; {emotes.length} emotes, shown at 16px (panel scale 1)
        and 48px.
      </p>

      <table className="border-separate border-spacing-2 text-xs">
        <thead>
          <tr>
            <th className="text-left">Character</th>
            {emotes.map((e) => (
              <th key={e.id} className="text-left font-medium">
                {e.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CHARACTER_MANIFEST.map((c) => (
            <tr key={c.id}>
              <td className="pr-2 align-middle font-medium">{c.label}</td>
              {emotes.map((e) => (
                <td key={e.id}>
                  <div className="flex items-end gap-1">
                    <Sprite characterId={c.id} emoteId={e.id} px={48} />
                    <Sprite characterId={c.id} emoteId={e.id} px={16} />
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
