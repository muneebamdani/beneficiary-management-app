import API_BASE_URL from '../config';

const getToken = () => localStorage.getItem("jwt_token")

export const UserService = {
  getAllUsers: async () => {
    const res = await fetch(`${API_BASE_URL}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    })
    if (!res.ok) throw new Error("Failed to fetch users")
    return await res.json()
  },

  createUser: async (userData) => {
    const res = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(userData),
    })
    if (!res.ok) throw new Error("Failed to create user")
    return await res.json()
  },

  updateUser: async (userId, updatedData) => {
    const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(updatedData),
    })
    if (!res.ok) throw new Error("Failed to update user")
    return await res.json()
  },

  deleteUser: async (userId) => {
    const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
    if (!res.ok) throw new Error("Failed to delete user")
    return true
  },

  toggleUserStatus: async (userId) => {
    const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ toggleStatus: true }),
    })
    if (!res.ok) throw new Error("Failed to toggle user status")
    return await res.json()
  },

  validateLogin: async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) throw new Error("Login failed")
    return await res.json() // { token, user }
  },
}
