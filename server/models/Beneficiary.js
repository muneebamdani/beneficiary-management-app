// models/Beneficiary.js
const mongoose = require('mongoose');

const BeneficiarySchema = new mongoose.Schema({
  name: { type: String, required: true },
  cnic: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  purpose: { type: String, required: true },
  status: { type: String, default: 'pending' },
  tokenId: { type: String, required: true, unique: true },
  department: { 
    type: String, 
    required: true,
    enum: ['Medical', 'Education', 'Food', 'Clothing', 'Financial', 'General']  // ✅ FIXED
  },
  registeredBy: { type: String, required: true },
  registeredByUserId: { type: String, required: true },
  remarks: { type: String, default: "" }
}, { timestamps: true }); // ✅ Automatically adds createdAt and updatedAt

module.exports = mongoose.model('Beneficiary', BeneficiarySchema);
