"use client"

import { formatDistanceToNow } from "date-fns"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { SceneThumbnail } from "@/components/scene-thumbnail"
import { Activity, Zap, Tv, Play, TrendingUp, Wifi, WifiOff, Plus, MonitorPlay, History } from "lucide-react"
import useSWR from "swr"
import type { SceneElement } from "@/lib/scene-schema"

interface Device {
  id: string
  name: string
  device_id: string
  is_online: boolean
  brightness: number
  last_sync: string
  panel_width: number
  panel_height: number
}

interface Scene {
  id: string
  name: string
  panel_width: number
  panel_height: number
  elements: SceneElement[] | null
}

interface Playlist {
  id: string
  name: string
}

interface Assignment {
  device_id: string
  target_type: "scene" | "playlist"
  scene_id: string | null
  playlist_id: string | null
}

interface ActivityEntry {
  id: string
  type: "assign" | "device_online" | "device_offline"
  message: string
  created_at: string
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function Dashboard({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const { data: devices, isLoading: devicesLoading } = useSWR<Device[]>("/api/devices", fetcher)
  // Ensure we always work with an array. Some API responses (or errors) may return
  // an object or null which would make `.filter`/`.map` crash at runtime.
  const devicesList: Device[] = Array.isArray(devices) ? devices : []
  const { data: scenes = [] } = useSWR<Scene[]>("/api/scenes", fetcher)
  const { data: playlists = [] } = useSWR<Playlist[]>("/api/playlists", fetcher)
  const { data: assignments } = useSWR<Assignment[]>("/api/device-assignments", fetcher)
  const { data: activity } = useSWR<ActivityEntry[]>("/api/activity", fetcher, { refreshInterval: 30_000 })

  const scenesList: Scene[] = Array.isArray(scenes) ? scenes : []
  const assignmentsList: Assignment[] = Array.isArray(assignments) ? assignments : []
  const activityList: ActivityEntry[] = Array.isArray(activity) ? activity : []

  const sceneById = new Map(scenesList.map((s) => [s.id, s]))
  const assignmentByDevice = new Map(assignmentsList.map((a) => [a.device_id, a]))

  const activeDevices = devicesList.filter((d) => d.is_online).length
  const stats = {
    totalDevices: devicesList.length,
    activeDevices,
    totalScenes: scenesList.length,
    totalPlaylists: Array.isArray(playlists) ? playlists.length : 0,
  }

  const statCards = [
    { label: "Total Devices", value: stats.totalDevices, icon: Zap },
    { label: "Active Devices", value: stats.activeDevices, icon: Activity },
    { label: "Scenes", value: stats.totalScenes, icon: Tv },
    { label: "Playlists", value: stats.totalPlaylists, icon: Play },
  ]

  const quickActions = [
    { label: "New Scene", page: "scenes" },
    { label: "New Playlist", page: "playlists" },
    { label: "Add Device", page: "devices" },
  ]

  // A device shows a live preview only when a single scene is assigned -
  // playlists rotate, so a still frame would misrepresent what's on the panel.
  const previewFor = (device: Device) => {
    const assignment = assignmentByDevice.get(device.id)
    if (!assignment || assignment.target_type !== "scene" || !assignment.scene_id) return null
    const scene = sceneById.get(assignment.scene_id)
    if (!scene) return null
    return scene
  }

  return (
    <div className="w-full px-4 py-6 md:px-8 lg:px-10">
      {/* Hero */}
      <div className="animate-scale-in gradient-mesh mb-8 overflow-hidden rounded-2xl border border-border p-8 md:p-10">
        <h1 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
          <span className="text-gradient-brand">RGB Display Manager</span>
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground md:text-base">
          Author scenes, rotate them in playlists, and push them to your LED panels - all from one place.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {quickActions.map((action) => (
            <Button
              key={action.page}
              variant="secondary"
              className="hover-lift gap-2"
              onClick={() => onNavigate?.(action.page)}
            >
              <Plus className="h-4 w-4" />
              {action.label}
            </Button>
          ))}
          <span className="hidden items-center self-center pl-2 text-xs text-muted-foreground sm:inline-flex">
            Press <kbd className="mx-1 rounded border border-border bg-muted px-1.5 py-0.5 font-mono">Ctrl K</kbd> to
            search
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="hover-lift animate-slide-up p-6" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                  <p className="mt-2 font-mono text-3xl font-bold">{stat.value}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Devices Status */}
        <Card className="xl:col-span-2">
          <div className="border-b border-border p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg font-semibold">Connected Devices</h3>
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
              devicesList.map((device) => {
                const scene = previewFor(device)
                return (
                  <div
                    key={device.id}
                    className="hover:bg-accent flex flex-wrap items-center justify-between gap-4 p-6 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`h-2.5 w-2.5 rounded-full ${device.is_online ? "bg-success animate-pulse" : "bg-destructive"}`}
                      />
                      <div className="w-28 shrink-0 overflow-hidden rounded-md border border-border bg-black">
                        {scene ? (
                          <SceneThumbnail
                            width={scene.panel_width}
                            height={scene.panel_height}
                            elements={scene.elements ?? []}
                          />
                        ) : (
                          <div className="flex aspect-video items-center justify-center text-muted-foreground">
                            <MonitorPlay className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{device.name}</p>
                        <p className="text-muted-foreground font-mono text-xs">{device.device_id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-muted-foreground text-sm">Brightness</p>
                        <p className="font-mono text-lg font-semibold text-primary">{device.brightness}%</p>
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
                      <Button variant="outline" size="sm" onClick={() => onNavigate?.("devices")}>
                        Configure
                      </Button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </Card>

        {/* Activity Feed */}
        <Card>
          <div className="border-b border-border p-6">
            <h3 className="font-heading flex items-center gap-2 text-lg font-semibold">
              <History className="h-4 w-4 text-primary" />
              Recent Activity
            </h3>
          </div>
          <div className="divide-y divide-border">
            {activityList.length === 0 ? (
              <p className="text-muted-foreground p-6 text-sm">
                Nothing yet. Assigning a scene or a device coming online will show up here.
              </p>
            ) : (
              activityList.map((entry) => (
                <div key={entry.id} className="flex gap-3 p-4">
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                      entry.type === "device_offline" ? "bg-destructive" : "bg-primary"
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="text-sm leading-snug">{entry.message}</p>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
