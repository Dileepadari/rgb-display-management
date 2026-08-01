"use client"

import type React from "react"

import { formatDistanceToNow } from "date-fns"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { SceneThumbnail } from "@/components/scene-thumbnail"
import { Mascot } from "@/components/mascot"
import { CountUp } from "@/components/ui/count-up"
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
  type: "assign" | "device_online" | "device_offline" | "mood" | "mood_cleared"
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

  // The mascot mirrors the fleet rather than being decoration: asleep when
  // nothing is on, waving when panels are live, thinking while data loads.
  const mascotState = devicesLoading
    ? "think"
    : devicesList.length === 0
      ? "sleep"
      : activeDevices > 0
        ? "wave"
        : "sleep"

  return (
    <div className="w-full px-4 py-6 md:px-8 lg:px-10">
      {/* Cover */}
      <div className="grain relative mb-6 overflow-hidden rounded-2xl border border-border bg-card p-6 md:p-9">
        <div
          aria-hidden
          className="animate-drift pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full opacity-45 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--primary), transparent 68%)" }}
        />
        <div
          aria-hidden
          className="animate-drift pointer-events-none absolute -bottom-40 left-1/3 h-72 w-72 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--tertiary-accent), transparent 68%)", animationDelay: "-7s" }}
        />

        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div className="min-w-0">
            <p className="text-muted-foreground mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em]">
              <span className={`h-1.5 w-1.5 rounded-full ${activeDevices > 0 ? "animate-soft-pulse bg-success" : "bg-muted-foreground"}`} />
              {activeDevices > 0 ? `${activeDevices} panel${activeDevices === 1 ? "" : "s"} live` : "All panels idle"}
            </p>
            <h1 className="font-heading text-4xl font-bold leading-[0.95] tracking-tight md:text-6xl">
              <span className="text-gradient-brand">Your panels,</span>
              <br />
              on your terms.
            </h1>
            <p className="text-muted-foreground mt-3 max-w-md text-sm leading-relaxed">
              Author scenes, rotate them in playlists, send a mood — then push it all to the wall.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              {quickActions.map((action) => (
                <Button key={action.page} variant="secondary" className="spring gap-2" onClick={() => onNavigate?.(action.page)}>
                  <Plus className="h-4 w-4" />
                  {action.label}
                </Button>
              ))}
              <span className="text-muted-foreground hidden items-center self-center pl-2 text-xs sm:inline-flex">
                or press <kbd className="mx-1 rounded border border-border bg-muted px-1.5 py-0.5 font-mono">Ctrl K</kbd>
              </span>
            </div>
          </div>

          <Mascot state={mascotState} px={112} className="shrink-0 drop-shadow-lg" />
        </div>
      </div>

      {/* Stats read as a compact instrument strip rather than four big tiles
          competing with the content they describe. */}
      <div className="stagger mb-6 grid grid-cols-2 overflow-hidden rounded-xl border border-border bg-card md:grid-cols-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              style={{ "--stagger-index": i } as React.CSSProperties}
              className="flex items-center gap-3 border-b border-r border-border px-5 py-4 last:border-r-0 md:border-b-0"
            >
              <Icon className="text-muted-foreground h-4 w-4 shrink-0" />
              <div className="min-w-0">
                <p className="font-mono text-2xl font-semibold leading-none tabular-nums">
                  <CountUp value={stat.value} />
                </p>
                <p className="text-muted-foreground mt-1 truncate text-[11px] uppercase tracking-wider">{stat.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.7fr_1fr]">
        {/* The panel wall leads: what's actually on the hardware, at a size
            worth looking at, rather than a name and a status dot. */}
        <section>
          <div className="mb-3 flex items-end justify-between">
            <div>
              <h2 className="font-heading text-xl font-semibold tracking-tight">The wall</h2>
              <p className="text-muted-foreground text-xs">What each panel is showing right now</p>
            </div>
            <span className="text-muted-foreground font-mono text-xs">
              {activeDevices}/{stats.totalDevices} online
            </span>
          </div>

          {devicesLoading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Skeleton className="aspect-square w-full" />
              <Skeleton className="aspect-square w-full" />
            </div>
          ) : devicesList.length === 0 ? (
            <Card className="flex flex-col items-center gap-3 p-10 text-center">
              <Mascot state="sleep" px={72} />
              <p className="text-muted-foreground text-sm">No panels yet — add one and it&apos;ll appear here.</p>
              <Button size="sm" onClick={() => onNavigate?.("devices")} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Device
              </Button>
            </Card>
          ) : (
            <div className="stagger grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
              {devicesList.map((device, i) => {
                const scene = previewFor(device)
                return (
                  <Card
                    key={device.id}
                    style={{ "--stagger-index": i } as React.CSSProperties}
                    className="spring group cursor-pointer gap-0 overflow-hidden py-0"
                    onClick={() => onNavigate?.("devices")}
                  >
                    <div className="scanlines relative aspect-square w-full overflow-hidden bg-black">
                      {scene ? (
                        <SceneThumbnail
                          width={scene.panel_width}
                          height={scene.panel_height}
                          elements={scene.elements ?? []}
                        />
                      ) : (
                        <div className="text-muted-foreground flex h-full items-center justify-center">
                          <MonitorPlay className="h-6 w-6" />
                        </div>
                      )}
                      <Badge
                        variant="outline"
                        className={
                          device.is_online
                            ? "border-success/30 bg-success/15 text-success absolute right-2 top-2 backdrop-blur"
                            : "border-destructive/30 bg-destructive/15 text-destructive absolute right-2 top-2 backdrop-blur"
                        }
                      >
                        {device.is_online ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                        {device.is_online ? "Live" : "Offline"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between gap-2 p-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{device.name}</p>
                        <p className="text-muted-foreground truncate font-mono text-[11px]">{device.device_id}</p>
                      </div>
                      <p className="text-muted-foreground shrink-0 font-mono text-xs tabular-nums">
                        {device.brightness}%
                      </p>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </section>

        {/* Activity */}
        <section>
          <div className="mb-3">
            <h2 className="font-heading text-xl font-semibold tracking-tight">Activity</h2>
            <p className="text-muted-foreground text-xs">Every push, mood and status change</p>
          </div>
          <Card className="gap-0 py-0">
            <div className="divide-y divide-border">
              {activityList.length === 0 ? (
                <p className="text-muted-foreground p-6 text-sm">
                  Nothing yet. Push a scene or send a mood and it&apos;ll show up here.
                </p>
              ) : (
                activityList.map((entry) => (
                  <div key={entry.id} className="flex gap-3 p-4">
                    <span
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                        entry.type === "device_offline"
                          ? "bg-destructive"
                          : entry.type === "mood"
                            ? "bg-secondary-accent"
                            : "bg-primary"
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
        </section>
      </div>
    </div>
  )
}
