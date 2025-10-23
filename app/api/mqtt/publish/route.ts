import { NextResponse } from 'next/server'
import { publishToDevice } from '@/lib/supabase/mqtt-server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const publishSchema = z.object({ deviceId: z.string().min(1), command: z.any() })

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const parsed = publishSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 })

  const { deviceId, command } = parsed.data
  const topic = `devices/${deviceId}/command`
  const ok = publishToDevice(topic, JSON.stringify(command))
  if (!ok) return NextResponse.json({ error: 'publish_failed' }, { status: 500 })

  return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
