const mongoose = require("mongoose");

const LoanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  duration: { type: Number, required: true }, // Loan duration in months
  purpose: { type: String, required: true },
  documents: [{ type: String }], // Array of document URLs/paths
  status: { type: String, enum: ["pending", "approved", "rejected", "closed"], default: "pending" },
  applicationDate: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  // Fields for repayment tracking
  balance: { type: Number, default: function() { return this.amount; } }, // Remaining balance to be paid
  totalPaid: { type: Number, default: 0 }, // Total amount paid so far
  lastPaymentDate: { type: Date }, // Date of the last payment
  nextPaymentDue: { type: Date }, // Date when the next payment is due
  isFullyPaid: { type: Boolean, default: false } // Whether the loan has been fully paid
}, { timestamps: true });

// Update the updatedAt field on save
LoanSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Check if loan is fully paid
  if (this.balance <= 0 && this.status === "approved") {
    this.isFullyPaid = true;
    this.status = "closed";
  }
  
  next();
});

module.exports = mongoose.model("Loan", LoanSchema);
