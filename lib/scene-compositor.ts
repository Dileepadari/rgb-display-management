// Canonical scene renderer for the web app: the scene list's static preview
// and the editor's live animated preview both use this, so what you see
// while authoring a scene is a faithful preview of what the firmware will
// show. Animation formulas here MUST match Arduino_code/src/elements.cpp's
// tickAnimations()/renderScene() exactly — see the comment on each case
// below for the paired firmware line.
import type { SceneElement } from "@/lib/scene-schema"
import { drawIcon, ICON_GRID_SIZE } from "@/lib/icons"
import { CHARACTER_GRID_SIZE, drawCharacter } from "@/lib/character-sprites"

export interface AnimRuntime {
  animPhase: number
  lastTickMs: number
}

export function createRuntimeState(count: number): AnimRuntime[] {
  return Array.from({ length: count }, () => ({ animPhase: 0, lastTickMs: 0 }))
}

// Headerless RGB888 dump (see Arduino_code/src/converter.py): width*height*3
// bytes, row-major, no header — not a format <img> can decode, so we read +
// paint it ourselves. (Same routine used in components/scene-editor-complete.tsx.)
export async function decodeRawImage(url: string, width: number, height: number): Promise<ImageData | null> {
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const bytes = new Uint8Array(await res.arrayBuffer())
    if (bytes.length < width * height * 3) return null

    const rgba = new Uint8ClampedArray(width * height * 4)
    for (let i = 0, j = 0; i < width * height; i++, j += 3) {
      rgba[i * 4] = bytes[j]
      rgba[i * 4 + 1] = bytes[j + 1]
      rgba[i * 4 + 2] = bytes[j + 2]
      rgba[i * 4 + 3] = 255
    }
    return new ImageData(rgba, width, height)
  } catch {
    return null
  }
}

export async function fetchWeatherTempC(lat: number, lon: number): Promise<number | null> {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m`,
    )
    if (!res.ok) return null
    const body = await res.json()
    return typeof body?.current?.temperature_2m === "number" ? body.current.temperature_2m : null
  } catch {
    return null
  }
}

// Mirrors elements.cpp's tickAnimations().
// Older stored scenes can predate a schema field (e.g. `animation` was added
// after some scenes were already saved) — GET doesn't re-validate on read,
// so the compositor has to tolerate partial data rather than assume every
// field the current schema requires is actually present.
function getAnimation(el: SceneElement): SceneElement["animation"] {
  return el.animation ?? { type: "none", speed: 0 }
}
function getColor(el: SceneElement): [number, number, number] {
  return el.color ?? [255, 255, 255]
}

export function tickAnimations(elements: SceneElement[], runtime: AnimRuntime[], nowMs: number) {
  elements.forEach((el, i) => {
    const rt = runtime[i]
    if (!rt) return
    const last = rt.lastTickMs === 0 ? nowMs : rt.lastTickMs
    const dtSec = (nowMs - last) / 1000
    rt.lastTickMs = nowMs
    const animation = getAnimation(el)
    if (animation.type !== "none") {
      rt.animPhase += animation.speed * dtSec
    }
  })
}

function hsvToRgb(hueDeg: number): [number, number, number] {
  let h = hueDeg % 360
  if (h < 0) h += 360
  const c = 255
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  let rf = 0,
    gf = 0,
    bf = 0
  if (h < 60) [rf, gf, bf] = [c, x, 0]
  else if (h < 120) [rf, gf, bf] = [x, c, 0]
  else if (h < 180) [rf, gf, bf] = [0, c, x]
  else if (h < 240) [rf, gf, bf] = [0, x, c]
  else if (h < 300) [rf, gf, bf] = [x, 0, c]
  else [rf, gf, bf] = [c, 0, x]
  return [Math.round(rf), Math.round(gf), Math.round(bf)]
}

export interface RenderCaches {
  images: Map<string, ImageData | null>
  weather: Map<string, number | null> // key: "lat,lon"
}

// Mirrors elements.cpp's scrollOffsetX(). The element enters from the right
// edge and wraps once it has travelled its own width past the left edge, so
// every element type scrolls with the same cadence regardless of how its
// width is derived (measured text, stored image width, icon grid × scale).
function scrollOffsetX(baseX: number, contentWidth: number, sceneWidth: number, animPhase: number): number {
  const totalTravel = contentWidth + sceneWidth
  const offset = animPhase % totalTravel
  return baseX + sceneWidth - offset
}

function fontSizeFor(el: SceneElement): number {
  return el.type === "text" || el.type === "scrollText" || el.type === "clock" || el.type === "weather"
    ? el.size * 8
    : 8
}

// Static footprint of an element at its authored position, used for canvas
// hit-testing in the editor. Clock/weather are measured from a representative
// string since their real text changes every tick.
export function elementBounds(
  ctx: CanvasRenderingContext2D,
  el: SceneElement,
): { x: number; y: number; width: number; height: number } {
  const fontSize = fontSizeFor(el)
  ctx.font = `${fontSize}px monospace`
  const box = (width: number, height: number) => ({ x: el.x, y: el.y, width, height })

  switch (el.type) {
    case "text":
    case "scrollText":
      return box(ctx.measureText(el.text).width, fontSize)
    case "image":
      return box(el.width, el.height)
    case "clock":
      return box(ctx.measureText(el.format === "HH:mm:ss" ? "00:00:00" : "00:00").width, fontSize)
    case "weather":
      return box(ctx.measureText("-99C").width, fontSize)
    case "icon":
      return box(ICON_GRID_SIZE * el.scale, ICON_GRID_SIZE * el.scale)
    case "character":
      return box(CHARACTER_GRID_SIZE * el.scale, CHARACTER_GRID_SIZE * el.scale)
  }
}

export function renderScene(
  ctx: CanvasRenderingContext2D,
  sceneWidth: number,
  sceneHeight: number,
  elements: SceneElement[],
  runtime: AnimRuntime[],
  caches: RenderCaches,
  nowMs: number,
) {
  ctx.fillStyle = "#0a0a0a"
  ctx.fillRect(0, 0, sceneWidth, sceneHeight)

  elements.forEach((el, i) => {
    if (el.visible === false) return
    const rt = runtime[i] ?? { animPhase: 0, lastTickMs: 0 }
    const animation = getAnimation(el)

    let [r, g, b] = getColor(el)
    if (animation.type === "rainbow") {
      // elements.cpp: hsvToRgb(el.animPhase, ...) — animPhase accumulates degrees/sec
      ;[r, g, b] = hsvToRgb(rt.animPhase)
    } else if (animation.type === "pulse") {
      // elements.cpp: factor = (sin(phase*2pi)+1)/2 * 0.8 + 0.2
      const factor = ((Math.sin(rt.animPhase * 2 * Math.PI) + 1) / 2) * 0.8 + 0.2
      r = Math.round(r * factor)
      g = Math.round(g * factor)
      b = Math.round(b * factor)
    } else if (animation.type === "blink") {
      // elements.cpp: skip draw when (phase mod 1) > 0.5
      const onPhase = rt.animPhase - Math.floor(rt.animPhase)
      if (onPhase > 0.5) return
    }
    const color = `rgb(${r}, ${g}, ${b})`

    let drawX = el.x
    let drawY = el.y
    if (animation.type === "bounce") {
      drawY += Math.round(Math.sin(rt.animPhase * 2 * Math.PI) * 4)
    }

    const fontSize = fontSizeFor(el)
    ctx.textBaseline = "top"
    ctx.font = `${fontSize}px monospace`

    switch (el.type) {
      case "text": {
        if (animation.type === "scroll") {
          drawX = scrollOffsetX(drawX, ctx.measureText(el.text).width, sceneWidth, rt.animPhase)
        }
        ctx.fillStyle = color
        ctx.fillText(el.text, drawX, drawY)
        break
      }
      case "scrollText": {
        // scrollText scrolls unconditionally — its motion is the element type
        // itself, driven by whatever animation keeps animPhase advancing.
        drawX = scrollOffsetX(drawX, ctx.measureText(el.text).width, sceneWidth, rt.animPhase)
        ctx.fillStyle = color
        ctx.fillText(el.text, drawX, drawY)
        break
      }
      case "image": {
        if (animation.type === "scroll") {
          drawX = scrollOffsetX(drawX, el.width, sceneWidth, rt.animPhase)
        }
        const cached = caches.images.get(el.url)
        if (cached) ctx.putImageData(cached, drawX, drawY)
        else if (!caches.images.has(el.url)) {
          caches.images.set(el.url, null) // mark in-flight so we don't refetch every frame
          decodeRawImage(el.url, el.width, el.height).then((data) => caches.images.set(el.url, data))
        }
        break
      }
      case "clock": {
        const now = new Date()
        const hh = String(now.getHours()).padStart(2, "0")
        const mm = String(now.getMinutes()).padStart(2, "0")
        const ss = String(now.getSeconds()).padStart(2, "0")
        const text = el.format === "HH:mm:ss" ? `${hh}:${mm}:${ss}` : `${hh}:${mm}`
        if (animation.type === "scroll") {
          drawX = scrollOffsetX(drawX, ctx.measureText(text).width, sceneWidth, rt.animPhase)
        }
        ctx.fillStyle = color
        ctx.fillText(text, drawX, drawY)
        break
      }
      case "weather": {
        const key = `${el.lat},${el.lon}`
        const temp = caches.weather.get(key)
        if (temp === undefined) {
          caches.weather.set(key, null)
          fetchWeatherTempC(el.lat, el.lon).then((t) => caches.weather.set(key, t))
        }
        const text = temp == null ? "--" : `${Math.round(temp)}C`
        if (animation.type === "scroll") {
          drawX = scrollOffsetX(drawX, ctx.measureText(text).width, sceneWidth, rt.animPhase)
        }
        ctx.fillStyle = color
        ctx.fillText(text, drawX, drawY)
        break
      }
      case "icon": {
        if (animation.type === "scroll") {
          drawX = scrollOffsetX(drawX, ICON_GRID_SIZE * el.scale, sceneWidth, rt.animPhase)
        }
        drawIcon(ctx, el.id, drawX, drawY, color, el.scale)
        break
      }
      case "character": {
        if (animation.type === "scroll") {
          drawX = scrollOffsetX(drawX, CHARACTER_GRID_SIZE * el.scale, sceneWidth, rt.animPhase)
        }
        // Characters carry their own palette, so the element colour doesn't
        // tint them. Their frame cycling is driven by wall-clock time rather
        // than animPhase, so an idle blink keeps its cadence even when the
        // element also has a scroll/pulse animation running at some other speed.
        drawCharacter(ctx, el.character, el.emote, drawX, drawY, el.scale, nowMs)
        break
      }
    }
  })
}
