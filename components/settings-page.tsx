"use client"

import type React from "react"
import { useState } from "react"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
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
import { useAuth } from "@/lib/auth-context"
import { KeyRound, LogOut, Moon, Palette, Sun, User as UserIcon } from "lucide-react"

export function SettingsPage() {
  const { user, updateName, changePassword, signOutEverywhere } = useAuth()
  const { theme, setTheme } = useTheme()

  const [name, setName] = useState(user?.name ?? "")
  const [savingName, setSavingName] = useState(false)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [changingPassword, setChangingPassword] = useState(false)

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingName(true)
    try {
      await updateName(name.trim())
      toast.success("Display name updated")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't update your name")
    } finally {
      setSavingName(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error("The two new passwords don't match")
      return
    }
    setChangingPassword(true)
    try {
      await changePassword(currentPassword, newPassword)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      toast.success("Password changed. Use it next time you sign in.")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't change your password")
    } finally {
      setChangingPassword(false)
    }
  }

  const handleSignOutEverywhere = async () => {
    try {
      await signOutEverywhere()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't sign out everywhere")
    }
  }

  const isDark = theme === "dark"

  return (
    <div className="w-full space-y-6 px-4 py-6 md:px-8 lg:px-10">
      <PageHeader
        title="Settings"
        purpose="Your account and how this app looks — nothing here changes what your panels are showing."
        howTo={
          <ul>
            <li>Your display name is what appears in the sidebar and on activity entries.</li>
            <li>Changing your password asks for the current one first, to prove it&apos;s you.</li>
            <li>Sign out everywhere is the thing to use if you think someone else has your session.</li>
          </ul>
        }
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-muted-foreground" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveName} className="space-y-4">
              <div className="space-y-1">
                <Label>Email</Label>
                <Input value={user?.email ?? ""} readOnly disabled />
                <p className="text-muted-foreground text-xs">
                  Your sign-in address. Changing it isn&apos;t supported yet.
                </p>
              </div>
              <div className="space-y-1">
                <Label className="gap-1.5">
                  Display name
                  <HelpTip>Shown in the sidebar and next to anything you do in the activity feed.</HelpTip>
                </Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              </div>
              <Button type="submit" disabled={savingName || !name.trim() || name.trim() === user?.name}>
                {savingName ? "Saving..." : "Save name"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-muted-foreground" />
              Change password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-1">
                <Label>Current password</Label>
                <Input
                  type="password"
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label>New password</Label>
                <Input
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <p className="text-muted-foreground text-xs">At least 6 characters.</p>
              </div>
              <div className="space-y-1">
                <Label>Confirm new password</Label>
                <Input
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={changingPassword || !currentPassword || !newPassword || !confirmPassword}
              >
                {changingPassword ? "Changing..." : "Change password"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-muted-foreground" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">
                  {isDark ? "Dark" : "Light"} theme
                </p>
                <p className="text-muted-foreground text-xs">
                  Dark suits a room with panels running; light is easier in daylight.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                <Switch
                  checked={isDark}
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                  aria-label="Toggle dark theme"
                />
              </div>
            </div>
            <Separator />
            <p className="text-muted-foreground text-xs">
              Animations follow your system&apos;s &ldquo;reduce motion&rdquo; setting automatically — turn it on in
              your OS and this app stops animating.
            </p>
          </CardContent>
        </Card>

        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogOut className="h-4 w-4 text-destructive" />
              Sessions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground text-sm">
              Signs you out of this browser and every other device where you&apos;re still logged in. Your scenes,
              devices and playlists are untouched.
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Sign out everywhere
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Sign out of every device?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You&apos;ll need to sign in again here and anywhere else you were logged in. Your panels keep
                    showing whatever you last pushed to them.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSignOutEverywhere}>Sign out everywhere</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
