"use client"

import type React from "react"

import { useState } from "react"
import { toast } from "sonner"
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

  const handleCreateMood = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/moods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, is_custom: true }),
      })

      if (!response.ok) throw new Error("Failed to create mood")

      setFormData({ name: "", description: "", color: "#FF6B6B", icon: "zap", animation: "pulse" })
      setShowForm(false)
      toast.success("Mood created")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error creating mood")
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
      toast.success("Mood applied")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error applying mood")
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 md:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Mood Board</h2>
          <p className="text-muted-foreground text-sm">Apply pre-built lighting moods to your devices</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="h-4 w-4" />
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="mood-name">Mood Name</Label>
                  <Input
                    id="mood-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Sunset"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mood-color">Color</Label>
                  <div className="flex gap-2">
                    <input
                      id="mood-color"
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="h-9 w-12 cursor-pointer rounded-md border border-input bg-transparent"
                    />
                    <Input value={formData.color} readOnly className="flex-1" />
                  </div>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="mood-description">Description</Label>
                  <Input
                    id="mood-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Mood description"
                  />
                </div>
              </div>
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Available Moods</h3>
          <div className="grid grid-cols-2 gap-4">
            {(Array.isArray(moods) ? moods : []).map((mood) => (
              <Card key={mood.id} className="cursor-pointer p-4 transition-colors hover:border-primary/40">
                <div
                  className="mb-3 flex h-24 w-full items-center justify-center rounded-lg text-white"
                  style={{ backgroundColor: mood.color }}
                >
                  <Zap className="h-8 w-8" />
                </div>
                <h4 className="text-sm font-semibold">{mood.name}</h4>
                <p className="text-muted-foreground text-xs">{mood.description}</p>
                {mood.is_custom && <span className="mt-2 inline-block text-xs text-primary">Custom</span>}
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Apply to Devices</h3>
          <div className="space-y-2">
            {!Array.isArray(devices) || devices.length === 0 ? (
              <p className="text-muted-foreground text-sm">No devices available</p>
            ) : (
              (Array.isArray(devices) ? devices : []).map((device) => (
                <Card key={device.id} className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-medium">{device.name}</span>
                    <div className="flex flex-wrap justify-end gap-2">
                      {moods.map((mood) => (
                        <Button
                          key={`${device.id}-${mood.id}`}
                          size="sm"
                          variant="outline"
                          onClick={() => handleApplyMood(mood.id, device.id)}
                          style={{ borderColor: mood.color, color: mood.color }}
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
