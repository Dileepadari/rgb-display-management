"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Copy, Download, Upload, Edit2, Search } from "lucide-react"
import { sceneConfigManager, type SceneConfig } from "@/lib/scene-config"

export default function SceneManager() {
  const [scenes, setScenes] = useState<SceneConfig[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingScene, setEditingScene] = useState<SceneConfig | null>(null)
  const [newSceneName, setNewSceneName] = useState("")
  const [newSceneDescription, setNewSceneDescription] = useState("")
  const [panelCols, setPanelCols] = useState(2)
  const [panelRows, setPanelRows] = useState(2)

  useEffect(() => {
    // Load scenes
    const allScenes = sceneConfigManager.getAllScenes()
    setScenes(allScenes)

    // Listen for changes
    sceneConfigManager.onSceneChange((scene, action) => {
      if (action === "create" || action === "update") {
        setScenes(sceneConfigManager.getAllScenes())
      } else if (action === "delete") {
        setScenes(sceneConfigManager.getAllScenes())
      }
    })
  }, [])

  const handleCreateScene = () => {
    if (newSceneName.trim()) {
      const scene = sceneConfigManager.createScene(newSceneName, panelCols, panelRows)
      if (newSceneDescription) {
        sceneConfigManager.updateScene(scene.id, { description: newSceneDescription })
      }
      setNewSceneName("")
      setNewSceneDescription("")
      setShowCreateForm(false)
      setScenes(sceneConfigManager.getAllScenes())
    }
  }

  const handleDeleteScene = (sceneId: string) => {
    if (confirm("Are you sure you want to delete this scene?")) {
      sceneConfigManager.deleteScene(sceneId)
      setScenes(sceneConfigManager.getAllScenes())
    }
  }

  const handleDuplicateScene = (sceneId: string) => {
    sceneConfigManager.duplicateScene(sceneId)
    setScenes(sceneConfigManager.getAllScenes())
  }

  const handleExportScene = (scene: SceneConfig) => {
    const json = sceneConfigManager.exportScene(scene.id)
    if (json) {
      const blob = new Blob([json], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${scene.name}.json`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const handleImportScene = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const json = event.target?.result as string
        sceneConfigManager.importScene(json)
        setScenes(sceneConfigManager.getAllScenes())
      }
      reader.readAsText(file)
    }
  }

  const filteredScenes = scenes.filter(
    (scene) =>
      scene.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scene.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Scene Manager</h2>
        <p className="text-muted-foreground">Create, manage, and organize your display scenes</p>
      </div>

      {/* Toolbar */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
        >
          <Plus className="w-4 h-4" />
          New Scene
        </Button>
        <label className="flex items-center gap-2">
          <Button
            variant="outline"
            className="gap-2 border-primary/50 text-primary hover:bg-primary/10 bg-transparent"
            asChild
          >
            <span>
              <Upload className="w-4 h-4" />
              Import
            </span>
          </Button>
          <input type="file" accept=".json" onChange={handleImportScene} className="hidden" />
        </label>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <Card className="p-6 mb-6 border-primary/20 bg-card/50 backdrop-blur">
          <h3 className="font-semibold mb-4">Create New Scene</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Scene Name</label>
              <input
                type="text"
                value={newSceneName}
                onChange={(e) => setNewSceneName(e.target.value)}
                placeholder="e.g., Welcome Screen"
                className="w-full px-3 py-2 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <input
                type="text"
                value={newSceneDescription}
                onChange={(e) => setNewSceneDescription(e.target.value)}
                placeholder="Optional description"
                className="w-full px-3 py-2 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Columns</label>
              <input
                type="number"
                value={panelCols}
                onChange={(e) => setPanelCols(Number.parseInt(e.target.value))}
                min="1"
                max="8"
                className="w-full px-3 py-2 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Rows</label>
              <input
                type="number"
                value={panelRows}
                onChange={(e) => setPanelRows(Number.parseInt(e.target.value))}
                min="1"
                max="8"
                className="w-full px-3 py-2 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button
              onClick={handleCreateScene}
              className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            >
              Create Scene
            </Button>
            <Button
              onClick={() => setShowCreateForm(false)}
              variant="outline"
              className="flex-1 border-primary/50 text-primary hover:bg-primary/10 bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Search */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search scenes..."
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Scenes Grid */}
      {filteredScenes.length === 0 ? (
        <Card className="p-12 text-center border-primary/20 bg-card/50 backdrop-blur">
          <p className="text-muted-foreground mb-4">No scenes found</p>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
          >
            <Plus className="w-4 h-4" />
            Create Your First Scene
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScenes.map((scene) => (
            <Card
              key={scene.id}
              className="border-primary/20 bg-card/50 backdrop-blur overflow-hidden hover:border-primary/50 transition-colors"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{scene.name}</h3>
                    {scene.description && <p className="text-sm text-muted-foreground mt-1">{scene.description}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                  <div className="bg-primary/10 rounded p-2">
                    <p className="text-muted-foreground text-xs">Panel Size</p>
                    <p className="font-semibold">
                      {scene.panelCols}x{scene.panelRows}
                    </p>
                  </div>
                  <div className="bg-primary/10 rounded p-2">
                    <p className="text-muted-foreground text-xs">Elements</p>
                    <p className="font-semibold">{scene.elements.length}</p>
                  </div>
                  <div className="bg-primary/10 rounded p-2">
                    <p className="text-muted-foreground text-xs">Duration</p>
                    <p className="font-semibold">{scene.duration}s</p>
                  </div>
                  <div className="bg-primary/10 rounded p-2">
                    <p className="text-muted-foreground text-xs">Loop</p>
                    <p className="font-semibold">{scene.loop ? "Yes" : "No"}</p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mb-4">
                  Created: {new Date(scene.createdAt).toLocaleDateString()}
                </p>

                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 gap-1 border-primary/50 text-primary hover:bg-primary/10 bg-transparent text-xs"
                    onClick={() => setEditingScene(scene)}
                  >
                    <Edit2 className="w-3 h-3" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 border-primary/50 text-primary hover:bg-primary/10 bg-transparent text-xs"
                    onClick={() => handleDuplicateScene(scene.id)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 border-primary/50 text-primary hover:bg-primary/10 bg-transparent text-xs"
                    onClick={() => handleExportScene(scene)}
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 border-destructive/50 text-destructive hover:bg-destructive/10 bg-transparent text-xs"
                    onClick={() => handleDeleteScene(scene.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
