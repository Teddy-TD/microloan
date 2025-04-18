const Loan = require("../models/Loan");
const Repayment = require("../models/Repayment");

const makeRepayment = async (req, res) => {
  try {
    const { loanId, amountPaid } = req.body;
    if (!loanId || !amountPaid) return res.status(400).json({ message: "Loan ID and amount are required" });

    const loan = await Loan.findById(loanId);
    if (!loan) return res.status(404).json({ message: "Loan not found" });

    if (loan.status !== "approved") return res.status(400).json({ message: "Only approved loans can be repaid" });

    loan.remainingBalance -= amountPaid;
    if (loan.remainingBalance <= 0) {
      loan.status = "paid"; 
    }

    await loan.save();

    const repayment = new Repayment({ loan: loanId, amountPaid });
    await repayment.save();

    res.json({ message: "Repayment successful", loan, repayment });
  } catch (error) {
    console.error("❌ Error making repayment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { makeRepayment };
