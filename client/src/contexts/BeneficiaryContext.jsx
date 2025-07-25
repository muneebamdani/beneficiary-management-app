"use client"

import { createContext, useContext, useState, useEffect } from "react"

const BeneficiaryContext = createContext(undefined)

// Mock initial data
const initialBeneficiaries = [
  {
    id: "1",
    name: "Ahmed Ali Khan",
    cnic: "42101-1234567-1",
    phone: "0300-1234567",
    address: "House No. 123, Street 5, Gulshan-e-Iqbal, Karachi",
    purpose: "Medical Assistance",
    status: "completed",
    registrationDate: "2024-01-15",
    tokenId: "SYL-240115-001",
    department: "Medical",
    registeredBy: "Receptionist",
  },
  {
    id: "2",
    name: "Fatima Sheikh",
    cnic: "42101-2345678-2",
    phone: "0301-2345678",
    address: "Flat 45, Block B, North Nazimabad, Karachi",
    purpose: "Education Support",
    status: "in-progress",
    registrationDate: "2024-01-16",
    tokenId: "SYL-240116-002",
    department: "Education",
    registeredBy: "Receptionist",
  },
  {
    id: "3",
    name: "Muhammad Hassan",
    cnic: "42101-3456789-3",
    phone: "0302-3456789",
    address: "House 67, Sector 11-A, North Karachi",
    purpose: "Food Distribution",
    status: "pending",
    registrationDate: "2024-01-17",
    tokenId: "SYL-240117-003",
    department: "Food",
    registeredBy: "Receptionist",
  },
  {
    id: "4",
    name: "Aisha Malik",
    cnic: "42101-4567890-4",
    phone: "0303-4567890",
    address: "Plot 89, Scheme 33, Gulshan-e-Maymar, Karachi",
    purpose: "Clothing Distribution",
    status: "completed",
    registrationDate: "2024-01-18",
    tokenId: "SYL-240118-004",
    department: "Clothing",
    registeredBy: "Receptionist",
  },
  {
    id: "5",
    name: "Omar Farooq",
    cnic: "42101-5678901-5",
    phone: "0304-5678901",
    address: "House 234, Block 15, Federal B Area, Karachi",
    purpose: "Financial Aid",
    status: "in-progress",
    registrationDate: "2024-01-19",
    tokenId: "SYL-240119-005",
    department: "Financial",
    registeredBy: "Receptionist",
  },
]

export function BeneficiaryProvider({ children }) {
  const [beneficiaries, setBeneficiaries] = useState([])

  useEffect(() => {
    // Load beneficiaries from localStorage or use initial data
    const storedBeneficiaries = localStorage.getItem("beneficiaries")
    if (storedBeneficiaries) {
      try {
        setBeneficiaries(JSON.parse(storedBeneficiaries))
      } catch (error) {
        setBeneficiaries(initialBeneficiaries)
      }
    } else {
      setBeneficiaries(initialBeneficiaries)
    }
  }, [])

  useEffect(() => {
    // Save beneficiaries to localStorage whenever it changes
    if (beneficiaries.length > 0) {
      localStorage.setItem("beneficiaries", JSON.stringify(beneficiaries))
    }
  }, [beneficiaries])

  const generateTokenId = () => {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    return `SYL-${timestamp}-${random}`
  }

  const getDepartmentFromPurpose = (purpose) => {
    const departmentMap = {
      "Medical Assistance": "Medical",
      "Education Support": "Education",
      "Food Distribution": "Food",
      "Clothing Distribution": "Clothing",
      "Financial Aid": "Financial",
      Other: "General",
    }
    return departmentMap[purpose] || "General"
  }

  const addBeneficiary = (beneficiaryData) => {
    const tokenId = generateTokenId()
    const newBeneficiary = {
      ...beneficiaryData,
      id: Date.now().toString(),
      registrationDate: new Date().toISOString().split("T")[0],
      tokenId,
      department: getDepartmentFromPurpose(beneficiaryData.purpose),
    }

    setBeneficiaries((prev) => [...prev, newBeneficiary])
    return tokenId
  }

  const updateBeneficiaryStatus = (tokenId, status, remarks) => {
    setBeneficiaries((prev) =>
      prev.map((beneficiary) => (beneficiary.tokenId === tokenId ? { ...beneficiary, status } : beneficiary)),
    )
    return true
  }

  const updateBeneficiaryById = (id, updatedData) => {
    setBeneficiaries((prev) =>
      prev.map((beneficiary) => (beneficiary.id === id ? { ...beneficiary, ...updatedData } : beneficiary)),
    )
    return true
  }

  const deleteBeneficiary = (id) => {
    setBeneficiaries((prev) => prev.filter((beneficiary) => beneficiary.id !== id))
    return true
  }

  const searchBeneficiaries = (searchTerm) => {
    if (!searchTerm.trim()) return []

    return beneficiaries.filter(
      (beneficiary) =>
        beneficiary.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        beneficiary.cnic.includes(searchTerm) ||
        beneficiary.phone.includes(searchTerm) ||
        beneficiary.tokenId.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  const getBeneficiaryByToken = (tokenId) => {
    return beneficiaries.find((beneficiary) => beneficiary.tokenId === tokenId) || null
  }

  return (
    <BeneficiaryContext.Provider
      value={{
        beneficiaries,
        addBeneficiary,
        updateBeneficiaryStatus,
        updateBeneficiaryById,
        deleteBeneficiary,
        searchBeneficiaries,
        getBeneficiaryByToken,
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
