const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user exists and is active
    const user = await User.findById(verified.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    
    if (!user.active) {
      return res.status(403).json({ message: "Account is deactivated. Please contact an administrator." });
    }
    
    req.user = {
      id: user._id.toString(),
      role: user.role
    };
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Middleware to check if user is an admin
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

// Middleware to check if user is a loan officer
const loanOfficerMiddleware = (req, res, next) => {
  if (req.user.role !== "loan_officer" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Loan officers and admins only." });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware, loanOfficerMiddleware };
