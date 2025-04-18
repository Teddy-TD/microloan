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
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
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
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error("❌ Update Role Error:", error);
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
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
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
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error("❌ Update Own Profile Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { 
  getAllUsers, 
  addUser, 
  removeUser, 
  resetPassword, 
  updateRole, 
  updateUserProfile,
  updateOwnProfile
};
