export interface DeviceConfig {
  deviceId: string
  name: string
  panelCols: number
  panelRows: number
  brightness: number
  colorMode: "RGB" | "RGBW" | "Monochrome"
  updateInterval: number
  timezone: string
  autoSync: boolean
  features: {
    weather: boolean
    clock: boolean
    animations: boolean
    scrollText: boolean
  }
}

export interface DeviceStatus {
  deviceId: string
  online: boolean
  brightness: number
  temperature: number
  powerConsumption: number
  uptime: number
  lastSync: string
  firmwareVersion: string
  signalStrength: number
}

class DeviceConfigManager {
  private configs: Map<string, DeviceConfig> = new Map()
  private statuses: Map<string, DeviceStatus> = new Map()
  private listeners: ((config: DeviceConfig) => void)[] = []

  createConfig(deviceId: string, name: string, panelCols: number, panelRows: number): DeviceConfig {
    const config: DeviceConfig = {
      deviceId,
      name,
      panelCols,
      panelRows,
      brightness: 100,
      colorMode: "RGB",
      updateInterval: 5000,
      timezone: "UTC",
      autoSync: true,
      features: {
        weather: true,
        clock: true,
        animations: true,
        scrollText: true,
      },
    }
    this.configs.set(deviceId, config)
    this.notifyListeners(config)
    console.log("[v0] Device config created:", deviceId)
    return config
  }

  updateConfig(deviceId: string, updates: Partial<DeviceConfig>): DeviceConfig | null {
    const config = this.configs.get(deviceId)
    if (!config) return null

    const updated = { ...config, ...updates }
    this.configs.set(deviceId, updated)
    this.notifyListeners(updated)
    console.log("[v0] Device config updated:", deviceId)
    return updated
  }

  getConfig(deviceId: string): DeviceConfig | null {
    return this.configs.get(deviceId) || null
  }

  getAllConfigs(): DeviceConfig[] {
    return Array.from(this.configs.values())
  }

  deleteConfig(deviceId: string): boolean {
    const deleted = this.configs.delete(deviceId)
    this.statuses.delete(deviceId)
    console.log("[v0] Device config deleted:", deviceId)
    return deleted
  }

  updateStatus(deviceId: string, status: Partial<DeviceStatus>): DeviceStatus {
    const existing = this.statuses.get(deviceId) || {
      deviceId,
      online: false,
      brightness: 0,
      temperature: 0,
      powerConsumption: 0,
      uptime: 0,
      lastSync: new Date().toISOString(),
      firmwareVersion: "1.0.0",
      signalStrength: 0,
    }

    const updated = { ...existing, ...status, lastSync: new Date().toISOString() }
    this.statuses.set(deviceId, updated)
    return updated
  }

  getStatus(deviceId: string): DeviceStatus | null {
    return this.statuses.get(deviceId) || null
  }

  getAllStatuses(): DeviceStatus[] {
    return Array.from(this.statuses.values())
  }

  onConfigChange(listener: (config: DeviceConfig) => void) {
    this.listeners.push(listener)
  }

  private notifyListeners(config: DeviceConfig) {
    this.listeners.forEach((listener) => listener(config))
  }
}

export const deviceConfigManager = new DeviceConfigManager()
