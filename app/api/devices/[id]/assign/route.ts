import { createClient } from "@/lib/supabase/server"
import { pushRevision } from "@/lib/thingspeak"
import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const assignSchema = z.discriminatedUnion("target_type", [
  z.object({ target_type: z.literal("scene"), scene_id: z.string().uuid() }),
  z.object({ target_type: z.literal("playlist"), playlist_id: z.string().uuid() }),
])

// Assigns a scene or playlist to a device: this is the entire "push" action.
// No image encoding or payload building happens here — images were already
// converted to raw pixels and uploaded when the scene was authored. This
// route just records the assignment, bumps the device's revision counter,
// and flips the ThingSpeak flag so the ESP32 knows to re-fetch.
export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id: deviceId } = await context.params
    const body = await request.json()
    const parsed = assignSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 })

    const { data: device, error: deviceError } = await supabase
      .from("devices")
      .select("id, name, current_revision, thingspeak_write_key")
      .eq("id", deviceId)
      .eq("user_id", user.id)
      .single()

    if (deviceError || !device) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 })
    }

    const nextRevision = device.current_revision + 1

    const assignmentRow =
      parsed.data.target_type === "scene"
        ? { target_type: "scene" as const, scene_id: parsed.data.scene_id, playlist_id: null }
        : { target_type: "playlist" as const, playlist_id: parsed.data.playlist_id, scene_id: null }

    const { error: upsertError } = await supabase.from("device_assignments").upsert(
      {
        user_id: user.id,
        device_id: deviceId,
        ...assignmentRow,
        revision: nextRevision,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "device_id" },
    )
    if (upsertError) throw upsertError

    const { error: revisionError } = await supabase
      .from("devices")
      .update({ current_revision: nextRevision })
      .eq("id", deviceId)
    if (revisionError) throw revisionError

    const pushed = await pushRevision(device.thingspeak_write_key, nextRevision)

    const targetName =
      parsed.data.target_type === "scene"
        ? (await supabase.from("scenes").select("name").eq("id", parsed.data.scene_id).single()).data?.name
        : (await supabase.from("playlists").select("name").eq("id", parsed.data.playlist_id).single()).data?.name

    await supabase.from("activity_log").insert({
      user_id: user.id,
      type: "assign",
      message: `Assigned ${parsed.data.target_type} "${targetName ?? "unknown"}" to ${device.name} (revision ${nextRevision})`,
      device_id: deviceId,
      scene_id: assignmentRow.scene_id,
      playlist_id: assignmentRow.playlist_id,
    })

    return NextResponse.json({
      success: true,
      revision: nextRevision,
      thingspeak_notified: pushed,
      ...(pushed ? {} : { warning: "Saved, but couldn't notify the device over ThingSpeak (no/invalid write key?). It'll pick up the change on its next poll if connectivity is the issue." }),
    })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
