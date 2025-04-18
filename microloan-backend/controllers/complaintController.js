const Complaint = require("../models/Complaint");
const User = require("../models/User");

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

    const complaint = await Complaint.findById(complaintId)
      .populate("user", "name email")
      .populate("assignedTo", "name email");

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

    res.json(complaint);
  } catch (error) {
    console.error("❌ Error fetching complaint:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Get all complaints (Admin and Loan Officer only)
 * @route GET /api/complaints/all
 * @access Private (Admin, Loan Officer)
 */
const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("user", "name email")
      .populate("assignedTo", "name email")
      .sort({ submittedAt: -1 });

    res.json(complaints);
  } catch (error) {
    console.error("❌ Error fetching all complaints:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Update complaint status (Admin and Loan Officer only)
 * @route PUT /api/complaints/:complaintId/status
 * @access Private (Admin, Loan Officer)
 */
const updateComplaintStatus = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { status, response } = req.body;
    const userId = req.user.id;

    // Validate status
    if (!["open", "assigned", "resolved"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Update complaint status
    complaint.status = status;
    
    // If status is assigned, assign to the current user
    if (status === "assigned") {
      complaint.assignedTo = userId;
    }
    
    // If status is resolved, set resolvedAt date
    if (status === "resolved") {
      complaint.resolvedAt = new Date();
    }
    
    // If response is provided, update it
    if (response) {
      complaint.response = response;
    }

    await complaint.save();

    res.json({
      message: "Complaint status updated successfully",
      complaint
    });
  } catch (error) {
    console.error("❌ Error updating complaint status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  submitComplaint,
  getClientComplaints,
  getComplaintById,
  getAllComplaints,
  updateComplaintStatus
};
