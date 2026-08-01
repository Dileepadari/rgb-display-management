"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import Navigation from "@/components/navigation"
import { CommandPalette } from "@/components/command-palette"
import Dashboard from "@/components/dashboard"
import { SceneEditorComplete } from "@/components/scene-editor-complete"
import { DeviceManagerComplete } from "@/components/device-manager-complete"
import { PlaylistManagerComplete } from "@/components/playlist-manager-complete"
import { MoodBoardComplete } from "@/components/mood-board-complete"
import AdminDashboard from "@/components/admin-dashboard"
import { SettingsPage } from "@/components/settings-page"
import AuthPage from "@/components/auth-page"

export default function Home() {
  const { isLoggedIn, loading } = useAuth()
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [paletteOpen, setPaletteOpen] = useState(false)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setPaletteOpen((prev) => !prev)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  if (loading) {
    return null
  }

  if (!isLoggedIn) {
    return <AuthPage />
  }

  return (
    <div className="flex min-h-screen flex-col bg-background md:h-screen md:flex-row md:overflow-hidden">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="flex-1 overflow-y-auto">
        {currentPage === "dashboard" && <Dashboard onNavigate={setCurrentPage} />}
        {currentPage === "scenes" && <SceneEditorComplete />}
        {currentPage === "devices" && <DeviceManagerComplete />}
        {currentPage === "playlists" && <PlaylistManagerComplete />}
        {currentPage === "moods" && <MoodBoardComplete />}
        {currentPage === "admin" && <AdminDashboard onNavigate={setCurrentPage} />}
        {currentPage === "settings" && <SettingsPage />}
      </main>
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} onNavigate={setCurrentPage} />
    </div>
  )
}
