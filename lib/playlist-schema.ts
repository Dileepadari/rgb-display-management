import { z } from "zod"

// Matches /api/device-feed/[token]'s expectation (item.scene_id, item.duration_seconds).
export const playlistItemSchema = z.object({
  scene_id: z.string().uuid(),
  duration_seconds: z.number().int().min(1).max(3600).default(10),
})

export type PlaylistItem = z.infer<typeof playlistItemSchema>

// Matches MAX_PLAYLIST_ITEMS in Arduino_code/include/elements.h. The firmware
// holds the whole playlist in RAM so it can rotate without re-fetching, which
// bounds how many scenes it can carry. Enforcing the same cap here means the
// editor can't build a playlist the panel would silently truncate.
export const MAX_PLAYLIST_ITEMS = 12

export const playlistItemsSchema = z.array(playlistItemSchema).max(MAX_PLAYLIST_ITEMS)
