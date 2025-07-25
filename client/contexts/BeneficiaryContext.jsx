"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { BeneficiaryService } from "../services/beneficiaryService"

const BeneficiaryContext = createContext(undefined)

export function BeneficiaryProvider({ children }) {
  const [beneficiaries, setBeneficiaries] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load beneficiaries from MongoDB on component mount
  useEffect(() => {
    loadBeneficiaries()
  }, [])

  const loadBeneficiaries = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const fetchedBeneficiaries = await BeneficiaryService.getAllBeneficiaries()
      setBeneficiaries(fetchedBeneficiaries)
    } catch (error) {
      console.error("Error loading beneficiaries:", error)
      setError(error.message)
      // Fallback to empty array if API fails
      setBeneficiaries([])
    } finally {
      setIsLoading(false)
    }
  }

  const addBeneficiary = async (beneficiaryData) => {
    try {
      setError(null)

      // Generate token ID and department
      const tokenId = BeneficiaryService.generateTokenId()
      const department = BeneficiaryService.getDepartmentFromPurpose(beneficiaryData.purpose)

      // Get current user info
      const userData = JSON.parse(localStorage.getItem("user_data") || "{}")

      const newBeneficiaryData = {
        ...beneficiaryData,
        tokenId,
        department,
        status: "pending",
        registrationDate: new Date().toISOString(),
        registeredBy: userData.name || "System",
        registeredByUserId: userData.id || "system",
      }

      const newBeneficiary = await BeneficiaryService.createBeneficiary(newBeneficiaryData)
      setBeneficiaries((prev) => [...prev, newBeneficiary])

      return tokenId
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const updateBeneficiaryStatus = async (tokenId, status, remarks = "") => {
    try {
      setError(null)
      const updatedBeneficiary = await BeneficiaryService.updateBeneficiaryStatus(tokenId, status, remarks)

      setBeneficiaries((prev) =>
        prev.map((beneficiary) => (beneficiary.tokenId === tokenId ? updatedBeneficiary : beneficiary)),
      )

      return true
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const updateBeneficiaryById = async (id, updatedData) => {
    try {
      setError(null)
      const updatedBeneficiary = await BeneficiaryService.updateBeneficiary(id, updatedData)

      setBeneficiaries((prev) => prev.map((beneficiary) => (beneficiary._id === id ? updatedBeneficiary : beneficiary)))

      return true
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const deleteBeneficiary = async (id) => {
    try {
      setError(null)
      await BeneficiaryService.deleteBeneficiary(id)
      setBeneficiaries((prev) => prev.filter((beneficiary) => beneficiary._id !== id))
      return true
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const searchBeneficiaries = async (searchTerm) => {
    try {
      setError(null)
      if (!searchTerm.trim()) return []

      const results = await BeneficiaryService.searchBeneficiaries(searchTerm)
      return results
    } catch (error) {
      setError(error.message)
      return []
    }
  }

  const getBeneficiaryByToken = async (tokenId) => {
    try {
      setError(null)
      const beneficiary = await BeneficiaryService.getBeneficiaryByToken(tokenId)
      return beneficiary
    } catch (error) {
      setError(error.message)
      return null
    }
  }

  const refreshBeneficiaries = () => {
    loadBeneficiaries()
  }

  return (
    <BeneficiaryContext.Provider
      value={{
        beneficiaries,
        isLoading,
        error,
        addBeneficiary,
        updateBeneficiaryStatus,
        updateBeneficiaryById,
        deleteBeneficiary,
        searchBeneficiaries,
        getBeneficiaryByToken,
        refreshBeneficiaries,
      }}
    >
      {children}
    </BeneficiaryContext.Provider>
  )
}

export function useBeneficiaries() {
  const context = useContext(BeneficiaryContext)
  if (context === undefined) {
    throw new Error("useBeneficiaries must be used within a BeneficiaryProvider")
  }
  return context
}
