const Loan = require("../models/Loan");
const path = require("path");

const applyForLoan = async (req, res) => {
  try {
    // Parse form data - multer puts form fields in req.body and files in req.files
    const amount = req.body.amount ? Number(req.body.amount) : null;
    const duration = req.body.duration ? Number(req.body.duration) : null;
    const purpose = req.body.purpose || "";
    
    // Validate required fields
    if (!amount) return res.status(400).json({ message: "Loan amount is required" });
    if (!duration) return res.status(400).json({ message: "Loan duration is required" });
    if (!purpose) return res.status(400).json({ message: "Loan purpose is required" });
    
    // Validate loan amount (minimum 1000)
    if (amount < 1000) return res.status(400).json({ message: "Loan amount must be at least 1000" });
    
    // Process uploaded documents
    let documents = [];
    if (req.files && req.files.length > 0) {
      documents = req.files.map(file => `/uploads/${file.filename}`);
    }

    // Create and save the loan application
    const loan = new Loan({ 
      user: req.user.id, 
      amount, 
      duration, 
      purpose, 
      documents,
      applicationDate: new Date()
    });
    
    await loan.save();
    
    res.status(201).json({ 
      message: "Loan application submitted successfully", 
      loan 
    });
  } catch (error) {
    console.error("❌ Error applying for loan:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getClientLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ user: req.user.id }).sort({ applicationDate: -1 });
    res.json(loans);
  } catch (error) {
    console.error("❌ Error fetching client loans:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getLoans = async (req, res) => {
  try {
    const loans = await Loan.find()
      .populate("user", "name email")
      .sort({ applicationDate: -1 });
    res.json(loans);
  } catch (error) {
    console.error("❌ Error fetching loans:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getLoanById = async (req, res) => {
  try {
    const { loanId } = req.params;
    const loan = await Loan.findById(loanId).populate("user", "name email");
    
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }
    
    // Check if the requesting user is the loan owner or an admin/loan officer
    if (
      req.user.id.toString() !== loan.user._id.toString() && 
      req.user.role !== "admin" && 
      req.user.role !== "loan_officer"
    ) {
      return res.status(403).json({ message: "Not authorized to view this loan" });
    }
    
    res.json(loan);
  } catch (error) {
    console.error("❌ Error fetching loan:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateLoanStatus = async (req, res) => {
  try {
    const { loanId } = req.params;
    const { status } = req.body;

    // Validate status
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const loan = await Loan.findById(loanId);
    if (!loan) return res.status(404).json({ message: "Loan not found" });

    loan.status = status;
    loan.updatedAt = new Date();
    await loan.save();

    res.json({ message: "Loan status updated successfully", loan });
  } catch (error) {
    console.error("❌ Error updating loan status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { 
  applyForLoan, 
  getClientLoans, 
  getLoans, 
  getLoanById, 
  updateLoanStatus 
};
