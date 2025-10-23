"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, Zap, Tv, Play, TrendingUp, Wifi } from "lucide-react"
import useSWR from "swr"

interface Device {
  id: string
  name: string
  device_id: string
  is_online: boolean
  brightness: number
  last_sync: string
}

interface Scene {
  id: string
  name: string
}

interface Playlist {
  id: string
  name: string
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function Dashboard() {
  const { data: devices = [] } = useSWR<Device[]>("/api/devices", fetcher)
  const { data: scenes = [] } = useSWR<Scene[]>("/api/scenes", fetcher)
  const { data: playlists = [] } = useSWR<Playlist[]>("/api/playlists", fetcher)

  const activeDevices = devices.filter((d) => d.is_online).length
  const stats = {
    totalDevices: devices.length,
    activeDevices,
    totalScenes: scenes.length,
    totalPlaylists: playlists.length,
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
        <p className="text-muted-foreground">Monitor and manage your RGB displays</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Devices", value: stats.totalDevices, icon: Zap, color: "from-primary to-accent" },
          {
            label: "Active Devices",
            value: stats.activeDevices,
            icon: Activity,
            color: "from-green-500 to-emerald-500",
          },
          { label: "Scenes", value: stats.totalScenes, icon: Tv, color: "from-blue-500 to-cyan-500" },
          { label: "Playlists", value: stats.totalPlaylists, icon: Play, color: "from-orange-500 to-red-500" },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <Card
              key={i}
              className="p-6 border-primary/20 bg-card/50 backdrop-blur hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Devices Status */}
      <Card className="border-primary/20 bg-card/50 backdrop-blur">
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Connected Devices</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              {activeDevices} of {stats.totalDevices} online
            </div>
          </div>
        </div>
        <div className="divide-y divide-border/50">
          {devices.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <p>No devices connected yet. Add a device to get started.</p>
            </div>
          ) : (
            devices.map((device) => (
              <div
                key={device.id}
                className="p-6 flex items-center justify-between hover:bg-primary/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-3 h-3 rounded-full ${device.is_online ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
                  />
                  <div>
                    <p className="font-semibold">{device.name}</p>
                    <p className="text-sm text-muted-foreground">ID: {device.device_id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm font-medium text-muted-foreground">Brightness</p>
                    <p className="text-lg font-bold text-primary">{device.brightness}%</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wifi className={`w-4 h-4 ${device.is_online ? "text-green-500" : "text-red-500"}`} />
                    <span className="text-sm">{device.is_online ? "Online" : "Offline"}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary/50 text-primary hover:bg-primary/10 bg-transparent"
                  >
                    Configure
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <Card className="p-6 border-primary/20 bg-card/50 backdrop-blur">
          <h4 className="font-semibold mb-4">System Health</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Device Uptime</span>
              <span className="text-sm font-semibold">99.2%</span>
            </div>
            <div className="w-full bg-border/50 rounded-full h-2">
              <div className="bg-gradient-to-r from-primary to-accent h-2 rounded-full" style={{ width: "99.2%" }} />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-primary/20 bg-card/50 backdrop-blur">
          <h4 className="font-semibold mb-4">Data Usage</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">This Month</span>
              <span className="text-sm font-semibold">2.4 GB</span>
            </div>
            <div className="w-full bg-border/50 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{ width: "45%" }} />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-primary/20 bg-card/50 backdrop-blur">
          <h4 className="font-semibold mb-4">Active Scenes</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Running Now</span>
              <span className="text-sm font-semibold">{Math.min(activeDevices, 3)} scenes</span>
            </div>
            <div className="w-full bg-border/50 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full"
                style={{ width: `${(Math.min(activeDevices, 3) / 3) * 100}%` }}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
