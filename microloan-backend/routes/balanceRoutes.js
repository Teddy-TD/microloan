const express = require("express");
const { 
  getClientBalances, 
  getLoanDetails, 
  getSavingsDetails 
} = require("../controllers/balanceController");
const { 
  authMiddleware 
} = require("../middleware/authMiddleware");

const router = express.Router();

// Get all balance information for the logged-in client
router.get("/", authMiddleware, getClientBalances);

// Get detailed loan information
router.get("/loans/:loanId", authMiddleware, getLoanDetails);

// Get savings account details
router.get("/savings", authMiddleware, getSavingsDetails);

module.exports = router;
