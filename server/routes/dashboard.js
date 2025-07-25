const express = require('express');
const { getDashboardStats } = require('../controllers/dashboardController');
const { authenticateJWT } = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(authenticateJWT);

router.get('/', roleMiddleware('admin'), getDashboardStats);

module.exports = router;
