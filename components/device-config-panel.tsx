"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, Save, X } from "lucide-react"
import type { DeviceConfig } from "@/lib/device-config"

interface DeviceConfigPanelProps {
  device: DeviceConfig
  onSave: (config: DeviceConfig) => void
  onClose: () => void
}

export default function DeviceConfigPanel({ device, onSave, onClose }: DeviceConfigPanelProps) {
  const [config, setConfig] = useState<DeviceConfig>(device)
  const [saving, setSaving] = useState(false)

  const handleChange = (key: keyof DeviceConfig, value: unknown) => {
    setConfig({ ...config, [key]: value })
  }

  const handleFeatureToggle = (feature: keyof DeviceConfig["features"]) => {
    setConfig({
      ...config,
      features: {
        ...config.features,
        [feature]: !config.features[feature],
      },
    })
  }

  const handleSave = () => {
    setSaving(true)
    // Persist to backend
    fetch('/api/device-configs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        device_id: config.deviceId,
        config_key: 'default',
        config_value: config,
      }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text())
        const data = await res.json()
        onSave({ ...config })
      })
      .catch((err) => {
        console.error('Failed to save config', err)
        // still call onSave locally
        onSave({ ...config })
      })
      .finally(() => {
        setSaving(false)
        onClose()
      })
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl border-primary/20 bg-card/95 backdrop-blur max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border/50 flex items-center justify-between sticky top-0 bg-card/95">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="w-6 h-6" />
            Device Configuration
          </h2>
          <Button size="icon" variant="ghost" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Settings */}
          <div>
            <h3 className="font-semibold mb-4">Basic Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Device Name</label>
                <input
                  type="text"
                  value={config.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Device ID</label>
                <input
                  type="text"
                  value={config.deviceId}
                  disabled
                  className="w-full px-3 py-2 rounded-lg bg-input border border-border text-foreground opacity-50 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Panel Columns</label>
                <input
                  type="number"
                  value={config.panelCols}
                  onChange={(e) => handleChange("panelCols", Number.parseInt(e.target.value))}
                  min="1"
                  max="8"
                  className="w-full px-3 py-2 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Panel Rows</label>
                <input
                  type="number"
                  value={config.panelRows}
                  onChange={(e) => handleChange("panelRows", Number.parseInt(e.target.value))}
                  min="1"
                  max="8"
                  className="w-full px-3 py-2 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Display Settings */}
          <div>
            <h3 className="font-semibold mb-4">Display Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Brightness</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={config.brightness}
                    onChange={(e) => handleChange("brightness", Number.parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm font-semibold w-12 text-right">{config.brightness}%</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Color Mode</label>
                <select
                  value={config.colorMode}
                  onChange={(e) => handleChange("colorMode", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="RGB">RGB</option>
                  <option value="RGBW">RGBW</option>
                  <option value="Monochrome">Monochrome</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Update Interval (ms)</label>
                <input
                  type="number"
                  value={config.updateInterval}
                  onChange={(e) => handleChange("updateInterval", Number.parseInt(e.target.value))}
                  min="100"
                  step="100"
                  className="w-full px-3 py-2 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Timezone</label>
                <input
                  type="text"
                  value={config.timezone}
                  onChange={(e) => handleChange("timezone", e.target.value)}
                  placeholder="UTC"
                  className="w-full px-3 py-2 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold mb-4">Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(config.features).map(([feature, enabled]) => (
                <label
                  key={feature}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:bg-primary/5 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={() => handleFeatureToggle(feature as keyof DeviceConfig["features"])}
                    className="w-4 h-4 rounded border-border"
                  />
                  <span className="font-medium capitalize">{feature}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Auto Sync */}
          <div>
            <label className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:bg-primary/5 cursor-pointer">
              <input
                type="checkbox"
                checked={config.autoSync}
                onChange={(e) => handleChange("autoSync", e.target.checked)}
                className="w-4 h-4 rounded border-border"
              />
              <span className="font-medium">Auto Sync with MQTT</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t border-border/50">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Configuration'}
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-primary/50 text-primary hover:bg-primary/10 bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
