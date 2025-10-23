"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Zap } from "lucide-react"
import useSWR from "swr"

interface Mood {
  id: string
  name: string
  description: string
  color: string
  icon: string
  animation: string
  is_custom: boolean
}

interface Device {
  id: string
  name: string
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function MoodBoardComplete() {
  const { data: moods = [] } = useSWR<Mood[]>("/api/moods", fetcher)
  const { data: devices = [] } = useSWR<Device[]>("/api/devices", fetcher)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#FF6B6B",
    icon: "zap",
    animation: "pulse",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreateMood = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/moods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, is_custom: true }),
      })

      if (!response.ok) throw new Error("Failed to create mood")

      setFormData({ name: "", description: "", color: "#FF6B6B", icon: "zap", animation: "pulse" })
      setShowForm(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creating mood")
    } finally {
      setLoading(false)
    }
  }

  const handleApplyMood = async (moodId: string, deviceId: string) => {
    try {
      const response = await fetch("/api/device-moods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ device_id: deviceId, mood_id: moodId }),
      })

      if (!response.ok) throw new Error("Failed to apply mood")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error applying mood")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Mood Board</h2>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          Create Mood
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create Custom Mood</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateMood} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Mood Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Sunset"
                    required
                  />
                </div>
                <div>
                  <Label>Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                    <Input value={formData.color} readOnly className="flex-1" />
                  </div>
                </div>
                <div className="col-span-2">
                  <Label>Description</Label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Mood description"
                  />
                </div>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Mood"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Available Moods</h3>
          <div className="grid grid-cols-2 gap-4">
            {(Array.isArray(moods) ? moods : []).map((mood) => (
              <Card
                key={mood.id}
                className="p-4 border-primary/20 bg-card/50 backdrop-blur hover:border-primary/40 transition-colors cursor-pointer"
              >
                <div
                  className="w-full h-24 rounded-lg mb-3 flex items-center justify-center text-white text-2xl"
                  style={{ backgroundColor: mood.color }}
                >
                  <Zap className="w-8 h-8" />
                </div>
                <h4 className="font-semibold text-sm">{mood.name}</h4>
                <p className="text-xs text-muted-foreground">{mood.description}</p>
                {mood.is_custom && <span className="text-xs text-primary mt-2 inline-block">Custom</span>}
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Apply to Devices</h3>
          <div className="space-y-2">
            {!Array.isArray(devices) || devices.length === 0 ? (
              <p className="text-muted-foreground text-sm">No devices available</p>
            ) : (
              (Array.isArray(devices) ? devices : []).map((device) => (
                <Card key={device.id} className="p-4 border-primary/20 bg-card/50 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{device.name}</span>
                    <div className="flex gap-2 flex-wrap justify-end">
                      {moods.slice(0, 3).map((mood) => (
                        <Button
                          key={`${device.id}-${mood.id}`}
                          size="sm"
                          variant="outline"
                          onClick={() => handleApplyMood(mood.id, device.id)}
                          style={{ borderColor: mood.color, color: mood.color }}
                          className="hover:bg-opacity-10"
                        >
                          {mood.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
