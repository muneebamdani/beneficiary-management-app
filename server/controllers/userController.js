const User = require("../models/User");
const bcrypt = require("bcryptjs");

// GET all users (excluding Admins)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } }).select("-password");
    res.json({ success: true, users });
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// CREATE a new user (Admin-only)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, isActive } = req.body;

    console.log("📦 Creating user with data:", { name, email, role, isActive });

    // Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password, and role are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    // Normalize role and create user
    const normalizedRole = role.toLowerCase();
    const newUser = new User({
      name,
      email,
      password, // Mongoose will hash it in schema
      role: normalizedRole,
      isActive: isActive ?? true,
    });

    await newUser.save();

    const { password: _, ...userWithoutPassword } = newUser.toObject();
    res.status(201).json({
      success: true,
      message: "User created",
      user: userWithoutPassword,
    });

  } catch (error) {
    console.error("❌ Error in createUser:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// UPDATE a user (Admin-only)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, isActive } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        name,
        email,
        role: role?.toLowerCase(),
        isActive,
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User updated", user: updatedUser });

  } catch (error) {
    console.error("❌ Error in updateUser:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// DELETE a user (Admin-only)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User deleted" });

  } catch (error) {
    console.error("❌ Error in deleteUser:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
