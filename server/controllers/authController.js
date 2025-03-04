const express = require("express");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const router = express.Router();

// Register a new user
const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Check if user already exists
    let user = await userModel.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    user = new userModel({ name, email, password, phone, role });
    await user.save();

    const token = user.generateAuthToken();
    res.status(201).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = user.generateAuthToken();
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Access denied" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
};
