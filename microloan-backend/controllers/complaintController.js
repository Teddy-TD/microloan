const Complaint = require("../models/Complaint");
const User = require("../models/User");
const mongoose = require("mongoose");

/**
 * Submit a new complaint
 * @route POST /api/complaints
 * @access Private (Client only)
 */
const submitComplaint = async (req, res) => {
  try {
    const { description } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!description) {
      return res.status(400).json({ message: "Complaint description is required" });
    }

    // Create new complaint
    const complaint = new Complaint({
      user: userId,
      description,
      submittedAt: new Date()
    });

    await complaint.save();

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaint
    });
  } catch (error) {
    console.error("❌ Error submitting complaint:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Get all complaints for the logged-in client
 * @route GET /api/complaints/my-complaints
 * @access Private (Client only)
 */
const getClientComplaints = async (req, res) => {
  try {
    const userId = req.user.id;

    const complaints = await Complaint.find({ user: userId })
      .sort({ submittedAt: -1 });

    res.json(complaints);
  } catch (error) {
    console.error("❌ Error fetching client complaints:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Get a specific complaint by ID
 * @route GET /api/complaints/:complaintId
 * @access Private (Client, Admin, Loan Officer)
 */
const getComplaintById = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(complaintId)) {
      return res.status(400).json({ message: "Invalid complaint ID" });
    }

    const complaint = await Complaint.findById(complaintId)
      .populate("user", "name email phone")
      .populate("assignedTo", "name email")
      .populate("adminHandledBy", "name email");

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Check if user is authorized to view this complaint
    if (
      complaint.user._id.toString() !== userId &&
      req.user.role !== "admin" &&
      req.user.role !== "loan_officer"
    ) {
      return res.status(403).json({ message: "Not authorized to view this complaint" });
    }

    // Format response for API consistency
    const formattedComplaint = {
      complaintId: complaint._id,
      clientId: complaint.user._id,
      clientName: complaint.user.name,
      clientEmail: complaint.user.email,
      clientPhone: complaint.user.phone,
      description: complaint.description,
      status: complaint.status,
      submittedAt: complaint.submittedAt,
      resolvedAt: complaint.resolvedAt,
      assignedTo: complaint.assignedTo ? {
        id: complaint.assignedTo._id,
        name: complaint.assignedTo.name,
        email: complaint.assignedTo.email
      } : null,
      adminNotes: complaint.adminNotes,
      adminHandledBy: complaint.adminHandledBy ? {
        id: complaint.adminHandledBy._id,
        name: complaint.adminHandledBy.name,
        email: complaint.adminHandledBy.email
      } : null,
      response: complaint.response
    };

    res.json(formattedComplaint);
  } catch (error) {
    console.error("❌ Error fetching complaint:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Get all complaints (Admin and Loan Officer only)
 * @route GET /api/complaints
 * @access Private (Admin, Loan Officer)
 */
const getAllComplaints = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      clientId,
      search,
      sortBy = 'submittedAt',
      order = 'desc'
    } = req.query;
    
    const skip = (page - 1) * limit;
    const sortOrder = order === 'desc' ? -1 : 1;
    const sortObj = { [sortBy]: sortOrder };
    
    // Build filter object
    const filter = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (clientId) {
      filter.user = clientId;
    }
    
    if (search) {
      // Find users whose name matches the search term
      const users = await User.find({
        name: { $regex: search, $options: 'i' }
      }).select('_id');
      
      const userIds = users.map(user => user._id);
      
      if (userIds.length > 0) {
        filter.$or = [
          { user: { $in: userIds } },
          { description: { $regex: search, $options: 'i' } }
        ];
      } else {
        filter.description = { $regex: search, $options: 'i' };
      }
    }

    const complaints = await Complaint.find(filter)
      .populate("user", "name email phone")
      .populate("assignedTo", "name email")
      .populate("adminHandledBy", "name email")
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    // Count total complaints for pagination
    const totalCount = await Complaint.countDocuments(filter);
    
    // Format response data
    const formattedComplaints = complaints.map(complaint => ({
      complaintId: complaint._id,
      clientId: complaint.user._id,
      clientName: complaint.user.name,
      clientEmail: complaint.user.email,
      description: complaint.description,
      status: complaint.status,
      submittedAt: complaint.submittedAt,
      resolvedAt: complaint.resolvedAt,
      assignedTo: complaint.assignedTo ? {
        id: complaint.assignedTo._id,
        name: complaint.assignedTo.name
      } : null,
      adminNotes: complaint.adminNotes
    }));

    res.json({
      complaints: formattedComplaints,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error("❌ Error fetching all complaints:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Update complaint status (Admin and Loan Officer only)
 * @route PATCH /api/complaints/:complaintId
 * @access Private (Admin, Loan Officer)
 */
const updateComplaintStatus = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { status, response, assignedTo } = req.body;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(complaintId)) {
      return res.status(400).json({ message: "Invalid complaint ID" });
    }

    // Validate status
    if (status && !["open", "assigned", "resolved"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Update complaint fields if provided
    if (status) {
      complaint.status = status;
    }
    
    // If status is assigned and assignedTo is provided, validate and assign
    if (status === "assigned" && assignedTo) {
      if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
        return res.status(400).json({ message: "Invalid assignedTo ID" });
      }
      
      // Verify the assigned user is a loan officer
      const loanOfficer = await User.findById(assignedTo);
      if (!loanOfficer || loanOfficer.role !== "loan_officer") {
        return res.status(400).json({ message: "Assigned user must be a loan officer" });
      }
      
      complaint.assignedTo = assignedTo;
    }
    
    // If response is provided, update it
    if (response) {
      complaint.response = response;
    }

    await complaint.save();

    res.json({
      message: "Complaint updated successfully",
      complaint
    });
  } catch (error) {
    console.error("❌ Error updating complaint:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Assign complaint to a loan officer (Admin only)
 * @route PATCH /api/complaints/:complaintId/assign
 * @access Private (Admin only)
 */
const assignComplaint = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { assignedTo } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(complaintId)) {
      return res.status(400).json({ message: "Invalid complaint ID" });
    }
    
    if (!assignedTo || !mongoose.Types.ObjectId.isValid(assignedTo)) {
      return res.status(400).json({ message: "Valid loan officer ID is required" });
    }
    
    // Verify the assigned user is a loan officer
    const loanOfficer = await User.findById(assignedTo);
    if (!loanOfficer || loanOfficer.role !== "loan_officer") {
      return res.status(400).json({ message: "Assigned user must be a loan officer" });
    }
    
    const complaint = await Complaint.findById(complaintId);
    
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    
    // Update complaint
    complaint.assignedTo = assignedTo;
    complaint.status = "assigned";
    
    await complaint.save();
    
    res.json({
      message: "Complaint assigned successfully",
      complaint
    });
  } catch (error) {
    console.error("❌ Error assigning complaint:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Resolve a complaint (Admin only)
 * @route PATCH /api/complaints/:complaintId/resolve
 * @access Private (Admin only)
 */
const resolveComplaint = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { adminNotes } = req.body;
    const adminId = req.user.id;
    
    if (!mongoose.Types.ObjectId.isValid(complaintId)) {
      return res.status(400).json({ message: "Invalid complaint ID" });
    }
    
    const complaint = await Complaint.findById(complaintId);
    
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    
    // Update complaint
    complaint.status = "resolved";
    complaint.resolvedAt = new Date();
    complaint.adminHandledBy = adminId;
    
    if (adminNotes) {
      complaint.adminNotes = adminNotes;
    }
    
    await complaint.save();
    
    res.json({
      message: "Complaint resolved successfully",
      complaint
    });
  } catch (error) {
    console.error("❌ Error resolving complaint:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  submitComplaint,
  getClientComplaints,
  getComplaintById,
  getAllComplaints,
  updateComplaintStatus,
  assignComplaint,
  resolveComplaint
};
