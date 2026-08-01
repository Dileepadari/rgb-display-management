import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// What each of the user's devices is currently showing. The firmware reads
// the same rows through /api/device-feed/[token]; this is the session-auth
// view of it, used by the dashboard to render a live thumbnail per device.
export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("device_assignments")
      .select("device_id, target_type, scene_id, playlist_id, revision, active_mood_id, mood_started_at")
      .eq("user_id", user.id)

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
