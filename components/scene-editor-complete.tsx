"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Download } from "lucide-react"
import useSWR from "swr"

interface SceneElement {
  id: string
  type: "text" | "image" | "clock" | "weather" | "scroll-text"
  x: number
  y: number
  width: number
  height: number
  color?: string
  content?: string
  animation?: string
}

interface Scene {
  id: string
  name: string
  description: string
  panel_width: number
  panel_height: number
  elements: SceneElement[]
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function SceneEditorComplete() {
  const { data: scenes, mutate } = useSWR<Scene[]>("/api/scenes", fetcher)
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    panel_width: 1,
    panel_height: 1,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreateScene = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/scenes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, elements: [] }),
      })

      if (!response.ok) throw new Error("Failed to create scene")

      await mutate()
      setFormData({ name: "", description: "", panel_width: 1, panel_height: 1 })
      setShowForm(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creating scene")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteScene = async (id: string) => {
    if (!confirm("Are you sure?")) return

    try {
      const response = await fetch(`/api/scenes/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete scene")
      await mutate()
      setSelectedScene(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error deleting scene")
    }
  }

  const handleExportScene = (scene: Scene) => {
    const dataStr = JSON.stringify(scene, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${scene.name}.json`
    link.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Scene Editor</h2>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          Create Scene
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Scene</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateScene} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Scene Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="My Scene"
                    required
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Scene description"
                  />
                </div>
                <div>
                  <Label>Panel Width</Label>
                  <Input
                    type="number"
                    min="1"
                    max="4"
                    value={formData.panel_width}
                    onChange={(e) => setFormData({ ...formData, panel_width: Number.parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Panel Height</Label>
                  <Input
                    type="number"
                    min="1"
                    max="4"
                    value={formData.panel_height}
                    onChange={(e) => setFormData({ ...formData, panel_height: Number.parseInt(e.target.value) })}
                  />
                </div>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Scene"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold">Scenes</h3>
          {(Array.isArray(scenes) ? scenes : [])?.map((scene) => (
            <Card
              key={scene.id}
              className={`cursor-pointer transition ${selectedScene?.id === scene.id ? "ring-2 ring-purple-500" : ""}`}
              onClick={() => setSelectedScene(scene)}
            >
              <CardContent className="pt-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{scene.name}</h4>
                    <p className="text-sm text-gray-500">{scene.description}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Panel: {scene.panel_width}x{scene.panel_height}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleExportScene(scene)
                      }}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteScene(scene.id)
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedScene && (
          <div className="space-y-4">
            <h3 className="font-semibold">Scene Details: {selectedScene.name}</h3>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">LED Panel Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <LEDPanelPreview scene={selectedScene} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

function LEDPanelPreview({ scene }: { scene: Scene }) {
  const panelSize = 64
  const dotSize = panelSize / 8
  const totalWidth = scene.panel_width * panelSize
  const totalHeight = scene.panel_height * panelSize

  return (
    <div
      className="bg-black rounded-lg p-4 overflow-auto"
      style={{
        width: "100%",
        maxWidth: "400px",
        aspectRatio: `${totalWidth} / ${totalHeight}`,
      }}
    >
      <div
        className="relative"
        style={{
          width: totalWidth,
          height: totalHeight,
          display: "grid",
          gridTemplateColumns: `repeat(${totalWidth / dotSize}, 1fr)`,
          gap: "1px",
          backgroundColor: "#000",
        }}
      >
        {Array.from({ length: (totalWidth / dotSize) * (totalHeight / dotSize) }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-800 rounded-full"
            style={{
              width: dotSize - 2,
              height: dotSize - 2,
              boxShadow: "0 0 4px rgba(100, 100, 100, 0.5)",
            }}
          />
        ))}
      </div>
    </div>
  )
}
