"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Wifi, WifiOff, Zap, Thermometer, Activity, Settings } from "lucide-react"

interface Device {
  id: string
  name: string
  status: "online" | "offline"
  brightness: number
  thingspeak_channel: string
  firmware_version: string
  last_sync: string
  group?: string
  temperature?: number
  power_consumption?: number
  uptime?: string
  signal_strength?: number
}

interface DeviceGroup {
  id: string
  name: string
  devices: string[]
}

export default function DeviceManager() {
  const [devices, setDevices] = useState<Device[]>([])

  const [groups, setGroups] = useState<DeviceGroup[]>([
    { id: "office", name: "Office", devices: ["1"] },
    { id: "lobby", name: "Lobby", devices: ["2"] },
    { id: "meeting", name: "Meeting Rooms", devices: ["3"] },
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [showGroupForm, setShowGroupForm] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [editingDevice, setEditingDevice] = useState<string | null>(null)
  const [newDevice, setNewDevice] = useState({ name: "", thingspeak_channel: "", group: "" })
  const [newGroup, setNewGroup] = useState("")

  useEffect(() => {
    let mounted = true
    fetch('/api/devices')
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text())
        return res.json()
      })
      .then((data: Device[]) => {
        if (mounted) setDevices(data)
      })
      .catch((err) => console.error('Failed to load devices', err))

    return () => {
      mounted = false
    }
  }, [])

  const addDevice = async () => {
    if (newDevice.name && newDevice.thingspeak_channel) {
      try {
        const res = await fetch('/api/devices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newDevice.name, thingspeak_channel: newDevice.thingspeak_channel, group: newDevice.group }),
        })
        if (!res.ok) throw new Error(await res.text())
        const created = await res.json()
        setDevices((prev) => [created, ...prev])
        setNewDevice({ name: '', thingspeak_channel: '', group: '' })
        setShowAddForm(false)
      } catch (err) {
        console.error('Failed to create device', err)
      }
    }
  }

  const addGroup = () => {
    if (newGroup.trim()) {
      setGroups([...groups, { id: `group-${Date.now()}`, name: newGroup, devices: [] }])
      setNewGroup("")
      setShowGroupForm(false)
    }
  }

  const deleteDevice = async (id: string) => {
    if (!confirm('Delete device?')) return
    try {
      const res = await fetch(`/api/devices/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(await res.text())
      setDevices((prev) => prev.filter((d) => d.id !== id))
    } catch (err) {
      console.error('Failed to delete device', err)
    }
  }

  const deleteGroup = (id: string) => {
    setGroups(groups.filter((g) => g.id !== id))
    setDevices(devices.map((d) => (d.group === id ? { ...d, group: undefined } : d)))
  }

  const updateBrightness = async (id: string, brightness: number) => {
    setDevices((prev) => prev.map((d) => (d.id === id ? { ...d, brightness } : d)))
    try {
      await fetch(`/api/devices/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brightness }),
      })
    } catch (err) {
      console.error('Failed to update brightness', err)
    }
  }

  const toggleDeviceStatus = async (id: string) => {
    setDevices((prev) => prev.map((d) => (d.id === id ? { ...d, status: d.status === 'online' ? 'offline' : 'online', last_sync: new Date().toLocaleTimeString() } : d)))
    try {
      // publish to MQTT to notify device
      await fetch('/api/mqtt/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId: id, command: { type: 'set_status', status: 'toggle' } }),
      })
    } catch (err) {
      console.error('Failed to publish MQTT command', err)
    }
  }

  const filteredDevices = selectedGroup ? devices.filter((d) => d.group === selectedGroup) : devices
  const onlineCount = devices.filter((d) => d.status === "online").length
  const totalPower = devices.reduce((sum, d) => sum + (d.power_consumption || 0), 0)

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Device Management</h2>
          <p className="text-muted-foreground">Register and manage your ESP32 devices</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowGroupForm(!showGroupForm)}
            variant="outline"
            className="gap-2 border-primary/50 text-primary hover:bg-primary/10"
          >
            <Plus className="w-4 h-4" />
            New Group
          </Button>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
          >
            <Plus className="w-4 h-4" />
            Add Device
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-4 border-primary/20 bg-card/50 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Online Devices</p>
              <p className="text-2xl font-bold mt-1">
                {onlineCount}/{devices.length}
              </p>
            </div>
            <Wifi className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4 border-primary/20 bg-card/50 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Power</p>
              <p className="text-2xl font-bold mt-1">{totalPower}W</p>
            </div>
            <Zap className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-4 border-primary/20 bg-card/50 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Device Groups</p>
              <p className="text-2xl font-bold mt-1">{groups.length}</p>
            </div>
            <Activity className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
      </div>

      {/* Add Device Form */}
      {showAddForm && (
        <Card className="p-6 mb-6 border-primary/20 bg-card/50 backdrop-blur">
          <h3 className="font-semibold mb-4">Register New Device</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Device Name</label>
              <input
                type="text"
                placeholder="e.g., Office Display"
                value={newDevice.name}
                onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">ThingSpeak Channel</label>
              <input
                type="text"
                placeholder="e.g., CH123456"
                value={newDevice.thingspeak_channel}
                onChange={(e) => setNewDevice({ ...newDevice, thingspeak_channel: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Group</label>
              <select
                value={newDevice.group}
                onChange={(e) => setNewDevice({ ...newDevice, group: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">No Group</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end gap-2">
              <Button
                onClick={addDevice}
                className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                Register
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

      {/* Add Group Form */}
      {showGroupForm && (
        <Card className="p-6 mb-6 border-primary/20 bg-card/50 backdrop-blur">
          <h3 className="font-semibold mb-4">Create New Group</h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g., Conference Rooms"
              value={newGroup}
              onChange={(e) => setNewGroup(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button
              onClick={addGroup}
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            >
              Create
            </Button>
            <Button
              onClick={() => setShowGroupForm(false)}
              variant="outline"
              className="border-primary/50 text-primary hover:bg-primary/10"
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Groups and Devices */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Groups Sidebar */}
        <div className="lg:col-span-1">
          <Card className="border-primary/20 bg-card/50 backdrop-blur">
            <div className="p-4 border-b border-border/50">
              <h3 className="font-semibold">Groups</h3>
            </div>
            <div className="divide-y divide-border/50">
              <button
                onClick={() => setSelectedGroup(null)}
                className={`w-full text-left px-4 py-3 transition-colors ${
                  selectedGroup === null ? "bg-primary/10 text-primary" : "hover:bg-primary/5"
                }`}
              >
                All Devices ({devices.length})
              </button>
              {groups.map((group) => (
                <div key={group.id} className="flex items-center justify-between px-4 py-3 hover:bg-primary/5">
                  <button
                    onClick={() => setSelectedGroup(group.id)}
                    className={`flex-1 text-left transition-colors ${
                      selectedGroup === group.id ? "text-primary font-semibold" : ""
                    }`}
                  >
                    {group.name} ({group.devices.length})
                  </button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive hover:text-destructive/80 h-6 w-6"
                    onClick={() => deleteGroup(group.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Devices Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredDevices.map((device) => (
              <Card
                key={device.id}
                className="border-primary/20 bg-card/50 backdrop-blur overflow-hidden hover:border-primary/50 transition-colors"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {device.status === "online" ? (
                        <Wifi className="w-5 h-5 text-green-500" />
                      ) : (
                        <WifiOff className="w-5 h-5 text-red-500" />
                      )}
                      <div>
                        <h3 className="font-semibold">{device.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {device.status === "online" ? "Online" : "Offline"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() => setEditingDevice(editingDevice === device.id ? null : device.id)}
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive hover:text-destructive/80"
                        onClick={() => deleteDevice(device.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Brightness Control */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium">Brightness</label>
                      <span className="text-sm font-semibold text-primary">{device.brightness}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={device.brightness}
                      onChange={(e) => updateBrightness(device.id, Number.parseInt(e.target.value))}
                      className="w-full"
                      disabled={device.status === "offline"}
                    />
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                    <div className="bg-primary/10 rounded p-2">
                      <p className="text-muted-foreground text-xs">Temperature</p>
                      <p className="font-semibold flex items-center gap-1">
                        <Thermometer className="w-3 h-3" />
                        {device.temperature}°C
                      </p>
                    </div>
                    <div className="bg-primary/10 rounded p-2">
                      <p className="text-muted-foreground text-xs">Power</p>
                      <p className="font-semibold flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        {device.power_consumption}W
                      </p>
                    </div>
                    <div className="bg-primary/10 rounded p-2">
                      <p className="text-muted-foreground text-xs">Signal</p>
                      <p className="font-semibold">{device.signal_strength}%</p>
                    </div>
                    <div className="bg-primary/10 rounded p-2">
                      <p className="text-muted-foreground text-xs">Uptime</p>
                      <p className="font-semibold">{device.uptime}</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-1 text-xs mb-4 pb-4 border-b border-border/50">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ThingSpeak:</span>
                      <span className="font-mono text-primary">{device.thingspeak_channel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Firmware:</span>
                      <span className="font-medium">{device.firmware_version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Sync:</span>
                      <span className="font-medium">{device.last_sync}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => toggleDeviceStatus(device.id)}
                      className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                    >
                      {device.status === "online" ? "Go Offline" : "Go Online"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-primary/50 text-primary hover:bg-primary/10 bg-transparent"
                    >
                      Update
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
