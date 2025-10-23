import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { z } from 'zod'

const updatePlaylistSchema = z.object({ name: z.string().optional(), description: z.string().optional(), scenes: z.array(z.any()).optional(), loop: z.boolean().optional(), shuffle: z.boolean().optional() })

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const params = await context.params
    const { data, error } = await supabase
      .from("playlists")
      .select("*")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const parsed = updatePlaylistSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 })

    const params = await context.params
    const { data, error } = await supabase
      .from("playlists")
      .update({ ...parsed.data, updated_at: new Date().toISOString() })
      .eq("id", params.id)
      .eq("user_id", user.id)
      .select()

    if (error) throw error

    return NextResponse.json(data[0])
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const params = await context.params
    const { error } = await supabase.from("playlists").delete().eq("id", params.id).eq("user_id", user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
