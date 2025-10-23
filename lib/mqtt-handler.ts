import mqtt, { type MqttClient } from "mqtt"

let client: MqttClient | null = null

export async function initMQTT() {
  if (client) return client

  try {
    const brokerUrl = process.env.NEXT_PUBLIC_MQTT_BROKER || "mqtt://localhost"
    const port = process.env.NEXT_PUBLIC_MQTT_PORT || "1883"

    client = mqtt.connect(`${brokerUrl}:${port}`, {
      clientId: `web-client-${Date.now()}`,
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
    })

    client.on("connect", () => {
      console.log("[MQTT] Connected to broker")
      client?.subscribe("devices/+/status", (err) => {
        if (err) console.error("[MQTT] Subscribe error:", err)
      })
    })

    client.on("message", (topic, message) => {
      console.log(`[MQTT] Message on ${topic}:`, message.toString())
      // Handle incoming messages
      const event = new CustomEvent("mqtt-message", {
        detail: { topic, message: message.toString() },
      })
      window.dispatchEvent(event)
    })

    client.on("error", (err) => {
      console.error("[MQTT] Error:", err)
    })

    client.on("disconnect", () => {
      console.log("[MQTT] Disconnected")
    })

    return client
  } catch (error) {
    console.error("[MQTT] Connection failed:", error)
    return null
  }
}

export function publishMessage(topic: string, message: string) {
  if (!client) {
    console.error("[MQTT] Client not initialized")
    return
  }

  client.publish(topic, message, (err) => {
    if (err) console.error("[MQTT] Publish error:", err)
    else console.log(`[MQTT] Published to ${topic}`)
  })
}

export function subscribeTopic(topic: string) {
  if (!client) {
    console.error("[MQTT] Client not initialized")
    return
  }

  client.subscribe(topic, (err) => {
    if (err) console.error("[MQTT] Subscribe error:", err)
    else console.log(`[MQTT] Subscribed to ${topic}`)
  })
}

export function unsubscribeTopic(topic: string) {
  if (!client) {
    console.error("[MQTT] Client not initialized")
    return
  }

  client.unsubscribe(topic, (err) => {
    if (err) console.error("[MQTT] Unsubscribe error:", err)
    else console.log(`[MQTT] Unsubscribed from ${topic}`)
  })
}

export function closeMQTT() {
  if (client) {
    client.end()
    client = null
  }
}
