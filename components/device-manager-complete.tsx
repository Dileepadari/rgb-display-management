"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Edit2, Wifi } from "lucide-react"
import useSWR from "swr"

interface Device {
  id: string
  name: string
  device_id: string
  panel_width: number
  panel_height: number
  brightness: number
  is_online: boolean
  last_sync: string
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function DeviceManagerComplete() {
  const { data: devices, mutate } = useSWR<Device[]>("/api/devices", fetcher)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    device_id: "",
    panel_width: 1,
    panel_height: 1,
    brightness: 100,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAddDevice = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/devices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to add device")

      await mutate()
      setFormData({ name: "", device_id: "", panel_width: 1, panel_height: 1, brightness: 100 })
      setShowForm(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error adding device")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDevice = async (id: string) => {
    if (!confirm("Are you sure?")) return

    try {
      const response = await fetch(`/api/devices/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete device")
      await mutate()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error deleting device")
    }
  }

  const handleUpdateBrightness = async (id: string, brightness: number) => {
    try {
      const response = await fetch(`/api/devices/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brightness }),
      })
      if (!response.ok) throw new Error("Failed to update brightness")
      await mutate()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error updating brightness")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Device Management</h2>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Device
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Device</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddDevice} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Device Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="My LED Panel"
                    required
                  />
                </div>
                <div>
                  <Label>Device ID</Label>
                  <Input
                    value={formData.device_id}
                    onChange={(e) => setFormData({ ...formData, device_id: e.target.value })}
                    placeholder="ESP32-001"
                    required
                  />
                </div>
                <div>
                  <Label>Panel Width</Label>
                  <Input
                    type="number"
                    min="1"
                    max="4"
                    value={formData.panel_width}
                    onChange={(e) => setFormData({ ...formData, panel_width: Number.parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Panel Height</Label>
                  <Input
                    type="number"
                    min="1"
                    max="4"
                    value={formData.panel_height}
                    onChange={(e) => setFormData({ ...formData, panel_height: Number.parseInt(e.target.value) })}
                  />
                </div>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "Adding..." : "Add Device"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {(Array.isArray(devices) ? devices : [])?.map((device) => (
          <Card key={device.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{device.name}</h3>
                  <p className="text-sm text-gray-500">{device.device_id}</p>
                  <div className="flex gap-4 mt-2 text-sm">
                    <span className="flex items-center gap-1">
                      <Wifi className={`w-4 h-4 ${device.is_online ? "text-green-500" : "text-red-500"}`} />
                      {device.is_online ? "Online" : "Offline"}
                    </span>
                    <span>
                      Panel: {device.panel_width}x{device.panel_height}
                    </span>
                    <span>Brightness: {device.brightness}%</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateBrightness(device.id, Math.max(0, device.brightness - 10))}
                  >
                    -
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateBrightness(device.id, Math.min(100, device.brightness + 10))}
                  >
                    +
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDeleteDevice(device.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
