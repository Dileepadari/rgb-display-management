"use client"

import type React from "react"

import { useMemo, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { HelpTip } from "@/components/help-tip"
import { MoodReactionPreview, toReaction } from "@/components/mood-reaction-preview"
import { CHARACTER_MANIFEST } from "@/lib/character-sprites"
import { normalizeSceneElements, type SceneElement } from "@/lib/scene-schema"
import { cn } from "@/lib/utils"
import { Plus, Send, Sparkles, Trash2, X } from "lucide-react"
import useSWR from "swr"

interface Mood {
  id: string
  name: string
  description: string
  color: string
  character: string
  emote: string
  entrance: string
  hold_seconds: number
  after_reaction: string
  position: string
  scale: number
  tint_strength: number
  is_custom: boolean
}

interface Device {
  id: string
  name: string
  is_online: boolean
}

interface Assignment {
  device_id: string
  target_type: "scene" | "playlist"
  scene_id: string | null
  active_mood_id: string | null
}

interface Scene {
  id: string
  name: string
  panel_width: number
  panel_height: number
  elements: SceneElement[] | null
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const ENTRANCES = [
  { id: "slide-left", label: "Slide in from the left" },
  { id: "slide-right", label: "Slide in from the right" },
  { id: "drop", label: "Drop in from the top" },
  { id: "fade", label: "Fade in on the spot" },
  { id: "pop", label: "Pop in on the spot" },
]

const POSITIONS = [
  { id: "bottom-left", label: "Bottom left" },
  { id: "bottom-right", label: "Bottom right" },
  { id: "top-left", label: "Top left" },
  { id: "top-right", label: "Top right" },
  { id: "center", label: "Centre" },
]

const EMOTES = CHARACTER_MANIFEST[0].emotes

const BLANK = {
  name: "",
  description: "",
  color: "#ffd23f",
  character: "cat",
  emote: "happy",
  entrance: "slide-left",
  hold_seconds: 5,
  after_reaction: "leave",
  position: "bottom-left",
  scale: 2,
  tint_strength: 20,
}

export function MoodBoardComplete() {
  const { data: rawMoods, mutate: mutateMoods } = useSWR<Mood[]>("/api/moods", fetcher)
  const { data: rawDevices } = useSWR<Device[]>("/api/devices", fetcher)
  const { data: rawAssignments, mutate: mutateAssignments } = useSWR<Assignment[]>(
    "/api/device-assignments",
    fetcher,
  )
  const { data: rawScenes } = useSWR<Scene[]>("/api/scenes", fetcher)

  const moods = Array.isArray(rawMoods) ? rawMoods : []
  const devices = Array.isArray(rawDevices) ? rawDevices : []
  const assignments = Array.isArray(rawAssignments) ? rawAssignments : []
  const scenes = Array.isArray(rawScenes) ? rawScenes : []

  // The scene a reaction will actually land on top of, so previews show your
  // real content rather than a stand-in. Playlists rotate, so there's no single
  // frame to show — those fall back to the neutral backdrop.
  const sceneForDevice = (deviceId: string) => {
    const assignment = assignments.find((a) => a.device_id === deviceId)
    if (!assignment || assignment.target_type !== "scene" || !assignment.scene_id) return null
    const scene = scenes.find((sc) => sc.id === assignment.scene_id)
    if (!scene) return null
    return {
      width: scene.panel_width,
      height: scene.panel_height,
      elements: normalizeSceneElements(scene.elements ?? []),
    }
  }

  // The library and the create form preview against whichever panel is set up,
  // so the cards aren't showing a fiction either.
  const referenceScene = devices.length > 0 ? sceneForDevice(devices[0].id) : null

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState(BLANK)
  const [loading, setLoading] = useState(false)
  const [selectedMoodId, setSelectedMoodId] = useState<string | null>(null)
  const [sendingTo, setSendingTo] = useState<string | null>(null)

  const selectedMood = moods.find((m) => m.id === selectedMoodId) ?? moods[0] ?? null
  const formReaction = useMemo(() => toReaction(formData), [formData])

  const activeMoodFor = (deviceId: string) => {
    const moodId = assignments.find((a) => a.device_id === deviceId)?.active_mood_id
    return moodId ? moods.find((m) => m.id === moodId) ?? null : null
  }

  const handleCreateMood = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch("/api/moods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, is_custom: true }),
      })
      if (!response.ok) throw new Error((await response.json()).error ?? "Failed to create mood")

      await mutateMoods()
      setFormData(BLANK)
      setShowForm(false)
      toast.success("Mood created")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error creating mood")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMood = async (moodId: string) => {
    try {
      const response = await fetch(`/api/moods/${moodId}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete mood")
      if (selectedMoodId === moodId) setSelectedMoodId(null)
      await mutateMoods()
      toast.success("Mood deleted")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error deleting mood")
    }
  }

  const handleSendMood = async (deviceId: string, moodId: string) => {
    setSendingTo(deviceId)
    try {
      const response = await fetch(`/api/devices/${deviceId}/mood`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood_id: moodId }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? "Failed to send mood")

      await mutateAssignments()
      if (result.warning) toast.warning(result.warning)
      else toast.success(`Mood sent — the panel will react on revision ${result.revision}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error sending mood")
    } finally {
      setSendingTo(null)
    }
  }

  const handleClearMood = async (deviceId: string) => {
    setSendingTo(deviceId)
    try {
      const response = await fetch(`/api/devices/${deviceId}/mood`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to clear mood")
      await mutateAssignments()
      toast.success("Mood cleared")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error clearing mood")
    } finally {
      setSendingTo(null)
    }
  }

  return (
    <div className="w-full space-y-6 px-4 py-6 md:px-8 lg:px-10">
      <PageHeader
        title="Moods"
        purpose="A mood is a reaction: a character walks onto the panel, performs an emote over whatever is already playing, then stays or leaves."
        howTo={
          <ul>
            <li>Pick a mood on the left to watch its reaction play in the preview.</li>
            <li>
              The reaction sits <em>on top of</em> the scene or playlist that device is already showing — it
              doesn&apos;t replace your content.
            </li>
            <li>Send it to a device and the panel performs it immediately, then follows the stay/leave rule.</li>
            <li>Create your own to choose the character, emote, entrance, how long it holds, and the tint.</li>
          </ul>
        }
        actions={
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Mood
          </Button>
        }
      />

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Design a reaction</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateMood} className="grid gap-6 lg:grid-cols-[1fr_auto]">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label>Name</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Celebrating"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Description</Label>
                    <Input
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="When something good happens"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label>Who shows up</Label>
                    <Select
                      value={formData.character}
                      onValueChange={(v) => setFormData({ ...formData, character: v })}
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
                    <Label>What they do</Label>
                    <Select value={formData.emote} onValueChange={(v) => setFormData({ ...formData, emote: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {EMOTES.map((e) => (
                          <SelectItem key={e.id} value={e.id}>
                            {e.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label>How they arrive</Label>
                    <Select
                      value={formData.entrance}
                      onValueChange={(v) => setFormData({ ...formData, entrance: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ENTRANCES.map((e) => (
                          <SelectItem key={e.id} value={e.id}>
                            {e.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label>Where they stand</Label>
                    <Select
                      value={formData.position}
                      onValueChange={(v) => setFormData({ ...formData, position: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {POSITIONS.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-1">
                    <Label className="gap-1.5">
                      Holds for
                      <HelpTip>How many seconds the character performs before the stay/leave rule kicks in.</HelpTip>
                    </Label>
                    <Input
                      type="number"
                      min={1}
                      max={300}
                      value={formData.hold_seconds}
                      onChange={(e) => setFormData({ ...formData, hold_seconds: Number(e.target.value) })}
                    />
                    <p className="text-muted-foreground text-xs">seconds</p>
                  </div>
                  <div className="space-y-1">
                    <Label>Then</Label>
                    <Select
                      value={formData.after_reaction}
                      onValueChange={(v) => setFormData({ ...formData, after_reaction: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="leave">Leave the screen</SelectItem>
                        <SelectItem value="stay">Stay until cleared</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="gap-1.5">
                      Size
                      <HelpTip>Characters are 16x16, so {formData.scale} draws at {formData.scale * 16}px.</HelpTip>
                    </Label>
                    <Input
                      type="number"
                      min={1}
                      max={8}
                      value={formData.scale}
                      onChange={(e) => setFormData({ ...formData, scale: Number(e.target.value) })}
                    />
                    <p className="text-muted-foreground text-xs">{formData.scale * 16}px square</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label>Tint colour</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        className="h-9 w-12 cursor-pointer rounded border border-input bg-transparent"
                        aria-label="Tint colour"
                      />
                      <Input value={formData.color} readOnly />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="gap-1.5">
                      Tint strength
                      <HelpTip>
                        How strongly the colour washes over your scene while the reaction plays. 0 means no wash at
                        all.
                      </HelpTip>
                    </Label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={formData.tint_strength}
                      onChange={(e) => setFormData({ ...formData, tint_strength: Number(e.target.value) })}
                    />
                    <p className="text-muted-foreground text-xs">percent</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={loading || !formData.name.trim()}>
                    {loading ? "Creating..." : "Create Mood"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Live preview</Label>
                <MoodReactionPreview
                  reaction={formReaction}
                  px={200}
                  scene={referenceScene}
                  panelWidth={referenceScene?.width}
                  panelHeight={referenceScene?.height}
                />
                <p className="text-muted-foreground max-w-[200px] text-xs">
                  {referenceScene
                    ? "Shown over the scene your panel is currently displaying."
                    : "Assign a scene to a device and it'll show underneath here."}
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Your moods</CardTitle>
          </CardHeader>
          <CardContent>
            {moods.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No moods yet. Create one to give your panel a character that reacts.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3 2xl:grid-cols-3">
                {moods.map((mood) => (
                  <button
                    key={mood.id}
                    type="button"
                    onClick={() => setSelectedMoodId(mood.id)}
                    className={cn(
                      "group flex flex-col items-start gap-2 rounded-lg border p-3 text-left transition-colors",
                      selectedMood?.id === mood.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50 hover:bg-accent",
                    )}
                  >
                    <MoodReactionPreview
                      reaction={toReaction(mood)}
                      px={96}
                      scene={referenceScene}
                      panelWidth={referenceScene?.width}
                      panelHeight={referenceScene?.height}
                    />
                    <div className="w-full">
                      <p className="truncate text-sm font-medium">{mood.name}</p>
                      <p className="text-muted-foreground truncate text-xs">
                        {mood.character} &middot; {mood.emote} &middot; {mood.after_reaction}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-muted-foreground" />
              Send a mood to a panel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!selectedMood ? (
              <p className="text-muted-foreground text-sm">Create a mood first, then pick one to send.</p>
            ) : devices.length === 0 ? (
              <p className="text-muted-foreground text-sm">Add a device before sending a mood.</p>
            ) : (
              <>
                <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <MoodReactionPreview
                    reaction={toReaction(selectedMood)}
                    px={80}
                    scene={referenceScene}
                    panelWidth={referenceScene?.width}
                    panelHeight={referenceScene?.height}
                  />
                  <div className="min-w-0">
                    <p className="truncate font-medium">{selectedMood.name}</p>
                    <p className="text-muted-foreground text-xs">{selectedMood.description}</p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      Holds {selectedMood.hold_seconds}s, then{" "}
                      {selectedMood.after_reaction === "stay" ? "stays until cleared" : "leaves"}.
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="icon-sm" variant="ghost" className="ml-auto shrink-0" aria-label="Delete mood">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete &ldquo;{selectedMood.name}&rdquo;?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Panels currently performing it keep going until the reaction finishes or you clear it.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteMood(selectedMood.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                <div className="divide-y divide-border">
                  {devices.map((device) => {
                    const active = activeMoodFor(device.id)
                    return (
                      <div key={device.id} className="flex items-center justify-between gap-3 py-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{device.name}</p>
                          <p className="text-muted-foreground truncate text-xs">
                            {active ? `Now performing: ${active.name}` : "No mood running"}
                          </p>
                        </div>
                        <div className="flex shrink-0 gap-2">
                          {active && (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={sendingTo === device.id}
                              onClick={() => handleClearMood(device.id)}
                              className="gap-1.5"
                            >
                              <X className="h-3.5 w-3.5" />
                              Clear
                            </Button>
                          )}
                          <Button
                            size="sm"
                            disabled={sendingTo === device.id}
                            onClick={() => handleSendMood(device.id, selectedMood.id)}
                            className="gap-1.5"
                          >
                            <Send className="h-3.5 w-3.5" />
                            {sendingTo === device.id ? "Sending..." : "Send"}
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
