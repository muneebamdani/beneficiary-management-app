// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()
  const [ok, setOk] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate("/login")
        return
      }

      if (!allowedRoles.includes(user.role)) {
        navigate("/unauthorized")
        return
      }

      setOk(true)
    }
  }, [user, isLoading, navigate, allowedRoles])

  if (isLoading || !ok) return <div>Loading...</div>
  return children
}
