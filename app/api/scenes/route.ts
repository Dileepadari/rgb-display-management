import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { sceneElementSchema } from "@/lib/scene-schema"

const createSceneSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  panel_width: z.number().int().min(1).optional(),
  panel_height: z.number().int().min(1).optional(),
  elements: z.array(sceneElementSchema).max(12).optional(),
  thumbnail: z.string().optional(),
  is_active: z.boolean().optional(),
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

    const { data, error } = await supabase.from("scenes").select("*").eq("user_id", user.id)

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
    const parsed = createSceneSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 })

    const { data, error } = await supabase
      .from("scenes")
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
