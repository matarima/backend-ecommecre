const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "3c3fc1b1e539065c81d4febfb47a6eaf6f7e2a381d6b5e5d4f0848e8c91a5606a537272a6f1b567c744d6b4ba1c2e7ab6de200fb2db6a5e2bdb5fc0eb3456d0b";

exports.createUser = async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    // Kiểm tra xem username đã tồn tại chưa
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username đã tồn tại" });
    }

    const user = new User({ username, email, password, phone, role: req.body.role || "customer",});
    await user.save();

    res.status(201).json({ user, message: "Đăng ký thanh cong" });
  } catch (error) {
    res.status(500).send("Error registering user");
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h", // Set token expiration time as needed
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({ user, token }); // Include token in JSON response
  } catch (error) {
    res.status(500).send("Error logging in");
  }
};

exports.logoutUser = async (req, res) => {
  // Remove token from cookies
  try {
    res.clearCookie("token");
    res.status(200).send("Logout successful");
  } catch (error) {
    res.status(500).send("Error logging out");
  }
};
