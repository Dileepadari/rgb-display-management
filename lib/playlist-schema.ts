import { z } from "zod"

// Matches /api/device-feed/[token]'s expectation (item.scene_id, item.duration_seconds).
export const playlistItemSchema = z.object({
  scene_id: z.string().uuid(),
  duration_seconds: z.number().int().min(1).max(3600).default(10),
})

export type PlaylistItem = z.infer<typeof playlistItemSchema>
