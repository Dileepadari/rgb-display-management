import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const params = await context.params
    const { data, error } = await supabase.from('moods').select('*').eq('id', params.id).eq('user_id', user.id).single()
    if (error) throw error
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

// Same vocabularies as the create schema; every field optional so the editor
// can PATCH a single property.
const moodUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  color: z.string().optional(),
  character: z.enum(["cat", "dog", "bunny", "person", "robot", "bird", "ghost", "alien"]).optional(),
  emote: z.enum(["idle", "happy", "sad", "wave", "sleep", "love", "angry", "dance", "think"]).optional(),
  entrance: z.enum(["slide-left", "slide-right", "drop", "fade", "pop"]).optional(),
  hold_seconds: z.number().int().min(1).max(300).optional(),
  after_reaction: z.enum(["stay", "leave"]).optional(),
  position: z.enum(["bottom-left", "bottom-right", "top-left", "top-right", "center"]).optional(),
  scale: z.number().int().min(1).max(8).optional(),
  tint_strength: z.number().int().min(0).max(100).optional(),
})

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json()
    const parsed = moodUpdateSchema.parse(body)

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const params = await context.params
    const { data, error } = await supabase.from('moods').update({ ...parsed, updated_at: new Date().toISOString() }).eq('id', params.id).eq('user_id', user.id).select()
    if (error) throw error
    return NextResponse.json(data[0])
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.errors }, { status: 400 })
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const params = await context.params
    const { error } = await supabase.from('moods').delete().eq('id', params.id).eq('user_id', user.id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
