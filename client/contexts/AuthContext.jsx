"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

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
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        return { success: false, message: data.message || "Login failed" }
      }

      localStorage.setItem("jwt_token", data.token)
      localStorage.setItem("user_data", JSON.stringify(data.user))
      setUser(data.user)

      return { success: true, user: data.user }
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
