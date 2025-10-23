"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Edit2, Send, History, Wifi, WifiOff, AlertCircle, CheckCircle } from "lucide-react"

interface Mood {
  id: string
  name: string
  color: string
  icon: string
  animation: string
  description: string
  brightness?: number
  saturation?: number
}

interface DeviceStatus {
  deviceId: string
  deviceName: string
  currentMood?: string
  status: "online" | "offline" | "error"
  lastUpdated: string
  appliedAt?: string
}

interface StatusHistory {
  id: string
  deviceId: string
  moodId: string
  timestamp: string
  status: "success" | "failed"
}

export default function MoodBoard() {
  const [moods, setMoods] = useState<Mood[]>([
    {
      id: "1",
      name: "Focus",
      color: "#6366F1",
      icon: "🎯",
      animation: "pulse",
      description: "Deep focus mode - calm and concentrated",
      brightness: 80,
      saturation: 60,
    },
    {
      id: "2",
      name: "Creative",
      color: "#EC4899",
      icon: "🎨",
      animation: "bounce",
      description: "Creative mode - energetic and inspiring",
      brightness: 100,
      saturation: 100,
    },
    {
      id: "3",
      name: "Relaxed",
      color: "#10B981",
      icon: "🌿",
      animation: "fade",
      description: "Relaxed mode - calm and peaceful",
      brightness: 50,
      saturation: 40,
    },
    {
      id: "4",
      name: "Energetic",
      color: "#F59E0B",
      icon: "⚡",
      animation: "spin",
      description: "High energy mode - vibrant and dynamic",
      brightness: 100,
      saturation: 100,
    },
  ])

  const [deviceStatuses, setDeviceStatuses] = useState<DeviceStatus[]>([
    {
      deviceId: "1",
      deviceName: "Office Display",
      currentMood: "1",
      status: "online",
      lastUpdated: "2 mins ago",
      appliedAt: "10:30 AM",
    },
    {
      deviceId: "2",
      deviceName: "Lobby Panel",
      currentMood: "3",
      status: "online",
      lastUpdated: "5 mins ago",
      appliedAt: "10:15 AM",
    },
    {
      deviceId: "3",
      deviceName: "Meeting Room",
      status: "offline",
      lastUpdated: "1 hour ago",
    },
  ])

  const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([
    { id: "1", deviceId: "1", moodId: "1", timestamp: "10:30 AM", status: "success" },
    { id: "2", deviceId: "2", moodId: "3", timestamp: "10:15 AM", status: "success" },
    { id: "3", deviceId: "1", moodId: "2", timestamp: "09:45 AM", status: "success" },
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [newMood, setNewMood] = useState({
    name: "",
    color: "#6366F1",
    icon: "😊",
    animation: "pulse",
    description: "",
    brightness: 80,
    saturation: 60,
  })

  const addMood = () => {
    if (newMood.name) {
      setMoods([
        ...moods,
        {
          id: `mood-${Date.now()}`,
          ...newMood,
        },
      ])
      setNewMood({
        name: "",
        color: "#6366F1",
        icon: "😊",
        animation: "pulse",
        description: "",
        brightness: 80,
        saturation: 60,
      })
      setShowAddForm(false)
    }
  }

  const deleteMood = (id: string) => {
    setMoods(moods.filter((m) => m.id !== id))
  }

  const applyMoodToDevice = (moodId: string, deviceId: string) => {
    setDeviceStatuses(
      deviceStatuses.map((ds) =>
        ds.deviceId === deviceId
          ? {
              ...ds,
              currentMood: moodId,
              lastUpdated: "now",
              appliedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            }
          : ds,
      ),
    )

    // Add to history
    setStatusHistory([
      {
        id: `hist-${Date.now()}`,
        deviceId,
        moodId,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "success",
      },
      ...statusHistory,
    ])
  }

  const applyMoodToAllDevices = (moodId: string) => {
    const onlineDevices = deviceStatuses.filter((ds) => ds.status === "online")
    onlineDevices.forEach((device) => {
      applyMoodToDevice(moodId, device.deviceId)
    })
  }

  const getMoodName = (moodId: string) => {
    return moods.find((m) => m.id === moodId)?.name || "Unknown"
  }

  const getStatusIcon = (status: DeviceStatus["status"]) => {
    switch (status) {
      case "online":
        return <Wifi className="w-4 h-4 text-green-500" />
      case "offline":
        return <WifiOff className="w-4 h-4 text-red-500" />
      case "error":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
    }
  }

  const onlineDeviceCount = deviceStatuses.filter((ds) => ds.status === "online").length

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Mood Board</h2>
          <p className="text-muted-foreground">Create and manage display moods and status indicators</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowHistory(!showHistory)}
            variant="outline"
            className="gap-2 border-primary/50 text-primary hover:bg-primary/10"
          >
            <History className="w-4 h-4" />
            History
          </Button>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
          >
            <Plus className="w-4 h-4" />
            New Mood
          </Button>
        </div>
      </div>

      {/* Add Mood Form */}
      {showAddForm && (
        <Card className="p-6 mb-6 border-primary/20 bg-card/50 backdrop-blur">
          <h3 className="font-semibold mb-4">Create New Mood</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Mood Name</label>
              <input
                type="text"
                placeholder="e.g., Focus"
                value={newMood.name}
                onChange={(e) => setNewMood({ ...newMood, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Color</label>
              <input
                type="color"
                value={newMood.color}
                onChange={(e) => setNewMood({ ...newMood, color: e.target.value })}
                className="w-full h-10 rounded-lg cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Icon</label>
              <input
                type="text"
                placeholder="e.g., 🎯"
                value={newMood.icon}
                onChange={(e) => setNewMood({ ...newMood, icon: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Animation</label>
              <select
                value={newMood.animation}
                onChange={(e) => setNewMood({ ...newMood, animation: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option>pulse</option>
                <option>bounce</option>
                <option>fade</option>
                <option>spin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Brightness</label>
              <input
                type="range"
                min="0"
                max="100"
                value={newMood.brightness}
                onChange={(e) => setNewMood({ ...newMood, brightness: Number.parseInt(e.target.value) })}
                className="w-full"
              />
              <span className="text-xs text-muted-foreground">{newMood.brightness}%</span>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Saturation</label>
              <input
                type="range"
                min="0"
                max="100"
                value={newMood.saturation}
                onChange={(e) => setNewMood({ ...newMood, saturation: Number.parseInt(e.target.value) })}
                className="w-full"
              />
              <span className="text-xs text-muted-foreground">{newMood.saturation}%</span>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                placeholder="Describe this mood..."
                value={newMood.description}
                onChange={(e) => setNewMood({ ...newMood, description: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows={2}
              />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <Button
                onClick={addMood}
                className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                Create Mood
              </Button>
              <Button
                onClick={() => setShowAddForm(false)}
                variant="outline"
                className="flex-1 border-primary/50 text-primary hover:bg-primary/10"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Status History */}
      {showHistory && (
        <Card className="p-6 mb-6 border-primary/20 bg-card/50 backdrop-blur">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <History className="w-5 h-5" />
            Recent Status Changes
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {statusHistory.slice(0, 10).map((entry) => {
              const device = deviceStatuses.find((ds) => ds.deviceId === entry.deviceId)
              const mood = moods.find((m) => m.id === entry.moodId)
              return (
                <div key={entry.id} className="flex items-center justify-between text-sm p-3 rounded bg-primary/5">
                  <div className="flex items-center gap-3">
                    {entry.status === "success" ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                    <div>
                      <p className="font-medium">
                        {device?.deviceName} → {mood?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{entry.timestamp}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-primary">{entry.status}</span>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Device Status Overview */}
      <Card className="p-6 mb-8 border-primary/20 bg-card/50 backdrop-blur">
        <h3 className="font-semibold mb-4">Device Status Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-primary/10">
            <p className="text-muted-foreground text-sm">Online Devices</p>
            <p className="text-2xl font-bold text-primary mt-1">
              {onlineDeviceCount}/{deviceStatuses.length}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-accent/10">
            <p className="text-muted-foreground text-sm">Total Moods</p>
            <p className="text-2xl font-bold text-accent mt-1">{moods.length}</p>
          </div>
          <div className="p-4 rounded-lg bg-green-500/10">
            <p className="text-muted-foreground text-sm">Status Changes</p>
            <p className="text-2xl font-bold text-green-500 mt-1">{statusHistory.length}</p>
          </div>
        </div>

        {/* Device Status List */}
        <div className="space-y-3">
          {deviceStatuses.map((device) => (
            <div key={device.deviceId} className="flex items-center justify-between p-4 rounded-lg bg-primary/5">
              <div className="flex items-center gap-3 flex-1">
                {getStatusIcon(device.status)}
                <div>
                  <p className="font-semibold">{device.deviceName}</p>
                  <p className="text-xs text-muted-foreground">
                    {device.currentMood ? `Mood: ${getMoodName(device.currentMood)}` : "No mood applied"} • Last
                    updated: {device.lastUpdated}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {device.status === "online" && (
                  <select
                    value={device.currentMood || ""}
                    onChange={(e) => applyMoodToDevice(e.target.value, device.deviceId)}
                    className="px-3 py-1 rounded bg-input border border-border text-foreground text-sm"
                  >
                    <option value="">Select mood...</option>
                    {moods.map((mood) => (
                      <option key={mood.id} value={mood.id}>
                        {mood.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Moods Grid */}
      <div>
        <h3 className="font-semibold mb-4">Available Moods</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {moods.map((mood) => (
            <Card
              key={mood.id}
              className="border-primary/20 bg-card/50 backdrop-blur overflow-hidden hover:border-primary/50 transition-all group cursor-pointer"
              onClick={() => setSelectedMood(selectedMood === mood.id ? null : mood.id)}
            >
              <div
                className="h-24 flex items-center justify-center text-5xl transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${mood.color}20` }}
              >
                {mood.icon}
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-1">{mood.name}</h3>
                <p className="text-xs text-muted-foreground mb-3">{mood.description}</p>
                <div className="flex items-center justify-between mb-3 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: mood.color }} />
                    <span className="text-muted-foreground">{mood.animation}</span>
                  </div>
                  <span className="text-muted-foreground">{mood.brightness}%</span>
                </div>

                {/* Expanded Actions */}
                {selectedMood === mood.id && (
                  <div className="space-y-2 pt-3 border-t border-border/50">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        applyMoodToAllDevices(mood.id)
                      }}
                      className="w-full gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-xs"
                    >
                      <Send className="w-3 h-3" />
                      Apply to All
                    </Button>
                  </div>
                )}

                {/* Default Actions */}
                {selectedMood !== mood.id && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-primary/50 text-primary hover:bg-primary/10 bg-transparent"
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="flex-1 text-destructive hover:text-destructive/80"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteMood(mood.id)
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
