const Loan = require("../models/Loan");
const User = require("../models/User");
const mongoose = require("mongoose");
const Notification = require("../models/Notification");
const AuditLog = require("../models/AuditLog");

/**
 * Get all pending loan applications
 * @route GET /api/loan-applications/pending
 * @access Private (Loan Officer only)
 */
const getPendingApplications = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = "applicationDate", order = "desc" } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Create sort object
    const sortObj = {};
    sortObj[sortBy] = order === "asc" ? 1 : -1;

    // Query for pending applications
    const pendingLoans = await Loan.find({ status: "pending" })
      .populate("user", "name email phone")
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const totalCount = await Loan.countDocuments({ status: "pending" });
    
    // Format the response
    const formattedLoans = pendingLoans.map(loan => ({
      applicationId: loan._id,
      clientId: loan.user._id,
      clientName: loan.user.name,
      clientEmail: loan.user.email,
      clientPhone: loan.user.phone,
      loanAmount: loan.amount,
      loanDuration: loan.duration,
      purpose: loan.purpose,
      documents: loan.documents,
      applicationDate: loan.applicationDate
    }));

    res.status(200).json({
      loans: formattedLoans,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        currentPage: parseInt(page),
        hasNextPage: skip + parseInt(limit) < totalCount,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error("❌ Error fetching pending applications:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Get a specific loan application by ID
 * @route GET /api/loan-applications/:applicationId
 * @access Private (Loan Officer only)
 */
const getApplicationById = async (req, res) => {
  try {
    const { applicationId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({ message: "Invalid application ID" });
    }

    const loan = await Loan.findById(applicationId)
      .populate("user", "name email phone address");
    
    if (!loan) {
      return res.status(404).json({ message: "Loan application not found" });
    }

    // Format the response
    const formattedLoan = {
      applicationId: loan._id,
      clientId: loan.user._id,
      clientName: loan.user.name,
      clientEmail: loan.user.email,
      clientPhone: loan.user.phone,
      clientAddress: loan.user.address,
      loanAmount: loan.amount,
      loanDuration: loan.duration,
      purpose: loan.purpose,
      documents: loan.documents,
      status: loan.status,
      applicationDate: loan.applicationDate,
      reviewNotes: loan.reviewNotes,
      reviewedAt: loan.reviewedAt,
      reviewedBy: loan.reviewedBy
    };

    res.status(200).json(formattedLoan);
  } catch (error) {
    console.error("❌ Error fetching application details:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Process a loan application (approve or reject)
 * @route PATCH /api/loan-applications/:applicationId
 * @access Private (Loan Officer only)
 */
const processApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, reviewNotes, approvedAmount, repaymentSchedule } = req.body;
    const loanOfficerId = req.user.id;
    
    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({ message: "Invalid application ID" });
    }

    // Validate status
    if (!status || !["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Must be 'approved' or 'rejected'" });
    }

    // Find the loan application
    const loanApplication = await Loan.findById(applicationId);
    
    if (!loanApplication) {
      return res.status(404).json({ message: "Loan application not found" });
    }
    
    if (loanApplication.status !== "pending") {
      return res.status(400).json({ message: "This application has already been processed" });
    }

    // Additional validation for approval
    if (status === "approved") {
      // Validate approved amount
      if (!approvedAmount || approvedAmount <= 0) {
        return res.status(400).json({ message: "Approved amount must be greater than 0" });
      }
      
      // Validate repayment schedule
      if (!repaymentSchedule || !Array.isArray(repaymentSchedule) || repaymentSchedule.length === 0) {
        return res.status(400).json({ message: "Valid repayment schedule is required" });
      }
      
      // Validate each schedule item
      for (const item of repaymentSchedule) {
        if (!item.dueDate || !item.amount || item.amount <= 0) {
          return res.status(400).json({ message: "Each repayment schedule item must have a valid dueDate and amount" });
        }
      }
      
      // Verify total repayment amount matches approved amount
      const totalRepayment = repaymentSchedule.reduce((sum, item) => sum + item.amount, 0);
      if (Math.abs(totalRepayment - approvedAmount) > 0.01) { // Allow small rounding differences
        return res.status(400).json({ 
          message: "Total repayment schedule amount must equal the approved amount",
          totalRepayment,
          approvedAmount
        });
      }
    }

    // Update the loan application
    loanApplication.status = status;
    loanApplication.reviewNotes = reviewNotes || "";
    loanApplication.reviewedBy = loanOfficerId;
    loanApplication.reviewedAt = new Date();
    
    if (status === "approved") {
      loanApplication.amount = approvedAmount;
      loanApplication.balance = approvedAmount;
      loanApplication.repaymentSchedule = repaymentSchedule.map(item => ({
        dueDate: new Date(item.dueDate),
        amount: item.amount,
        status: "pending"
      }));
      
      // Set next payment due date to the earliest date in the schedule
      const nextPaymentDue = new Date(Math.min(...repaymentSchedule.map(item => new Date(item.dueDate))));
      loanApplication.nextPaymentDue = nextPaymentDue;
    }
    
    await loanApplication.save();
    console.log(`[loanOfficerController] loanApplication ${applicationId} saved with status ${status}`);
    // Send notification on approval or rejection
    if (["approved", "rejected"].includes(status)) {
      try {
        const clientUser = await User.findById(loanApplication.user);
        const officerUser = await User.findById(req.user.id);
        const message = status === 'approved'
          ? `Your loan application #${loanApplication._id} for ${loanApplication.amount} birr was approved by ${officerUser.name}`
          : `Your loan application #${loanApplication._id} was rejected by ${officerUser.name}`;
        const newNotif = await Notification.create({
          user: clientUser._id,
          message,
          type: 'loan_status',
          status: 'unread',
          linkId: loanApplication._id,
          createdAt: new Date()
        });
        console.log(`[loanOfficerController] Notification created: id=${newNotif._id}, user=${newNotif.user}`);
        await AuditLog.create({
          user: req.user.id,
          action: 'notification_created',
          details: { type: 'loan_status', applicationId: loanApplication._id, clientId: clientUser._id }
        });
        console.log(`[loanOfficerController] AuditLog created for application ${loanApplication._id}`);
        console.log(`✅ ${status.charAt(0).toUpperCase() + status.slice(1)} notification sent for application ${loanApplication._id} to client ${clientUser._id}`);
      } catch (err) {
        console.error('[loanOfficerController] Error creating notification or audit log:', err);
      }
    }

    res.status(200).json({
      message: `Loan application ${status === "approved" ? "approved" : "rejected"} successfully`,
      application: {
        applicationId: loanApplication._id,
        status: loanApplication.status,
        reviewedAt: loanApplication.reviewedAt,
        reviewNotes: loanApplication.reviewNotes
      }
    });
  } catch (error) {
    console.error("❌ Error processing application:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Get all loan applications (with filtering options)
 * @route GET /api/loan-applications
 * @access Private (Loan Officer only)
 */
const getAllApplications = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sortBy = "applicationDate", 
      order = "desc",
      status,
      clientId,
      fromDate,
      toDate
    } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Create sort object
    const sortObj = {};
    sortObj[sortBy] = order === "asc" ? 1 : -1;

    // Build filter object
    const filter = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (clientId && mongoose.Types.ObjectId.isValid(clientId)) {
      filter.user = clientId;
    }
    
    // Date range filter
    if (fromDate || toDate) {
      filter.applicationDate = {};
      
      if (fromDate) {
        filter.applicationDate.$gte = new Date(fromDate);
      }
      
      if (toDate) {
        filter.applicationDate.$lte = new Date(toDate);
      }
    }

    // Query for applications with filters
    const loans = await Loan.find(filter)
      .populate("user", "name email phone")
      .populate("reviewedBy", "name email")
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const totalCount = await Loan.countDocuments(filter);
    
    // Format the response
    const formattedLoans = loans.map(loan => ({
      applicationId: loan._id,
      clientId: loan.user._id,
      clientName: loan.user.name,
      clientEmail: loan.user.email,
      loanAmount: loan.amount,
      loanDuration: loan.duration,
      purpose: loan.purpose,
      status: loan.status,
      applicationDate: loan.applicationDate,
      reviewedAt: loan.reviewedAt,
      reviewedBy: loan.reviewedBy ? {
        id: loan.reviewedBy._id,
        name: loan.reviewedBy.name
      } : null
    }));

    res.status(200).json({
      loans: formattedLoans,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        currentPage: parseInt(page),
        hasNextPage: skip + parseInt(limit) < totalCount,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error("❌ Error fetching applications:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getPendingApplications,
  getApplicationById,
  processApplication,
  getAllApplications
};
