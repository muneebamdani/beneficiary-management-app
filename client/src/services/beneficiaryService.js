// src/services/beneficiaryService.js
const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:5000/api"

export class BeneficiaryService {
  static async createBeneficiary(beneficiaryData) {
    try {
      const response = await fetch(`${API_BASE_URL}/beneficiaries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
        body: JSON.stringify(beneficiaryData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create beneficiary");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating beneficiary:", error);
      throw error;
    }
  }
}
