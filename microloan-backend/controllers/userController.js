const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Get all users - Admin only
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("❌ Get All Users Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Add a new user - Admin only
const addUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate role
    if (!["client", "loan_officer", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });
 
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ 
      message: "User added successfully",
      user: { id: user._id, name: user.name, email: user.email, role: user.role, active: user.active }
    });
  } catch (error) {
    console.error("❌ Add User Error:", error); 
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Remove a user - Admin only
const removeUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(userId);
    res.json({ message: "User removed successfully" });
  } catch (error) {
    console.error("❌ Remove User Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Reset user password - Admin only
const resetPassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { newPassword } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("❌ Reset Password Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update user role - Admin only
const updateRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    
    // Validate role
    if (!["client", "loan_officer", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    await user.save();

    res.json({ 
      message: "User role updated successfully",
      user: { id: user._id, name: user.name, email: user.email, role: user.role, active: user.active }
    });
  } catch (error) {
    console.error("❌ Update Role Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Toggle user active status (activate/deactivate) - Admin only
const toggleUserActive = async (req, res) => {
  try {
    const { userId } = req.params;
    const { active } = req.body;
    
    if (typeof active !== 'boolean') {
      return res.status(400).json({ message: "Active status must be a boolean" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent deactivating your own admin account
    if (req.user.id === userId && req.user.role === 'admin' && active === false) {
      return res.status(400).json({ message: "Cannot deactivate your own admin account" });
    }

    user.active = active;
    await user.save();

    const statusMessage = active ? "activated" : "deactivated";
    res.json({ 
      message: `User account ${statusMessage} successfully`,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, active: user.active }
    });
  } catch (error) {
    console.error("❌ Toggle User Active Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update user profile - For loan officers to update client profiles
const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Only allow loan officers to update client profiles
    if (req.user.role === "loan_officer" && user.role !== "client") {
      return res.status(403).json({ message: "Loan officers can only update client profiles" });
    }

    if (name) user.name = name;
    if (email) {
      // Check if email already exists for another user
      const emailExists = await User.findOne({ email, _id: { $ne: userId } });
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email;
    }

    await user.save();

    res.json({ 
      message: "User profile updated successfully",
      user: { id: user._id, name: user.name, email: user.email, role: user.role, active: user.active }
    });
  } catch (error) {
    console.error("❌ Update Profile Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update own profile - For all users
const updateOwnProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, currentPassword, newPassword } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    
    if (email && email !== user.email) {
      // Check if email already exists
      const emailExists = await User.findOne({ email, _id: { $ne: userId } });
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email;
    }

    // If user wants to change password
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
    }

    await user.save();

    res.json({ 
      message: "Profile updated successfully",
      user: { id: user._id, name: user.name, email: user.email, role: user.role, active: user.active }
    });
  } catch (error) {
    console.error("❌ Update Own Profile Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get user profile - For all users
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("❌ Get Profile Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update user password - For all users
const updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current password and new password are required" });
    }
    
    if (newPassword.length < 8) {
      return res.status(400).json({ message: "New password must be at least 8 characters long" });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }
    
    // Hash and update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("❌ Update Password Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all clients - For loan officers
const getAllClients = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", sortBy = "createdAt", order = "desc" } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Create sort object
    const sortObj = {};
    sortObj[sortBy] = order === "asc" ? 1 : -1;
    
    // Create search filter
    const searchFilter = search 
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } }
          ]
        }
      : {};
    
    // Only get clients
    const filter = {
      ...searchFilter,
      role: "client"
    };

    // Get clients with pagination
    const clients = await User.find(filter)
      .select("-password")
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const totalCount = await User.countDocuments(filter);
    
    res.json({
      clients,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        currentPage: parseInt(page),
        hasNextPage: skip + parseInt(limit) < totalCount,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error("❌ Get All Clients Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get client by ID - For loan officers
const getClientById = async (req, res) => {
  try {
    const { clientId } = req.params;
    
    const client = await User.findById(clientId)
      .select("-password")
      .populate("lastReviewedBy", "name email");
    
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    
    // Ensure the user is a client
    if (client.role !== "client") {
      return res.status(400).json({ message: "User is not a client" });
    }
    
    res.json(client);
  } catch (error) {
    console.error("❌ Get Client Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update client profile - For loan officers
const updateClientProfile = async (req, res) => {
  try {
    const { clientId } = req.params;
    const loanOfficerId = req.user.id;
    const { name, email, phone, address, reviewNotes } = req.body;
    
    const client = await User.findById(clientId);
    
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    
    // Ensure the user is a client
    if (client.role !== "client") {
      return res.status(400).json({ message: "User is not a client" });
    }
    
    // Update fields if provided
    if (name) client.name = name;
    
    if (email && email !== client.email) {
      // Check if email already exists
      const emailExists = await User.findOne({ email, _id: { $ne: clientId } });
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
      client.email = email;
    }
    
    if (phone) client.phone = phone;
    
    if (address) {
      client.address = {
        ...client.address,
        ...address
      };
    }
    
    // Add review information
    if (reviewNotes) {
      if (reviewNotes.length < 2) {
        return res.status(400).json({ message: "Review notes must be at least 2 characters long" });
      }
      client.reviewNotes = reviewNotes;
    }
    
    client.lastReviewedBy = loanOfficerId;
    client.lastReviewedAt = new Date();
    
    await client.save();
    
    // Populate the lastReviewedBy field for the response
    await client.populate("lastReviewedBy", "name email");
    
    res.json({
      message: "Client profile updated successfully",
      client: {
        ...client.toObject(),
        password: undefined
      }
    });
  } catch (error) {
    console.error("❌ Update Client Profile Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { 
  getAllUsers, 
  addUser, 
  removeUser, 
  resetPassword, 
  updateRole, 
  toggleUserActive,
  updateUserProfile,
  updateOwnProfile,
  getUserProfile,
  updatePassword,
  getAllClients,
  getClientById,
  updateClientProfile
};
