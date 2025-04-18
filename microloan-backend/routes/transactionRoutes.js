const express = require("express");
const { 
  processRepayment, 
  getUserTransactions, 
  getLoanTransactions, 
  getAllTransactions 
} = require("../controllers/transactionController");
const { 
  authMiddleware, 
  adminMiddleware, 
  loanOfficerMiddleware 
} = require("../middleware/authMiddleware");

const router = express.Router();

// Client routes
// Process a loan repayment
router.post("/repayment", authMiddleware, processRepayment);

// Get all transactions for the logged-in user
router.get("/", authMiddleware, getUserTransactions);

// Get all transactions for a specific loan
router.get("/loan/:loanId", authMiddleware, getLoanTransactions);

// Admin and Loan Officer routes
// Get all transactions
router.get("/all", authMiddleware, loanOfficerMiddleware, getAllTransactions);

module.exports = router;
