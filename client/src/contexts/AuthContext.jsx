"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { jwtDecode } from "jwt-decode"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("jwt_token") : null
    const userData = typeof window !== "undefined" ? localStorage.getItem("user_data") : null

    if (token && userData) {
      try {
        const decoded = jwtDecode(token)
        const now = Date.now() / 1000

        if (decoded.exp && decoded.exp < now) {
          logout() // Token expired
        } else {
          const parsedUser = JSON.parse(userData)
          const normalizedUser = { ...parsedUser, role: parsedUser.role.toLowerCase() }
          setUser(normalizedUser)
        }
      } catch (err) {
        logout() // Invalid token
      }
    }

    setIsLoading(false)
  }, [])

  async function login(email, password) {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const json = await res.json()

      if (res.ok && json.success) {
        const normalizedUser = { ...json.user, role: json.user.role.toLowerCase() }

        localStorage.setItem("jwt_token", json.token)
        localStorage.setItem("user_data", JSON.stringify(normalizedUser))
        setUser(normalizedUser)

        return { success: true, user: normalizedUser }
      } else {
        return { success: false, message: json.message || "Login failed" }
      }
    } catch {
      return { success: false, message: "Network error" }
    }
  }

  function logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("jwt_token")
      localStorage.removeItem("user_data")
    }
    setUser(null)
  }

  function updateUser(updatedUser) {
    const normalizedUser = { ...updatedUser, role: updatedUser.role.toLowerCase() }
    setUser(normalizedUser)
    localStorage.setItem("user_data", JSON.stringify(normalizedUser))
  }

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
