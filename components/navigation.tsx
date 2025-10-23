"use client"

import { Button } from "@/components/ui/button"
import { Zap, Grid3x3, Tv, Play, Smile, BarChart3, LogOut, User } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useState } from "react"

interface NavigationProps {
  currentPage: string
  setCurrentPage: (page: string) => void
}

export default function Navigation({ currentPage, setCurrentPage }: NavigationProps) {
  const { user, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Grid3x3 },
    { id: "scenes", label: "Scenes", icon: Tv },
    { id: "devices", label: "Devices", icon: Zap },
    { id: "playlists", label: "Playlists", icon: Play },
    { id: "moods", label: "Moods", icon: Smile },
    { id: "admin", label: "Admin", icon: BarChart3 },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 h-20 bg-card border-b border-border/50 backdrop-blur-xl z-50">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            RGB Display Manager
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            return (
              <Button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                variant={isActive ? "default" : "ghost"}
                className={`gap-2 ${
                  isActive
                    ? "bg-gradient-to-r from-primary to-accent text-white"
                    : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Button>
            )
          })}
        </div>

        <div className="relative">
          <Button
            onClick={() => setShowUserMenu(!showUserMenu)}
            variant="ghost"
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <User className="w-5 h-5" />
            <span className="hidden sm:inline text-sm">{user?.name}</span>
          </Button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-card border border-border/50 rounded-lg shadow-lg overflow-hidden">
              <div className="p-4 border-b border-border/50">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <Button
                onClick={() => {
                  logout()
                  setShowUserMenu(false)
                }}
                variant="ghost"
                className="w-full justify-start gap-2 rounded-none text-destructive hover:bg-destructive/10"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
