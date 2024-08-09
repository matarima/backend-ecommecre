const jwt = require("jsonwebtoken");
const User = require("../models/User");
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "3c3fc1b1e539065c81d4febfb47a6eaf6f7e2a381d6b5e5d4f0848e8c91a5606a537272a6f1b567c744d6b4ba1c2e7ab6de200fb2db6a5e2bdb5fc0eb3456d0b";

exports.authenticate = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("No token provided or invalid token format");
    }
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized: " + error.message });
  }
};

exports.authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }
    next();
  };
};
