"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import Navigation from "@/components/navigation"
import Dashboard from "@/components/dashboard"
import { SceneEditorComplete } from "@/components/scene-editor-complete"
import { DeviceManagerComplete } from "@/components/device-manager-complete"
import { PlaylistManagerComplete } from "@/components/playlist-manager-complete"
import { MoodBoardComplete } from "@/components/mood-board-complete"
import AdminDashboard from "@/components/admin-dashboard"
import AuthPage from "@/components/auth-page"

export default function Home() {
  const { isLoggedIn, loading } = useAuth()
  const [currentPage, setCurrentPage] = useState("dashboard")

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
