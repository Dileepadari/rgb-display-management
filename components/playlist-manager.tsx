"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Play, Clock, Repeat2, ChevronDown, ChevronUp } from "lucide-react"

interface PlaylistItem {
  id: string
  scene_id: string
  duration: number
  transition: string
}

interface Schedule {
  id: string
  type: "once" | "daily" | "weekly"
  startTime: string
  endTime?: string
  daysOfWeek?: string[]
  devices: string[]
}

interface Playlist {
  id: string
  name: string
  is_active: boolean
  items: PlaylistItem[]
  schedules: Schedule[]
  loop: boolean
  randomOrder: boolean
}

export default function PlaylistManager() {
  const [playlists, setPlaylists] = useState<Playlist[]>([
    {
      id: "1",
      name: "Morning Display",
      is_active: true,
      items: [
        { id: "1", scene_id: "scene-1", duration: 10, transition: "fade" },
        { id: "2", scene_id: "scene-2", duration: 15, transition: "scroll" },
      ],
      schedules: [
        {
          id: "sch-1",
          type: "daily",
          startTime: "08:00",
          endTime: "12:00",
          devices: ["1", "2"],
        },
      ],
      loop: true,
      randomOrder: false,
    },
    {
      id: "2",
      name: "Evening Display",
      is_active: false,
      items: [{ id: "3", scene_id: "scene-3", duration: 20, transition: "fade" }],
      schedules: [
        {
          id: "sch-2",
          type: "daily",
          startTime: "17:00",
          endTime: "21:00",
          devices: ["1"],
        },
      ],
      loop: true,
      randomOrder: false,
    },
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [expandedPlaylist, setExpandedPlaylist] = useState<string | null>(null)
  const [editingSchedule, setEditingSchedule] = useState<string | null>(null)
  const [newPlaylist, setNewPlaylist] = useState({ name: "" })
  const [newSchedule, setNewSchedule] = useState({
    type: "daily" as const,
    startTime: "09:00",
    endTime: "17:00",
    devices: [] as string[],
  })

  const devices = ["1", "2", "3"] // Mock devices

  const addPlaylist = () => {
    if (newPlaylist.name) {
      setPlaylists([
        ...playlists,
        {
          id: `playlist-${Date.now()}`,
          name: newPlaylist.name,
          is_active: false,
          items: [],
          schedules: [],
          loop: true,
          randomOrder: false,
        },
      ])
      setNewPlaylist({ name: "" })
      setShowAddForm(false)
    }
  }

  const deletePlaylist = (id: string) => {
    setPlaylists(playlists.filter((p) => p.id !== id))
  }

  const toggleActive = (id: string) => {
    setPlaylists(
      playlists.map((p) => ({
        ...p,
        is_active: p.id === id ? !p.is_active : false,
      })),
    )
  }

  const toggleLoop = (id: string) => {
    setPlaylists(playlists.map((p) => (p.id === id ? { ...p, loop: !p.loop } : p)))
  }

  const toggleRandomOrder = (id: string) => {
    setPlaylists(playlists.map((p) => (p.id === id ? { ...p, randomOrder: !p.randomOrder } : p)))
  }

  const addSchedule = (playlistId: string) => {
    setPlaylists(
      playlists.map((p) =>
        p.id === playlistId
          ? {
              ...p,
              schedules: [
                ...p.schedules,
                {
                  id: `sch-${Date.now()}`,
                  type: newSchedule.type,
                  startTime: newSchedule.startTime,
                  endTime: newSchedule.endTime,
                  devices: newSchedule.devices,
                },
              ],
            }
          : p,
      ),
    )
    setEditingSchedule(null)
    setNewSchedule({ type: "daily", startTime: "09:00", endTime: "17:00", devices: [] })
  }

  const deleteSchedule = (playlistId: string, scheduleId: string) => {
    setPlaylists(
      playlists.map((p) =>
        p.id === playlistId ? { ...p, schedules: p.schedules.filter((s) => s.id !== scheduleId) } : p,
      ),
    )
  }

  const addSceneToPlaylist = (playlistId: string) => {
    setPlaylists(
      playlists.map((p) =>
        p.id === playlistId
          ? {
              ...p,
              items: [
                ...p.items,
                {
                  id: `item-${Date.now()}`,
                  scene_id: `scene-${p.items.length + 1}`,
                  duration: 10,
                  transition: "fade",
                },
              ],
            }
          : p,
      ),
    )
  }

  const removeSceneFromPlaylist = (playlistId: string, itemId: string) => {
    setPlaylists(
      playlists.map((p) => (p.id === playlistId ? { ...p, items: p.items.filter((i) => i.id !== itemId) } : p)),
    )
  }

  const getTotalDuration = (items: PlaylistItem[]) => {
    return items.reduce((sum, item) => sum + item.duration, 0)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Playlist Manager</h2>
          <p className="text-muted-foreground">Create and manage display playlists with scheduling</p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
        >
          <Plus className="w-4 h-4" />
          New Playlist
        </Button>
      </div>

      {/* Add Playlist Form */}
      {showAddForm && (
        <Card className="p-6 mb-6 border-primary/20 bg-card/50 backdrop-blur">
          <h3 className="font-semibold mb-4">Create New Playlist</h3>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Playlist name"
              value={newPlaylist.name}
              onChange={(e) => setNewPlaylist({ name: e.target.value })}
              className="flex-1 px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button
              onClick={addPlaylist}
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            >
              Create
            </Button>
            <Button
              onClick={() => setShowAddForm(false)}
              variant="outline"
              className="border-primary/50 text-primary hover:bg-primary/10"
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Playlists List */}
      <div className="space-y-4">
        {playlists.map((playlist) => (
          <Card
            key={playlist.id}
            className={`border-primary/20 bg-card/50 backdrop-blur overflow-hidden transition-all ${
              playlist.is_active ? "ring-2 ring-primary" : ""
            }`}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  {playlist.is_active && <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />}
                  <div>
                    <h3 className="font-semibold">{playlist.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {playlist.items.length} scene{playlist.items.length !== 1 ? "s" : ""} • Total:{" "}
                      {getTotalDuration(playlist.items)}s
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => toggleActive(playlist.id)}
                    className={`gap-2 ${
                      playlist.is_active
                        ? "bg-gradient-to-r from-primary to-accent"
                        : "border-primary/50 text-primary hover:bg-primary/10"
                    }`}
                    variant={playlist.is_active ? "default" : "outline"}
                  >
                    <Play className="w-4 h-4" />
                    {playlist.is_active ? "Active" : "Activate"}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setExpandedPlaylist(expandedPlaylist === playlist.id ? null : playlist.id)}
                  >
                    {expandedPlaylist === playlist.id ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive hover:text-destructive/80"
                    onClick={() => deletePlaylist(playlist.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedPlaylist === playlist.id && (
                <>
                  {/* Playback Options */}
                  <div className="mb-4 pb-4 border-b border-border/50 flex gap-4">
                    <Button
                      size="sm"
                      onClick={() => toggleLoop(playlist.id)}
                      variant={playlist.loop ? "default" : "outline"}
                      className={`gap-2 ${
                        playlist.loop
                          ? "bg-gradient-to-r from-primary to-accent"
                          : "border-primary/50 text-primary hover:bg-primary/10"
                      }`}
                    >
                      <Repeat2 className="w-4 h-4" />
                      Loop
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => toggleRandomOrder(playlist.id)}
                      variant={playlist.randomOrder ? "default" : "outline"}
                      className={`gap-2 ${
                        playlist.randomOrder
                          ? "bg-gradient-to-r from-primary to-accent"
                          : "border-primary/50 text-primary hover:bg-primary/10"
                      }`}
                    >
                      Shuffle
                    </Button>
                  </div>

                  {/* Playlist Items */}
                  {playlist.items.length > 0 && (
                    <div className="mb-4 pb-4 border-b border-border/50">
                      <h4 className="font-semibold mb-3 text-sm">Scenes</h4>
                      <div className="space-y-2">
                        {playlist.items.map((item, idx) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between text-sm p-3 rounded bg-primary/5"
                          >
                            <span className="text-muted-foreground">
                              {idx + 1}. {item.scene_id}
                            </span>
                            <div className="flex gap-4 text-xs items-center">
                              <span>Duration: {item.duration}s</span>
                              <span className="text-primary">Transition: {item.transition}</span>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-destructive hover:text-destructive/80 h-6 w-6"
                                onClick={() => removeSceneFromPlaylist(playlist.id, item.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Schedules */}
                  <div className="mb-4 pb-4 border-b border-border/50">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Schedules ({playlist.schedules.length})
                      </h4>
                      <Button
                        size="sm"
                        onClick={() => setEditingSchedule(editingSchedule === playlist.id ? null : playlist.id)}
                        variant="outline"
                        className="border-primary/50 text-primary hover:bg-primary/10"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Schedule
                      </Button>
                    </div>

                    {/* Add Schedule Form */}
                    {editingSchedule === playlist.id && (
                      <div className="mb-3 p-3 rounded bg-primary/5 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium mb-1">Type</label>
                            <select
                              value={newSchedule.type}
                              onChange={(e) =>
                                setNewSchedule({
                                  ...newSchedule,
                                  type: e.target.value as "once" | "daily" | "weekly",
                                })
                              }
                              className="w-full px-2 py-1 rounded bg-input border border-border text-foreground text-sm"
                            >
                              <option value="once">Once</option>
                              <option value="daily">Daily</option>
                              <option value="weekly">Weekly</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1">Start Time</label>
                            <input
                              type="time"
                              value={newSchedule.startTime}
                              onChange={(e) => setNewSchedule({ ...newSchedule, startTime: e.target.value })}
                              className="w-full px-2 py-1 rounded bg-input border border-border text-foreground text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1">End Time</label>
                            <input
                              type="time"
                              value={newSchedule.endTime}
                              onChange={(e) => setNewSchedule({ ...newSchedule, endTime: e.target.value })}
                              className="w-full px-2 py-1 rounded bg-input border border-border text-foreground text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1">Devices</label>
                            <select
                              multiple
                              value={newSchedule.devices}
                              onChange={(e) =>
                                setNewSchedule({
                                  ...newSchedule,
                                  devices: Array.from(e.target.selectedOptions, (o) => o.value),
                                })
                              }
                              className="w-full px-2 py-1 rounded bg-input border border-border text-foreground text-sm"
                            >
                              {devices.map((d) => (
                                <option key={d} value={d}>
                                  Device {d}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => addSchedule(playlist.id)}
                            className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                          >
                            Add
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => setEditingSchedule(null)}
                            variant="outline"
                            className="flex-1 border-primary/50 text-primary hover:bg-primary/10"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Schedule List */}
                    {playlist.schedules.length > 0 && (
                      <div className="space-y-2">
                        {playlist.schedules.map((schedule) => (
                          <div
                            key={schedule.id}
                            className="flex items-center justify-between text-sm p-2 rounded bg-primary/5"
                          >
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-primary" />
                              <span>
                                {schedule.type === "daily" ? "Daily" : schedule.type === "weekly" ? "Weekly" : "Once"}{" "}
                                {schedule.startTime}-{schedule.endTime}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {schedule.devices.length} device{schedule.devices.length !== 1 ? "s" : ""}
                              </span>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-destructive hover:text-destructive/80 h-6 w-6"
                                onClick={() => deleteSchedule(playlist.id, schedule.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add Scene Button */}
                  <Button
                    size="sm"
                    onClick={() => addSceneToPlaylist(playlist.id)}
                    className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Scene to Playlist
                  </Button>
                </>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
