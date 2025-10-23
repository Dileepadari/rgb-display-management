"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import Navigation from "@/components/navigation"
import Dashboard from "@/components/dashboard"
import { SceneEditorComplete } from "@/components/scene-editor-complete"
import { DeviceManagerComplete } from "@/components/device-manager-complete"
import { PlaylistManagerComplete } from "@/components/playlist-manager-complete"
import { MoodBoardComplete } from "@/components/mood-board-complete"
import AdminDashboard from "@/components/admin-dashboard"
import AuthPage from "@/components/auth-page"
import { initMQTT } from "@/lib/mqtt-handler"

export default function Home() {
  const { isLoggedIn } = useAuth()
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (isLoggedIn) {
      initMQTT().catch((err) => console.error("[v0] MQTT init error:", err))
    }
  }, [isLoggedIn])

  if (!mounted) {
    return null
  }

  if (!isLoggedIn) {
    return <AuthPage />
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="pt-20 px-4 md:px-8 pb-8">
        {currentPage === "dashboard" && <Dashboard />}
        {currentPage === "scenes" && <SceneEditorComplete />}
        {currentPage === "devices" && <DeviceManagerComplete />}
        {currentPage === "playlists" && <PlaylistManagerComplete />}
        {currentPage === "moods" && <MoodBoardComplete />}
        {currentPage === "admin" && <AdminDashboard />}
      </main>
    </div>
  )
}
