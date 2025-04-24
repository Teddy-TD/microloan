const Loan = require("../models/Loan");
const SavingsAccount = require("../models/SavingsAccount");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const AuditLog = require("../models/AuditLog");
const { calculateCreditScore } = require("../utils/creditScoreUtils");
const axios = require("axios");

/**
 * Get client balance information (loans and savings)
 * @route GET /api/balances
 * @access Private (Client only)
 */
const getClientBalances = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get active loans for the client
    const loans = await Loan.find({ 
      user: userId,
      status: "approved",
      isFullyPaid: false
    }).sort({ applicationDate: -1 });

    // Get savings account for the client
    let savingsAccount = await SavingsAccount.findOne({ user: userId });
    
    // If no savings account exists, create one
    if (!savingsAccount) {
      savingsAccount = new SavingsAccount({
        user: userId,
        balance: 0
      });
      await savingsAccount.save();
    }

    // Get recent transactions
    const recentTransactions = await Transaction.find({ 
      user: userId 
    })
    .sort({ transactionDate: -1 })
    .limit(5);

    // Calculate total loan balance
    const totalLoanBalance = loans.reduce((total, loan) => total + loan.balance, 0);
    
    // Find the next payment due date (the earliest one among all active loans)
    let nextPaymentDue = null;
    if (loans.length > 0) {
      const loansWithDueDates = loans.filter(loan => loan.nextPaymentDue);
      if (loansWithDueDates.length > 0) {
        nextPaymentDue = new Date(Math.min(...loansWithDueDates.map(loan => new Date(loan.nextPaymentDue))));
      }
    }

    res.json({
      loans: loans.map(loan => ({
        id: loan._id,
        amount: loan.amount,
        balance: loan.balance,
        purpose: loan.purpose,
        duration: loan.duration,
        nextPaymentDue: loan.nextPaymentDue,
        applicationDate: loan.applicationDate,
        totalPaid: loan.totalPaid
      })),
      savingsAccount: {
        id: savingsAccount._id,
        balance: savingsAccount.balance
      },
      summary: {
        totalLoanBalance,
        savingsBalance: savingsAccount.balance,
        nextPaymentDue
      },
      recentTransactions: recentTransactions.map(transaction => ({
        id: transaction._id,
        amount: transaction.amount,
        type: transaction.type,
        date: transaction.transactionDate,
        status: transaction.status
      }))
    });
  } catch (error) {
    console.error("❌ Error fetching client balances:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Get detailed loan information
 * @route GET /api/balances/loans/:loanId
 * @access Private (Client only)
 */
const getLoanDetails = async (req, res) => {
  try {
    const { loanId } = req.params;
    const userId = req.user.id;

    // Get the loan
    const loan = await Loan.findById(loanId);
    
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }
    
    // Check if the loan belongs to the user
    if (loan.user.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to view this loan" });
    }

    // Get transactions for this loan
    const transactions = await Transaction.find({ 
      loanId: loanId 
    }).sort({ transactionDate: -1 });

    // Calculate monthly payment amount (simple calculation)
    const monthlyPayment = loan.amount / loan.duration;
    
    // Calculate remaining months
    const remainingAmount = loan.balance;
    const remainingMonths = Math.ceil(remainingAmount / monthlyPayment);

    res.json({
      loan: {
        id: loan._id,
        amount: loan.amount,
        balance: loan.balance,
        purpose: loan.purpose,
        duration: loan.duration,
        nextPaymentDue: loan.nextPaymentDue,
        applicationDate: loan.applicationDate,
        totalPaid: loan.totalPaid,
        status: loan.status,
        isFullyPaid: loan.isFullyPaid
      },
      paymentDetails: {
        monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
        remainingMonths,
        totalPaid: loan.totalPaid,
        remainingAmount
      },
      transactions: transactions.map(transaction => ({
        id: transaction._id,
        amount: transaction.amount,
        date: transaction.transactionDate,
        status: transaction.status,
        reference: transaction.reference
      }))
    });
  } catch (error) {
    console.error("❌ Error fetching loan details:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Get savings account details
 * @route GET /api/balances/savings
 * @access Private (Client only)
 */
const getSavingsDetails = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get savings account for the client
    let savingsAccount = await SavingsAccount.findOne({ user: userId });
    
    // If no savings account exists, create one
    if (!savingsAccount) {
      savingsAccount = new SavingsAccount({
        user: userId,
        balance: 0
      });
      await savingsAccount.save();
    }

    res.json({
      savingsAccount: {
        id: savingsAccount._id,
        balance: savingsAccount.balance,
        transactions: savingsAccount.transactions
      }
    });
  } catch (error) {
    console.error("❌ Error fetching savings details:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Update savings account balance
 * @route PUT /api/balances/savings
 * @access Private (Client only)
 */
const updateSavingsDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const { balance } = req.body;
    
    // Validate balance is not negative
    if (balance < 0) {
      return res.status(400).json({ message: 'Savings balance cannot be negative' });
    }
    
    // Find or create savings account
    let savingsAccount = await SavingsAccount.findOne({ user: userId });
    if (!savingsAccount) {
      savingsAccount = new SavingsAccount({ user: userId, balance: 0 });
    }
    
    // Record previous balance for transaction history
    const previousBalance = savingsAccount.balance;
    const changeAmount = balance - previousBalance;
    
    // Update balance
    savingsAccount.balance = balance;
    
    // Add transaction to history if there's a change
    if (changeAmount !== 0) {
      const transactionType = changeAmount > 0 ? 'deposit' : 'withdrawal';
      savingsAccount.transactions.push({
        amount: Math.abs(changeAmount),
        type: transactionType,
        date: new Date()
      });
    }
    
    await savingsAccount.save();
    
    // Update credit score after savings change
    let updatedCreditScore = 0;
    try {
      // Get user for monthly income
      const user = await User.findById(userId);
      if (user) {
        const monthlyIncome = user.incomeDetails?.monthlyIncome || 0;
        
        // Calculate new credit score
        const creditScore = calculateCreditScore(monthlyIncome, balance);
        updatedCreditScore = creditScore;
        
        // Update user's credit score
        user.creditScore = creditScore;
        user.lastCreditScoreUpdate = new Date();
        await user.save();
        
        // Log the credit score update
        await AuditLog.create({
          user: userId,
          action: "credit_score_updated",
          details: { userId, creditScore, trigger: "savings_update" }
        });
      }
    } catch (creditScoreError) {
      console.error('❌ Error updating credit score:', creditScoreError);
      // Continue with the response even if credit score update fails
    }
    
    res.json({
      id: savingsAccount._id,
      balance: savingsAccount.balance,
      transactions: savingsAccount.transactions,
      creditScore: updatedCreditScore
    });
  } catch (error) {
    console.error('❌ Error updating savings details:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getClientBalances,
  getLoanDetails,
  getSavingsDetails,
  updateSavingsDetails
};
