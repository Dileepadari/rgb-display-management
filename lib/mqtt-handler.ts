import mqtt from "mqtt"

interface ThingSpeakMQTTConfig {
  channelId: string
  clientId: string
  username: string
  password: string
}

let mqttClient: mqtt.MqttClient | null = null

export async function initMQTT() {
  if (mqttClient) return mqttClient

  try {
    // ThingSpeak WebSocket configuration
    const broker = "wss://mqtt3.thingspeak.com"
    const port = "443" // WebSocket port
    const channelId = process.env.NEXT_PUBLIC_THINGSPEAK_CHANNEL_ID
    const apiKey = process.env.THINGSPEAK_API_KEY

    if (!channelId || !apiKey) {
      throw new Error("ThingSpeak configuration missing")
    }

    const config: ThingSpeakMQTTConfig = {
      channelId,
      clientId: `nextjs_client_${Math.random().toString(16).substring(2, 10)}`,
      username: apiKey,
      password: apiKey,
    }

    const mqttUrl = `${broker}/mqtt`

    mqttClient = mqtt.connect(mqttUrl, {
      clientId: config.clientId,
      username: config.username,
      password: config.password,
      clean: true,
      reconnectPeriod: 10000,
      connectTimeout: 30000,
      keepalive: 60,
      protocol: 'wss',
      rejectUnauthorized: false
    })

    mqttClient.on("connect", () => {
      console.log("[ThingSpeak MQTT] Connected successfully")
      // Subscribe to ThingSpeak channel updates
      const topic = `channels/${config.channelId}/subscribe`
      mqttClient?.subscribe(topic, (err) => {
        if (err) {
          console.error("[ThingSpeak MQTT] Subscribe error:", err)
        } else {
          console.log("[ThingSpeak MQTT] Subscribed to:", topic)
        }
      })
    })

    mqttClient.on("message", (topic, message) => {
      try {
        const data = JSON.parse(message.toString())
        console.log("[ThingSpeak MQTT] Received update:", data)
        // Dispatch event for components to listen to
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("thingspeak-update", {
              detail: data,
            })
          )
        }
      } catch (error) {
        console.error("[ThingSpeak MQTT] Message parse error:", error)
      }
    })

    mqttClient.on("error", (err) => {
      console.error("[ThingSpeak MQTT] Error:", err)
    })

    mqttClient.on("close", () => {
      console.log("[ThingSpeak MQTT] Connection closed")
    })

    return mqttClient
  } catch (error) {
    console.error("[ThingSpeak MQTT] Setup failed:", error)
    return null
  }
}

export function publishToThingSpeak(fieldValues: Record<string, number | string>) {
  if (!mqttClient?.connected) {
    console.error("[ThingSpeak MQTT] Not connected")
    return false
  }

  const channelId = process.env.NEXT_PUBLIC_THINGSPEAK_CHANNEL_ID
  if (!channelId) {
    console.error("[ThingSpeak MQTT] Channel ID not configured")
    return false
  }

  try {
    const topic = `channels/${channelId}/publish`
    mqttClient.publish(topic, JSON.stringify(fieldValues))
    console.log("[ThingSpeak MQTT] Published:", fieldValues)
    return true
  } catch (error) {
    console.error("[ThingSpeak MQTT] Publish failed:", error)
    return false
  }
}

export function closeMQTT() {
  if (mqttClient?.connected) {
    mqttClient.end(false, () => {
      console.log("[ThingSpeak MQTT] Disconnected")
      mqttClient = null
    })
  }
}
