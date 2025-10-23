"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Copy, Download, Plus, Settings2, Play } from "lucide-react"

interface CanvasElement {
  id: string
  type: "text" | "image" | "clock" | "weather" | "scroll-text"
  x: number
  y: number
  width: number
  height: number
  content?: string
  color?: string
  fontSize?: number
  rotation?: number
  opacity?: number
  animation?: string
}

interface PanelConfig {
  cols: number
  rows: number
  pixelSize: number
}

interface Scene {
  id: string
  name: string
  elements: CanvasElement[]
  config: PanelConfig
  createdAt: string
}

export default function SceneEditor() {
  const [panelConfig, setPanelConfig] = useState<PanelConfig>({ cols: 2, rows: 2, pixelSize: 128 })
  const [elements, setElements] = useState<CanvasElement[]>([])
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [sceneName, setSceneName] = useState("Untitled Scene")
  const [scenes, setScenes] = useState<Scene[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const canvasRef = useRef<HTMLDivElement>(null)

  const panelPresets = [
    { label: "1x1 (64x64)", cols: 1, rows: 1, pixelSize: 64 },
    { label: "2x2 (128x128)", cols: 2, rows: 2, pixelSize: 128 },
    { label: "1x2 (64x128)", cols: 1, rows: 2, pixelSize: 128 },
    { label: "2x1 (128x64)", cols: 2, rows: 1, pixelSize: 128 },
    { label: "3x3 (192x192)", cols: 3, rows: 3, pixelSize: 192 },
    { label: "4x4 (256x256)", cols: 4, rows: 4, pixelSize: 256 },
    { label: "2x3 (128x192)", cols: 2, rows: 3, pixelSize: 192 },
    { label: "3x2 (192x128)", cols: 3, rows: 2, pixelSize: 128 },
  ]

  const elementTypes = [
    { type: "text", label: "Text", icon: "📝" },
    { type: "scroll-text", label: "Scroll Text", icon: "↔️" },
    { type: "image", label: "Image", icon: "🖼️" },
    { type: "clock", label: "Clock", icon: "🕐" },
    { type: "weather", label: "Weather", icon: "🌤️" },
  ]

  const animations = ["none", "fade", "slide", "bounce", "pulse", "rotate", "blink", "rainbow"]

  const addElement = (type: CanvasElement["type"]) => {
    const newElement: CanvasElement = {
      id: `element-${Date.now()}`,
      type,
      x: 10,
      y: 10,
      width: 30,
      height: 20,
      content: type === "text" ? "New Text" : undefined,
      color: "#FF00FF",
      fontSize: 12,
      rotation: 0,
      opacity: 1,
      animation: "none",
    }
    setElements([...elements, newElement])
    setSelectedElement(newElement.id)
  }

  const updateElement = (id: string, updates: Partial<CanvasElement>) => {
    setElements(elements.map((el) => (el.id === id ? { ...el, ...updates } : el)))
  }

  const deleteElement = (id: string) => {
    setElements(elements.filter((el) => el.id !== id))
    setSelectedElement(null)
  }

  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    if (e.button !== 0) return
    setSelectedElement(elementId)
    setIsDragging(true)
    const element = elements.find((el) => el.id === elementId)
    if (element && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      setDragOffset({
        x: e.clientX - rect.left - (element.x / canvasWidth) * rect.width,
        y: e.clientY - rect.top - (element.y / canvasHeight) * rect.height,
      })
    }
  }

  const handleResizeStart = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation()
    setSelectedElement(elementId)
    setIsResizing(true)
    const element = elements.find((el) => el.id === elementId)
    if (element && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: (element.width / canvasWidth) * rect.width,
        height: (element.height / canvasHeight) * rect.height,
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!selectedElement || !canvasRef.current) return

    if (isDragging) {
      const rect = canvasRef.current.getBoundingClientRect()
      const newX = Math.max(
        0,
        Math.min(canvasWidth - 10, ((e.clientX - rect.left - dragOffset.x) / rect.width) * canvasWidth),
      )
      const newY = Math.max(
        0,
        Math.min(canvasHeight - 10, ((e.clientY - rect.top - dragOffset.y) / rect.height) * canvasHeight),
      )
      updateElement(selectedElement, { x: Math.round(newX), y: Math.round(newY) })
    }

    if (isResizing) {
      const rect = canvasRef.current.getBoundingClientRect()
      const deltaX = e.clientX - resizeStart.x
      const deltaY = e.clientY - resizeStart.y
      const newWidth = Math.max(10, ((resizeStart.width + deltaX) / rect.width) * canvasWidth)
      const newHeight = Math.max(10, ((resizeStart.height + deltaY) / rect.height) * canvasHeight)
      updateElement(selectedElement, { width: Math.round(newWidth), height: Math.round(newHeight) })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setIsResizing(false)
  }

  const saveScene = () => {
    const newScene: Scene = {
      id: `scene-${Date.now()}`,
      name: sceneName,
      elements: [...elements],
      config: { ...panelConfig },
      createdAt: new Date().toISOString(),
    }
    setScenes([...scenes, newScene])
  }

  const loadScene = (scene: Scene) => {
    setSceneName(scene.name)
    setElements([...scene.elements])
    setPanelConfig({ ...scene.config })
    setSelectedElement(null)
  }

  const duplicateScene = () => {
    const newScene: Scene = {
      id: `scene-${Date.now()}`,
      name: `${sceneName} (Copy)`,
      elements: [...elements],
      config: { ...panelConfig },
      createdAt: new Date().toISOString(),
    }
    setScenes([...scenes, newScene])
  }

  const canvasWidth = panelConfig.cols * panelConfig.pixelSize
  const canvasHeight = panelConfig.rows * panelConfig.pixelSize
  const selectedElementData = elements.find((el) => el.id === selectedElement)

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Scene Editor</h2>
        <p className="text-muted-foreground">Create and design display scenes with drag-and-drop elements</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Tools */}
        <div className="lg:col-span-1 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Scene Name */}
          <Card className="p-4 border-primary/20 bg-card/50 backdrop-blur">
            <label className="block text-sm font-medium mb-2">Scene Name</label>
            <input
              type="text"
              value={sceneName}
              onChange={(e) => setSceneName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </Card>

          {/* Panel Configuration */}
          <Card className="p-4 border-primary/20 bg-card/50 backdrop-blur">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Settings2 className="w-4 h-4" />
              Panel Size
            </h3>
            <div className="space-y-2">
              {panelPresets.map((preset) => (
                <Button
                  key={preset.label}
                  onClick={() => setPanelConfig({ cols: preset.cols, rows: preset.rows, pixelSize: preset.pixelSize })}
                  variant={panelConfig.cols === preset.cols && panelConfig.rows === preset.rows ? "default" : "outline"}
                  className="w-full justify-start text-sm"
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </Card>

          {/* Element Tools */}
          <Card className="p-4 border-primary/20 bg-card/50 backdrop-blur">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Elements
            </h3>
            <div className="space-y-2">
              {elementTypes.map((el) => (
                <Button
                  key={el.type}
                  onClick={() => addElement(el.type as CanvasElement["type"])}
                  variant="outline"
                  className="w-full justify-start gap-2 text-sm border-primary/30 hover:bg-primary/10"
                >
                  <span>{el.icon}</span>
                  {el.label}
                </Button>
              ))}
            </div>
          </Card>

          {/* Element Properties */}
          {selectedElementData && (
            <Card className="p-4 border-primary/20 bg-card/50 backdrop-blur">
              <h3 className="font-semibold mb-3">Properties</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Content</label>
                  <input
                    type="text"
                    value={selectedElementData.content || ""}
                    onChange={(e) => updateElement(selectedElement!, { content: e.target.value })}
                    className="w-full px-2 py-1 rounded bg-input border border-border text-foreground text-sm"
                    placeholder="Enter text content"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">X Position</label>
                  <input
                    type="number"
                    value={selectedElementData.x}
                    onChange={(e) => updateElement(selectedElement!, { x: Number.parseInt(e.target.value) })}
                    className="w-full px-2 py-1 rounded bg-input border border-border text-foreground text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Y Position</label>
                  <input
                    type="number"
                    value={selectedElementData.y}
                    onChange={(e) => updateElement(selectedElement!, { y: Number.parseInt(e.target.value) })}
                    className="w-full px-2 py-1 rounded bg-input border border-border text-foreground text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Width</label>
                  <input
                    type="number"
                    value={selectedElementData.width}
                    onChange={(e) => updateElement(selectedElement!, { width: Number.parseInt(e.target.value) })}
                    className="w-full px-2 py-1 rounded bg-input border border-border text-foreground text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Height</label>
                  <input
                    type="number"
                    value={selectedElementData.height}
                    onChange={(e) => updateElement(selectedElement!, { height: Number.parseInt(e.target.value) })}
                    className="w-full px-2 py-1 rounded bg-input border border-border text-foreground text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Color</label>
                  <input
                    type="color"
                    value={selectedElementData.color || "#FF00FF"}
                    onChange={(e) => updateElement(selectedElement!, { color: e.target.value })}
                    className="w-full h-8 rounded cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Font Size</label>
                  <input
                    type="number"
                    value={selectedElementData.fontSize || 12}
                    onChange={(e) => updateElement(selectedElement!, { fontSize: Number.parseInt(e.target.value) })}
                    className="w-full px-2 py-1 rounded bg-input border border-border text-foreground text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Rotation</label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={selectedElementData.rotation || 0}
                    onChange={(e) => updateElement(selectedElement!, { rotation: Number.parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Opacity</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={selectedElementData.opacity || 1}
                    onChange={(e) => updateElement(selectedElement!, { opacity: Number.parseFloat(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Animation</label>
                  <select
                    value={selectedElementData.animation || "none"}
                    onChange={(e) => updateElement(selectedElement!, { animation: e.target.value })}
                    className="w-full px-2 py-1 rounded bg-input border border-border text-foreground text-sm"
                  >
                    {animations.map((anim) => (
                      <option key={anim} value={anim}>
                        {anim}
                      </option>
                    ))}
                  </select>
                </div>
                <Button
                  onClick={() => deleteElement(selectedElement!)}
                  variant="destructive"
                  size="sm"
                  className="w-full gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Canvas Area */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="border-primary/20 bg-card/50 backdrop-blur overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Canvas Preview</h3>
                <div className="text-sm text-muted-foreground">
                  {canvasWidth}x{canvasHeight}px
                </div>
              </div>

              {/* Canvas Grid */}
              <div
                ref={canvasRef}
                className="canvas-grid rounded-lg border-2 border-primary/30 relative bg-black/50 cursor-move"
                style={{
                  width: `${Math.min(canvasWidth * 2, 600)}px`,
                  height: `${Math.min(canvasHeight * 2, 600)}px`,
                  backgroundSize: `${(panelConfig.pixelSize / canvasWidth) * 100}% ${(panelConfig.pixelSize / canvasHeight) * 100}%`,
                }}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {/* Grid Lines */}
                {Array.from({ length: panelConfig.cols + 1 }).map((_, i) => (
                  <div
                    key={`v-${i}`}
                    className="absolute top-0 bottom-0 border-l border-primary/20"
                    style={{
                      left: `${(i / panelConfig.cols) * 100}%`,
                    }}
                  />
                ))}
                {Array.from({ length: panelConfig.rows + 1 }).map((_, i) => (
                  <div
                    key={`h-${i}`}
                    className="absolute left-0 right-0 border-t border-primary/20"
                    style={{
                      top: `${(i / panelConfig.rows) * 100}%`,
                    }}
                  />
                ))}

                {/* Elements */}
                {elements.map((element) => (
                  <div
                    key={element.id}
                    onMouseDown={(e) => handleMouseDown(e, element.id)}
                    className={`draggable-element absolute rounded cursor-move transition-all ${
                      selectedElement === element.id ? "selected" : ""
                    }`}
                    style={{
                      left: `${(element.x / canvasWidth) * 100}%`,
                      top: `${(element.y / canvasHeight) * 100}%`,
                      width: `${(element.width / canvasWidth) * 100}%`,
                      height: `${(element.height / canvasHeight) * 100}%`,
                      backgroundColor: element.color,
                      opacity: element.opacity || 0.8,
                      transform: `rotate(${element.rotation || 0}deg)`,
                    }}
                  >
                    <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-white truncate p-1">
                      {element.content || element.type}
                    </div>
                    {selectedElement === element.id && (
                      <div
                        onMouseDown={(e) => handleResizeStart(e, element.id)}
                        className="absolute bottom-0 right-0 w-4 h-4 bg-accent rounded-tl cursor-nwse-resize hover:bg-accent/80"
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-6 flex-wrap">
                <Button
                  onClick={saveScene}
                  className="gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                >
                  <Download className="w-4 h-4" />
                  Save Scene
                </Button>
                <Button
                  onClick={duplicateScene}
                  variant="outline"
                  className="gap-2 border-primary/50 text-primary hover:bg-primary/10 bg-transparent"
                >
                  <Copy className="w-4 h-4" />
                  Duplicate
                </Button>
                <Button
                  variant="outline"
                  className="gap-2 border-primary/50 text-primary hover:bg-primary/10 bg-transparent"
                >
                  <Play className="w-4 h-4" />
                  Preview
                </Button>
              </div>
            </div>
          </Card>

          {/* Saved Scenes */}
          {scenes.length > 0 && (
            <Card className="border-primary/20 bg-card/50 backdrop-blur">
              <div className="p-6 border-b border-border/50">
                <h3 className="text-lg font-bold">Saved Scenes ({scenes.length})</h3>
              </div>
              <div className="divide-y divide-border/50">
                {scenes.map((scene) => (
                  <div
                    key={scene.id}
                    className="p-4 flex items-center justify-between hover:bg-primary/5 transition-colors"
                  >
                    <div>
                      <p className="font-semibold">{scene.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {scene.elements.length} elements • {scene.config.cols}x{scene.config.rows}
                      </p>
                    </div>
                    <Button
                      onClick={() => loadScene(scene)}
                      size="sm"
                      className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                    >
                      Load
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
