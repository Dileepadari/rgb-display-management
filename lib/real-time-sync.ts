import { mqttClient } from "./mqtt-client"

interface DeviceData {
  deviceId: string
  brightness: number
  color: string
  temperature: number
  powerConsumption: number
  status: "online" | "offline"
  lastSync: string
}

interface SyncConfig {
  thingSpeakChannelId: string
  thingSpeakApiKey: string
  mqttBroker: string
  mqttPort: number
  syncInterval: number // milliseconds
}

class RealTimeSyncManager {
  private config: SyncConfig | null = null
  private syncInterval: NodeJS.Timeout | null = null
  private deviceDataCache: Map<string, DeviceData> = new Map()
  private syncListeners: ((data: DeviceData) => void)[] = []

  configure(config: SyncConfig) {
    this.config = config
    mqttClient.configure({
      broker: config.mqttBroker,
      port: config.mqttPort,
      clientId: `rgb-display-${Date.now()}`,
    })
  }

  async startSync(): Promise<void> {
    if (!this.config) {
      console.error("Sync not configured")
      return
    }

    try {
      // Connect MQTT
      await mqttClient.connect()

      // Subscribe to device topics
      mqttClient.subscribe("devices/+/status", (message) => {
        this.handleDeviceStatus(message)
      })

      // Start periodic sync
      this.syncInterval = setInterval(() => {
        this.syncWithThingSpeak()
      }, this.config.syncInterval)

      console.log("Real-time sync started")
    } catch (error) {
      console.error("Failed to start sync:", error)
    }
  }

  async stopSync(): Promise<void> {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
    }
    await mqttClient.disconnect()
    console.log("Real-time sync stopped")
  }

  private handleDeviceStatus(message: { topic: string; payload: string; timestamp: number }) {
    try {
      const data = JSON.parse(message.payload) as DeviceData
      this.deviceDataCache.set(data.deviceId, data)

      // Notify listeners
      this.syncListeners.forEach((listener) => listener(data))
    } catch (error) {
      console.error("Failed to parse device status:", error)
    }
  }

  private async syncWithThingSpeak(): Promise<void> {
    if (!this.config) return

    try {
      // Aggregate device data
      const devices = Array.from(this.deviceDataCache.values())
      if (devices.length === 0) return

      // Send to ThingSpeak
      const response = await fetch("/api/thingspeak/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel_id: this.config.thingSpeakChannelId,
          field1: devices[0]?.brightness || 0,
          field2: devices[0]?.temperature || 0,
          field3: devices[0]?.powerConsumption || 0,
          field4: devices.filter((d) => d.status === "online").length,
          field5: devices.length,
        }),
      })

      if (!response.ok) {
        throw new Error(`Sync failed: ${response.statusText}`)
      }

      console.log("ThingSpeak sync completed")
    } catch (error) {
      console.error("ThingSpeak sync error:", error)
    }
  }

  async publishDeviceCommand(deviceId: string, command: Record<string, unknown>): Promise<boolean> {
    const topic = `devices/${deviceId}/command`
    return mqttClient.publish(topic, JSON.stringify(command))
  }

  onDeviceUpdate(listener: (data: DeviceData) => void) {
    this.syncListeners.push(listener)
  }

  getDeviceData(deviceId: string): DeviceData | undefined {
    return this.deviceDataCache.get(deviceId)
  }

  getAllDeviceData(): DeviceData[] {
    return Array.from(this.deviceDataCache.values())
  }
}

export const realTimeSync = new RealTimeSyncManager()
