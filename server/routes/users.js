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

// ✅ TEMP ROUTE: Fix capital "Admin" roles — placed BEFORE authentication
router.get("/fix-admin-role", async (req, res) => {
  try {
    const result = await User.updateMany(
      { role: "Admin" },
      { $set: { role: "admin" } }
    );
    res.json({
      success: true,
      message: "Admin roles normalized",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fixing admin roles",
      error: error.message,
    });
  }
});

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

// ✅ Apply authentication to all routes below
router.use(authenticateJWT);

// Admin-only user management routes
router.get("/", roleMiddleware("admin"), getAllUsers);
router.post("/", roleMiddleware("admin"), createUser);
router.put("/:id", roleMiddleware("admin"), updateUser);
router.delete("/:id", roleMiddleware("admin"), deleteUser);

module.exports = router;
