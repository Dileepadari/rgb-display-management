"use client"

import type React from "react"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, Trash2, Play, Pause, Send, ArrowUp, ArrowDown, GripVertical } from "lucide-react"
import useSWR from "swr"
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { PlaylistItem } from "@/lib/playlist-schema"

interface Playlist {
  id: string
  name: string
  description: string
  scenes: PlaylistItem[]
  is_active: boolean
  loop: boolean
  shuffle: boolean
}

interface Scene {
  id: string
  name: string
}

interface Device {
  id: string
  name: string
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function PlaylistManagerComplete() {
  const { data: playlists, isLoading, mutate } = useSWR<Playlist[]>("/api/playlists", fetcher)
  const { data: allScenes } = useSWR<Scene[]>("/api/scenes", fetcher)
  // "__"-prefixed scenes are auto-managed (e.g. the Devices page's Identify
  // test pattern) - not something the user should be able to add to a playlist.
  const scenes = allScenes?.filter((s) => !s.name.startsWith("__"))
  const { data: devices } = useSWR<Device[]>("/api/devices", fetcher)
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    loop: true,
    shuffle: false,
  })
  const [loading, setLoading] = useState(false)

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/playlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, scenes: [] }),
      })

      if (!response.ok) throw new Error("Failed to create playlist")

      await mutate()
      setFormData({ name: "", description: "", loop: true, shuffle: false })
      setShowForm(false)
      toast.success("Playlist created")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error creating playlist")
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePlaylist = async (id: string) => {
    try {
      const response = await fetch(`/api/playlists/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete playlist")
      await mutate()
      if (selectedPlaylist?.id === id) setSelectedPlaylist(null)
      toast.success("Playlist deleted")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error deleting playlist")
    }
  }

  const handleTogglePlaylist = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/playlists/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !isActive }),
      })
      if (!response.ok) throw new Error("Failed to toggle playlist")
      await mutate()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error toggling playlist")
    }
  }

  return (
    <div className="w-full space-y-6 px-4 py-6 md:px-8 lg:px-10">
      <PageHeader
        title="Playlist Manager"
        purpose="Rotate scenes automatically across your displays, each for a duration you choose."
        howTo={
          <ul>
            <li>Create a playlist, then add scenes to it and set how long each one stays on screen.</li>
            <li>Drag items by the grip handle to reorder them, or use the arrow buttons.</li>
            <li>Assign the playlist to a device from the Devices page to start the rotation.</li>
          </ul>
        }
        actions={
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Playlist
          </Button>
        }
      />

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Playlist</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreatePlaylist} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="playlist-name">Playlist Name</Label>
                  <Input
                    id="playlist-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="My Playlist"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="playlist-description">Description</Label>
                  <Input
                    id="playlist-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Playlist description"
                  />
                </div>
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <Switch
                    checked={formData.loop}
                    onCheckedChange={(checked) => setFormData({ ...formData, loop: checked })}
                  />
                  Loop
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Switch
                    checked={formData.shuffle}
                    onCheckedChange={(checked) => setFormData({ ...formData, shuffle: checked })}
                  />
                  Shuffle
                </label>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Playlist"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="stagger grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="grid gap-4">
          {!isLoading && (!playlists || playlists.length === 0) && (
            <p className="text-muted-foreground text-sm">No playlists yet. Create one to get started.</p>
          )}
          {(Array.isArray(playlists) ? playlists : [])?.map((playlist) => (
            <Card
              key={playlist.id}
              className={`cursor-pointer transition ${selectedPlaylist?.id === playlist.id ? "ring-2 ring-primary" : ""}`}
              onClick={() => setSelectedPlaylist(playlist)}
            >
              <CardContent className="pt-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{playlist.name}</h3>
                      {playlist.is_active && (
                        <Badge variant="outline" className="border-success/30 bg-success/10 text-success">
                          Active
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm">{playlist.description}</p>
                    <div className="text-muted-foreground mt-2 flex gap-4 text-sm">
                      <span>{playlist.scenes?.length ?? 0} scenes</span>
                      <span>{playlist.loop ? "Loop: On" : "Loop: Off"}</span>
                      <span>{playlist.shuffle ? "Shuffle: On" : "Shuffle: Off"}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={playlist.is_active ? "default" : "outline"}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleTogglePlaylist(playlist.id, playlist.is_active)
                      }}
                    >
                      {playlist.is_active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive" onClick={(e) => e.stopPropagation()}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete {playlist.name}?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This playlist will be permanently deleted. This can&apos;t be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-white hover:bg-destructive/90"
                            onClick={() => handleDeletePlaylist(playlist.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedPlaylist && (
          <PlaylistItemsEditor
            key={selectedPlaylist.id}
            playlist={selectedPlaylist}
            scenes={Array.isArray(scenes) ? scenes : []}
            devices={Array.isArray(devices) ? devices : []}
            onSaved={async (updated) => {
              await mutate()
              setSelectedPlaylist(updated)
            }}
          />
        )}
      </div>
    </div>
  )
}

function SortablePlaylistItem({
  index,
  label,
  duration,
  onDurationChange,
  onMoveUp,
  onMoveDown,
  onRemove,
  isFirst,
  isLast,
}: {
  index: number
  label: string
  duration: number
  onDurationChange: (value: number) => void
  onMoveUp: () => void
  onMoveDown: () => void
  onRemove: () => void
  isFirst: boolean
  isLast: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: index })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="flex items-center gap-2 rounded-md border border-border bg-card p-2"
    >
      <button
        type="button"
        className="cursor-grab touch-none text-muted-foreground active:cursor-grabbing"
        aria-label={`Reorder ${label}`}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <span className="text-muted-foreground w-5 text-center font-mono text-xs">{index + 1}</span>
      <span className="flex-1 truncate text-sm">{label}</span>
      <Input
        type="number"
        min={1}
        value={duration}
        onChange={(e) => onDurationChange(Number(e.target.value))}
        className="w-20"
      />
      <span className="text-muted-foreground text-xs">sec</span>
      <Button size="icon-sm" variant="ghost" onClick={onMoveUp} disabled={isFirst} aria-label="Move up">
        <ArrowUp className="h-4 w-4" />
      </Button>
      <Button size="icon-sm" variant="ghost" onClick={onMoveDown} disabled={isLast} aria-label="Move down">
        <ArrowDown className="h-4 w-4" />
      </Button>
      <Button size="icon-sm" variant="ghost" onClick={onRemove} aria-label="Remove from playlist">
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  )
}

function PlaylistItemsEditor({
  playlist,
  scenes,
  devices,
  onSaved,
}: {
  playlist: Playlist
  scenes: Scene[]
  devices: Device[]
  onSaved: (playlist: Playlist) => void
}) {
  const [items, setItems] = useState<PlaylistItem[]>(playlist.scenes ?? [])
  const [addSceneId, setAddSceneId] = useState("")
  const [saving, setSaving] = useState(false)
  const [assignDeviceId, setAssignDeviceId] = useState("")
  const [assigning, setAssigning] = useState(false)

  const dirty = JSON.stringify(items) !== JSON.stringify(playlist.scenes ?? [])
  const sceneName = (id: string) => scenes.find((s) => s.id === id)?.name ?? "Unknown scene"

  const addItem = () => {
    if (!addSceneId) return
    setItems((prev) => [...prev, { scene_id: addSceneId, duration_seconds: 10 }])
    setAddSceneId("")
  }

  const updateDuration = (index: number, duration_seconds: number) => {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, duration_seconds } : it)))
  }

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  const moveItem = (index: number, dir: -1 | 1) => {
    setItems((prev) => {
      const next = [...prev]
      const target = index + dir
      if (target < 0 || target >= next.length) return prev
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  const reorderItems = (from: number, to: number) => {
    setItems((prev) => {
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next
    })
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/playlists/${playlist.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenes: items }),
      })
      if (!res.ok) throw new Error("Failed to save playlist")
      const updated = await res.json()
      onSaved(updated)
      toast.success("Playlist saved")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error saving playlist")
    } finally {
      setSaving(false)
    }
  }

  const handleAssign = async () => {
    if (!assignDeviceId) return
    setAssigning(true)
    try {
      const res = await fetch(`/api/devices/${assignDeviceId}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target_type: "playlist", playlist_id: playlist.id }),
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error ?? "Failed to assign playlist")
      if (body.warning) toast.warning(body.warning)
      else toast.success("Pushed to device")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error assigning playlist")
    } finally {
      setAssigning(false)
    }
  }

  return (
    <Card className="h-fit">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg">Editing: {playlist.name}</CardTitle>
        <Button size="sm" onClick={handleSave} disabled={!dirty || saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Select value={addSceneId} onValueChange={setAddSceneId}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Choose a scene to add" />
            </SelectTrigger>
            <SelectContent>
              {scenes.length === 0 && <div className="text-muted-foreground px-2 py-1.5 text-sm">No scenes yet</div>}
              {scenes.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={addItem} disabled={!addSceneId} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>

        <div className="space-y-2">
          {items.length === 0 ? (
            <p className="text-muted-foreground text-sm">No scenes in this playlist yet.</p>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={({ active, over }) => {
                if (over && active.id !== over.id) reorderItems(Number(active.id), Number(over.id))
              }}
            >
              <SortableContext items={items.map((_, i) => i)} strategy={verticalListSortingStrategy}>
                {items.map((item, i) => (
                  <SortablePlaylistItem
                    key={i}
                    index={i}
                    label={sceneName(item.scene_id)}
                    duration={item.duration_seconds}
                    onDurationChange={(v) => updateDuration(i, v)}
                    onMoveUp={() => moveItem(i, -1)}
                    onMoveDown={() => moveItem(i, 1)}
                    onRemove={() => removeItem(i)}
                    isFirst={i === 0}
                    isLast={i === items.length - 1}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>

        <div className="flex flex-wrap items-end gap-2 border-t border-border pt-4">
          <div className="flex-1 space-y-2">
            <Label>Push to device</Label>
            <Select value={assignDeviceId} onValueChange={setAssignDeviceId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a device" />
              </SelectTrigger>
              <SelectContent>
                {devices.length === 0 && <div className="text-muted-foreground px-2 py-1.5 text-sm">No devices yet</div>}
                {devices.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleAssign} disabled={!assignDeviceId || assigning} className="gap-2">
            <Send className="h-4 w-4" />
            {assigning ? "Pushing..." : "Push"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
