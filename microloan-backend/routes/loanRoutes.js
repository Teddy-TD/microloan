const express = require("express");
const { applyForLoan, getLoans, updateLoanStatus } = require("../controllers/loanController");
const { authMiddleware, adminMiddleware, loanOfficerMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();


router.post("/apply", authMiddleware, applyForLoan);


router.get("/", authMiddleware, loanOfficerMiddleware, getLoans);


router.put("/:loanId", authMiddleware, adminMiddleware, updateLoanStatus);

module.exports = router;
