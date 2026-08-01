"use client"

import type React from "react"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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
import { Plus, Trash2, Wifi, WifiOff, Sparkles, Settings2, ChevronDown } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PANEL_LAYOUTS } from "@/lib/panel-layouts"
import useSWR from "swr"

interface Device {
  id: string
  name: string
  device_id: string
  panel_width: number
  panel_height: number
  panel_cols: number
  panel_rows: number
  panel_unit_size: number
  brightness: number
  is_online: boolean
  last_sync: string | null
  thingspeak_channel_id: string | null
  thingspeak_read_key: string | null
  thingspeak_write_key: string | null
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function DeviceManagerComplete() {
  const { data: devices, isLoading, mutate } = useSWR<Device[]>("/api/devices", fetcher)
  const [showForm, setShowForm] = useState(false)
  const [configuring, setConfiguring] = useState<Device | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    device_id: "",
    panel_cols: 1,
    panel_rows: 1,
    panel_unit_size: 64,
    brightness: 100,
  })
  const [loading, setLoading] = useState(false)

  const handleAddDevice = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/devices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          panel_width: formData.panel_cols * formData.panel_unit_size,
          panel_height: formData.panel_rows * formData.panel_unit_size,
        }),
      })

      if (!response.ok) throw new Error("Failed to add device")

      await mutate()
      setFormData({ name: "", device_id: "", panel_cols: 1, panel_rows: 1, panel_unit_size: 64, brightness: 100 })
      setShowForm(false)
      toast.success("Device added")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error adding device")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDevice = async (id: string) => {
    try {
      const response = await fetch(`/api/devices/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete device")
      await mutate()
      toast.success("Device removed")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error deleting device")
    }
  }

  const handleUpdateBrightness = async (id: string, brightness: number) => {
    try {
      const response = await fetch(`/api/devices/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brightness }),
      })
      if (!response.ok) throw new Error("Failed to update brightness")
      await mutate()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error updating brightness")
    }
  }

  return (
    <div className="w-full space-y-6 px-4 py-6 md:px-8 lg:px-10">
      <PageHeader
        title="Device Management"
        purpose="Register and monitor your LED panels, and control which scene or playlist each one is showing."
        howTo={
          <ul>
            <li>Add a device with its panel size and ThingSpeak keys, then flash the firmware with the same keys.</li>
            <li>A device reports online once its heartbeat arrives; the badge updates automatically.</li>
            <li>Assign a scene or playlist to push new content - this bumps the revision the device polls for.</li>
          </ul>
        }
        actions={
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Device
          </Button>
        }
      />

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Device</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddDevice} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="device-name">Device Name</Label>
                  <Input
                    id="device-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="My LED Panel"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="device-id">Device ID</Label>
                  <Input
                    id="device-id"
                    value={formData.device_id}
                    onChange={(e) => setFormData({ ...formData, device_id: e.target.value })}
                    placeholder="ESP32-001"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="panel-cols">Panel Columns</Label>
                  <Input
                    id="panel-cols"
                    type="number"
                    min="1"
                    max="32"
                    value={formData.panel_cols}
                    onChange={(e) => setFormData({ ...formData, panel_cols: Number.parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="panel-rows">Panel Rows</Label>
                  <Input
                    id="panel-rows"
                    type="number"
                    min="1"
                    max="32"
                    value={formData.panel_rows}
                    onChange={(e) => setFormData({ ...formData, panel_rows: Number.parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="panel-unit">Pixels per panel</Label>
                  <Input
                    id="panel-unit"
                    type="number"
                    min="1"
                    max="256"
                    value={formData.panel_unit_size}
                    onChange={(e) => setFormData({ ...formData, panel_unit_size: Number.parseInt(e.target.value) })}
                  />
                  <p className="text-muted-foreground text-xs">
                    Total resolution: {formData.panel_cols * formData.panel_unit_size} x{" "}
                    {formData.panel_rows * formData.panel_unit_size} pixels
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "Adding..." : "Add Device"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="stagger grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
        {!isLoading && (!devices || devices.length === 0) && (
          <p className="text-muted-foreground text-sm">No devices yet. Add one to get started.</p>
        )}
        {(Array.isArray(devices) ? devices : []).map((device, deviceIndex) => (
          <Card
            key={device.id}
            className="spring"
            style={{ "--stagger-index": deviceIndex } as React.CSSProperties}
          >
            <CardContent className="pt-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{device.name}</h3>
                  <p className="text-muted-foreground text-sm">{device.device_id}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                    <Badge
                      variant="outline"
                      className={
                        device.is_online
                          ? "border-success/30 bg-success/10 text-success"
                          : "border-destructive/30 bg-destructive/10 text-destructive"
                      }
                    >
                      {device.is_online ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                      {device.is_online ? "Online" : "Offline"}
                    </Badge>
                    <span className="text-muted-foreground">
                      {device.panel_cols ?? 1}x{device.panel_rows ?? 1} panels ({device.panel_width}x{device.panel_height}px)
                    </span>
                    <span className="text-muted-foreground">Brightness: {device.brightness}%</span>
                    {device.last_sync && (
                      <span className="text-muted-foreground">Last seen: {new Date(device.last_sync).toLocaleString()}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateBrightness(device.id, Math.max(0, device.brightness - 10))}
                  >
                    -
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateBrightness(device.id, Math.min(100, device.brightness + 10))}
                  >
                    +
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setConfiguring(device)} className="gap-2">
                    <Settings2 className="h-4 w-4" />
                    Configure
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove {device.name}?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This device will be permanently removed from your account. This can&apos;t be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-white hover:bg-destructive/90"
                          onClick={() => handleDeleteDevice(device.id)}
                        >
                          Remove
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

      {configuring && (
        <DeviceConfigDialog
          device={configuring}
          onClose={() => setConfiguring(null)}
          onSaved={async () => {
            await mutate()
            setConfiguring(null)
          }}
        />
      )}
    </div>
  )
}

function DeviceConfigDialog({
  device,
  onClose,
  onSaved,
}: {
  device: Device
  onClose: () => void
  onSaved: () => void
}) {
  const [form, setForm] = useState({
    panel_cols: device.panel_cols ?? 1,
    panel_rows: device.panel_rows ?? 1,
    panel_unit_size: device.panel_unit_size ?? 64,
    thingspeak_channel_id: device.thingspeak_channel_id ?? "",
    thingspeak_read_key: device.thingspeak_read_key ?? "",
    thingspeak_write_key: device.thingspeak_write_key ?? "",
  })
  const [saving, setSaving] = useState(false)
  const [identifying, setIdentifying] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/devices/${device.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          panel_width: form.panel_cols * form.panel_unit_size,
          panel_height: form.panel_rows * form.panel_unit_size,
        }),
      })
      if (!res.ok) throw new Error("Failed to save device config")
      toast.success("Device configuration saved")
      onSaved()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error saving device")
    } finally {
      setSaving(false)
    }
  }

  const handleIdentify = async () => {
    setIdentifying(true)
    try {
      const width = form.panel_cols * form.panel_unit_size
      const height = form.panel_rows * form.panel_unit_size

      // Reuse a single "Identify" scene per device instead of piling up new
      // rows every click - same pattern as a normal authored scene, just
      // auto-managed.
      const scenesRes = await fetch("/api/scenes")
      const scenes = await scenesRes.json()
      const existing = Array.isArray(scenes) ? scenes.find((s: { name: string }) => s.name === `__identify_${device.id}`) : null

      const elements = [
        {
          type: "icon",
          x: Math.max(0, Math.round(width / 2 - 8)),
          y: Math.max(0, Math.round(height / 2 - 8)),
          color: [255, 0, 200],
          id: "dot",
          scale: 1,
          visible: true,
          animation: { type: "pulse", speed: 1.5 },
        },
      ]

      const sceneRes = existing
        ? await fetch(`/api/scenes/${existing.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ panel_width: width, panel_height: height, elements }),
          })
        : await fetch("/api/scenes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: `__identify_${device.id}`,
              description: "Auto-managed test pattern used by the Identify button",
              panel_width: width,
              panel_height: height,
              elements,
            }),
          })
      if (!sceneRes.ok) throw new Error("Failed to prepare identify pattern")
      const scene = await sceneRes.json()

      const assignRes = await fetch(`/api/devices/${device.id}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target_type: "scene", scene_id: scene.id }),
      })
      const assignBody = await assignRes.json()
      if (!assignRes.ok) throw new Error(assignBody.error ?? "Failed to push identify pattern")
      if (assignBody.warning) toast.warning(assignBody.warning)
      else toast.success("Identify pattern pushed - check the panel")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error running identify")
    } finally {
      setIdentifying(false)
    }
  }

  return (
    <AlertDialog open onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Configure {device.name}</AlertDialogTitle>
          <AlertDialogDescription>
            Panel arrangement is informational - it must match what&apos;s actually flashed to the ESP32 (see
            Arduino_code/SETUP.md). Content changes never require a reflash; arrangement changes do.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          <div className="space-y-1">
            <Label>Wall shape</Label>
            <Select
              value={
                PANEL_LAYOUTS.find((l) => l.cols === form.panel_cols && l.rows === form.panel_rows)?.id ??
                "custom"
              }
              onValueChange={(v) => {
                if (v === "custom") return
                const layout = PANEL_LAYOUTS.find((l) => l.id === v)
                if (layout) setForm({ ...form, panel_cols: layout.cols, panel_rows: layout.rows })
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PANEL_LAYOUTS.map((layout) => (
                  <SelectItem key={layout.id} value={layout.id}>
                    {layout.label} ({layout.cols * form.panel_unit_size}x{layout.rows * form.panel_unit_size}px)
                  </SelectItem>
                ))}
                <SelectItem value="custom">Custom (set below)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label>Columns</Label>
              <Input
                type="number"
                min={1}
                max={32}
                value={form.panel_cols}
                onChange={(e) => setForm({ ...form, panel_cols: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <Label>Rows</Label>
              <Input
                type="number"
                min={1}
                max={32}
                value={form.panel_rows}
                onChange={(e) => setForm({ ...form, panel_rows: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <Label>Panel size (px)</Label>
              <Input
                type="number"
                min={1}
                max={256}
                value={form.panel_unit_size}
                onChange={(e) => setForm({ ...form, panel_unit_size: Number(e.target.value) })}
              />
            </div>
          </div>
          <p className="text-muted-foreground text-xs">
            Total resolution: {form.panel_cols * form.panel_unit_size} x {form.panel_rows * form.panel_unit_size} pixels
          </p>

          <Collapsible className="border-t border-border pt-4">
            <CollapsibleTrigger className="group flex w-full items-center justify-between text-sm font-medium">
              ThingSpeak channel
              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pt-3">
              <p className="text-muted-foreground text-xs">
                This device&apos;s dedicated trigger channel. Must match the keys flashed to the ESP32.
              </p>
              <Input
                placeholder="Channel ID"
                value={form.thingspeak_channel_id}
                onChange={(e) => setForm({ ...form, thingspeak_channel_id: e.target.value })}
              />
              <Input
                placeholder="Read API key"
                value={form.thingspeak_read_key}
                onChange={(e) => setForm({ ...form, thingspeak_read_key: e.target.value })}
              />
              <Input
                placeholder="Write API key"
                value={form.thingspeak_write_key}
                onChange={(e) => setForm({ ...form, thingspeak_write_key: e.target.value })}
              />
            </CollapsibleContent>
          </Collapsible>
        </div>

        <AlertDialogFooter className="flex-row items-center !justify-between sm:justify-between">
          <Button variant="outline" onClick={handleIdentify} disabled={identifying} className="gap-2">
            <Sparkles className="h-4 w-4" />
            {identifying ? "Pushing..." : "Identify"}
          </Button>
          <div className="flex gap-2">
            <AlertDialogCancel>Close</AlertDialogCancel>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
