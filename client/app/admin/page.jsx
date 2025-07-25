"use client"

import { ProtectedRoute } from "@/components/ProtectedRoute"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Users, UserPlus, Search, Edit, Trash2, Eye, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { useState, useMemo, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useBeneficiaries } from "@/contexts/BeneficiaryContext"

const dailyVisitorData = [
  { name: "Mon", visitors: 45 },
  { name: "Tue", visitors: 52 },
  { name: "Wed", visitors: 38 },
  { name: "Thu", visitors: 61 },
  { name: "Fri", visitors: 55 },
  { name: "Sat", visitors: 42 },
  { name: "Sun", visitors: 28 },
]

const mockUsers = [
  { id: 1, name: "Ahmed Ali", email: "ahmed@saylani.org", role: "receptionist", status: "active" },
  { id: 2, name: "Fatima Khan", email: "fatima@saylani.org", role: "department-staff", status: "active" },
  { id: 3, name: "Muhammad Hassan", email: "hassan@saylani.org", role: "department-staff", status: "inactive" },
]

export default function AdminDashboard() {
  const { beneficiaries, searchBeneficiaries, updateBeneficiaryById, deleteBeneficiary } = useBeneficiaries()
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredBeneficiaries, setFilteredBeneficiaries] = useState(beneficiaries)
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [users, setUsers] = useState(mockUsers)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
    status: "active",
  })

  const [editingUser, setEditingUser] = useState(null)
  const [isEditUserOpen, setIsEditUserOpen] = useState(false)

  // Beneficiary management states
  const [editingBeneficiary, setEditingBeneficiary] = useState(null)
  const [isEditBeneficiaryOpen, setIsEditBeneficiaryOpen] = useState(false)
  const [viewingBeneficiary, setViewingBeneficiary] = useState(null)
  const [isViewBeneficiaryOpen, setIsViewBeneficiaryOpen] = useState(false)

  // Calculate department statistics from real beneficiary data
  const departmentData = useMemo(() => {
    const departmentCounts = beneficiaries.reduce((acc, beneficiary) => {
      acc[beneficiary.department] = (acc[beneficiary.department] || 0) + 1
      return acc
    }, {})

    const colors = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6", "#F97316"]
    return Object.entries(departmentCounts).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length],
    }))
  }, [beneficiaries])

  // Calculate statistics from real data
  const stats = useMemo(() => {
    const totalBeneficiaries = beneficiaries.length
    const activeCases = beneficiaries.filter((b) => b.status === "in-progress" || b.status === "pending").length
    const completedCases = beneficiaries.filter((b) => b.status === "completed").length
    const todayRegistrations = beneficiaries.filter(
      (b) => b.registrationDate === new Date().toISOString().split("T")[0],
    ).length

    return {
      totalBeneficiaries,
      activeCases,
      completedCases,
      todayRegistrations,
    }
  }, [beneficiaries])

  const handleSearch = (term) => {
    setSearchTerm(term)
    if (term.trim() === "") {
      setFilteredBeneficiaries(beneficiaries)
    } else {
      const filtered = searchBeneficiaries(term)
      setFilteredBeneficiaries(filtered)
    }
  }

  // User management functions
  const handleAddUser = (e) => {
    e.preventDefault()
    const user = {
      id: users.length + 1,
      ...newUser,
    }
    setUsers([...users, user])
    setNewUser({ name: "", email: "", role: "", status: "active" })
    setIsAddUserOpen(false)
  }

  const handleEditUser = (user) => {
    setEditingUser(user)
    setNewUser({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    })
    setIsEditUserOpen(true)
  }

  const handleUpdateUser = (e) => {
    e.preventDefault()
    const updatedUsers = users.map((user) => (user.id === editingUser.id ? { ...user, ...newUser } : user))
    setUsers(updatedUsers)
    setNewUser({ name: "", email: "", role: "", status: "active" })
    setEditingUser(null)
    setIsEditUserOpen(false)
  }

  const handleDeleteUser = (userId) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((user) => user.id !== userId))
    }
  }

  const toggleUserStatus = (userId) => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, status: user.status === "active" ? "inactive" : "active" } : user,
    )
    setUsers(updatedUsers)
  }

  // Beneficiary management functions
  const handleViewBeneficiary = (beneficiary) => {
    setViewingBeneficiary(beneficiary)
    setIsViewBeneficiaryOpen(true)
  }

  const handleEditBeneficiary = (beneficiary) => {
    setEditingBeneficiary(beneficiary)
    setIsEditBeneficiaryOpen(true)
  }

  const handleUpdateBeneficiary = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const updatedData = {
      name: formData.get("name"),
      cnic: formData.get("cnic"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      purpose: formData.get("purpose"),
      status: formData.get("status"),
    }

    updateBeneficiaryById(editingBeneficiary.id, updatedData)
    setEditingBeneficiary(null)
    setIsEditBeneficiaryOpen(false)
  }

  const handleDeleteBeneficiary = (beneficiaryId) => {
    if (confirm("Are you sure you want to delete this beneficiary? This action cannot be undone.")) {
      deleteBeneficiary(beneficiaryId)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "in-progress":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "pending":
        return <AlertCircle className="w-4 h-4 text-gray-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />
    }
  }

  // Initialize filtered beneficiaries when beneficiaries change
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredBeneficiaries(beneficiaries)
    }
  }, [beneficiaries, searchTerm])

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, beneficiaries, view statistics, and oversee operations</p>
        </div>

        {/* Stats Cards - Now using real data */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Beneficiaries</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalBeneficiaries}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <UserPlus className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Today's Registrations</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.todayRegistrations}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Cases</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeCases}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed Cases</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completedCases}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts - Now using real data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Daily Visitor Count</CardTitle>
              <CardDescription>Number of beneficiaries per day this week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyVisitorData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="visitors" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Department-wise Distribution</CardTitle>
              <CardDescription>Beneficiaries by department (Real Data)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Beneficiary Management */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Beneficiary Management</CardTitle>
            <CardDescription>View, edit, and manage all registered beneficiaries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                placeholder="Search by CNIC, name, phone, or token ID..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="max-w-md"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Name</th>
                    <th className="text-left p-4">CNIC</th>
                    <th className="text-left p-4">Phone</th>
                    <th className="text-left p-4">Token ID</th>
                    <th className="text-left p-4">Department</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBeneficiaries.map((beneficiary) => (
                    <tr key={beneficiary.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">{beneficiary.name}</td>
                      <td className="p-4">{beneficiary.cnic}</td>
                      <td className="p-4">{beneficiary.phone}</td>
                      <td className="p-4">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">{beneficiary.tokenId}</code>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">{beneficiary.department}</Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(beneficiary.status)}
                          <Badge
                            variant={
                              beneficiary.status === "completed"
                                ? "default"
                                : beneficiary.status === "in-progress"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {beneficiary.status}
                          </Badge>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewBeneficiary(beneficiary)}
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditBeneficiary(beneficiary)}
                            title="Edit Beneficiary"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteBeneficiary(beneficiary.id)}
                            className="text-red-600 hover:text-red-700"
                            title="Delete Beneficiary"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredBeneficiaries.length === 0 && searchTerm && (
              <div className="text-center py-8">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No beneficiaries found matching your search.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Users Management */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Users Management</CardTitle>
            <CardDescription>Manage system users and their roles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Button className="bg-green-600 hover:bg-green-700" onClick={() => setIsAddUserOpen(true)}>
                <UserPlus className="w-4 h-4 mr-2" />
                Add New User
              </Button>
            </div>

            {/* Add User Dialog */}
            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>Create a new user account for the system</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddUser} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="receptionist">Receptionist</SelectItem>
                        <SelectItem value="department-staff">Department Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsAddUserOpen(false)
                        setNewUser({ name: "", email: "", role: "", status: "active" })
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-green-600 hover:bg-green-700">
                      Add User
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            {/* Edit User Dialog */}
            <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit User</DialogTitle>
                  <DialogDescription>Update user account details</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleUpdateUser} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Full Name</Label>
                    <Input
                      id="edit-name"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-role">Role</Label>
                    <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="receptionist">Receptionist</SelectItem>
                        <SelectItem value="department-staff">Department Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <Select value={newUser.status} onValueChange={(value) => setNewUser({ ...newUser, status: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditUserOpen(false)
                        setEditingUser(null)
                        setNewUser({ name: "", email: "", role: "", status: "active" })
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-green-600 hover:bg-green-700">
                      Update User
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Name</th>
                    <th className="text-left p-4">Email</th>
                    <th className="text-left p-4">Role</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">{user.name}</td>
                      <td className="p-4">{user.email}</td>
                      <td className="p-4">
                        <Badge variant="outline">{user.role}</Badge>
                      </td>
                      <td className="p-4">
                        <Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditUser(user)} title="Edit User">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleUserStatus(user.id)}
                            title={user.status === "active" ? "Deactivate User" : "Activate User"}
                            className={
                              user.status === "active"
                                ? "text-orange-600 hover:text-orange-700"
                                : "text-green-600 hover:text-green-700"
                            }
                          >
                            {user.status === "active" ? "Deactivate" : "Activate"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-700"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* View Beneficiary Dialog */}
        <Dialog open={isViewBeneficiaryOpen} onOpenChange={setIsViewBeneficiaryOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Beneficiary Details</DialogTitle>
              <DialogDescription>Complete information about the beneficiary</DialogDescription>
            </DialogHeader>
            {viewingBeneficiary && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Full Name</Label>
                    <p className="text-lg font-semibold">{viewingBeneficiary.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">CNIC</Label>
                    <p className="text-gray-900">{viewingBeneficiary.cnic}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Phone</Label>
                    <p className="text-gray-900">{viewingBeneficiary.phone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Token ID</Label>
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">{viewingBeneficiary.tokenId}</code>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Purpose</Label>
                    <p className="text-gray-900">{viewingBeneficiary.purpose}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Department</Label>
                    <Badge variant="outline">{viewingBeneficiary.department}</Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Status</Label>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(viewingBeneficiary.status)}
                      <Badge
                        variant={
                          viewingBeneficiary.status === "completed"
                            ? "default"
                            : viewingBeneficiary.status === "in-progress"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {viewingBeneficiary.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Registration Date</Label>
                    <p className="text-gray-900">{viewingBeneficiary.registrationDate}</p>
                  </div>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm font-medium text-gray-600">Address</Label>
                  <p className="text-gray-900">{viewingBeneficiary.address}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Beneficiary Dialog */}
        <Dialog open={isEditBeneficiaryOpen} onOpenChange={setIsEditBeneficiaryOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Beneficiary</DialogTitle>
              <DialogDescription>Update beneficiary information</DialogDescription>
            </DialogHeader>
            {editingBeneficiary && (
              <form onSubmit={handleUpdateBeneficiary} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Full Name</Label>
                    <Input id="edit-name" name="name" defaultValue={editingBeneficiary.name} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-cnic">CNIC</Label>
                    <Input id="edit-cnic" name="cnic" defaultValue={editingBeneficiary.cnic} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-phone">Phone</Label>
                    <Input id="edit-phone" name="phone" defaultValue={editingBeneficiary.phone} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-purpose">Purpose</Label>
                    <Select name="purpose" defaultValue={editingBeneficiary.purpose}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Medical Assistance">Medical Assistance</SelectItem>
                        <SelectItem value="Education Support">Education Support</SelectItem>
                        <SelectItem value="Food Distribution">Food Distribution</SelectItem>
                        <SelectItem value="Clothing Distribution">Clothing Distribution</SelectItem>
                        <SelectItem value="Financial Aid">Financial Aid</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <Select name="status" defaultValue={editingBeneficiary.status}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-address">Address</Label>
                  <Textarea id="edit-address" name="address" defaultValue={editingBeneficiary.address} rows={3} />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsEditBeneficiaryOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    Update Beneficiary
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}
