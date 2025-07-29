"use client"

import { createContext, useContext, useState, useEffect } from "react"
import NEXT_URL from "../src/config-two"
const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Read backend URL from env, with a fallback
  const BACKEND_URL = `${NEXT_URL}`

  useEffect(() => {
    const token = localStorage.getItem("jwt_token")
    const userData = localStorage.getItem("user_data")

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        if (parsedUser?.role) {
          setUser(parsedUser)
        } else {
          throw new Error("Invalid user data")
        }
      } catch (error) {
        console.error("Failed to parse user data:", error)
        localStorage.removeItem("jwt_token")
        localStorage.removeItem("user_data")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const res = await fetch(`${NEXT_URL}/api`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        return { success: false, message: data.message || "Login failed" }
      }

      // Normalize role to lowercase for consistency
      const safeUser = { ...data.user, role: data.user.role.toLowerCase() }

      localStorage.setItem("jwt_token", data.token)
      localStorage.setItem("user_data", JSON.stringify(safeUser))
      setUser(safeUser)

      return { success: true, user: safeUser }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, message: "An unexpected error occurred" }
    }
  }

  const logout = () => {
    localStorage.removeItem("jwt_token")
    localStorage.removeItem("user_data")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
