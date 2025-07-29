const express = require('express');
const router = express.Router();

const { authenticateJWT } = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const { registerBeneficiary, getAllBeneficiaries } = require('../controllers/beneficiaryController');

router.get(
  '/',
  authenticateJWT,
  roleMiddleware('receptionist', 'admin'),
  getAllBeneficiaries
);

router.post(
  '/',
  authenticateJWT,
  roleMiddleware('receptionist'),
  registerBeneficiary
);

module.exports = router;
