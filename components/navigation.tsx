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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import {
  Zap,
  Grid3x3,
  Tv,
  Play,
  Smile,
  BarChart3,
  LogOut,
  User,
  Menu,
  Moon,
  Sun,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
} from "lucide-react"

interface NavigationProps {
  currentPage: string
  setCurrentPage: (page: string) => void
}

const SIDEBAR_STORAGE_KEY = "sidebar-collapsed"

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: Grid3x3 },
  { id: "scenes", label: "Scenes", icon: Tv },
  { id: "devices", label: "Devices", icon: Zap },
  { id: "playlists", label: "Playlists", icon: Play },
  { id: "moods", label: "Moods", icon: Smile },
  { id: "admin", label: "Admin", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
]

function BrandMark({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5 py-4", collapsed ? "justify-center px-2" : "px-4")}>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary">
        <Zap className="h-5 w-5 text-primary-foreground" />
      </div>
      {!collapsed && (
        <span className="font-heading text-base font-semibold tracking-tight text-sidebar-foreground">
          RGB Display Manager
        </span>
      )}
    </div>
  )
}

function NavList({
  currentPage,
  onNavigate,
  collapsed = false,
}: {
  currentPage: string
  onNavigate: (page: string) => void
  collapsed?: boolean
}) {
  return (
    <nav className={cn("flex-1 space-y-1", collapsed ? "px-2" : "px-3")}>
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = currentPage === item.id
        const button = (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            aria-label={item.label}
            className={cn(
              "relative flex w-full items-center gap-3 rounded-md py-2 text-sm font-medium transition-colors",
              collapsed ? "justify-center px-2" : "px-3",
              isActive
                ? "bg-gradient-to-r from-primary/15 to-secondary-accent/10 text-primary"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
            )}
          >
            {isActive && (
              <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-gradient-to-b from-primary to-secondary-accent" />
            )}
            <Icon className="h-4 w-4 shrink-0" />
            {!collapsed && item.label}
          </button>
        )

        if (!collapsed) return button
        return (
          <Tooltip key={item.id}>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent side="right">{item.label}</TooltipContent>
          </Tooltip>
        )
      })}
    </nav>
  )
}

function ThemeToggle({ collapsed = false }: { collapsed?: boolean }) {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label="Toggle dark mode"
            className="w-full text-sidebar-foreground/70 hover:bg-sidebar-accent"
          >
            {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">{isDark ? "Dark" : "Light"} mode</TooltipContent>
      </Tooltip>
    )
  }

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

function UserMenu({ collapsed = false }: { collapsed?: boolean }) {
  const { user, logout } = useAuth()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "w-full gap-2 text-sidebar-foreground hover:bg-sidebar-accent",
            collapsed ? "justify-center px-2" : "justify-start px-3",
          )}
          aria-label={user?.name ?? "Account"}
        >
          <User className="h-4 w-4 shrink-0" />
          {!collapsed && <span className="truncate text-sm">{user?.name}</span>}
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
  // Safe to read storage during init: this tree only mounts once auth has
  // resolved client-side, so it never renders during SSR.
  const [collapsed, setCollapsed] = useState(
    () => typeof window !== "undefined" && window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true",
  )

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev
      window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next))
      return next
    })
  }

  const handleNavigate = (page: string) => {
    setCurrentPage(page)
    setMobileOpen(false)
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200 md:flex",
          collapsed ? "w-16" : "w-64",
        )}
      >
        <BrandMark collapsed={collapsed} />
        <div className={cn("px-2 pb-2", collapsed ? "flex justify-center" : "flex justify-end")}>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </Button>
        </div>
        <div className="mt-1 flex-1 overflow-y-auto">
          <NavList currentPage={currentPage} onNavigate={handleNavigate} collapsed={collapsed} />
        </div>
        <div className={cn("space-y-1 border-t border-sidebar-border", collapsed ? "p-2" : "p-3")}>
          <ThemeToggle collapsed={collapsed} />
          <UserMenu collapsed={collapsed} />
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4 md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-heading text-sm font-semibold">RGB Display Manager</span>
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
