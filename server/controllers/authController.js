const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// helper to generate token
const generateToken = (user) => jwt.sign(
  {
    userId: user._id,
    role: user.role.toLowerCase(),
  },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials." });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials." });

    const token = generateToken(user);
    res.json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role.toLowerCase() },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error during login" });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (await User.findOne({ email })) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashed,
      role: role?.toLowerCase() || "receptionist",
      isActive: true,
    });
    await newUser.save();
    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};
