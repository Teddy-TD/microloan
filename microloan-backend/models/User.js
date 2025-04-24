const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  address: {
    street: { type: String },
    city: { type: String },
    region: { type: String },
    postalCode: { type: String }
  },
  role: { type: String, enum: ["client", "loan_officer", "admin"], default: "client" },
  active: { type: Boolean, default: true },
  // Credit score related fields
  creditScore: { type: Number, default: 0 },
  lastCreditScoreUpdate: { type: Date },
  incomeDetails: {
    monthlyIncome: { type: Number, default: 0 },
    employmentStatus: { type: String, enum: ["employed", "self-employed", "unemployed", "student"], default: "unemployed" },
    employer: { type: String }
  },
  // Additional fields for loan officer review
  lastReviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reviewNotes: { type: String },
  lastReviewedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
