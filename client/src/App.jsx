// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"

import {Navbar} from "./components/Navbar"
import LoginPage from "./pages/LoginPage"
import AdminDashboard from "./pages/AdminDashboard"
import ReceptionistPanel from "./pages/ReceptionistPanel"
import DepartmentStaffPanel from "./pages/DepartmentStaffPanel"
import SearchPage from "./pages/SearchPage"
import UnauthorizedPage from "./pages/UnauthorizedPage"

function RequireUserAndRedirect() {
  const { user, isLoading } = useAuth()
  if (isLoading) return null
  if (!user) return <Navigate to="/login" replace />
  const rolePath = user.role.replace(/\s+/g, "-").toLowerCase()
  return <Navigate to={`/${rolePath}`} replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<RequireUserAndRedirect />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/receptionist"
        element={
          <ProtectedRoute allowedRoles={["Receptionist"]}>
            <ReceptionistPanel />
          </ProtectedRoute>
        }
      />
      <Route
        path="/department-staff"
        element={
          <ProtectedRoute allowedRoles={["Department Staff"]}>
            <DepartmentStaffPanel />
          </ProtectedRoute>
        }
      />
      <Route
        path="/search"
        element={
          <ProtectedRoute allowedRoles={["Admin", "Receptionist", "Department Staff"]}>
            <SearchPage />
          </ProtectedRoute>
        }
      />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<Navigate to="/unauthorized" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <AppRoutes />
      </Router>
    </AuthProvider>
  )
}
