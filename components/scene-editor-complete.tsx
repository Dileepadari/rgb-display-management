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
import { Plus, Trash2, Download, Upload, Send, Type, MoveHorizontal, ImageIcon, Clock, Cloud, Shapes } from "lucide-react"
import useSWR from "swr"
import { type SceneElement, normalizeSceneElements } from "@/lib/scene-schema"
import { ICON_MANIFEST, type IconId } from "@/lib/icon-manifest"
import { createRuntimeState, tickAnimations, renderScene, type AnimRuntime, type RenderCaches } from "@/lib/scene-compositor"
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

const ELEMENT_TYPES: SceneElement["type"][] = ["text", "scrollText", "image", "clock", "weather", "icon"]

const ELEMENT_TYPE_META: Record<SceneElement["type"], { label: string; icon: typeof Type }> = {
  text: { label: "Text", icon: Type },
  scrollText: { label: "Scrolling Text", icon: MoveHorizontal },
  image: { label: "Image", icon: ImageIcon },
  clock: { label: "Clock", icon: Clock },
  weather: { label: "Weather", icon: Cloud },
  icon: { label: "Icon", icon: Shapes },
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
  // test pattern) — not something the user authored or should see/edit here.
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

  const handleCreateScene = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/scenes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, elements: [] }),
      })

      if (!response.ok) throw new Error("Failed to create scene")

      await mutate()
      setFormData({ name: "", description: "", panel_width: 64, panel_height: 64 })
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
        purpose="Design what your displays show — lay out text, images, clocks, weather and icons on a pixel canvas."
        howTo={
          <ul>
            <li>Create a scene, then pick it from the list to open the editor.</li>
            <li>Add elements from the Elements panel; drag them on the canvas or click one to select and edit it.</li>
            <li>Drag list items to change layering — items lower in the list draw on top.</li>
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
                <div className="space-y-2">
                  <Label htmlFor="scene-width">Panel Width (pixels)</Label>
                  <Input
                    id="scene-width"
                    type="number"
                    min="1"
                    max="512"
                    value={formData.panel_width}
                    onChange={(e) => setFormData({ ...formData, panel_width: Number.parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scene-height">Panel Height (pixels)</Label>
                  <Input
                    id="scene-height"
                    type="number"
                    min="1"
                    max="512"
                    value={formData.panel_height}
                    onChange={(e) => setFormData({ ...formData, panel_height: Number.parseInt(e.target.value) })}
                  />
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
        <div className="space-y-4">
          <h3 className="font-semibold">Scenes</h3>
          {Array.isArray(scenes) && scenes.length === 0 && (
            <p className="text-muted-foreground text-sm">No scenes yet. Create one to get started.</p>
          )}
          {(Array.isArray(scenes) ? scenes : [])?.map((scene) => (
            <Card
              key={scene.id}
              className={`cursor-pointer transition ${selectedScene?.id === scene.id ? "ring-2 ring-primary" : ""}`}
              onClick={() => setSelectedScene(scene)}
            >
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">{scene.name}</h4>
                    <p className="text-muted-foreground text-sm">{scene.description}</p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      Panel: {scene.panel_width}x{scene.panel_height} · {scene.elements?.length ?? 0} elements
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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_280px_280px]">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Live Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <SceneCanvasPreview
              scene={scene}
              elements={elements}
              selectedIndex={selectedIndex}
              onDragElement={(x, y) => {
                if (selectedIndex != null) updateElement(selectedIndex, { x, y })
              }}
            />
            <p className="text-muted-foreground text-xs">
              {selected ? "Drag anywhere on the preview to reposition the selected element." : "Select an element below to reposition it by dragging."}
            </p>

            <div className="flex flex-wrap items-end gap-2 border-t border-border pt-4">
              <div className="flex-1 space-y-2">
                <Label>Push to device</Label>
                <Select value={assignDeviceId} onValueChange={setAssignDeviceId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a device" />
                  </SelectTrigger>
                  <SelectContent>
                    {devices.length === 0 && (
                      <div className="text-muted-foreground px-2 py-1.5 text-sm">No devices yet</div>
                    )}
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

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Elements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Select onValueChange={(v) => addElement(v as SceneElement["type"])} value="">
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

            <div className="space-y-1">
              {elements.length === 0 && <p className="text-muted-foreground text-sm">No elements yet.</p>}
              {elements.map((el, i) => {
                const meta = ELEMENT_TYPE_META[el.type]
                const Icon = meta.icon
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedIndex(i)}
                    className={`flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left text-sm transition-colors ${
                      selectedIndex === i ? "border-primary bg-primary/10" : "border-border hover:bg-accent"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="truncate">
                      {meta.label}
                      {el.type === "text" || el.type === "scrollText" ? `: ${el.text}` : ""}
                    </span>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
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
      </div>
    </div>
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
          <Label>X</Label>
          <Input type="number" value={element.x} onChange={(e) => onChange({ x: Number(e.target.value) })} />
        </div>
        <div className="space-y-1">
          <Label>Y</Label>
          <Input type="number" value={element.y} onChange={(e) => onChange({ y: Number(e.target.value) })} />
        </div>
      </div>

      <div className="space-y-1">
        <Label>Color</Label>
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
            <Label>Size</Label>
            <Input
              type="number"
              min={1}
              max={6}
              value={element.size}
              onChange={(e) => onChange({ size: Number(e.target.value) })}
            />
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
              <Label>Width</Label>
              <Input type="number" value={element.width} onChange={(e) => onChange({ width: Number(e.target.value) })} />
            </div>
            <div className="space-y-1">
              <Label>Height</Label>
              <Input type="number" value={element.height} onChange={(e) => onChange({ height: Number(e.target.value) })} />
            </div>
          </div>
        </div>
      )}

      {element.type === "clock" && (
        <div className="space-y-1">
          <Label>Format</Label>
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
            <Label>Latitude</Label>
            <Input type="number" step="0.01" value={element.lat} onChange={(e) => onChange({ lat: Number(e.target.value) })} />
          </div>
          <div className="space-y-1">
            <Label>Longitude</Label>
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
            <Label>Scale</Label>
            <Input
              type="number"
              min={1}
              max={8}
              value={element.scale}
              onChange={(e) => onChange({ scale: Number(e.target.value) })}
            />
          </div>
        </div>
      )}

      <div className="space-y-2 border-t border-border pt-4">
        <Label>Animation</Label>
        <Select
          value={element.animation.type}
          onValueChange={(v) => onChange({ animation: { ...element.animation, type: v as SceneElement["animation"]["type"] } })}
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
          <Input
            type="number"
            placeholder="Speed"
            value={element.animation.speed}
            onChange={(e) => onChange({ animation: { ...element.animation, speed: Number(e.target.value) } })}
          />
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
  onDragElement,
}: {
  scene: Scene
  elements: SceneElement[]
  selectedIndex: number | null
  onDragElement: (x: number, y: number) => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const runtimeRef = useRef<AnimRuntime[]>(createRuntimeState(elements.length))
  const cachesRef = useRef<RenderCaches>({ images: new Map(), weather: new Map() })
  const draggingRef = useRef(false)

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

  const handlePointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (selectedIndex == null) return
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = Math.round(((e.clientX - rect.left) / rect.width) * canvas.width)
    const y = Math.round(((e.clientY - rect.top) / rect.height) * canvas.height)
    onDragElement(x, y)
  }

  return (
    <div className="flex items-center justify-center rounded-lg bg-black p-4">
      <canvas
        ref={canvasRef}
        width={scene.panel_width}
        height={scene.panel_height}
        onPointerDown={(e) => {
          draggingRef.current = true
          handlePointer(e)
        }}
        onPointerMove={(e) => {
          if (draggingRef.current) handlePointer(e)
        }}
        onPointerUp={() => {
          draggingRef.current = false
        }}
        onPointerLeave={() => {
          draggingRef.current = false
        }}
        style={{
          width: "100%",
          maxWidth: 400,
          aspectRatio: `${scene.panel_width} / ${scene.panel_height}`,
          imageRendering: "pixelated",
          cursor: selectedIndex != null ? "move" : "default",
          touchAction: "none",
        }}
      />
    </div>
  )
}
