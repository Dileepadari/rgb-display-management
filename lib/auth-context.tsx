"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const savedUser = localStorage.getItem("rgbUser")
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
        setIsLoggedIn(true)
      } catch (error) {
        console.error("Failed to parse saved user:", error)
        localStorage.removeItem("rgbUser")
      }
    }
  }, [])

  const login = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error("Email and password are required")
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name: email.split("@")[0],
      createdAt: new Date().toISOString(),
    }

    setUser(newUser)
    setIsLoggedIn(true)
    localStorage.setItem("rgbUser", JSON.stringify(newUser))
  }

  const signup = async (email: string, password: string, name: string) => {
    if (!email || !password || !name) {
      throw new Error("All fields are required")
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters")
    }

    if (!email.includes("@")) {
      throw new Error("Please enter a valid email")
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      createdAt: new Date().toISOString(),
    }

    setUser(newUser)
    setIsLoggedIn(true)
    localStorage.setItem("rgbUser", JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    setIsLoggedIn(false)
    localStorage.removeItem("rgbUser")
  }

  return <AuthContext.Provider value={{ user, isLoggedIn, login, signup, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
