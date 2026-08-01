import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

// Mirrors scripts/006_mood_reactions.sql's CHECK constraints and
// lib/mood-reaction.ts's vocabularies - the firmware only implements these.
const createMoodSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  color: z.string().min(1),
  character: z.enum(["cat", "dog", "bunny", "person", "robot", "bird", "ghost", "alien"]).default("cat"),
  emote: z.enum(["idle", "happy", "sad", "wave", "sleep", "love", "angry", "dance", "think"]).default("happy"),
  entrance: z.enum(["slide-left", "slide-right", "drop", "fade", "pop"]).default("slide-left"),
  hold_seconds: z.number().int().min(1).max(300).default(5),
  after_reaction: z.enum(["stay", "leave"]).default("leave"),
  position: z.enum(["bottom-left", "bottom-right", "top-left", "top-right", "center"]).default("bottom-left"),
  scale: z.number().int().min(1).max(8).default(2),
  tint_strength: z.number().int().min(0).max(100).default(20),
  is_custom: z.boolean().optional(),
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

    const { data, error } = await supabase.from("moods").select("*").eq("user_id", user.id)

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
    const parsed = createMoodSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 })

    const { data, error } = await supabase
      .from("moods")
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
