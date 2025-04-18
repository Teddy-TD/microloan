const Transaction = require("../models/Transaction");
const Loan = require("../models/Loan");

/**
 * Process a loan repayment
 * @route POST /api/transactions/repayment
 * @access Private (Client only)
 */
const processRepayment = async (req, res) => {
  try {
    const { loanId, amount, reference } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!loanId) return res.status(400).json({ message: "Loan ID is required" });
    if (!amount) return res.status(400).json({ message: "Amount is required" });
    
    // Convert amount to number
    const paymentAmount = Number(amount);
    
    // Validate payment amount
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      return res.status(400).json({ message: "Invalid payment amount" });
    }

    // Find the loan
    const loan = await Loan.findById(loanId);
    
    // Check if loan exists
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }
    
    // Check if loan belongs to the user
    if (loan.user.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to make payment on this loan" });
    }
    
    // Check if loan is approved
    if (loan.status !== "approved") {
      return res.status(400).json({ message: "Cannot make payment on a loan that is not approved" });
    }
    
    // Check if payment amount is greater than the balance
    if (paymentAmount > loan.balance) {
      return res.status(400).json({ message: "Payment amount cannot exceed the remaining balance" });
    }
    
    // Create transaction
    const transaction = new Transaction({
      loanId: loan._id,
      user: userId,
      amount: paymentAmount,
      type: "repayment",
      status: "completed",
      reference: reference || undefined,
      transactionDate: new Date()
    });
    
    // Update loan balance
    loan.balance -= paymentAmount;
    loan.totalPaid += paymentAmount;
    loan.lastPaymentDate = new Date();
    
    // Calculate next payment due date (1 month from now)
    const nextPaymentDate = new Date();
    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
    loan.nextPaymentDue = nextPaymentDate;
    
    // Save transaction and updated loan
    await transaction.save();
    await loan.save();
    
    res.status(201).json({
      message: "Payment processed successfully",
      transaction,
      loan: {
        id: loan._id,
        balance: loan.balance,
        totalPaid: loan.totalPaid,
        isFullyPaid: loan.isFullyPaid,
        status: loan.status
      }
    });
  } catch (error) {
    console.error("❌ Error processing repayment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Get all transactions for a user
 * @route GET /api/transactions
 * @access Private (Client only)
 */
const getUserTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const transactions = await Transaction.find({ user: userId })
      .populate("loanId", "amount duration purpose")
      .sort({ transactionDate: -1 });
    
    res.json(transactions);
  } catch (error) {
    console.error("❌ Error fetching user transactions:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Get all transactions for a specific loan
 * @route GET /api/transactions/loan/:loanId
 * @access Private (Client, Admin, Loan Officer)
 */
const getLoanTransactions = async (req, res) => {
  try {
    const { loanId } = req.params;
    const userId = req.user.id;
    
    // Find the loan
    const loan = await Loan.findById(loanId);
    
    // Check if loan exists
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }
    
    // Check if user is authorized to view transactions
    if (loan.user.toString() !== userId && 
        req.user.role !== "admin" && 
        req.user.role !== "loan_officer") {
      return res.status(403).json({ message: "Not authorized to view these transactions" });
    }
    
    const transactions = await Transaction.find({ loanId })
      .sort({ transactionDate: -1 });
    
    res.json(transactions);
  } catch (error) {
    console.error("❌ Error fetching loan transactions:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Get all transactions (Admin and Loan Officer only)
 * @route GET /api/transactions/all
 * @access Private (Admin, Loan Officer)
 */
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("loanId", "amount duration purpose")
      .populate("user", "name email")
      .sort({ transactionDate: -1 });
    
    res.json(transactions);
  } catch (error) {
    console.error("❌ Error fetching all transactions:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  processRepayment,
  getUserTransactions,
  getLoanTransactions,
  getAllTransactions
};
