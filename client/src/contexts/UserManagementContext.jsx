"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { UserService } from "../services/userService"
import { useAuth } from "./AuthContext" // ✅ IMPORT THIS

const UserManagementContext = createContext(undefined)

export function UserManagementProvider({ children }) {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const { user } = useAuth() // ✅ GET CURRENT LOGGED-IN USER

  useEffect(() => {
    if (user?.role === "admin") {
      loadUsers()
    } else {
      setIsLoading(false) // ✅ Avoid infinite loading for non-admins
    }
  }, [user])

  const loadUsers = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const fetchedUsers = await UserService.getAllUsers()
      setUsers(fetchedUsers)
    } catch (error) {
      console.error("Error loading users:", error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const addUser = async (userData) => {
    try {
      setError(null)
      const newUser = await UserService.createUser({
        ...userData,
        createdBy: localStorage.getItem("user_email") || "admin",
      })
      setUsers((prev) => [...prev, newUser])
      return newUser
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const updateUser = async (userId, updatedData) => {
    try {
      setError(null)
      const updatedUser = await UserService.updateUser(userId, {
        ...updatedData,
        updatedAt: new Date().toISOString(),
      })
      setUsers((prev) =>
        prev.map((user) => (user._id === userId ? updatedUser : user))
      )
      return updatedUser
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const deleteUser = async (userId) => {
    try {
      setError(null)
      await UserService.deleteUser(userId)
      setUsers((prev) => prev.filter((user) => user._id !== userId))
      return true
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const toggleUserStatus = async (userId) => {
    try {
      setError(null)
      const updatedUser = await UserService.toggleUserStatus(userId)
      setUsers((prev) =>
        prev.map((user) => (user._id === userId ? updatedUser : user))
      )
      return updatedUser
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const validateUser = async (email, password) => {
    try {
      setError(null)
      const result = await UserService.validateLogin(email, password)

      if (result.token) {
        localStorage.setItem("jwt_token", result.token)
        localStorage.setItem("user_email", result.user?.email || "")
      }

      return result.user
    } catch (error) {
      setError(error.message)
      return null
    }
  }

  const refreshUsers = () => {
    if (user?.role === "admin") {
      loadUsers()
    }
  }

  return (
    <UserManagementContext.Provider
      value={{
        users,
        isLoading,
        error,
        addUser,
        updateUser,
        deleteUser,
        toggleUserStatus,
        validateUser,
        refreshUsers,
      }}
    >
      {children}
    </UserManagementContext.Provider>
  )
}

export function useUserManagement() {
  const context = useContext(UserManagementContext)
  if (context === undefined) {
    throw new Error("useUserManagement must be used within a UserManagementProvider")
  }
  return context
}
