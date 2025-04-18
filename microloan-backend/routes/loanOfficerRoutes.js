const express = require("express");
const { 
  getPendingApplications,
  getApplicationById,
  processApplication,
  getAllApplications
} = require("../controllers/loanOfficerController");
const { 
  authMiddleware, 
  loanOfficerMiddleware 
} = require("../middleware/authMiddleware");

const router = express.Router();

// Apply middleware to all routes
router.use(authMiddleware, loanOfficerMiddleware);

// Get all loan applications with filtering options
router.get("/", getAllApplications);

// Get all pending loan applications
router.get("/pending", getPendingApplications);

// Get a specific loan application by ID
router.get("/:applicationId", getApplicationById);

// Process a loan application (approve or reject)
router.patch("/:applicationId", processApplication);

module.exports = router;
