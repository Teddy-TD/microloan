const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  loanId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Loan", 
    required: true 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ["repayment", "deposit", "withdrawal"], 
    default: "repayment" 
  },
  transactionDate: { 
    type: Date, 
    default: Date.now 
  },
  status: { 
    type: String, 
    enum: ["completed", "pending"], 
    default: "completed" 
  },
  reference: { 
    type: String,
    default: () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }
}, { timestamps: true });

module.exports = mongoose.model("Transaction", TransactionSchema);
