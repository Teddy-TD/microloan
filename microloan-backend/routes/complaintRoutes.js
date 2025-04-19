const express = require("express");
const { 
  submitComplaint, 
  getClientComplaints, 
  getComplaintById, 
  getAllComplaints, 
  updateComplaintStatus,
  assignComplaint,
  resolveComplaint
} = require("../controllers/complaintController");
const { 
  authMiddleware, 
  adminMiddleware, 
  loanOfficerMiddleware 
} = require("../middleware/authMiddleware");

const router = express.Router();

// Client routes
// Submit a new complaint
router.post("/", authMiddleware, submitComplaint);

// Get all complaints for the logged-in client
router.get("/my-complaints", authMiddleware, getClientComplaints);

// Get a specific complaint by ID
router.get("/:complaintId", authMiddleware, getComplaintById);

// Admin and Loan Officer routes
// Get all complaints with pagination and filters
router.get("/", authMiddleware, loanOfficerMiddleware, getAllComplaints);

// Update complaint status
router.patch("/:complaintId", authMiddleware, loanOfficerMiddleware, updateComplaintStatus);

// Admin-only routes
// Assign complaint to loan officer
router.patch("/:complaintId/assign", authMiddleware, adminMiddleware, assignComplaint);

// Resolve complaint
router.patch("/:complaintId/resolve", authMiddleware, adminMiddleware, resolveComplaint);

module.exports = router;
