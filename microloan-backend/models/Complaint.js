const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["open", "assigned", "resolved"], 
    default: "open" 
  },
  submittedAt: { 
    type: Date, 
    default: Date.now 
  },
  resolvedAt: { 
    type: Date,
    default: null
  },
  assignedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    default: null 
  },
  response: {
    type: String,
    default: ""
  },
  adminNotes: {
    type: String,
    default: ""
  },
  adminHandledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model("Complaint", ComplaintSchema);
