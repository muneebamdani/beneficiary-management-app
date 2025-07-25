"use client"

import { useState, useEffect } from "react"
import  ProtectedRoute  from "../components/ProtectedRoute"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Alert, AlertDescription } from "../components/ui/alert"
import { Search, User, Phone, MapPin, Calendar, FileText, Loader2, RefreshCw } from "lucide-react"
import { useBeneficiaries } from "../contexts/BeneficiaryContext"

export default function SearchPage() {
  const { beneficiaries, searchBeneficiaries, isLoading, error, refreshBeneficiaries } = useBeneficiaries()
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredBeneficiaries, setFilteredBeneficiaries] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState("")

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredBeneficiaries([])
      return
    }

    setIsSearching(true)
    setSearchError("")

    const timer = setTimeout(async () => {
      try {
        const filtered = await searchBeneficiaries(searchTerm)
        setFilteredBeneficiaries(filtered)
      } catch (error) {
        setSearchError(error.message || "Error searching beneficiaries")
        setFilteredBeneficiaries([])
      } finally {
        setIsSearching(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm, searchBeneficiaries])

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

  const getDepartmentColor = (department) => {
    const colors = {
      Medical: "bg-blue-100 text-blue-800",
      Education: "bg-purple-100 text-purple-800",
      Food: "bg-orange-100 text-orange-800",
      Clothing: "bg-pink-100 text-pink-800",
      Financial: "bg-indigo-100 text-indigo-800",
      General: "bg-gray-100 text-gray-800",
    }
    return colors[department] || "bg-gray-100 text-gray-800"
  }

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Search Beneficiaries (MongoDB)</h1>
          <p className="text-gray-600">Search by CNIC, name, phone number, or token ID from database</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              <strong>Database Error:</strong> {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Search Input */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Search className="w-5 h-5 mr-2" />
                Search MongoDB Database
              </div>
              <Button variant="outline" size="sm" onClick={refreshBeneficiaries} disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                Refresh Data
              </Button>
            </CardTitle>
            <CardDescription>
              {isLoading ? (
                <div className="flex items-center">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Loading beneficiaries from MongoDB...
                </div>
              ) : (
                `Enter CNIC, name, phone number, or token ID to find beneficiaries. Total in database: ${beneficiaries.length}`
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by CNIC, name, phone, or token ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                disabled={isLoading}
              />
            </div>

            {searchError && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{searchError}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchTerm && (
          <Card>
            <CardHeader>
              <CardTitle>Search Results from MongoDB</CardTitle>
              <CardDescription>
                {isSearching ? (
                  <div className="flex items-center">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Searching database...
                  </div>
                ) : (
                  `Found ${filteredBeneficiaries.length} result(s) in database`
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSearching ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
              ) : filteredBeneficiaries.length === 0 ? (
                <div className="text-center py-8">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No beneficiaries found matching your search in MongoDB database.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredBeneficiaries.map((beneficiary) => (
                    <Card key={beneficiary._id} className="border-l-4 border-l-green-500">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{beneficiary.name}</h3>
                            <p className="text-sm text-gray-600">Token: {beneficiary.tokenId}</p>
                          </div>
                          <div className="flex flex-col space-y-2">
                            <Badge className={getStatusColor(beneficiary.status)}>
                              {beneficiary.status.replace("-", " ").toUpperCase()}
                            </Badge>
                            <Badge className={getDepartmentColor(beneficiary.department)}>
                              {beneficiary.department}
                            </Badge>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <User className="w-4 h-4 mr-2" />
                            <span>CNIC: {beneficiary.cnic}</span>
                          </div>

                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="w-4 h-4 mr-2" />
                            <span>{beneficiary.phone}</span>
                          </div>

                          <div className="flex items-start text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-2 mt-0.5" />
                            <span>{beneficiary.address}</span>
                          </div>

                          <div className="flex items-center text-sm text-gray-600">
                            <FileText className="w-4 h-4 mr-2" />
                            <span>Purpose: {beneficiary.purpose}</span>
                          </div>

                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>
                              Registered:{" "}
                              {beneficiary.registrationDate
                                ? new Date(beneficiary.registrationDate).toLocaleDateString()
                                : "N/A"}
                            </span>
                          </div>

                          {beneficiary.registeredBy && (
                            <div className="flex items-center text-sm text-gray-600">
                              <User className="w-4 h-4 mr-2" />
                              <span>By: {beneficiary.registeredBy}</span>
                            </div>
                          )}

                          {beneficiary.remarks && (
                            <div className="flex items-start text-sm text-gray-600">
                              <FileText className="w-4 h-4 mr-2 mt-0.5" />
                              <span>Remarks: {beneficiary.remarks}</span>
                            </div>
                          )}
                        </div>

                        <div className="mt-4 pt-4 border-t">
                          <div className="text-xs text-gray-500">Database ID: {beneficiary._id}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        {!searchTerm && !isLoading && (
          <Card>
            <CardHeader>
              <CardTitle>MongoDB Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Search Options:</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• CNIC Number (e.g., 42101-1234567-1)</li>
                    <li>• Full Name or partial name</li>
                    <li>• Phone Number (e.g., 0300-1234567)</li>
                    <li>• Token ID (e.g., SYL-240115-001)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Database Features:</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• All data stored in MongoDB database</li>
                    <li>• Real-time search across all records</li>
                    <li>• Status updates reflected instantly</li>
                    <li>• Secure and persistent data storage</li>
                  </ul>
                </div>
              </div>

              <Alert className="mt-4">
                <AlertDescription>
                  <strong>MongoDB Integration:</strong> All beneficiary data is now stored in MongoDB database. Search
                  results are fetched in real-time from the database and include all updates made by department staff.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  )
}
