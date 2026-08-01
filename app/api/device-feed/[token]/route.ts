import { createServiceClient } from "@/lib/supabase/service"
import { NextResponse } from "next/server"

// Token-authenticated content feed for the ESP32 (not a Supabase user session
// - the device can't log in). Returns everything the firmware needs to render
// and animate a scene or playlist entirely on its own: full element list,
// image URLs, and (for playlists) every item's duration. ThingSpeak only ever
// carries the `revision` number that tells the firmware to re-fetch this.
export async function GET(request: Request, context: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await context.params
    if (!token) {
      return NextResponse.json({ error: "Missing device token" }, { status: 400 })
    }

    const supabase = createServiceClient()

    const { data: device, error: deviceError } = await supabase
      .from("devices")
      .select("id, current_revision")
      .eq("device_api_token", token)
      .single()

    if (deviceError || !device) {
      return NextResponse.json({ error: "Unknown device token" }, { status: 404 })
    }

    const { data: assignment, error: assignmentError } = await supabase
      .from("device_assignments")
      .select("target_type, scene_id, playlist_id, revision")
      .eq("device_id", device.id)
      .single()

    if (assignmentError || !assignment) {
      return NextResponse.json({ error: "No content assigned to this device yet" }, { status: 404 })
    }

    if (assignment.target_type === "scene") {
      const { data: scene, error: sceneError } = await supabase
        .from("scenes")
        .select("panel_width, panel_height, elements")
        .eq("id", assignment.scene_id)
        .single()

      if (sceneError || !scene) {
        return NextResponse.json({ error: "Assigned scene not found" }, { status: 404 })
      }

      return NextResponse.json({
        type: "scene",
        revision: assignment.revision,
        scene: {
          width: scene.panel_width,
          height: scene.panel_height,
          elements: scene.elements ?? [],
        },
      })
    }

    // playlist
    const { data: playlist, error: playlistError } = await supabase
      .from("playlists")
      .select("loop, shuffle, scenes")
      .eq("id", assignment.playlist_id)
      .single()

    if (playlistError || !playlist) {
      return NextResponse.json({ error: "Assigned playlist not found" }, { status: 404 })
    }

    const items: { scene_id: string; duration_seconds?: number }[] = Array.isArray(playlist.scenes) ? playlist.scenes : []
    const sceneIds = items.map((i) => i.scene_id).filter(Boolean)

    const { data: scenes, error: scenesError } = sceneIds.length
      ? await supabase.from("scenes").select("id, panel_width, panel_height, elements").in("id", sceneIds)
      : { data: [], error: null }

    if (scenesError) {
      return NextResponse.json({ error: String(scenesError) }, { status: 500 })
    }

    const sceneById = new Map((scenes ?? []).map((s) => [s.id, s]))

    return NextResponse.json({
      type: "playlist",
      revision: assignment.revision,
      playlist: {
        loop: playlist.loop ?? true,
        shuffle: playlist.shuffle ?? false,
        items: items
          .map((item) => {
            const scene = sceneById.get(item.scene_id)
            if (!scene) return null
            return {
              duration: item.duration_seconds ?? 10,
              scene: {
                width: scene.panel_width,
                height: scene.panel_height,
                elements: scene.elements ?? [],
              },
            }
          })
          .filter(Boolean),
      },
    })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
