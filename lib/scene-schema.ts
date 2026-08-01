import { z } from "zod"

// Single source of truth for the scene element shape. Matches
// Arduino_code/include/elements.h's parseElement() field-for-field - if you
// add a field here, add it there too (and to lib/icon-manifest.ts for icons).

export const animationSchema = z.object({
  type: z.enum(["none", "scroll", "blink", "pulse", "rainbow", "bounce"]).default("none"),
  speed: z.number().default(0),
})

const baseElement = {
  x: z.number().int(),
  y: z.number().int(),
  color: z.tuple([z.number().int().min(0).max(255), z.number().int().min(0).max(255), z.number().int().min(0).max(255)]).default([255, 255, 255]),
  visible: z.boolean().default(true),
  animation: animationSchema.default({ type: "none", speed: 0 }),
}

export const textElementSchema = z.object({
  type: z.literal("text"),
  ...baseElement,
  text: z.string().min(1),
  // .catch() rather than a hard bound: old data using a different size
  // convention (e.g. pixel-ish values like 11) should fall back to a sane
  // default instead of invalidating - and silently dropping - the whole element.
  size: z.number().int().min(1).max(6).catch(2),
})

export const scrollTextElementSchema = z.object({
  type: z.literal("scrollText"),
  ...baseElement,
  text: z.string().min(1),
  // .catch() rather than a hard bound: old data using a different size
  // convention (e.g. pixel-ish values like 11) should fall back to a sane
  // default instead of invalidating - and silently dropping - the whole element.
  size: z.number().int().min(1).max(6).catch(2),
})

export const imageElementSchema = z.object({
  type: z.literal("image"),
  ...baseElement,
  url: z.string().url(),
  width: z.number().int().min(1),
  height: z.number().int().min(1),
})

export const clockElementSchema = z.object({
  type: z.literal("clock"),
  ...baseElement,
  format: z.enum(["HH:mm", "HH:mm:ss"]).default("HH:mm"),
  // .catch() rather than a hard bound: old data using a different size
  // convention (e.g. pixel-ish values like 11) should fall back to a sane
  // default instead of invalidating - and silently dropping - the whole element.
  size: z.number().int().min(1).max(6).catch(2),
})

export const weatherElementSchema = z.object({
  type: z.literal("weather"),
  ...baseElement,
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
  // .catch() rather than a hard bound: old data using a different size
  // convention (e.g. pixel-ish values like 11) should fall back to a sane
  // default instead of invalidating - and silently dropping - the whole element.
  size: z.number().int().min(1).max(6).catch(2),
})

export const iconElementSchema = z.object({
  type: z.literal("icon"),
  ...baseElement,
  id: z.enum(["dot", "ring", "cross", "triangle", "square"]),
  scale: z.number().int().min(1).max(8).default(1),
})

// Animated pixel character. `character` and `emote` are ids from
// lib/character-sprites.ts, which Arduino_code/include/characters.h mirrors -
// unknown ids fall back rather than invalidating the element, so a sprite set
// that gains entries on one side can't drop saved scenes on the other.
export const characterElementSchema = z.object({
  type: z.literal("character"),
  ...baseElement,
  character: z.enum(["cat", "dog", "person", "robot"]).catch("cat"),
  emote: z.enum(["idle", "happy", "sad", "wave", "sleep"]).catch("idle"),
  scale: z.number().int().min(1).max(8).default(1),
})

export const sceneElementSchema = z.discriminatedUnion("type", [
  textElementSchema,
  scrollTextElementSchema,
  imageElementSchema,
  clockElementSchema,
  weatherElementSchema,
  iconElementSchema,
  characterElementSchema,
])

export type SceneElement = z.infer<typeof sceneElementSchema>

export const sceneContentSchema = z.object({
  width: z.number().int().min(1).max(1024),
  height: z.number().int().min(1).max(1024),
  elements: z.array(sceneElementSchema).max(12), // keep in sync with Arduino_code/include/elements.h's MAX_ELEMENTS
})

export type SceneContent = z.infer<typeof sceneContentSchema>

// Fills in defaults (animation, color, visible) for elements saved before
// those fields existed, and drops anything that doesn't parse at all. Use
// this whenever reading `elements` from the DB for editing/rendering -
// GET responses aren't re-validated, so older rows can be missing fields
// the current schema assumes are always present.
export function normalizeSceneElements(raw: unknown[]): SceneElement[] {
  const out: SceneElement[] = []
  for (const item of raw) {
    const parsed = sceneElementSchema.safeParse(item)
    if (parsed.success) out.push(parsed.data)
  }
  return out
}
