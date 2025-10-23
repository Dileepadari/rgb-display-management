import { type NextRequest, NextResponse } from "next/server"

interface ThingSpeakData {
  channel_id: string
  field1?: string
  field2?: string
  field3?: string
  field4?: string
  field5?: string
  field6?: string
  field7?: string
  field8?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ThingSpeakData = await request.json()
    const { channel_id } = body

    if (!channel_id) {
      return NextResponse.json({ error: "Channel ID required" }, { status: 400 })
    }

    // Validate ThingSpeak API key from environment
    const thingSpeakApiKey = process.env.THINGSPEAK_API_KEY
    if (!thingSpeakApiKey) {
      return NextResponse.json({ error: "ThingSpeak API key not configured" }, { status: 500 })
    }

    // Prepare data for ThingSpeak
    const thingSpeakData = new URLSearchParams()
    thingSpeakData.append("api_key", thingSpeakApiKey)

    // Map fields
    for (let i = 1; i <= 8; i++) {
      const fieldKey = `field${i}` as keyof ThingSpeakData
      if (body[fieldKey]) {
        thingSpeakData.append(`field${i}`, String(body[fieldKey]))
      }
    }

    // Send to ThingSpeak
    const response = await fetch("https://api.thingspeak.com/update", {
      method: "POST",
      body: thingSpeakData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })

    if (!response.ok) {
      throw new Error(`ThingSpeak API error: ${response.statusText}`)
    }

    const result = await response.text()

    return NextResponse.json({
      success: true,
      entryId: result,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("ThingSpeak sync error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Sync failed" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const channelId = request.nextUrl.searchParams.get("channel_id")
    const thingSpeakApiKey = process.env.THINGSPEAK_API_KEY

    if (!channelId || !thingSpeakApiKey) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 })
    }

    const response = await fetch(
      `https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${thingSpeakApiKey}&results=1`,
    )

    if (!response.ok) {
      throw new Error(`ThingSpeak API error: ${response.statusText}`)
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      data: data.feeds?.[0] || null,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("ThingSpeak fetch error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Fetch failed" }, { status: 500 })
  }
}
