"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import {
  Users,
  Activity,
  TrendingUp,
  AlertCircle,
  Settings,
  Download,
  Filter,
  Search,
  MoreVertical,
  Trash2,
  Edit,
  Eye,
} from "lucide-react"

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  // Analytics data
  const analyticsData = [
    { month: "Jan", devices: 45, scenes: 120, playlists: 30 },
    { month: "Feb", devices: 52, scenes: 145, playlists: 38 },
    { month: "Mar", devices: 48, scenes: 135, playlists: 35 },
    { month: "Apr", devices: 61, scenes: 165, playlists: 45 },
    { month: "May", devices: 55, scenes: 150, playlists: 42 },
    { month: "Jun", devices: 67, scenes: 180, playlists: 52 },
  ]

  const deviceStatusData = [
    { name: "Online", value: 156, color: "#10b981" },
    { name: "Offline", value: 12, color: "#ef4444" },
    { name: "Idle", value: 32, color: "#f59e0b" },
  ]

  const systemHealthData = [
    { metric: "CPU Usage", value: 45, status: "good" },
    { metric: "Memory", value: 62, status: "good" },
    { metric: "Network", value: 38, status: "good" },
    { metric: "Storage", value: 71, status: "warning" },
  ]

  const recentUsers = [
    { id: 1, name: "John Doe", email: "john@example.com", devices: 5, status: "active", joined: "2024-01-15" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", devices: 3, status: "active", joined: "2024-02-20" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", devices: 8, status: "inactive", joined: "2024-01-10" },
    { id: 4, name: "Alice Brown", email: "alice@example.com", devices: 2, status: "active", joined: "2024-03-05" },
    { id: 5, name: "Charlie Wilson", email: "charlie@example.com", devices: 6, status: "active", joined: "2024-02-28" },
  ]

  const systemLogs = [
    { id: 1, timestamp: "2024-06-15 14:32:10", event: "Device connected", severity: "info", user: "System" },
    { id: 2, timestamp: "2024-06-15 14:28:45", event: "Scene updated", severity: "info", user: "John Doe" },
    {
      id: 3,
      timestamp: "2024-06-15 14:15:22",
      event: "High memory usage detected",
      severity: "warning",
      user: "System",
    },
    { id: 4, timestamp: "2024-06-15 14:02:18", event: "Playlist executed", severity: "info", user: "Jane Smith" },
    { id: 5, timestamp: "2024-06-15 13:45:30", event: "Device offline", severity: "error", user: "System" },
  ]

  const filteredUsers = recentUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || user.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "error":
        return "text-red-500"
      case "warning":
        return "text-yellow-500"
      default:
        return "text-green-500"
    }
  }

  const getStatusBadge = (status) => {
    return status === "active" ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">System overview and management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        {["overview", "users", "system", "logs"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === tab
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6 border-primary/20 bg-card/50 backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Devices</p>
                  <p className="text-3xl font-bold mt-2">200</p>
                  <p className="text-green-500 text-sm mt-2">+12 this month</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-primary" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-accent/20 bg-card/50 backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Active Users</p>
                  <p className="text-3xl font-bold mt-2">1,234</p>
                  <p className="text-green-500 text-sm mt-2">+8% from last week</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-accent" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-secondary/20 bg-card/50 backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Scenes</p>
                  <p className="text-3xl font-bold mt-2">5,678</p>
                  <p className="text-green-500 text-sm mt-2">+234 this month</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-secondary" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-destructive/20 bg-card/50 backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">System Alerts</p>
                  <p className="text-3xl font-bold mt-2">3</p>
                  <p className="text-yellow-500 text-sm mt-2">1 critical</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-destructive/20 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-destructive" />
                </div>
              </div>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 p-6 border-primary/20 bg-card/50 backdrop-blur">
              <h3 className="text-lg font-semibold mb-4">Growth Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="devices" stroke="#a78bfa" strokeWidth={2} />
                  <Line type="monotone" dataKey="scenes" stroke="#22d3ee" strokeWidth={2} />
                  <Line type="monotone" dataKey="playlists" stroke="#fb923c" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6 border-accent/20 bg-card/50 backdrop-blur">
              <h3 className="text-lg font-semibold mb-4">Device Status</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={deviceStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {deviceStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {deviceStatusData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* System Health */}
          <Card className="p-6 border-primary/20 bg-card/50 backdrop-blur">
            <h3 className="text-lg font-semibold mb-4">System Health</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {systemHealthData.map((item) => (
                <div key={item.metric} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.metric}</span>
                    <span className="text-sm font-semibold">{item.value}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        item.status === "good"
                          ? "bg-gradient-to-r from-green-500 to-emerald-500"
                          : "bg-gradient-to-r from-yellow-500 to-orange-500"
                      }`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="space-y-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <Card className="border-primary/20 bg-card/50 backdrop-blur overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Devices</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Joined</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                      <td className="px-6 py-4 text-sm">{user.name}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{user.email}</td>
                      <td className="px-6 py-4 text-sm">{user.devices}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{user.joined}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <button className="p-1 hover:bg-primary/20 rounded transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 hover:bg-primary/20 rounded transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1 hover:bg-destructive/20 rounded transition-colors">
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* System Tab */}
      {activeTab === "system" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 border-primary/20 bg-card/50 backdrop-blur">
              <h3 className="text-lg font-semibold mb-4">Server Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">API Server</span>
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-sm font-medium">Running</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Database</span>
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-sm font-medium">Connected</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Cache Server</span>
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-sm font-medium">Active</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Message Queue</span>
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <span className="text-sm font-medium">Degraded</span>
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-accent/20 bg-card/50 backdrop-blur">
              <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Response Time</span>
                    <span className="text-sm font-semibold">145ms</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-1/3 bg-green-500" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Request Rate</span>
                    <span className="text-sm font-semibold">2.3K/min</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-blue-500" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Error Rate</span>
                    <span className="text-sm font-semibold">0.2%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-1/12 bg-green-500" />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6 border-primary/20 bg-card/50 backdrop-blur">
            <h3 className="text-lg font-semibold mb-4">Backup Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                <div>
                  <p className="font-medium">Last Backup</p>
                  <p className="text-sm text-muted-foreground">2024-06-15 02:30 AM</p>
                </div>
                <Button size="sm" variant="outline">
                  Backup Now
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg">
                <div>
                  <p className="font-medium">Backup Size</p>
                  <p className="text-sm text-muted-foreground">2.4 GB</p>
                </div>
                <span className="text-sm font-semibold">Healthy</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Logs Tab */}
      {activeTab === "logs" && (
        <Card className="border-primary/20 bg-card/50 backdrop-blur">
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">System Logs</h3>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
            <div className="space-y-2">
              {systemLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-4 p-3 hover:bg-primary/5 rounded-lg transition-colors"
                >
                  <div className={`w-2 h-2 rounded-full mt-2 ${getSeverityColor(log.severity)}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-sm">{log.event}</p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{log.timestamp}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">By: {log.user}</p>
                  </div>
                  <button className="p-1 hover:bg-primary/20 rounded transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

export default AdminDashboard
