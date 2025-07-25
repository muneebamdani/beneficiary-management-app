import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", role: "Receptionist", isActive: true });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Receptionist",
    isActive: true,
  });

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("jwt_token");
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data.users.filter(u => u.role !== "admin"));
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = (user) => {
    setEditUserId(user._id);
    setFormData({ name: user.name, email: user.email, role: user.role, isActive: user.isActive });
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("jwt_token");
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwt_token");
      await axios.put(`http://localhost:5000/api/users/${editUserId}`, {
        ...formData,
        role: formData.role.toLowerCase()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditUserId(null);
      fetchUsers();
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwt_token");
      await axios.post("http://localhost:5000/api/users", {
        ...newUserData,
        role: newUserData.role.toLowerCase()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowAddForm(false);
      setNewUserData({ name: "", email: "", password: "", role: "Receptionist", isActive: true });
      fetchUsers();
    } catch (error) {
      console.error("User creation failed", error);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <Button className="mb-4" onClick={() => setShowAddForm(!showAddForm)}>
        {showAddForm ? "Cancel" : "+ Add New User"}
      </Button>

      {showAddForm && (
        <form onSubmit={handleAddUser} className="mb-6 grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg shadow">
          <Input
            placeholder="Name"
            value={newUserData.name}
            onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
          />
          <Input
            placeholder="Email"
            value={newUserData.email}
            onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
          />
          <Input
            placeholder="Password"
            type="password"
            value={newUserData.password}
            onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
          />
          <select
            value={newUserData.role}
            onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
          >
            <option>Receptionist</option>
            <option>Department Staff</option>
          </select>
          <select
            value={newUserData.isActive}
            onChange={(e) => setNewUserData({ ...newUserData, isActive: e.target.value === "true" })}
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <Button type="submit">Create User</Button>
        </form>
      )}

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) =>
            editUserId === u._id ? (
              <tr key={u._id} className="border-t">
                <td className="p-2">
                  <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </td>
                <td className="p-2">
                  <Input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </td>
                <td className="p-2">
                  <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                    <option>Receptionist</option>
                    <option>Department Staff</option>
                  </select>
                </td>
                <td className="p-2">
                  <select
                    value={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "true" })}
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </td>
                <td className="p-2">
                  <Button onClick={handleUpdate} className="mr-2">Save</Button>
                  <Button variant="destructive" onClick={() => setEditUserId(null)}>Cancel</Button>
                </td>
              </tr>
            ) : (
              <tr key={u._id} className="border-t">
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.role}</td>
                <td className="p-2">{u.isActive ? "Active" : "Inactive"}</td>
                <td className="p-2">
                  <Button onClick={() => handleEditClick(u)} className="mr-2">Edit</Button>
                  <Button variant="destructive" onClick={() => handleDelete(u._id)}>Delete</Button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
