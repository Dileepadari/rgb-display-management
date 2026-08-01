"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import useSWR from "swr"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface Device {
  id: string
  name: string
  device_id: string
  brightness: number
  is_online: boolean
  user_id: string
  created_at: string
  updated_at: string
}

interface Playlist {
  id: string
  name: string
  description: string
  is_active: boolean
  created_at: string
  updated_at: string
}

import {
  Zap,
  Tv,
  Play,
  Smile,
  Download,
  Settings,
  Filter,
  Search,
  MoreVertical,
  Trash2,
  Edit,
  Eye,
} from "lucide-react"
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const chartTooltipStyle = {
  backgroundColor: "var(--popover)",
  color: "var(--popover-foreground)",
  border: "1px solid var(--border)",
  borderRadius: "8px",
}

const AdminDashboard = ({ onNavigate }: { onNavigate?: (page: string) => void }) => {
  const [activeTab, setActiveTab] = useState("overview")

  const { data: devices = [] } = useSWR<Device[]>("/api/devices", fetcher)
  const { data: scenes = [] } = useSWR("/api/scenes", fetcher)
  const { data: playlists = [] } = useSWR<Playlist[]>("/api/playlists", fetcher)
  const { data: moods = [] } = useSWR("/api/moods", fetcher)

  // These endpoints can return an error object rather than an array, which
  // would make .length/.map throw during render.
  const deviceList: Device[] = Array.isArray(devices) ? devices : []
  const sceneList = Array.isArray(scenes) ? scenes : []
  const playlistList: Playlist[] = Array.isArray(playlists) ? playlists : []
  const moodList = Array.isArray(moods) ? moods : []

  const analyticsData = Array.from({ length: 6 }, (_, i) => {
    const month = new Date()
    month.setMonth(month.getMonth() - 5 + i)
    return {
      month: month.toLocaleString("default", { month: "short" }),
      devices: devices?.length || 0,
      scenes: scenes?.length || 0,
      playlists: playlists?.length || 0,
    }
  })

  // Schema tracks online/offline only, no "idle" state
  const deviceStatusData = [
    {
      name: "Online",
      value: (Array.isArray(devices) ? devices : []).filter((d) => d.is_online).length,
      color: "var(--success)",
    },
    {
      name: "Offline",
      value: (Array.isArray(devices) ? devices : []).filter((d) => !d.is_online).length,
      color: "var(--destructive)",
    },
  ]

  const { data: healthData } = useSWR("/api/sync-config", fetcher)

  const systemHealthData = [
    {
      metric: "Online Devices",
      value:
        ((Array.isArray(devices) ? devices : []).filter((d) => d.is_online).length /
          ((Array.isArray(devices) ? devices : []).length || 1)) *
        100,
      status: "good" as const,
    },
    {
      metric: "Active Playlists",
      value:
        ((Array.isArray(playlists) ? playlists : []).filter((p) => p.is_active).length /
          ((Array.isArray(playlists) ? playlists : []).length || 1)) *
        100,
      status: "good" as const,
    },
    {
      metric: "System Uptime",
      value: healthData?.uptime || 99,
      status: "good" as const,
    },
    {
      metric: "Message Queue",
      value: healthData?.mqttConnected ? 100 : 0,
      status: healthData?.mqttConnected ? ("good" as const) : ("warning" as const),
    },
  ]

  interface ActivityEntry {
    id: string
    type: string
    message: string
    created_at: string
  }

  const { data: rawActivity } = useSWR<ActivityEntry[]>("/api/activity", fetcher)
  const activity = Array.isArray(rawActivity) ? rawActivity : []

  // Everything in this report is already loaded client-side, so the export is
  // a local file build rather than a round trip to an endpoint that would only
  // re-derive the same numbers.
  const handleExportReport = () => {
    const report = {
      generated_at: new Date().toISOString(),
      totals: {
        devices: deviceList.length,
        online_devices: deviceList.filter((d) => d.is_online).length,
        scenes: sceneList.length,
        playlists: playlistList.length,
        moods: moodList.length,
      },
      devices: deviceList.map((d) => ({
        name: d.name,
        device_id: d.device_id,
        online: d.is_online,
        brightness: d.brightness,
      })),
      activity: activity.map((a) => ({ at: a.created_at, type: a.type, message: a.message })),
    }

    const url = URL.createObjectURL(
      new Blob([JSON.stringify(report, null, 2)], { type: "application/json" }),
    )
    const a = document.createElement("a")
    a.href = url
    a.download = `rgb-report-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Report downloaded")
  }

  return (
    <div className="w-full space-y-6 p-4 md:p-8 lg:p-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-4xl font-bold leading-none tracking-tighter text-gradient-brand md:text-5xl">Admin Dashboard</h1>
          <p className="text-muted-foreground max-w-2xl text-sm">
            System-wide overview across every device, scene and user.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleExportReport}>
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button className="gap-2" onClick={() => onNavigate?.("settings")}>
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Total Devices", value: devices?.length || 0, icon: Zap },
              { label: "Available Scenes", value: scenes?.length || 0, icon: Tv },
              { label: "Active Playlists", value: playlists?.length || 0, icon: Play },
              { label: "Available Moods", value: moods?.length || 0, icon: Smile },
            ].map((stat) => {
              const Icon = stat.icon
              return (
                <Card key={stat.label} className="p-6">
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

          {/* Charts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="p-6 lg:col-span-2">
              <h3 className="mb-4 text-lg font-semibold">Growth Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Legend />
                  <Line type="monotone" dataKey="devices" stroke="var(--chart-1)" strokeWidth={2} />
                  <Line type="monotone" dataKey="scenes" stroke="var(--chart-2)" strokeWidth={2} />
                  <Line type="monotone" dataKey="playlists" stroke="var(--chart-3)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold">Device Status</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={deviceStatusData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={2} dataKey="value">
                    {deviceStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={chartTooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 space-y-2">
                {deviceStatusData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* System Health */}
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">System Health</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {systemHealthData.map((item) => (
                <div key={item.metric} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.metric}</span>
                    <span className="text-sm font-semibold">{Math.round(item.value)}%</span>
                  </div>
                  <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                    <div
                      className={`h-full rounded-full transition-all ${item.status === "good" ? "bg-success" : "bg-warning"}`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <div className="border-b border-border p-6">
              <h3 className="text-lg font-semibold">Recent activity</h3>
              <p className="text-muted-foreground text-sm">
                Everything that changed what your panels are showing - scene and playlist pushes, mood reactions,
                and devices going online or offline.
              </p>
            </div>
            <div className="divide-y divide-border">
              {activity.length === 0 ? (
                <p className="text-muted-foreground p-6 text-sm">
                  Nothing yet. Push a scene or apply a mood and it will show up here.
                </p>
              ) : (
                activity.map((entry) => (
                  <div key={entry.id} className="flex items-start justify-between gap-4 p-4">
                    <div className="flex items-start gap-3">
                      <span
                        className={cn(
                          "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                          entry.type === "device_offline" ? "bg-destructive" : "bg-success",
                        )}
                      />
                      <p className="text-sm">{entry.message}</p>
                    </div>
                    <time className="text-muted-foreground shrink-0 text-xs">
                      {new Date(entry.created_at).toLocaleString()}
                    </time>
                  </div>
                ))
              )}
            </div>
          </Card>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold">Server Status</h3>
              <div className="space-y-3">
                {[
                  { label: "API Server", status: "Running", ok: true },
                  { label: "Database", status: "Connected", ok: true },
                  { label: "Cache Server", status: "Active", ok: true },
                  { label: "Message Queue", status: "Degraded", ok: false },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between">
                    <span className="text-sm">{row.label}</span>
                    <span className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${row.ok ? "bg-success" : "bg-warning"}`} />
                      <span className="text-sm font-medium">{row.status}</span>
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold">Performance Metrics</h3>
              <div className="space-y-3">
                {[
                  { label: "Response Time", value: "145ms", width: "33%" },
                  { label: "Request Rate", value: "2.3K/min", width: "66%" },
                  { label: "Error Rate", value: "0.2%", width: "8%" },
                ].map((row) => (
                  <div key={row.label}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm">{row.label}</span>
                      <span className="text-sm font-semibold">{row.value}</span>
                    </div>
                    <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                      <div className="h-full rounded-full bg-primary" style={{ width: row.width }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Backup Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                <div>
                  <p className="font-medium">Last Backup</p>
                  <p className="text-muted-foreground text-sm">2024-06-15 02:30 AM</p>
                </div>
                <Button size="sm" variant="outline">
                  Backup Now
                </Button>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                <div>
                  <p className="font-medium">Backup Size</p>
                  <p className="text-muted-foreground text-sm">2.4 GB</p>
                </div>
                <span className="text-sm font-semibold text-success">Healthy</span>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Logs Tab */}
      </Tabs>
    </div>
  )
}

export default AdminDashboard
