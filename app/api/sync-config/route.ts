import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Sensitive values like API keys are kept server-side only
    return NextResponse.json({
      mqttBroker: process.env.NEXT_PUBLIC_MQTT_BROKER || "mqtt.example.com",
      mqttPort: Number.parseInt(process.env.NEXT_PUBLIC_MQTT_PORT || "8883"),
      syncInterval: Number.parseInt(process.env.NEXT_PUBLIC_SYNC_INTERVAL || "5000"),
      thingSpeakChannelId: process.env.NEXT_PUBLIC_THINGSPEAK_CHANNEL_ID || "",
      // API key is NOT returned to client
    })
  } catch (error) {
    console.error("Config fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch config" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Only allow updating non-sensitive fields
    const allowedFields = ["mqttBroker", "mqttPort", "syncInterval"]
    const updates: Record<string, unknown> = {}

    for (const field of allowedFields) {
      if (field in body) {
        updates[field] = body[field]
      }
    }

    // In a real implementation, you would save this to a database
    // For now, we just validate and return success
    return NextResponse.json({
      success: true,
      message: "Configuration updated (server-side only)",
      updated: updates,
    })
  } catch (error) {
    console.error("Config update error:", error)
    return NextResponse.json({ error: "Failed to update config" }, { status: 500 })
  }
}
