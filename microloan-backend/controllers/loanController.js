const Loan = require("../models/Loan");

const applyForLoan = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) return res.status(400).json({ message: "Loan amount is required" });

    const loan = new Loan({ user: req.user.id, amount });
    await loan.save();
    
    res.status(201).json({ message: "Loan application submitted", loan });
  } catch (error) {
    console.error("❌ Error applying for loan:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getLoans = async (req, res) => {
  try {
    const loans = await Loan.find().populate("user", "name email");
    res.json(loans);
  } catch (error) {
    console.error("❌ Error fetching loans:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateLoanStatus = async (req, res) => {
  try {
    const { loanId } = req.params;
    const { status } = req.body;

    const loan = await Loan.findById(loanId);
    if (!loan) return res.status(404).json({ message: "Loan not found" });

    loan.status = status;
    await loan.save();

    res.json({ message: "Loan status updated", loan });
  } catch (error) {
    console.error("❌ Error updating loan status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { applyForLoan, getLoans, updateLoanStatus };
