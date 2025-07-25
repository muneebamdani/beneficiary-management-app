import mongoose from "mongoose"

const beneficiarySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  cnic: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  purpose: {
    type: String,
    required: true,
    enum: [
      "Medical Assistance",
      "Education Support",
      "Food Distribution",
      "Clothing Distribution",
      "Financial Aid",
      "Other",
    ],
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "in-progress", "completed"],
    default: "pending",
  },
  tokenId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  department: {
    type: String,
    required: true,
    enum: ["Medical", "Education", "Food", "Clothing", "Financial", "General"],
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
  registeredBy: {
    type: String,
    required: true,
  },
  registeredByUserId: {
    type: String,
    required: true,
  },
  remarks: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model("Beneficiary", beneficiarySchema)
