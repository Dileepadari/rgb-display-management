import { createClient } from "@/lib/supabase/server"
import { pushRevision } from "@/lib/thingspeak"
import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

// Applying a mood is a real push, exactly like assigning a scene: it records
// the mood on the device's assignment, bumps the revision, and flips the
// ThingSpeak flag so the panel re-fetches. Previously "apply mood" only wrote
// a device_moods row that nothing read, so the panel never saw it.
const applyMoodSchema = z.object({ mood_id: z.string().uuid() })

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id: deviceId } = await context.params
    const body = await request.json()
    const parsed = applyMoodSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 })

    const { data: device, error: deviceError } = await supabase
      .from("devices")
      .select("id, name, current_revision, thingspeak_write_key")
      .eq("id", deviceId)
      .eq("user_id", user.id)
      .single()
    if (deviceError || !device) return NextResponse.json({ error: "Device not found" }, { status: 404 })

    const { data: mood, error: moodError } = await supabase
      .from("moods")
      .select("id, name")
      .eq("id", parsed.data.mood_id)
      .eq("user_id", user.id)
      .single()
    if (moodError || !mood) return NextResponse.json({ error: "Mood not found" }, { status: 404 })

    // A mood layers on top of existing content, so there must be content to
    // layer onto — otherwise the character would perform over a black panel.
    const { data: assignment } = await supabase
      .from("device_assignments")
      .select("device_id")
      .eq("device_id", deviceId)
      .maybeSingle()
    if (!assignment) {
      return NextResponse.json(
        { error: "Assign a scene or playlist to this device first — a mood plays on top of what's already showing." },
        { status: 409 },
      )
    }

    const nextRevision = device.current_revision + 1

    const { error: updateError } = await supabase
      .from("device_assignments")
      .update({
        active_mood_id: mood.id,
        // The firmware measures the entrance/hold/exit lifecycle from here.
        mood_started_at: new Date().toISOString(),
        revision: nextRevision,
        updated_at: new Date().toISOString(),
      })
      .eq("device_id", deviceId)
    if (updateError) throw updateError

    const { error: revisionError } = await supabase
      .from("devices")
      .update({ current_revision: nextRevision })
      .eq("id", deviceId)
    if (revisionError) throw revisionError

    const pushed = await pushRevision(device.thingspeak_write_key, nextRevision)

    await supabase.from("device_moods").insert({ user_id: user.id, device_id: deviceId, mood_id: mood.id })
    await supabase.from("activity_log").insert({
      user_id: user.id,
      type: "mood",
      message: `Sent mood "${mood.name}" to ${device.name}`,
      device_id: deviceId,
    })

    return NextResponse.json({
      success: true,
      revision: nextRevision,
      thingspeak_notified: pushed,
      ...(pushed
        ? {}
        : {
            warning:
              "Saved, but couldn't notify the device over ThingSpeak (no/invalid write key?). It'll pick up the change on its next poll if connectivity is the issue.",
          }),
    })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

// Clearing a mood is also a revision bump — the panel needs to be told to stop
// drawing the character, not just left to time out.
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id: deviceId } = await context.params

    const { data: device, error: deviceError } = await supabase
      .from("devices")
      .select("id, name, current_revision, thingspeak_write_key")
      .eq("id", deviceId)
      .eq("user_id", user.id)
      .single()
    if (deviceError || !device) return NextResponse.json({ error: "Device not found" }, { status: 404 })

    const nextRevision = device.current_revision + 1

    const { error: updateError } = await supabase
      .from("device_assignments")
      .update({
        active_mood_id: null,
        mood_started_at: null,
        revision: nextRevision,
        updated_at: new Date().toISOString(),
      })
      .eq("device_id", deviceId)
    if (updateError) throw updateError

    await supabase.from("devices").update({ current_revision: nextRevision }).eq("id", deviceId)
    const pushed = await pushRevision(device.thingspeak_write_key, nextRevision)

    await supabase.from("activity_log").insert({
      user_id: user.id,
      type: "mood_cleared",
      message: `Cleared the mood on ${device.name}`,
      device_id: deviceId,
    })

    return NextResponse.json({ success: true, revision: nextRevision, thingspeak_notified: pushed })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
