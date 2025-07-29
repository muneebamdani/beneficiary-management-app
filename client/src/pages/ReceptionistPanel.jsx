"use client";

import { useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Alert, AlertDescription } from "../components/ui/alert";
import { CheckCircle, UserPlus, Copy, Loader2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { BeneficiaryService } from "../services/beneficiaryService";

export default function ReceptionistPanel() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    cnic: "",
    name: "",
    phone: "",
    address: "",
    purpose: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [tokenId, setTokenId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitError("");

    try {
      // ✅ Let the backend generate tokenId and department
      const response = await BeneficiaryService.createBeneficiary(formData);

      // <-- FIX HERE: Access tokenId directly, not via response.data
      setTokenId(response.token.tokenId);
      setIsSubmitted(true);
      setFormData({
        cnic: "",
        name: "",
        phone: "",
        address: "",
        purpose: "",
      });
    } catch (error) {
      console.error("Registration error:", error);
      setSubmitError(
        error?.response?.data?.message ||
          error.message ||
          "Failed to register beneficiary. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const copyTokenId = () => {
    navigator.clipboard.writeText(tokenId);
    alert("Token ID copied to clipboard!");
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setTokenId("");
    setSubmitError("");
  };

  if (isSubmitted) {
    return (
      <ProtectedRoute allowedRoles={["receptionist"]}>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <Card className="text-center">
            <CardContent className="p-8">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">
                Registration Successful!
              </h2>
              <p className="mb-6">
                Beneficiary has been registered successfully. Provide them with
                the token ID below.
              </p>

              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <Label className="text-sm font-medium">Token ID</Label>
                <div className="flex items-center justify-center space-x-2 mt-2">
                  <span className="text-2xl font-bold text-green-600">
                    {tokenId}
                  </span>
                  <Button variant="outline" size="sm" onClick={copyTokenId}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Alert className="mb-6">
                <AlertDescription>
                  This beneficiary is now stored in the database and visible to
                  Admin and Department Staff.
                </AlertDescription>
              </Alert>

              <Button
                onClick={resetForm}
                className="bg-green-600 hover:bg-green-700"
              >
                Register Another Beneficiary
              </Button>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["receptionist"]}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Beneficiary Registration</h1>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserPlus className="w-5 h-5 mr-2" />
              New Beneficiary Registration
            </CardTitle>
            <CardDescription>
              Fill in the beneficiary details to generate a token ID and store
              in database
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitError && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cnic">CNIC Number *</Label>
                  <Input
                    id="cnic"
                    placeholder="42101-1234567-1"
                    value={formData.cnic}
                    onChange={(e) => handleInputChange("cnic", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    placeholder="0300-1234567"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose *</Label>
                  <Select
                    value={formData.purpose}
                    onValueChange={(value) => handleInputChange("purpose", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Medical Assistance">
                        Medical Assistance
                      </SelectItem>
                      <SelectItem value="Education Support">
                        Education Support
                      </SelectItem>
                      <SelectItem value="Food Distribution">
                        Food Distribution
                      </SelectItem>
                      <SelectItem value="Clothing Distribution">
                        Clothing Distribution
                      </SelectItem>
                      <SelectItem value="Financial Aid">Financial Aid</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  placeholder="Enter complete address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Registering in MongoDB...
                  </>
                ) : (
                  "Register Beneficiary in Database"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
