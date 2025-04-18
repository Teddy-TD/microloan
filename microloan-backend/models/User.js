const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["client", "loan_officer", "admin"], default: "client" },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
