"use client"

import useSWR from "swr"
import { BarChart3, Grid3x3, Play, Smile, Tv, Zap } from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

interface NamedRecord {
  id: string
  name: string
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const pages = [
  { id: "dashboard", label: "Dashboard", icon: Grid3x3 },
  { id: "scenes", label: "Scenes", icon: Tv },
  { id: "devices", label: "Devices", icon: Zap },
  { id: "playlists", label: "Playlists", icon: Play },
  { id: "moods", label: "Moods", icon: Smile },
  { id: "admin", label: "Admin", icon: BarChart3 },
]

export function CommandPalette({
  open,
  onOpenChange,
  onNavigate,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onNavigate: (page: string) => void
}) {
  // Only fetch while open. These keys are shared with the dashboard, so SWR
  // serves them from cache and the list is populated immediately on reopen.
  const { data: scenes } = useSWR<NamedRecord[]>(open ? "/api/scenes" : null, fetcher)
  const { data: devices } = useSWR<NamedRecord[]>(open ? "/api/devices" : null, fetcher)
  const { data: playlists } = useSWR<NamedRecord[]>(open ? "/api/playlists" : null, fetcher)

  const go = (page: string) => {
    onNavigate(page)
    onOpenChange(false)
  }

  // "__"-prefixed records are auto-managed internals (e.g. the Identify test
  // pattern), not something to surface as a searchable destination.
  const listable = (items: NamedRecord[] | undefined) =>
    (Array.isArray(items) ? items : []).filter((item) => !item.name.startsWith("__"))

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search pages, scenes, devices, playlists..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Go to">
          {pages.map((page) => {
            const Icon = page.icon
            return (
              <CommandItem key={page.id} value={`page ${page.label}`} onSelect={() => go(page.id)}>
                <Icon />
                {page.label}
              </CommandItem>
            )
          })}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Scenes">
          {listable(scenes).map((scene) => (
            <CommandItem key={scene.id} value={`scene ${scene.name}`} onSelect={() => go("scenes")}>
              <Tv />
              {scene.name}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Devices">
          {listable(devices).map((device) => (
            <CommandItem key={device.id} value={`device ${device.name}`} onSelect={() => go("devices")}>
              <Zap />
              {device.name}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Playlists">
          {listable(playlists).map((playlist) => (
            <CommandItem key={playlist.id} value={`playlist ${playlist.name}`} onSelect={() => go("playlists")}>
              <Play />
              {playlist.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
