const jwt = require("jsonwebtoken");
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(401).json({ message: 'Token is not valid' });
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

// Middleware to check if user can manage users
const canManageUsersMiddleware = (req, res, next) => {
  if (!req.user.permissions.canManageUsers) {
    return res.status(403).json({ message: "Access denied. Insufficient permissions." });
  }
  next();
};

// Middleware to check if user can manage borrowers
const canManageBorrowersMiddleware = (req, res, next) => {
  if (!req.user.permissions.canManageBorrowers) {
    return res.status(403).json({ message: "Access denied. Insufficient permissions." });
  }
  next();
};

module.exports = {
  authMiddleware,
  adminMiddleware,
  loanOfficerMiddleware,
  canManageUsersMiddleware,
  canManageBorrowersMiddleware
};
