// routes/tokens.js
const express = require('express');
const { getTokenById, updateToken } = require('../controllers/tokenController');
const { authenticateJWT } = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');  // Import WITHOUT destructuring

const router = express.Router();

// Protect all routes with authentication
router.use(authenticateJWT);

// Anyone authenticated can get token by ID
router.get('/:id', getTokenById);

// Only 'department staff' or 'admin' roles can update tokens
router.patch('/:id', roleMiddleware('department staff', 'admin'), updateToken);

module.exports = router;
