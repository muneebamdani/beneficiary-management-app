const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { authenticateJWT } = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Protect all /api/users routes
router.use(authenticateJWT);

// Only admin can manage users
router.get('/', roleMiddleware('admin'), getAllUsers);
router.post('/', roleMiddleware('admin'), createUser);
router.put('/:id', roleMiddleware('admin'), updateUser);
router.delete('/:id', roleMiddleware('admin'), deleteUser);

module.exports = router;
