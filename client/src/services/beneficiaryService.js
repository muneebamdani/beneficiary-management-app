const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:5000/api"

export class BeneficiaryService {
  static generateTokenId() {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    return `SYL-${timestamp}-${random}`
  }

  static getDepartmentFromPurpose(purpose) {
    const departmentMap = {
      "Medical Assistance": "Medical",
      "Education Support": "Education",
      "Food Distribution": "Food",
      "Clothing Distribution": "Clothing",
      "Financial Aid": "Finance", // ✅ Fixed from "Financial"
      Other: "General",
    }
    return departmentMap[purpose] || "General"
  }

  static async createBeneficiary(beneficiaryData) {
    try {
      const response = await fetch(`${API_BASE_URL}/beneficiaries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
        body: JSON.stringify(beneficiaryData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to create beneficiary")
      }

      return await response.json()
    } catch (error) {
      console.error("Error creating beneficiary:", error)
      throw error
    }
  }

  // Other methods can be added here if needed
}
