"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, Wifi, WifiOff, CheckCircle, AlertCircle } from "lucide-react"

interface SyncConfig {
  mqttBroker: string
  mqttPort: number
  syncInterval: number
  thingSpeakChannelId: string
}

export default function SyncSettings() {
  const [config, setConfig] = useState<SyncConfig>({
    mqttBroker: "mqtt.example.com",
    mqttPort: 8883,
    syncInterval: 5000,
    thingSpeakChannelId: "",
  })

  const [isConnected, setIsConnected] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null)
  const [syncStatus, setSyncStatus] = useState<"idle" | "connecting" | "connected" | "error">("idle")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch("/api/sync-config")
        if (response.ok) {
          const data = await response.json()
          setConfig(data)
        }
      } catch (error) {
        console.error("Failed to load config:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadConfig()
  }, [])

  const handleConfigChange = (key: keyof SyncConfig, value: string | number) => {
    setConfig({ ...config, [key]: value })
  }

  const testConnection = async () => {
    setSyncStatus("connecting")
    try {
      const response = await fetch("/api/thingspeak/sync", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })

      if (response.ok) {
        setSyncStatus("connected")
        setIsConnected(true)
        setLastSyncTime(new Date().toLocaleTimeString())
        setTimeout(() => setSyncStatus("idle"), 3000)
      } else {
        setSyncStatus("error")
        setTimeout(() => setSyncStatus("idle"), 3000)
      }
    } catch (error) {
      console.error("Connection test failed:", error)
      setSyncStatus("error")
      setTimeout(() => setSyncStatus("idle"), 3000)
    }
  }

  const startSync = async () => {
    setIsSyncing(true)
    try {
      // In a real implementation, this would initialize the real-time sync
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsConnected(true)
      setLastSyncTime(new Date().toLocaleTimeString())
    } catch (error) {
      console.error("Sync failed:", error)
    } finally {
      setIsSyncing(false)
    }
  }

  const stopSync = () => {
    setIsConnected(false)
  }

  const saveConfig = async () => {
    try {
      const response = await fetch("/api/sync-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      })

      if (response.ok) {
        setSyncStatus("connected")
        setTimeout(() => setSyncStatus("idle"), 2000)
      }
    } catch (error) {
      console.error("Failed to save config:", error)
      setSyncStatus("error")
      setTimeout(() => setSyncStatus("idle"), 2000)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <p className="text-muted-foreground">Loading configuration...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Settings className="w-8 h-8" />
          Real-time Sync Settings
        </h2>
        <p className="text-muted-foreground">Configure ThingSpeak and MQTT for real-time device synchronization</p>
      </div>

      {/* Connection Status */}
      <Card className="p-6 mb-6 border-primary/20 bg-card/50 backdrop-blur">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            {isConnected ? (
              <>
                <Wifi className="w-5 h-5 text-green-500" />
                Connected
              </>
            ) : (
              <>
                <WifiOff className="w-5 h-5 text-red-500" />
                Disconnected
              </>
            )}
          </h3>
          <div className="flex gap-2">
            {!isConnected ? (
              <Button
                onClick={startSync}
                disabled={isSyncing}
                className="gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                {isSyncing ? "Connecting..." : "Start Sync"}
              </Button>
            ) : (
              <Button
                onClick={stopSync}
                variant="outline"
                className="gap-2 border-destructive/50 text-destructive hover:bg-destructive/10 bg-transparent"
              >
                Stop Sync
              </Button>
            )}
          </div>
        </div>

        {lastSyncTime && <p className="text-sm text-muted-foreground">Last sync: {lastSyncTime}</p>}

        {syncStatus === "connected" && (
          <div className="mt-3 p-3 rounded-lg bg-green-500/10 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-600">Connection successful</span>
          </div>
        )}

        {syncStatus === "error" && (
          <div className="mt-3 p-3 rounded-lg bg-red-500/10 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-600">Connection failed</span>
          </div>
        )}
      </Card>

      {/* ThingSpeak Configuration */}
      <Card className="p-6 mb-6 border-primary/20 bg-card/50 backdrop-blur">
        <h3 className="font-semibold mb-4">ThingSpeak Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Channel ID</label>
            <input
              type="text"
              value={config.thingSpeakChannelId}
              onChange={(e) => handleConfigChange("thingSpeakChannelId", e.target.value)}
              placeholder="Your ThingSpeak Channel ID"
              className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Set NEXT_PUBLIC_THINGSPEAK_CHANNEL_ID in environment variables
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">API Key (Server-side only)</label>
            <input
              type="password"
              disabled
              placeholder="••••••••••••••••"
              className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary opacity-50 cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Set THINGSPEAK_API_KEY in environment variables (server-side only)
            </p>
          </div>
        </div>
      </Card>

      {/* MQTT Configuration */}
      <Card className="p-6 mb-6 border-primary/20 bg-card/50 backdrop-blur">
        <h3 className="font-semibold mb-4">MQTT Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Broker Address</label>
            <input
              type="text"
              value={config.mqttBroker}
              onChange={(e) => handleConfigChange("mqttBroker", e.target.value)}
              placeholder="mqtt.example.com"
              className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Port</label>
            <input
              type="number"
              value={config.mqttPort}
              onChange={(e) => handleConfigChange("mqttPort", Number.parseInt(e.target.value))}
              placeholder="8883"
              className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Sync Interval (ms)</label>
            <input
              type="number"
              value={config.syncInterval}
              onChange={(e) => handleConfigChange("syncInterval", Number.parseInt(e.target.value))}
              placeholder="5000"
              className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </Card>

      {/* Actions */}
      <Card className="p-6 border-primary/20 bg-card/50 backdrop-blur">
        <h3 className="font-semibold mb-4">Actions</h3>
        <div className="flex gap-2">
          <Button
            onClick={testConnection}
            variant="outline"
            className="gap-2 border-primary/50 text-primary hover:bg-primary/10 bg-transparent"
          >
            Test Connection
          </Button>
          <Button
            onClick={saveConfig}
            className="gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
          >
            Save Configuration
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Note: Sensitive API keys should be set in environment variables and are never exposed to the client.
        </p>
      </Card>
    </div>
  )
}
