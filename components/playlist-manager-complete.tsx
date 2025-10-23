"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Play, Pause } from "lucide-react"
import useSWR from "swr"

interface Playlist {
  id: string
  name: string
  description: string
  scenes: string[]
  is_active: boolean
  loop: boolean
  shuffle: boolean
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function PlaylistManagerComplete() {
  const { data: playlists, mutate } = useSWR<Playlist[]>("/api/playlists", fetcher)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    loop: true,
    shuffle: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creating playlist")
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePlaylist = async (id: string) => {
    if (!confirm("Are you sure?")) return

    try {
      const response = await fetch(`/api/playlists/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete playlist")
      await mutate()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error deleting playlist")
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
      setError(err instanceof Error ? err.message : "Error toggling playlist")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Playlist Manager</h2>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          Create Playlist
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Playlist</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreatePlaylist} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Playlist Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="My Playlist"
                    required
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Playlist description"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.loop}
                    onChange={(e) => setFormData({ ...formData, loop: e.target.checked })}
                  />
                  Loop
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.shuffle}
                    onChange={(e) => setFormData({ ...formData, shuffle: e.target.checked })}
                  />
                  Shuffle
                </label>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
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

      <div className="grid gap-4">
        {(Array.isArray(playlists) ? playlists : [])?.map((playlist) => (
          <Card key={playlist.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{playlist.name}</h3>
                  <p className="text-sm text-gray-500">{playlist.description}</p>
                  <div className="flex gap-4 mt-2 text-sm">
                    <span>{playlist.scenes.length} scenes</span>
                    <span>{playlist.loop ? "Loop: On" : "Loop: Off"}</span>
                    <span>{playlist.shuffle ? "Shuffle: On" : "Shuffle: Off"}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={playlist.is_active ? "default" : "outline"}
                    onClick={() => handleTogglePlaylist(playlist.id, playlist.is_active)}
                  >
                    {playlist.is_active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDeletePlaylist(playlist.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
