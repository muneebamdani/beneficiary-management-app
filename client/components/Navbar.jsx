"use client"

import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut, Users, UserPlus, Search, BarChart3 } from "lucide-react"

export function Navbar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  if (!user || pathname === "/login") {
    return null
  }

  const getNavLinks = () => {
    switch (user.role) {
      case "admin":
        return [
          { href: "/admin", label: "Dashboard", icon: BarChart3 },
          { href: "/search", label: "Search", icon: Search },
        ]
      case "receptionist":
        return [
          { href: "/receptionist", label: "Registration", icon: UserPlus },
          { href: "/search", label: "Search", icon: Search },
        ]
      case "department-staff":
        return [
          { href: "/department-staff", label: "Token Processing", icon: Users },
          { href: "/search", label: "Search", icon: Search },
        ]
      default:
        return []
    }
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-green-600">Saylani Welfare</h1>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {getNavLinks().map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                      pathname === link.href
                        ? "text-green-600 border-b-2 border-green-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {link.label}
                  </Link>
                )
              })}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">Welcome, {user.name}</span>
            <Button variant="outline" size="sm" onClick={logout} className="flex items-center bg-transparent">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
