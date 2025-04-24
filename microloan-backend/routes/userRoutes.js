const express = require("express");
const router = express.Router();
const { 
  getAllUsers, 
  addUser, 
  removeUser, 
  resetPassword, 
  updateRole, 
  toggleUserActive,
  updateUserProfile,
  updateOwnProfile,
  getUserProfile,
  updatePassword,
  getAllClients,
  getClientById,
  updateClientProfile,
  updateCreditScore
} = require("../controllers/userController");
const { authMiddleware, adminMiddleware, loanOfficerMiddleware } = require("../middleware/authMiddleware");

// Admin only routes
router.get("/", authMiddleware, adminMiddleware, getAllUsers);
router.post("/", authMiddleware, adminMiddleware, addUser);
router.delete("/:userId", authMiddleware, adminMiddleware, removeUser);
router.put("/:userId/reset-password", authMiddleware, adminMiddleware, resetPassword);
router.put("/:userId/role", authMiddleware, adminMiddleware, updateRole);
router.put("/:userId/active", authMiddleware, adminMiddleware, toggleUserActive);

// Loan officer routes
router.put("/:userId/profile", authMiddleware, loanOfficerMiddleware, updateUserProfile);
router.get("/clients", authMiddleware, loanOfficerMiddleware, getAllClients);
router.get("/clients/:clientId", authMiddleware, loanOfficerMiddleware, getClientById);
router.patch("/clients/:clientId", authMiddleware, loanOfficerMiddleware, updateClientProfile);
router.patch("/clients/:clientId/credit-score", authMiddleware, loanOfficerMiddleware, updateCreditScore);

// All authenticated users
router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateOwnProfile);
router.put("/password", authMiddleware, updatePassword);

module.exports = router;
