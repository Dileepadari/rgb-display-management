"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
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
import {
  Plus,
  Trash2,
  Download,
  Upload,
  Send,
  Type,
  MoveHorizontal,
  ImageIcon,
  Clock,
  Cloud,
  Shapes,
  Smile,
  Tv,
  GripVertical,
  ChevronsUp,
  ChevronsDown,
  ZoomIn,
} from "lucide-react"
import useSWR from "swr"
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Slider } from "@/components/ui/slider"
import { HelpTip } from "@/components/help-tip"
import { SceneThumbnail } from "@/components/scene-thumbnail"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { type SceneElement, normalizeSceneElements } from "@/lib/scene-schema"
import { ICON_MANIFEST, type IconId } from "@/lib/icon-manifest"
import { CHARACTER_GRID_SIZE, CHARACTER_MANIFEST, drawCharacter } from "@/lib/character-sprites"
import { cn } from "@/lib/utils"
import {
  createRuntimeState,
  tickAnimations,
  renderScene,
  elementBounds,
  type AnimRuntime,
  type RenderCaches,
} from "@/lib/scene-compositor"
import { SCENE_TEMPLATES } from "@/lib/scene-templates"
import { PANEL_LAYOUTS, layoutForPixels, layoutPixels } from "@/lib/panel-layouts"
import { createClient } from "@/lib/supabase/client"

interface Scene {
  id: string
  name: string
  description: string
  panel_width: number
  panel_height: number
  elements: SceneElement[]
}

interface Device {
  id: string
  name: string
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const ELEMENT_TYPES: SceneElement["type"][] = ["text", "scrollText", "image", "clock", "weather", "icon", "character"]

const ELEMENT_TYPE_META: Record<SceneElement["type"], { label: string; icon: typeof Type }> = {
  text: { label: "Text", icon: Type },
  scrollText: { label: "Scrolling Text", icon: MoveHorizontal },
  image: { label: "Image", icon: ImageIcon },
  clock: { label: "Clock", icon: Clock },
  weather: { label: "Weather", icon: Cloud },
  icon: { label: "Icon", icon: Shapes },
  character: { label: "Character", icon: Smile },
}

const ANIMATION_SPEED_HELP: Record<SceneElement["animation"]["type"], string> = {
  none: "No animation is running.",
  scroll: "Pixels travelled per second, right to left.",
  blink: "Blinks per second.",
  pulse: "Brightness cycles per second.",
  rainbow: "Degrees of hue rotation per second - 360 is one full colour wheel per second.",
  bounce: "Bounces per second, four pixels up and down.",
}

// Speed 0 means "never advance", which reads as a broken animation - a scrolling
// element in particular parks itself just off the right edge and never returns.
// So switching an element onto an animation seeds a speed that visibly moves.
const DEFAULT_ANIMATION_SPEED: Record<SceneElement["animation"]["type"], number> = {
  none: 0,
  scroll: 20,
  blink: 1,
  pulse: 1,
  rainbow: 120,
  bounce: 1,
}

function defaultElementFor(type: SceneElement["type"], panelWidth: number, panelHeight: number): SceneElement {
  const base = {
    x: 0,
    y: 0,
    color: [255, 255, 255] as [number, number, number],
    visible: true,
    animation: { type: "none" as const, speed: 0 },
  }
  switch (type) {
    case "text":
      return { type, ...base, text: "Hello", size: 1 }
    case "scrollText":
      return { type, ...base, text: "Scrolling...", size: 1, animation: { type: "scroll", speed: 20 } }
    case "image":
      return { type, ...base, url: "", width: Math.min(panelWidth, 64), height: Math.min(panelHeight, 64) }
    case "clock":
      return { type, ...base, format: "HH:mm", size: 1 }
    case "weather":
      return { type, ...base, lat: 0, lon: 0, size: 1 }
    case "icon":
      return { type, ...base, id: "dot", scale: 1 }
    case "character":
      // Scale 2 (32px) so the character is legible on a 64x64 panel instead of
      // landing as a 16px speck in the corner.
      return { type, ...base, character: "cat", emote: "idle", scale: 2 }
  }
}

async function uploadImageAsRaw(file: File, width: number, height: number): Promise<string | null> {
  const bitmap = await createImageBitmap(file)
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")
  if (!ctx) return null
  ctx.drawImage(bitmap, 0, 0, width, height)
  const imageData = ctx.getImageData(0, 0, width, height)

  const raw = new Uint8Array(width * height * 3)
  for (let i = 0, j = 0; i < width * height; i++, j += 4) {
    raw[i * 3] = imageData.data[j]
    raw[i * 3 + 1] = imageData.data[j + 1]
    raw[i * 3 + 2] = imageData.data[j + 2]
  }

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const path = `${user.id}/${crypto.randomUUID()}.raw`
  const { error } = await supabase.storage.from("scene-assets").upload(path, raw, {
    contentType: "application/octet-stream",
  })
  if (error) {
    toast.error(error.message)
    return null
  }
  const { data } = supabase.storage.from("scene-assets").getPublicUrl(path)
  return data.publicUrl
}

export function SceneEditorComplete() {
  const { data: allScenes, mutate } = useSWR<Scene[]>("/api/scenes", fetcher)
  // "__"-prefixed scenes are auto-managed (e.g. the Devices page's Identify
  // test pattern) - not something the user authored or should see/edit here.
  const scenes = allScenes?.filter((s) => !s.name.startsWith("__"))
  const { data: devices } = useSWR<Device[]>("/api/devices", fetcher)
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    panel_width: 64,
    panel_height: 64,
  })
  const [loading, setLoading] = useState(false)
  const [templateId, setTemplateId] = useState("blank")

  const handleCreateScene = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const template = SCENE_TEMPLATES.find((t) => t.id === templateId) ?? SCENE_TEMPLATES[0]
      const response = await fetch("/api/scenes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          elements: template.elements(formData.panel_width, formData.panel_height),
        }),
      })

      if (!response.ok) throw new Error("Failed to create scene")

      await mutate()
      setFormData({ name: "", description: "", panel_width: 64, panel_height: 64 })
      setTemplateId("blank")
      setShowForm(false)
      toast.success("Scene created")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error creating scene")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteScene = async (id: string) => {
    try {
      const response = await fetch(`/api/scenes/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete scene")
      await mutate()
      setSelectedScene(null)
      toast.success("Scene deleted")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error deleting scene")
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
    <div className="w-full space-y-6 px-4 py-6 md:px-8 lg:px-10">
      <PageHeader
        title="Scene Editor"
        purpose="Design what your displays show - lay out text, images, clocks, weather, icons and animated characters on a pixel canvas."
        howTo={
          <ul>
            <li>Create a scene, then pick it from the list to open the editor.</li>
            <li>Add elements from the Elements panel; drag them on the canvas or click one to select and edit it.</li>
            <li>Drag list items to change layering - items lower in the list draw on top.</li>
            <li>Use the zoom slider to inspect pixel detail, then Save to push changes to assigned devices.</li>
          </ul>
        }
        actions={
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Scene
          </Button>
        }
      />

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Scene</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateScene} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="scene-name">Scene Name</Label>
                  <Input
                    id="scene-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="My Scene"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scene-description">Description</Label>
                  <Input
                    id="scene-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Scene description"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label className="gap-1.5">
                    Panel size
                    <HelpTip>
                      How many 64x64 modules your wall is built from. This has to match how the device is
                      physically wired, or the scene will be cropped or letterboxed on the panel.
                    </HelpTip>
                  </Label>
                  <Select
                    value={layoutForPixels(formData.panel_width, formData.panel_height)?.id ?? "custom"}
                    onValueChange={(v) => {
                      if (v === "custom") return
                      const layout = PANEL_LAYOUTS.find((l) => l.id === v)
                      if (!layout) return
                      const { width, height } = layoutPixels(layout)
                      setFormData({ ...formData, panel_width: width, panel_height: height })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PANEL_LAYOUTS.map((layout) => {
                        const { width, height } = layoutPixels(layout)
                        return (
                          <SelectItem key={layout.id} value={layout.id}>
                            {layout.label} ({width}x{height}px)
                          </SelectItem>
                        )
                      })}
                      {!layoutForPixels(formData.panel_width, formData.panel_height) && (
                        <SelectItem value="custom">
                          Custom ({formData.panel_width}x{formData.panel_height}px)
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scene-width">Width (pixels)</Label>
                  <Input
                    id="scene-width"
                    type="number"
                    min="1"
                    max="1024"
                    value={formData.panel_width}
                    onChange={(e) => setFormData({ ...formData, panel_width: Number.parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scene-height">Height (pixels)</Label>
                  <Input
                    id="scene-height"
                    type="number"
                    min="1"
                    max="1024"
                    value={formData.panel_height}
                    onChange={(e) => setFormData({ ...formData, panel_height: Number.parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Start from a template</Label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
                  {SCENE_TEMPLATES.map((template) => {
                    const isSelected = templateId === template.id
                    return (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() => setTemplateId(template.id)}
                        className={`hover-lift rounded-lg border p-2 text-left transition-colors ${
                          isSelected ? "border-primary bg-primary/10" : "border-border hover:bg-accent"
                        }`}
                      >
                        <div className="mb-2 overflow-hidden rounded border border-border bg-black">
                          <SceneThumbnail
                            width={formData.panel_width || 64}
                            height={formData.panel_height || 64}
                            elements={template.elements(formData.panel_width || 64, formData.panel_height || 64)}
                          />
                        </div>
                        <p className="text-xs font-medium">{template.name}</p>
                        <p className="text-muted-foreground text-xs leading-tight">{template.description}</p>
                      </button>
                    )
                  })}
                </div>
              </div>

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

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[320px_1fr]">
        <div className="stagger space-y-4">
          <h3 className="font-semibold">Scenes</h3>
          {Array.isArray(scenes) && scenes.length === 0 && (
            <p className="text-muted-foreground text-sm">No scenes yet. Create one to get started.</p>
          )}
          {(Array.isArray(scenes) ? scenes : [])?.map((scene, sceneIndex) => (
            <Card
              key={scene.id}
              style={{ "--stagger-index": sceneIndex } as React.CSSProperties}
              className={`spring cursor-pointer gap-0 overflow-hidden py-0 ${selectedScene?.id === scene.id ? "ring-2 ring-primary" : ""}`}
              onClick={() => setSelectedScene(scene)}
            >
              {/* Scenes are visual things — showing the actual composition
                  beats showing its element count. */}
              <div className="scanlines relative flex h-36 w-full items-center justify-center overflow-hidden border-b border-border bg-black">
                <SceneThumbnail
                  width={scene.panel_width}
                  height={scene.panel_height}
                  elements={normalizeSceneElements(scene.elements ?? [])}
                  fit="contain"
                />
              </div>
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="truncate font-semibold">{scene.name}</h4>
                    <p className="text-muted-foreground truncate text-sm">{scene.description}</p>
                    <p className="text-muted-foreground mt-1 font-mono text-xs">
                      {scene.panel_width}&times;{scene.panel_height} · {scene.elements?.length ?? 0} elements
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleExportScene(scene)
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive" onClick={(e) => e.stopPropagation()}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete {scene.name}?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This scene will be permanently deleted. This can&apos;t be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-white hover:bg-destructive/90"
                            onClick={() => handleDeleteScene(scene.id)}
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

        {selectedScene && (
          <SceneDetailEditor
            key={selectedScene.id}
            scene={selectedScene}
            devices={Array.isArray(devices) ? devices : []}
            onSaved={async (updated) => {
              await mutate()
              setSelectedScene(updated)
            }}
          />
        )}

        {!selectedScene && (
          <Card className="flex min-h-72 flex-col items-center justify-center gap-3 p-10 text-center">
            <Tv className="text-muted-foreground h-8 w-8" />
            <div>
              <p className="font-medium">Pick a scene to edit it</p>
              <p className="text-muted-foreground mt-1 max-w-sm text-sm">
                Choose one on the left to open the canvas, or create a new scene to start from a template.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

function SceneDetailEditor({
  scene,
  devices,
  onSaved,
}: {
  scene: Scene
  devices: Device[]
  onSaved: (scene: Scene) => void
}) {
  const [elements, setElements] = useState<SceneElement[]>(() => normalizeSceneElements(scene.elements ?? []))
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [assignDeviceId, setAssignDeviceId] = useState<string>("")
  const [assigning, setAssigning] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  const dirty = JSON.stringify(elements) !== JSON.stringify(normalizeSceneElements(scene.elements ?? []))
  const selected = selectedIndex != null ? elements[selectedIndex] : null

  const updateElement = (index: number, patch: Partial<SceneElement>) => {
    setElements((prev) => prev.map((el, i) => (i === index ? ({ ...el, ...patch } as SceneElement) : el)))
  }

  const addElement = (type: SceneElement["type"]) => {
    setElements((prev) => [...prev, defaultElementFor(type, scene.panel_width, scene.panel_height)])
    setSelectedIndex(elements.length)
  }

  const removeElement = (index: number) => {
    setElements((prev) => prev.filter((_, i) => i !== index))
    setSelectedIndex(null)
  }

  // Array order is z-order: later entries paint over earlier ones.
  const moveElement = (from: number, to: number) => {
    if (to < 0 || to >= elements.length || from === to) return
    setElements((prev) => {
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next
    })
    setSelectedIndex(to)
  }

  const reorderElements = (from: number, to: number) => moveElement(from, to)
  const bringToFront = (index: number) => moveElement(index, elements.length - 1)
  const sendToBack = (index: number) => moveElement(index, 0)

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/scenes/${scene.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ elements }),
      })
      if (!res.ok) throw new Error("Failed to save scene")
      const updated = await res.json()
      onSaved(updated)
      toast.success("Scene saved")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error saving scene")
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
        body: JSON.stringify({ target_type: "scene", scene_id: scene.id }),
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error ?? "Failed to assign scene")
      if (body.warning) toast.warning(body.warning)
      else toast.success("Pushed to device")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error assigning scene")
    } finally {
      setAssigning(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Editing: {scene.name}</h3>
        <Button size="sm" onClick={handleSave} disabled={!dirty || saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <ResizablePanelGroup
        direction="horizontal"
        autoSaveId="scene-editor-panels"
        className="hidden min-h-[560px] items-stretch gap-0 lg:flex"
      >
        <ResizablePanel defaultSize={50} minSize={25}>
          <div className="h-full pr-2">
            <PreviewPanel
              scene={scene}
              elements={elements}
              selectedIndex={selectedIndex}
              onSelect={setSelectedIndex}
              onDragElement={(x, y) => {
                if (selectedIndex != null) updateElement(selectedIndex, { x, y })
              }}
              devices={devices}
              assignDeviceId={assignDeviceId}
              setAssignDeviceId={setAssignDeviceId}
              assigning={assigning}
              onAssign={handleAssign}
            />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={25} minSize={15}>
          <div className="h-full px-2">
            <ElementsPanel
              elements={elements}
              selectedIndex={selectedIndex}
              onSelect={setSelectedIndex}
              onAdd={addElement}
              onReorder={reorderElements}
              onBringToFront={bringToFront}
              onSendToBack={sendToBack}
            />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={25} minSize={15}>
          <div className="h-full pl-2">
            <PropertiesPanel
              selected={selected}
              selectedIndex={selectedIndex}
              updateElement={updateElement}
              removeElement={removeElement}
              uploadingImage={uploadingImage}
              setUploadingImage={setUploadingImage}
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Stacked layout on narrow screens, where draggable dividers don't apply */}
      <div className="space-y-4 lg:hidden">
        <PreviewPanel
          scene={scene}
          elements={elements}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
          onDragElement={(x, y) => {
            if (selectedIndex != null) updateElement(selectedIndex, { x, y })
          }}
          devices={devices}
          assignDeviceId={assignDeviceId}
          setAssignDeviceId={setAssignDeviceId}
          assigning={assigning}
          onAssign={handleAssign}
        />
        <ElementsPanel
          elements={elements}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
          onAdd={addElement}
          onReorder={reorderElements}
          onBringToFront={bringToFront}
          onSendToBack={sendToBack}
        />
        <PropertiesPanel
          selected={selected}
          selectedIndex={selectedIndex}
          updateElement={updateElement}
          removeElement={removeElement}
          uploadingImage={uploadingImage}
          setUploadingImage={setUploadingImage}
        />
      </div>
    </div>
  )
}

function PreviewPanel({
  scene,
  elements,
  selectedIndex,
  onSelect,
  onDragElement,
  devices,
  assignDeviceId,
  setAssignDeviceId,
  assigning,
  onAssign,
}: {
  scene: Scene
  elements: SceneElement[]
  selectedIndex: number | null
  onSelect: (index: number | null) => void
  onDragElement: (x: number, y: number) => void
  devices: Device[]
  assignDeviceId: string
  setAssignDeviceId: (id: string) => void
  assigning: boolean
  onAssign: () => void
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Live Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <SceneCanvasPreview
          scene={scene}
          elements={elements}
          selectedIndex={selectedIndex}
          onSelect={onSelect}
          onDragElement={onDragElement}
        />

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
          <Button onClick={onAssign} disabled={!assignDeviceId || assigning} className="gap-2">
            <Send className="h-4 w-4" />
            {assigning ? "Pushing..." : "Push"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function SortableElementRow({
  index,
  element,
  selected,
  onSelect,
  onBringToFront,
  onSendToBack,
  isLast,
  isFirst,
}: {
  index: number
  element: SceneElement
  selected: boolean
  onSelect: () => void
  onBringToFront: () => void
  onSendToBack: () => void
  isLast: boolean
  isFirst: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: index })
  const meta = ELEMENT_TYPE_META[element.type]
  const Icon = meta.icon

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className={`flex items-center gap-1 rounded-md border px-1.5 py-1 transition-colors ${
        selected ? "border-primary bg-primary/10" : "border-border hover:bg-accent"
      }`}
    >
      <button
        type="button"
        className="cursor-grab touch-none text-muted-foreground active:cursor-grabbing"
        aria-label={`Reorder ${meta.label}`}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <button onClick={onSelect} className="flex min-w-0 flex-1 items-center gap-2 text-left text-sm">
        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="truncate">
          {meta.label}
          {element.type === "text" || element.type === "scrollText" ? `: ${element.text}` : ""}
        </span>
      </button>
      <Button
        size="icon-sm"
        variant="ghost"
        onClick={onBringToFront}
        disabled={isLast}
        aria-label="Bring to front"
        title="Bring to front"
      >
        <ChevronsUp className="h-3.5 w-3.5" />
      </Button>
      <Button
        size="icon-sm"
        variant="ghost"
        onClick={onSendToBack}
        disabled={isFirst}
        aria-label="Send to back"
        title="Send to back"
      >
        <ChevronsDown className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}

function ElementsPanel({
  elements,
  selectedIndex,
  onSelect,
  onAdd,
  onReorder,
  onBringToFront,
  onSendToBack,
}: {
  elements: SceneElement[]
  selectedIndex: number | null
  onSelect: (index: number) => void
  onAdd: (type: SceneElement["type"]) => void
  onReorder: (from: number, to: number) => void
  onBringToFront: (index: number) => void
  onSendToBack: (index: number) => void
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Elements</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Select onValueChange={(v) => onAdd(v as SceneElement["type"])} value="">
          <SelectTrigger>
            <SelectValue placeholder="+ Add element" />
          </SelectTrigger>
          <SelectContent>
            {ELEMENT_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {ELEMENT_TYPE_META[t].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {elements.length === 0 ? (
          <p className="text-muted-foreground text-sm">No elements yet.</p>
        ) : (
          <>
            <p className="text-muted-foreground text-xs">Later items draw on top. Drag to restack.</p>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={({ active, over }) => {
                if (over && active.id !== over.id) onReorder(Number(active.id), Number(over.id))
              }}
            >
              <SortableContext items={elements.map((_, i) => i)} strategy={verticalListSortingStrategy}>
                <div className="space-y-1">
                  {elements.map((el, i) => (
                    <SortableElementRow
                      key={i}
                      index={i}
                      element={el}
                      selected={selectedIndex === i}
                      onSelect={() => onSelect(i)}
                      onBringToFront={() => onBringToFront(i)}
                      onSendToBack={() => onSendToBack(i)}
                      isFirst={i === 0}
                      isLast={i === elements.length - 1}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </>
        )}
      </CardContent>
    </Card>
  )
}

function PropertiesPanel({
  selected,
  selectedIndex,
  updateElement,
  removeElement,
  uploadingImage,
  setUploadingImage,
}: {
  selected: SceneElement | null
  selectedIndex: number | null
  updateElement: (index: number, patch: Partial<SceneElement>) => void
  removeElement: (index: number) => void
  uploadingImage: boolean
  setUploadingImage: (v: boolean) => void
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Properties</CardTitle>
      </CardHeader>
      <CardContent>
        {selected == null || selectedIndex == null ? (
          <p className="text-muted-foreground text-sm">Select an element to edit it.</p>
        ) : (
          <ElementProperties
            element={selected}
            onChange={(patch) => updateElement(selectedIndex, patch)}
            onDelete={() => removeElement(selectedIndex)}
            uploadingImage={uploadingImage}
            onUploadImage={async (file) => {
              if (selected.type !== "image") return
              setUploadingImage(true)
              const url = await uploadImageAsRaw(file, selected.width, selected.height)
              setUploadingImage(false)
              if (url) updateElement(selectedIndex, { url })
            }}
          />
        )}
      </CardContent>
    </Card>
  )
}

// Live thumbnails of every mood the chosen character can play, so you can see
// the animation before committing to it rather than picking a name blind.
function CharacterPreviewStrip({
  characterId,
  selectedEmote,
  onPick,
}: {
  characterId: string
  selectedEmote: string
  onPick: (emote: "idle" | "happy" | "sad" | "wave" | "sleep") => void
}) {
  const emotes = CHARACTER_MANIFEST.find((c) => c.id === characterId)?.emotes ?? []
  return (
    <div className="space-y-1.5">
      <Label>Preview moods</Label>
      <div className="grid grid-cols-3 gap-1.5">
        {emotes.map((e) => (
          <button
            key={e.id}
            type="button"
            onClick={() => onPick(e.id as "idle" | "happy" | "sad" | "wave" | "sleep")}
            title={e.label}
            className={cn(
              "flex flex-col items-center gap-1 rounded-md border p-1.5 transition-colors",
              selectedEmote === e.id
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50 hover:bg-accent",
            )}
          >
            <CharacterSpriteCanvas characterId={characterId} emoteId={e.id} px={40} />
            <span className="text-[10px] leading-none">{e.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// A single sprite animating on its own rAF loop, independent of the scene
// preview so the picker keeps playing even when nothing is selected on canvas.
function CharacterSpriteCanvas({
  characterId,
  emoteId,
  px,
}: {
  characterId: string
  emoteId: string
  px: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let raf = 0
    const loop = () => {
      ctx.clearRect(0, 0, CHARACTER_GRID_SIZE, CHARACTER_GRID_SIZE)
      drawCharacter(ctx, characterId, emoteId, 0, 0, 1, performance.now())
      raf = requestAnimationFrame(loop)
    }
    loop()
    return () => cancelAnimationFrame(raf)
  }, [characterId, emoteId])

  return (
    <canvas
      ref={canvasRef}
      width={CHARACTER_GRID_SIZE}
      height={CHARACTER_GRID_SIZE}
      style={{ width: px, height: px, imageRendering: "pixelated" }}
    />
  )
}

function ElementProperties({
  element,
  onChange,
  onDelete,
  onUploadImage,
  uploadingImage,
}: {
  element: SceneElement
  onChange: (patch: Partial<SceneElement>) => void
  onDelete: () => void
  onUploadImage: (file: File) => void
  uploadingImage: boolean
}) {
  const [r, g, b] = element.color
  const colorHex = `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="gap-1.5">
            Horizontal position
            <HelpTip>Pixels from the left edge of the panel. 0 is flush against the left.</HelpTip>
          </Label>
          <Input type="number" value={element.x} onChange={(e) => onChange({ x: Number(e.target.value) })} />
        </div>
        <div className="space-y-1">
          <Label className="gap-1.5">
            Vertical position
            <HelpTip>Pixels from the top edge of the panel. 0 is flush against the top.</HelpTip>
          </Label>
          <Input type="number" value={element.y} onChange={(e) => onChange({ y: Number(e.target.value) })} />
        </div>
      </div>

      <div className="space-y-1">
        <Label>Colour</Label>
        <div className="flex gap-2">
          <input
            type="color"
            value={colorHex}
            onChange={(e) => {
              const hex = e.target.value
              onChange({
                color: [
                  Number.parseInt(hex.slice(1, 3), 16),
                  Number.parseInt(hex.slice(3, 5), 16),
                  Number.parseInt(hex.slice(5, 7), 16),
                ],
              })
            }}
            className="h-9 w-12 cursor-pointer rounded-md border border-input bg-transparent"
          />
          <Input value={colorHex} readOnly className="flex-1" />
        </div>
      </div>

      {(element.type === "text" || element.type === "scrollText") && (
        <>
          <div className="space-y-1">
            <Label>Text</Label>
            <Input value={element.text} onChange={(e) => onChange({ text: e.target.value })} />
          </div>
          <div className="space-y-1">
            <Label className="gap-1.5">
              Text size
              <HelpTip>
                A multiplier, not a pixel value. Each step is 8 pixels tall, so {element.size} renders at{" "}
                {element.size * 8}px.
              </HelpTip>
            </Label>
            <Input
              type="number"
              min={1}
              max={6}
              value={element.size}
              onChange={(e) => onChange({ size: Number(e.target.value) })}
            />
            <p className="text-muted-foreground text-xs">{element.size * 8}px tall</p>
          </div>
        </>
      )}

      {element.type === "image" && (
        <div className="space-y-2">
          <Label>Image</Label>
          <Input
            type="file"
            accept="image/*"
            disabled={uploadingImage}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) onUploadImage(file)
            }}
          />
          {uploadingImage && <p className="text-muted-foreground text-xs">Converting and uploading...</p>}
          {element.url && !uploadingImage && (
            <p className="text-muted-foreground truncate text-xs">
              <Upload className="mr-1 inline h-3 w-3" />
              {element.url.split("/").pop()}
            </p>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="gap-1.5">
                Width
                <HelpTip>
                  Pixel width the image is resized to when uploaded. Change this before uploading, not after.
                </HelpTip>
              </Label>
              <Input type="number" value={element.width} onChange={(e) => onChange({ width: Number(e.target.value) })} />
            </div>
            <div className="space-y-1">
              <Label className="gap-1.5">
                Height
                <HelpTip>
                  Pixel height the image is resized to when uploaded. Change this before uploading, not after.
                </HelpTip>
              </Label>
              <Input type="number" value={element.height} onChange={(e) => onChange({ height: Number(e.target.value) })} />
            </div>
          </div>
        </div>
      )}

      {element.type === "clock" && (
        <div className="space-y-1">
          <Label className="gap-1.5">
            Time format
            <HelpTip>Uses the device&apos;s configured timezone, not your browser&apos;s.</HelpTip>
          </Label>
          <Select value={element.format} onValueChange={(v) => onChange({ format: v as "HH:mm" | "HH:mm:ss" })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="HH:mm">HH:mm</SelectItem>
              <SelectItem value="HH:mm:ss">HH:mm:ss</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {element.type === "weather" && (
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="gap-1.5">
              Latitude
              <HelpTip>Location the temperature is fetched for. Positive is north of the equator.</HelpTip>
            </Label>
            <Input type="number" step="0.01" value={element.lat} onChange={(e) => onChange({ lat: Number(e.target.value) })} />
          </div>
          <div className="space-y-1">
            <Label className="gap-1.5">
              Longitude
              <HelpTip>Location the temperature is fetched for. Positive is east of Greenwich.</HelpTip>
            </Label>
            <Input type="number" step="0.01" value={element.lon} onChange={(e) => onChange({ lon: Number(e.target.value) })} />
          </div>
        </div>
      )}

      {element.type === "icon" && (
        <div className="space-y-3">
          <div className="space-y-1">
            <Label>Icon</Label>
            <Select value={element.id} onValueChange={(v) => onChange({ id: v as IconId })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ICON_MANIFEST.map((icon) => (
                  <SelectItem key={icon.id} value={icon.id}>
                    {icon.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="gap-1.5">
              Icon size
              <HelpTip>
                Icons are a 16x16 grid scaled by this number, so {element.scale} renders at {element.scale * 16}px
                square.
              </HelpTip>
            </Label>
            <Input
              type="number"
              min={1}
              max={8}
              value={element.scale}
              onChange={(e) => onChange({ scale: Number(e.target.value) })}
            />
            <p className="text-muted-foreground text-xs">{element.scale * 16}px square</p>
          </div>
        </div>
      )}

      {element.type === "character" && (
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="gap-1.5">
              Character
              <HelpTip>
                Characters are animated pixel sprites drawn by the panel itself, so they keep moving without the
                website being open.
              </HelpTip>
            </Label>
            <Select
              value={element.character}
              onValueChange={(v) => onChange({ character: v as typeof element.character })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CHARACTER_MANIFEST.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="gap-1.5">
              Mood
              <HelpTip>What the character is doing - each mood is its own little looping animation.</HelpTip>
            </Label>
            <Select value={element.emote} onValueChange={(v) => onChange({ emote: v as typeof element.emote })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(CHARACTER_MANIFEST.find((c) => c.id === element.character)?.emotes ?? []).map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="gap-1.5">
              Character size
              <HelpTip>
                Characters are a 16x16 grid scaled by this number, so {element.scale} renders at{" "}
                {element.scale * 16}px square.
              </HelpTip>
            </Label>
            <Input
              type="number"
              min={1}
              max={8}
              value={element.scale}
              onChange={(e) => onChange({ scale: Number(e.target.value) })}
            />
            <p className="text-muted-foreground text-xs">{element.scale * 16}px square</p>
          </div>
          <CharacterPreviewStrip characterId={element.character} selectedEmote={element.emote} onPick={(emote) => onChange({ emote })} />
        </div>
      )}

      <div className="space-y-2 border-t border-border pt-4">
        <Label className="gap-1.5">
          Animation
          <HelpTip>Every animation works on every element type, including images and icons.</HelpTip>
        </Label>
        <Select
          value={element.animation.type}
          onValueChange={(v) => {
            const type = v as SceneElement["animation"]["type"]
            // Keep a speed the author already tuned; only seed one when there
            // isn't a usable value yet (fresh elements default to 0).
            const speed = element.animation.speed > 0 ? element.animation.speed : DEFAULT_ANIMATION_SPEED[type]
            onChange({ animation: { type, speed } })
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="scroll">Scroll</SelectItem>
            <SelectItem value="blink">Blink</SelectItem>
            <SelectItem value="pulse">Pulse</SelectItem>
            <SelectItem value="rainbow">Rainbow</SelectItem>
            <SelectItem value="bounce">Bounce</SelectItem>
          </SelectContent>
        </Select>
        {element.animation.type !== "none" && (
          <>
            <Label className="gap-1.5">
              Speed
              <HelpTip>{ANIMATION_SPEED_HELP[element.animation.type]}</HelpTip>
            </Label>
            <Input
              type="number"
              placeholder="Speed"
              value={element.animation.speed}
              onChange={(e) => onChange({ animation: { ...element.animation, speed: Number(e.target.value) } })}
            />
          </>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm">
        <Switch checked={element.visible} onCheckedChange={(v) => onChange({ visible: v })} />
        Visible
      </label>

      <Button variant="destructive" size="sm" onClick={onDelete} className="w-full gap-2">
        <Trash2 className="h-4 w-4" />
        Delete Element
      </Button>
    </div>
  )
}

function SceneCanvasPreview({
  scene,
  elements,
  selectedIndex,
  onSelect,
  onDragElement,
}: {
  scene: Scene
  elements: SceneElement[]
  selectedIndex: number | null
  onSelect: (index: number | null) => void
  onDragElement: (x: number, y: number) => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const runtimeRef = useRef<AnimRuntime[]>(createRuntimeState(elements.length))
  const cachesRef = useRef<RenderCaches>({ images: new Map(), weather: new Map() })
  const draggingRef = useRef(false)
  const [fitToPanel, setFitToPanel] = useState(true)
  const [zoom, setZoom] = useState(4)

  useEffect(() => {
    if (runtimeRef.current.length !== elements.length) {
      runtimeRef.current = createRuntimeState(elements.length)
    }
  }, [elements.length])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    let rafId: number
    function frame(now: number) {
      tickAnimations(elements, runtimeRef.current, now)
      renderScene(ctx!, scene.panel_width, scene.panel_height, elements, runtimeRef.current, cachesRef.current, now)
      rafId = requestAnimationFrame(frame)
    }
    rafId = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(rafId)
  }, [elements, scene.panel_width, scene.panel_height])

  const toScenePoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    return {
      x: Math.round(((e.clientX - rect.left) / rect.width) * canvas.width),
      y: Math.round(((e.clientY - rect.top) / rect.height) * canvas.height),
    }
  }

  // Topmost element wins, matching paint order (later elements draw on top).
  const hitTest = (x: number, y: number): number | null => {
    const ctx = canvasRef.current?.getContext("2d")
    if (!ctx) return null
    for (let i = elements.length - 1; i >= 0; i--) {
      const el = elements[i]
      if (el.visible === false) continue
      const b = elementBounds(ctx, el)
      if (x >= b.x && x <= b.x + b.width && y >= b.y && y <= b.y + b.height) return i
    }
    return null
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const point = toScenePoint(e)
    if (!point) return
    const hit = hitTest(point.x, point.y)
    if (hit != null) {
      onSelect(hit)
      draggingRef.current = true
      return
    }
    // Clicking empty canvas with something selected moves it there, matching
    // the previous drag-to-reposition behaviour.
    if (selectedIndex != null) {
      draggingRef.current = true
      onDragElement(point.x, point.y)
    } else {
      onSelect(null)
    }
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!draggingRef.current || selectedIndex == null) return
    const point = toScenePoint(e)
    if (point) onDragElement(point.x, point.y)
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <Switch checked={fitToPanel} onCheckedChange={setFitToPanel} />
          Fit to panel
        </label>
        {!fitToPanel && (
          <div className="flex min-w-40 flex-1 items-center gap-2">
            <ZoomIn className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <Slider min={1} max={16} step={1} value={[zoom]} onValueChange={([v]) => setZoom(v)} />
            <span className="w-8 shrink-0 font-mono text-xs text-muted-foreground">{zoom}x</span>
          </div>
        )}
      </div>

      <div className="flex max-h-[60vh] items-center justify-center overflow-auto rounded-lg bg-black p-4">
        <canvas
          ref={canvasRef}
          width={scene.panel_width}
          height={scene.panel_height}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={() => {
            draggingRef.current = false
          }}
          onPointerLeave={() => {
            draggingRef.current = false
          }}
          style={
            fitToPanel
              ? {
                  width: "100%",
                  aspectRatio: `${scene.panel_width} / ${scene.panel_height}`,
                  imageRendering: "pixelated",
                  cursor: "pointer",
                  touchAction: "none",
                }
              : {
                  width: scene.panel_width * zoom,
                  height: scene.panel_height * zoom,
                  flexShrink: 0,
                  imageRendering: "pixelated",
                  cursor: "pointer",
                  touchAction: "none",
                }
          }
        />
      </div>

      <p className="text-muted-foreground text-xs">
        Click an element on the canvas to select it, then drag to reposition.
      </p>
    </div>
  )
}
