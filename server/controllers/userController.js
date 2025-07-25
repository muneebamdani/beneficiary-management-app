const User = require("../models/User");
const bcrypt = require("bcryptjs");

// GET all users (excluding Admins)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "Admin" } }).select("-password");
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// CREATE a new user (Admin-only)
exports.createUser = async (req, res) => {
  const { name, email, password, role, isActive } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role.charAt(0).toUpperCase() + role.slice(1).toLowerCase(),
      isActive: isActive ?? true,
    });

    await newUser.save();
    const userToReturn = newUser.toObject();
    delete userToReturn.password;

    res.status(201).json({ success: true, message: "User created", user: userToReturn });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// UPDATE a user (Admin-only)
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role, isActive } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        name,
        email,
        role: role.charAt(0).toUpperCase() + role.slice(1).toLowerCase(),
        isActive,
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User updated", user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// DELETE a user (Admin-only)
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
