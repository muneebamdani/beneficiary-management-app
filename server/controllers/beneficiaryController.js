const Beneficiary = require('../models/Beneficiary');
const Token = require('../models/Token');

exports.registerBeneficiary = async (req, res) => {
  try {
    const { name, cnic, phone, address, purpose } = req.body;

    console.log("✅ Request body:", req.body);
    console.log("✅ Authenticated user:", req.user);

    if (!name || !cnic || !phone || !address || !purpose) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (!req.user || !req.user.name || !req.user._id) {
      return res.status(401).json({ success: false, message: "User information is missing in request" });
    }

    // Check for existing beneficiary with same CNIC
    const existing = await Beneficiary.findOne({ cnic });
    if (existing) {
      return res.status(400).json({ success: false, message: "Beneficiary already exists with this CNIC" });
    }

    // Generate Token ID
    const tokenId = generateTokenId();
    const department = getDepartmentFromPurpose(purpose);

    // Create Token
    const token = await Token.create({
      tokenId,
      department,
      status: "Pending",
    });

    // Save Beneficiary to MongoDB
    const beneficiary = await Beneficiary.create({
      name,
      cnic,
      phone,
      address,
      purpose,
      tokenId,
      department,
      status: "pending",
      registeredBy: req.user.name,
      registeredByUserId: req.user._id.toString(),
    });

    res.status(201).json({
      success: true,
      message: "Beneficiary registered successfully",
      data: {
        beneficiary,
        token,
      },
    });
  } catch (err) {
    console.error("❌ Error registering beneficiary:", err);
    res.status(500).json({ success: false, message: "Server error while registering beneficiary" });
  }
};

exports.getAllBeneficiaries = async (req, res) => {
  try {
    const beneficiaries = await Beneficiary.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: beneficiaries,
    });
  } catch (error) {
    console.error("❌ Error fetching beneficiaries:", error);
    res.status(500).json({ success: false, message: "Server error while fetching beneficiaries" });
  }
};

// Helpers
function generateTokenId() {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `SYL-${timestamp}-${random}`;
}

function getDepartmentFromPurpose(purpose) {
  const departmentMap = {
    "Medical Assistance": "Medical",
    "Education Support": "Education",
    "Food Distribution": "Food",
    "Clothing Distribution": "Clothing",
    "Financial Aid": "Financial",
    Other: "General",
  };
  return departmentMap[purpose] || "General";
}
