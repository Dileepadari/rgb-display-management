import { createServiceClient } from "@/lib/supabase/service"
import { NextResponse } from "next/server"

const ONLINE_THRESHOLD_MS = 5 * 60 * 1000 // no heartbeat in 5 min => considered offline

// Polls each device's own ThingSpeak channel for its periodic heartbeat
// (field3, written by the firmware's sendHeartbeat()) and syncs
// devices.is_online / last_sync + a telemetry row.
//
// This is NOT wired to a Vercel Cron — the plan's cron allowance is limited, so
// it's driven by an external scheduler instead (see DEVDOC.md §8). Call it
// every ~5 minutes to match ONLINE_THRESHOLD_MS below. Protected by
// CRON_SECRET because it has to skip the normal user-session gate (proxy.ts)
// to be callable by something that isn't a logged-in browser.
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = createServiceClient()
  const { data: devices, error } = await supabase
    .from("devices")
    .select("id, user_id, name, is_online, thingspeak_channel_id, thingspeak_read_key")
    .not("thingspeak_channel_id", "is", null)
    .not("thingspeak_read_key", "is", null)

  if (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }

  const results = await Promise.all(
    (devices ?? []).map(async (device) => {
      try {
        const url = `https://api.thingspeak.com/channels/${device.thingspeak_channel_id}/fields/3/last.json?api_key=${device.thingspeak_read_key}`
        const res = await fetch(url)
        if (!res.ok) return { device: device.id, ok: false }

        const body = await res.json()
        const field3: string | null = body?.field3 ?? null
        const createdAt: Date | null = body?.created_at ? new Date(body.created_at) : null
        const isOnline = !!field3 && !!createdAt && Date.now() - createdAt.getTime() < ONLINE_THRESHOLD_MS

        await supabase
          .from("devices")
          .update({ is_online: isOnline, last_sync: createdAt?.toISOString() ?? null })
          .eq("id", device.id)

        // This cron rewrites is_online on every poll, so compare against the
        // value we just read to log the transition rather than every check.
        if (isOnline !== device.is_online) {
          await supabase.from("activity_log").insert({
            user_id: device.user_id,
            type: isOnline ? "device_online" : "device_offline",
            message: `${device.name} went ${isOnline ? "online" : "offline"}`,
            device_id: device.id,
          })
        }

        if (field3 && createdAt) {
          const uptimeMatch = field3.match(/up:(\d+)s/)
          const rssiMatch = field3.match(/rssi:(-?\d+)/)
          await supabase.from("telemetry").insert({
            user_id: device.user_id,
            device_id: device.id,
            uptime: uptimeMatch ? Number.parseInt(uptimeMatch[1], 10) : null,
            signal_strength: rssiMatch ? Number.parseInt(rssiMatch[1], 10) : null,
          })
        }

        return { device: device.id, ok: true, online: isOnline }
      } catch (err) {
        return { device: device.id, ok: false, error: String(err) }
      }
    }),
  )

  return NextResponse.json({ checked: results.length, results })
}
