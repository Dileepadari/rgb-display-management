interface MQTTConfig {
  broker: string
  port: number
  username?: string
  password?: string
  clientId: string
}

interface MQTTMessage {
  topic: string
  payload: string
  timestamp: number
}

interface DeviceCommand {
  deviceId: string
  command: string
  params?: Record<string, unknown>
}

class MQTTClientManager {
  private config: MQTTConfig | null = null
  private connected = false
  private messageHandlers: Map<string, (message: MQTTMessage) => void> = new Map()
  private messageQueue: MQTTMessage[] = []
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 3000

  configure(config: MQTTConfig) {
    this.config = config
    console.log("[v0] MQTT configured:", { broker: config.broker, port: config.port })
  }

  async connect(): Promise<boolean> {
    if (!this.config) {
      console.error("[v0] MQTT not configured")
      return false
    }

    try {
      // Simulate MQTT connection with WebSocket
      const wsProtocol = this.config.port === 8883 ? "wss" : "ws"
      const wsUrl = `${wsProtocol}://${this.config.broker}:${this.config.port}/mqtt`

      console.log("[v0] Attempting MQTT connection to:", wsUrl)

      // In production, use mqtt.js library
      // For now, simulate successful connection
      this.connected = true
      this.reconnectAttempts = 0

      // Process queued messages
      this.processQueue()

      console.log("[v0] MQTT connected successfully")
      return true
    } catch (error) {
      console.error("[v0] MQTT connection failed:", error)
      this.attemptReconnect()
      return false
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(`[v0] Reconnecting... Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`)
      setTimeout(() => this.connect(), this.reconnectDelay * this.reconnectAttempts)
    }
  }

  async disconnect(): Promise<void> {
    this.connected = false
    console.log("[v0] MQTT disconnected")
  }

  subscribe(topic: string, handler: (message: MQTTMessage) => void) {
    this.messageHandlers.set(topic, handler)
    console.log("[v0] Subscribed to topic:", topic)
  }

  unsubscribe(topic: string) {
    this.messageHandlers.delete(topic)
    console.log("[v0] Unsubscribed from topic:", topic)
  }

  async publish(topic: string, payload: string): Promise<boolean> {
    if (!this.connected) {
      console.warn("[v0] MQTT not connected, queuing message for topic:", topic)
      this.messageQueue.push({
        topic,
        payload,
        timestamp: Date.now(),
      })
      return false
    }

    try {
      const message: MQTTMessage = {
        topic,
        payload,
        timestamp: Date.now(),
      }

      // Trigger handlers for this topic
      const handler = this.messageHandlers.get(topic)
      if (handler) {
        handler(message)
      }

      console.log("[v0] Published to topic:", topic, "payload:", payload)
      return true
    } catch (error) {
      console.error("[v0] MQTT publish failed:", error)
      return false
    }
  }

  async publishCommand(command: DeviceCommand): Promise<boolean> {
    const topic = `devices/${command.deviceId}/command`
    const payload = JSON.stringify({
      command: command.command,
      params: command.params || {},
      timestamp: Date.now(),
    })
    return this.publish(topic, payload)
  }

  private processQueue() {
    while (this.messageQueue.length > 0 && this.connected) {
      const message = this.messageQueue.shift()
      if (message) {
        this.publish(message.topic, message.payload)
      }
    }
  }

  isConnected(): boolean {
    return this.connected
  }

  getQueuedMessages(): MQTTMessage[] {
    return this.messageQueue
  }

  clearQueue() {
    this.messageQueue = []
  }

  getConnectionStatus() {
    return {
      connected: this.connected,
      reconnectAttempts: this.reconnectAttempts,
      queuedMessages: this.messageQueue.length,
    }
  }
}

export const mqttClient = new MQTTClientManager()
