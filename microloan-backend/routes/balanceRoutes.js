const express = require("express");
const { 
  getClientBalances, 
  getLoanDetails, 
  getSavingsDetails,
  updateSavingsDetails
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
// Update savings account balance
router.put("/savings", authMiddleware, updateSavingsDetails);

module.exports = router;
