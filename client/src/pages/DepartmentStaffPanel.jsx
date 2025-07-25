"use client"

import { useState } from "react"
import  ProtectedRoute  from "../components/ProtectedRoute"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Badge } from "../components/ui/badge"
import { Alert, AlertDescription } from "../components/ui/alert"
import { Search, User, Phone, MapPin, FileText, Save, Loader2 } from "lucide-react"
import { useBeneficiaries } from "../contexts/BeneficiaryContext"

export default function DepartmentStaffPanel() {
  const { getBeneficiaryByToken, updateBeneficiaryStatus, error } = useBeneficiaries()
  const [tokenInput, setTokenInput] = useState("")
  const [beneficiary, setBeneficiary] = useState(null)
  const [status, setStatus] = useState("")
  const [remarks, setRemarks] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [searchError, setSearchError] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  const handleTokenSearch = async () => {
    if (!tokenInput.trim()) {
      setSearchError("Please enter a token ID")
      return
    }

    setIsLoading(true)
    setSearchError("")

    try {
      const foundBeneficiary = await getBeneficiaryByToken(tokenInput)
      if (foundBeneficiary) {
        setBeneficiary(foundBeneficiary)
        setStatus(foundBeneficiary.status)
        setRemarks(foundBeneficiary.remarks || "")
      } else {
        setSearchError("Token ID not found in MongoDB database")
        setBeneficiary(null)
      }
    } catch (error) {
      setSearchError(error.message || "Error searching for token in database")
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusUpdate = async () => {
    if (!beneficiary || !status) return

    setIsUpdating(true)
    try {
      await updateBeneficiaryStatus(beneficiary.tokenId, status, remarks)

      // Update local beneficiary state
      setBeneficiary((prev) => (prev ? { ...prev, status: status, remarks: remarks } : null))
      setRemarks("")
      alert("Status updated successfully in MongoDB database!")
    } catch (error) {
      alert(`Error updating status: ${error.message}`)
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
      case "pending":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <ProtectedRoute allowedRoles={["department-staff"]}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Department Staff Panel</h1>
          <p className="text-gray-600">Process beneficiary tokens from MongoDB database and update status</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              <strong>Database Error:</strong> {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Token Search */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Token Search (MongoDB)
            </CardTitle>
            <CardDescription>
              Enter or scan the beneficiary's token ID to fetch their details from database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Enter token ID (e.g., SYL-240115-001)"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleTokenSearch()}
                />
              </div>
              <Button onClick={handleTokenSearch} disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Searching...
                  </>
                ) : (
                  "Search Database"
                )}
              </Button>
            </div>
            {searchError && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{searchError}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Beneficiary Details */}
        {beneficiary && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Beneficiary Details (From MongoDB)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Full Name</Label>
                  <p className="text-lg font-semibold">{beneficiary.name}</p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-600">CNIC</Label>
                  <p className="text-gray-900">{beneficiary.cnic}</p>
                </div>

                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-gray-500" />
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Phone</Label>
                    <p className="text-gray-900">{beneficiary.phone}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="w-4 h-4 mr-2 text-gray-500 mt-1" />
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Address</Label>
                    <p className="text-gray-900">{beneficiary.address}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-600">Purpose</Label>
                  <p className="text-gray-900">{beneficiary.purpose}</p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-600">Department</Label>
                  <Badge variant="outline">{beneficiary.department}</Badge>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-600">Registration Date</Label>
                  <p className="text-gray-900">
                    {beneficiary.registrationDate ? new Date(beneficiary.registrationDate).toLocaleDateString() : "N/A"}
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-600">Registered By</Label>
                  <p className="text-gray-900">{beneficiary.registeredBy || "System"}</p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-600">Current Status</Label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(beneficiary.status)}>
                      {beneficiary.status.replace("-", " ").toUpperCase()}
                    </Badge>
                  </div>
                </div>

                {beneficiary.remarks && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Previous Remarks</Label>
                    <p className="text-gray-900 text-sm bg-gray-50 p-2 rounded">{beneficiary.remarks}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Update Status in MongoDB
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="remarks">Remarks</Label>
                  <Textarea
                    id="remarks"
                    placeholder="Add any remarks or notes..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button
                  onClick={handleStatusUpdate}
                  disabled={isUpdating || !status}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Updating Database...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update Status in MongoDB
                    </>
                  )}
                </Button>

                <Alert>
                  <AlertDescription>
                    <strong>Database Integration:</strong> Status updates will be saved to MongoDB and reflected across
                    all user roles in real-time.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Demo Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription>
                <strong>MongoDB Integration:</strong> All beneficiary data is now stored in MongoDB database. Search for
                token IDs that were registered by receptionists. The system will fetch real-time data from the database
                and allow you to update status with remarks.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
