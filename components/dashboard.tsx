"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Activity, Zap, Tv, Play, TrendingUp, Wifi, WifiOff } from "lucide-react"
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
  const { data: devices, isLoading: devicesLoading } = useSWR<Device[]>("/api/devices", fetcher)
  // Ensure we always work with an array. Some API responses (or errors) may return
  // an object or null which would make `.filter`/`.map` crash at runtime.
  const devicesList: Device[] = Array.isArray(devices) ? devices : []
  const { data: scenes = [] } = useSWR<Scene[]>("/api/scenes", fetcher)
  const { data: playlists = [] } = useSWR<Playlist[]>("/api/playlists", fetcher)

  const activeDevices = devicesList.filter((d) => d.is_online).length
  const stats = {
    totalDevices: devicesList.length,
    activeDevices,
    totalScenes: scenes.length,
    totalPlaylists: playlists.length,
  }

  const statCards = [
    { label: "Total Devices", value: stats.totalDevices, icon: Zap },
    { label: "Active Devices", value: stats.activeDevices, icon: Activity },
    { label: "Scenes", value: stats.totalScenes, icon: Tv },
    { label: "Playlists", value: stats.totalPlaylists, icon: Play },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground text-sm">Monitor and manage your RGB displays</p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon
          return (
            <Card key={i} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold">{stat.value}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Devices Status */}
      <Card>
        <div className="border-b border-border p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Connected Devices</h3>
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4" />
              {activeDevices} of {stats.totalDevices} online
            </div>
          </div>
        </div>
        <div className="divide-y divide-border">
          {devicesLoading ? (
            <div className="space-y-4 p-6">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          ) : devicesList.length === 0 ? (
            <div className="text-muted-foreground p-6 text-center">
              <p>No devices connected yet. Add a device to get started.</p>
            </div>
          ) : (
            devicesList.map((device) => (
              <div key={device.id} className="hover:bg-accent flex items-center justify-between p-6 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`h-2.5 w-2.5 rounded-full ${device.is_online ? "bg-success animate-pulse" : "bg-destructive"}`} />
                  <div>
                    <p className="font-medium">{device.name}</p>
                    <p className="text-muted-foreground text-sm">ID: {device.device_id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-muted-foreground text-sm">Brightness</p>
                    <p className="text-lg font-semibold text-primary">{device.brightness}%</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      device.is_online
                        ? "border-success/30 bg-success/10 text-success"
                        : "border-destructive/30 bg-destructive/10 text-destructive"
                    }
                  >
                    {device.is_online ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                    {device.is_online ? "Online" : "Offline"}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="p-6">
          <h4 className="mb-4 font-semibold">System Health</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Device Uptime</span>
              <span className="text-sm font-semibold">99.2%</span>
            </div>
            <div className="bg-muted h-2 w-full rounded-full">
              <div className="h-2 rounded-full bg-primary" style={{ width: "99.2%" }} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="mb-4 font-semibold">Data Usage</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">This Month</span>
              <span className="text-sm font-semibold">2.4 GB</span>
            </div>
            <div className="bg-muted h-2 w-full rounded-full">
              <div className="h-2 rounded-full bg-primary" style={{ width: "45%" }} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="mb-4 font-semibold">Active Scenes</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Running Now</span>
              <span className="text-sm font-semibold">{Math.min(activeDevices, 3)} scenes</span>
            </div>
            <div className="bg-muted h-2 w-full rounded-full">
              <div
                className="h-2 rounded-full bg-primary"
                style={{ width: `${(Math.min(activeDevices, 3) / 3) * 100}%` }}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
