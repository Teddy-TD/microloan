const express = require("express");
const router = express.Router();
const { 
  getAllUsers, 
  addUser, 
  removeUser, 
  resetPassword, 
  updateRole, 
  updateUserProfile,
  updateOwnProfile
} = require("../controllers/userController");
const { authMiddleware, adminMiddleware, loanOfficerMiddleware } = require("../middleware/authMiddleware");

// Admin only routes
router.get("/", authMiddleware, adminMiddleware, getAllUsers);
router.post("/", authMiddleware, adminMiddleware, addUser);
router.delete("/:userId", authMiddleware, adminMiddleware, removeUser);
router.put("/:userId/reset-password", authMiddleware, adminMiddleware, resetPassword);
router.put("/:userId/role", authMiddleware, adminMiddleware, updateRole);

// Loan officer routes
router.put("/:userId/profile", authMiddleware, loanOfficerMiddleware, updateUserProfile);

// All authenticated users
router.put("/profile", authMiddleware, updateOwnProfile);

module.exports = router;
