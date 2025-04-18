const express = require("express");
const { makeRepayment } = require("../controllers/repaymentController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();


router.post("/", authMiddleware, makeRepayment);

module.exports = router;
