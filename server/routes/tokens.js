const express = require('express');
const { getTokenById, updateToken } = require('../controllers/tokenController');
const { authenticateJWT } = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(authenticateJWT); // Ensure user is authenticated

// Anyone authenticated can get token by ID
router.get('/:id', getTokenById);

// Only 'department staff' or 'admin' can update tokens
router.patch('/:id', roleMiddleware('department staff', 'admin'), updateToken);

module.exports = router;
