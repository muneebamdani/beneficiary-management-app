// src/services/beneficiaryService.js
import API_BASE_URL from '../config';

export class BeneficiaryService {
  static async createBeneficiary(beneficiaryData) {
    const token = localStorage.getItem("jwt_token");
    console.log("Token from localStorage:", token);  // <--- Add this line

    if (!token) {
      throw new Error("No auth token found. Please login first.");  // <--- Optional: prevent API call without token
    }

    const response = await fetch(`${API_BASE_URL}/beneficiaries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,   // <--- Send token in header
      },
      body: JSON.stringify(beneficiaryData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create beneficiary");
    }

    return await response.json();
  }
}
