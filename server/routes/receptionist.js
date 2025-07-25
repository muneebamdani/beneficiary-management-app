const express = require('express');
const router = express.Router();

// Destructure the needed function from authMiddleware
const { authenticateJWT } = require('../middleware/authMiddleware');

// roleMiddleware is exported as a function directly
const roleMiddleware = require('../middleware/roleMiddleware');

const { registerBeneficiary } = require('../controllers/beneficiaryController');

// Test GET route
router.get(
  '/',
  authenticateJWT,
  roleMiddleware('receptionist', 'admin'),
  (req, res) => {
    res.json({ success: true, message: 'Receptionist route working!' });
  }
);

// POST route to register beneficiary
router.post(
  '/register',
  authenticateJWT,
  roleMiddleware('receptionist', 'admin'),
  registerBeneficiary
);

module.exports = router;
