const Loan = require('../models/Loan');
const User = require('../models/User');
const mongoose = require('mongoose');

// Fetch Pending Applications
exports.getPendingApplications = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'applicationDate', 
      order = 'desc' 
    } = req.query;
    
    const skip = (page - 1) * limit;
    const sortOrder = order === 'desc' ? -1 : 1;
    const sortObj = { [sortBy]: sortOrder };
    
    // Query for pending applications
    const applications = await Loan.find({ status: 'pending' })
      .populate('user', 'name email phone incomeDetails')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));
    
    // Count total pending applications for pagination
    const totalCount = await Loan.countDocuments({ status: 'pending' });
    
    // Format response data
    const formattedApplications = applications.map(app => ({
      applicationId: app._id,
      clientId: app.user._id,
      clientName: app.user.name,
      loanAmount: app.amount,
      loanDuration: app.duration,
      purpose: app.purpose,
      documents: app.documents,
      applicationDate: app.applicationDate
    }));
    
    res.status(200).json({
      applications: formattedApplications,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching pending applications:', error);
    res.status(500).json({ message: 'Failed to fetch pending applications' });
  }
};

// Fetch Single Application Details
exports.getApplicationById = async (req, res) => {
  try {
    const { applicationId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({ message: 'Invalid application ID' });
    }
    
    const application = await Loan.findById(applicationId)
      .populate('user', 'name email phone incomeDetails address');
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Format response data
    const formattedApplication = {
      applicationId: application._id,
      clientId: application.user._id,
      clientName: application.user.name,
      clientEmail: application.user.email,
      clientPhone: application.user.phone,
      clientIncome: application.user.incomeDetails,
      clientAddress: application.user.address,
      loanAmount: application.amount,
      loanDuration: application.duration,
      purpose: application.purpose,
      documents: application.documents,
      status: application.status,
      applicationDate: application.applicationDate,
      approvedAmount: application.approvedAmount,
      repaymentSchedule: application.repaymentSchedule,
      reviewNotes: application.reviewNotes,
      reviewedBy: application.reviewedBy,
      reviewedAt: application.reviewedAt
    };
    
    res.status(200).json(formattedApplication);
  } catch (error) {
    console.error('Error fetching application details:', error);
    res.status(500).json({ message: 'Failed to fetch application details' });
  }
};

// Process Application (Approve/Reject)
exports.processApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, reviewNotes, approvedAmount, repaymentSchedule } = req.body;
    const adminId = req.user.id;
    
    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({ message: 'Invalid application ID' });
    }
    
    if (status !== 'approved' && status !== 'rejected') {
      return res.status(400).json({ message: 'Status must be either approved or rejected' });
    }
    
    const application = await Loan.findById(applicationId);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Update application based on status
    application.status = status;
    application.reviewNotes = reviewNotes || '';
    application.reviewedBy = adminId;
    application.reviewedAt = new Date();
    
    if (status === 'approved') {
      // Validation for approval
      if (!approvedAmount || approvedAmount <= 0) {
        return res.status(400).json({ message: 'Approved amount must be greater than 0' });
      }
      
      if (!repaymentSchedule || !Array.isArray(repaymentSchedule) || repaymentSchedule.length === 0) {
        return res.status(400).json({ message: 'Repayment schedule is required for approval' });
      }
      
      // Validate repayment schedule
      let totalRepayment = 0;
      for (const payment of repaymentSchedule) {
        if (!payment.dueDate || !payment.amount || payment.amount <= 0) {
          return res.status(400).json({ 
            message: 'Each repayment schedule item must have a valid dueDate and amount' 
          });
        }
        totalRepayment += payment.amount;
      }
      
      // Check if total repayment matches approved amount
      if (Math.abs(totalRepayment - approvedAmount) > 0.01) {
        return res.status(400).json({ 
          message: `Total repayment (${totalRepayment}) must equal approved amount (${approvedAmount})` 
        });
      }
      
      application.approvedAmount = approvedAmount;
      application.repaymentSchedule = repaymentSchedule;
    }
    
    await application.save();
    
    res.status(200).json({ 
      message: `Application ${status === 'approved' ? 'approved' : 'rejected'} successfully`,
      application
    });
  } catch (error) {
    console.error('Error processing application:', error);
    res.status(500).json({ message: 'Failed to process application' });
  }
};

// Fetch Application Documents
exports.getApplicationDocument = async (req, res) => {
  try {
    const { applicationId, documentId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({ message: 'Invalid application ID' });
    }
    
    const application = await Loan.findById(applicationId);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    const document = application.documents.find(doc => doc._id.toString() === documentId);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    // In a real application, you would handle secure document access here
    // For example, generating a signed URL or serving the file directly
    
    res.status(200).json({ 
      documentUrl: document.url,
      documentName: document.name,
      documentType: document.type
    });
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ message: 'Failed to fetch document' });
  }
};

// Get All Applications with filters
exports.getAllApplications = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'applicationDate', 
      order = 'desc',
      status,
      search
    } = req.query;
    
    const skip = (page - 1) * limit;
    const sortOrder = order === 'desc' ? -1 : 1;
    const sortObj = { [sortBy]: sortOrder };
    
    // Build filter object
    const filter = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (search) {
      // We need to join with the User model to search by client name
      // This is a simplified approach - in a real app, you might use aggregation
      const users = await User.find({
        name: { $regex: search, $options: 'i' }
      }).select('_id');
      
      const userIds = users.map(user => user._id);
      
      if (userIds.length > 0) {
        filter.$or = [
          { user: { $in: userIds } },
          { purpose: { $regex: search, $options: 'i' } }
        ];
      } else {
        filter.purpose = { $regex: search, $options: 'i' };
      }
    }
    
    // Query for applications
    const applications = await Loan.find(filter)
      .populate('user', 'name email phone')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));
    
    // Count total applications for pagination
    const totalCount = await Loan.countDocuments(filter);
    
    // Format response data
    const formattedApplications = applications.map(app => ({
      applicationId: app._id,
      clientId: app.user._id,
      clientName: app.user.name,
      loanAmount: app.amount,
      loanDuration: app.duration,
      purpose: app.purpose,
      status: app.status,
      applicationDate: app.applicationDate
    }));
    
    res.status(200).json({
      applications: formattedApplications,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Failed to fetch applications' });
  }
};
