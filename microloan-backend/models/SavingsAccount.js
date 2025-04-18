const mongoose = require("mongoose");

const SavingsAccountSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  balance: { 
    type: Number, 
    default: 0 
  },
  transactions: [
    {
      amount: { type: Number, required: true },
      type: { type: String, enum: ["deposit", "withdrawal"], required: true },
      date: { type: Date, default: Date.now },
      description: { type: String }
    }
  ],
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

// Update the updatedAt field on save
SavingsAccountSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("SavingsAccount", SavingsAccountSchema);
