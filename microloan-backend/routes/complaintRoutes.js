const express = require("express");
const { 
  submitComplaint, 
  getClientComplaints, 
  getComplaintById, 
  getAllComplaints, 
  updateComplaintStatus 
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
// Get all complaints
router.get("/all", authMiddleware, loanOfficerMiddleware, getAllComplaints);

// Update complaint status
router.put("/:complaintId/status", authMiddleware, loanOfficerMiddleware, updateComplaintStatus);

module.exports = router;
