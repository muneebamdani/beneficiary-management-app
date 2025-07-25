const express = require('express');
const router = express.Router();

const {
  registerBeneficiary,
  getAllBeneficiaries,
} = require('../controllers/beneficiaryController');

const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');

// Authenticate all routes
router.use(authenticateJWT);

// Register a new beneficiary (accessible by receptionist, admin, department staff)
router.post(
  '/',
  authorizeRoles('receptionist', 'admin', 'department staff'),
  registerBeneficiary
);

// Get all beneficiaries (accessible by admin and receptionist only)
router.get(
  '/',
  authorizeRoles('admin', 'receptionist'),
  getAllBeneficiaries
);

module.exports = router;
