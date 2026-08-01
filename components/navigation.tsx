"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import { Zap, Grid3x3, Tv, Play, Smile, BarChart3, LogOut, User, Menu, Moon, Sun } from "lucide-react"

interface NavigationProps {
  currentPage: string
  setCurrentPage: (page: string) => void
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: Grid3x3 },
  { id: "scenes", label: "Scenes", icon: Tv },
  { id: "devices", label: "Devices", icon: Zap },
  { id: "playlists", label: "Playlists", icon: Play },
  { id: "moods", label: "Moods", icon: Smile },
  { id: "admin", label: "Admin", icon: BarChart3 },
]

function BrandMark() {
  return (
    <div className="flex items-center gap-2.5 px-4 py-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60">
        <Zap className="h-5 w-5 text-primary-foreground" />
      </div>
      <span className="text-base font-semibold tracking-tight text-sidebar-foreground">RGB Display Manager</span>
    </div>
  )
}

function NavList({ currentPage, onNavigate }: { currentPage: string; onNavigate: (page: string) => void }) {
  return (
    <nav className="flex-1 space-y-1 px-3">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = currentPage === item.id
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={cn(
              "relative flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
            )}
          >
            {isActive && <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary" />}
            <Icon className="h-4 w-4 shrink-0" />
            {item.label}
          </button>
        )
      })}
    </nav>
  )
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"
  return (
    <div className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-sidebar-foreground/70">
      <span className="flex items-center gap-2">
        {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        {isDark ? "Dark" : "Light"} mode
      </span>
      <Switch
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        aria-label="Toggle dark mode"
      />
    </div>
  )
}

function UserMenu() {
  const { user, logout } = useAuth()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 px-3 text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <User className="h-4 w-4 shrink-0" />
          <span className="truncate text-sm">{user?.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="top" className="w-56">
        <DropdownMenuLabel>
          <p className="text-sm font-medium">{user?.name}</p>
          <p className="text-xs font-normal text-muted-foreground">{user?.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => logout()}>
          <LogOut className="h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function Navigation({ currentPage, setCurrentPage }: NavigationProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleNavigate = (page: string) => {
    setCurrentPage(page)
    setMobileOpen(false)
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
        <BrandMark />
        <div className="mt-2 flex-1 overflow-y-auto">
          <NavList currentPage={currentPage} onNavigate={handleNavigate} />
        </div>
        <div className="space-y-1 border-t border-sidebar-border p-3">
          <ThemeToggle />
          <UserMenu />
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4 md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold">RGB Display Manager</span>
        </div>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex w-64 flex-col bg-sidebar p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            <BrandMark />
            <div className="mt-2 flex-1 overflow-y-auto">
              <NavList currentPage={currentPage} onNavigate={handleNavigate} />
            </div>
            <div className="space-y-1 border-t border-sidebar-border p-3">
              <ThemeToggle />
              <UserMenu />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
