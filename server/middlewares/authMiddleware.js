const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const dotenv = require("dotenv");

dotenv.config();

exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access Denied: No token provided" });
    }

    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    req.user = await User.findById(decoded._id).select("-password");
    if (!req.user) {
      return res.status(401).json({ message: "Invalid token" });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access Denied: Admins only" });
  }
  next();
};

exports.isSeller = (req, res, next) => {
  if (req.user.role !== "seller") {
    return res.status(403).json({ message: "Access Denied: Sellers only" });
  }
  next();
};
