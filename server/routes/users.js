const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { authenticateJWT } = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const User = require("../models/User");

// Route to create the first Admin user (should be removed or protected after first use)
router.post("/create-admin", async (req, res, next) => {
  try {
    const existingAdmin = await User.findOne({ role: "Admin" });
    if (existingAdmin) {
      return res.status(403).json({ message: "Admin already exists" });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}, createUser);

// Protect all routes below with JWT
router.use(authenticateJWT);

// Admin-only user management routes
router.get("/", roleMiddleware("Admin"), getAllUsers);
router.post("/", roleMiddleware("Admin"), createUser);
router.put("/:id", roleMiddleware("Admin"), updateUser);
router.delete("/:id", roleMiddleware("Admin"), deleteUser);

module.exports = router;
