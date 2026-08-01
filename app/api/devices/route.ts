import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const createDeviceSchema = z.object({
  name: z.string().min(1),
  device_id: z.string().min(1),
  panel_width: z.number().int().min(1).optional(),
  panel_height: z.number().int().min(1).optional(),
  panel_cols: z.number().int().min(1).max(32).optional(),
  panel_rows: z.number().int().min(1).max(32).optional(),
  panel_unit_size: z.number().int().min(1).max(256).optional(),
  brightness: z.number().int().min(0).max(100).optional(),
  color_mode: z.string().optional(),
  update_interval: z.number().int().min(0).optional(),
  timezone: z.string().optional(),
  thingspeak_channel_id: z.string().optional(),
  thingspeak_read_key: z.string().optional(),
  thingspeak_write_key: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase.from("devices").select("*").eq("user_id", user.id)

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const parsed = createDeviceSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 })

    const { data, error } = await supabase
      .from("devices")
      .insert({
        user_id: user.id,
        ...parsed.data,
      })
      .select()

    if (error) throw error

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
