const express = require("express");
const { 
  applyForLoan, 
  getClientLoans, 
  getLoans, 
  getLoanById, 
  updateLoanStatus 
} = require("../controllers/loanController");
const { 
  authMiddleware, 
  adminMiddleware, 
  loanOfficerMiddleware 
} = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Client routes
// Apply for a loan with document uploads (up to 3 files)
router.post("/apply", authMiddleware, upload.array("documents", 3), applyForLoan);

// Get all loans for the logged-in client
router.get("/my-loans", authMiddleware, getClientLoans);

// Admin and Loan Officer routes
// Get all loans (for admins and loan officers)
router.get("/all", authMiddleware, loanOfficerMiddleware, getLoans);

// Get a specific loan by ID (for clients, admins, and loan officers)
router.get("/:loanId", authMiddleware, getLoanById);

// Update loan status (for admins and loan officers)
router.put("/:loanId/status", authMiddleware, loanOfficerMiddleware, updateLoanStatus);

module.exports = router;
