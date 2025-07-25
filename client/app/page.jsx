"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

export default function HomePage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      // Redirect based on user role
      switch (user.role) {
        case "admin":
          router.push("/admin")
          break
        case "receptionist":
          router.push("/receptionist")
          break
        case "department-staff":
          router.push("/department-staff")
          break
        default:
          router.push("/login")
      }
    } else {
      router.push("/login")
    }
  }, [user, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  )
}
