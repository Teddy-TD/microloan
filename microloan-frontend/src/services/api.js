import axios from "axios";
const BASE_URL = "http://localhost:5000";
const API_URL = "http://localhost:5000/api/auth"; // Ensure this is correct

// Register Only Clients
export const registerUser = async (name, email, password) => {
  try {
    const res = await axios.post(`${API_URL}/register`, { name, email, password });
    return res.data;
  } catch (error) {
    console.error("Registration Error:", error);
    throw error.response?.data?.message || "Server error";
  }
};

// Login for All Roles
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {  
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    const data = await response.json();

    // Store the token after login
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    return data;
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

export const getClientLoans = async () => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      throw new Error("No token found. Please log in.");
    }
    
    const response = await fetch(`${BASE_URL}/api/loans/my-loans`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch loans");
    }

    const data = await response.json();
    return Array.isArray(data) ? data : []; 
  } catch (error) {
    console.error("Error fetching client loans:", error);
    throw error;
  }
};

export const applyForLoan = async (formData) => {
  const token = localStorage.getItem("authToken");  

  if (!token) {
    throw new Error("No token found. Please log in.");
  }

  try {
    const response = await fetch(`${BASE_URL}/api/loans/apply`, {  
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData, // FormData for file uploads
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Loan application failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Loan Application Error:", error);
    throw error;
  }
};

export const getLoanById = async (loanId) => {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    throw new Error("No token found. Please log in.");
  }
  
  try {
    const response = await fetch(`${BASE_URL}/api/loans/${loanId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch loan details");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching loan details:", error);
    throw error;
  }
};

export const applyLoan = async (amount, duration) => {
  const token = localStorage.getItem("authToken");  

  if (!token) {
    throw new Error("No token found. Please log in.");
  }

  try {
    const response = await fetch(`${BASE_URL}/api/loans`, {  
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,  
      },
      body: JSON.stringify({ amount, duration }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Loan application failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Loan API Error:", error);
    throw error;
  }
};

// Admin API Functions
export const getAllUsers = async () => {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    throw new Error("No token found. Please log in.");
  }
  
  try {
    const response = await fetch(`${BASE_URL}/api/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch users");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const addUser = async (userData) => {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    throw new Error("No token found. Please log in.");
  }
  
  try {
    const response = await fetch(`${BASE_URL}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to add user");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
};

export const removeUser = async (userId) => {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    throw new Error("No token found. Please log in.");
  }
  
  try {
    const response = await fetch(`${BASE_URL}/api/users/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to remove user");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error removing user:", error);
    throw error;
  }
};

export const resetUserPassword = async (userId, newPassword) => {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    throw new Error("No token found. Please log in.");
  }
  
  try {
    const response = await fetch(`${BASE_URL}/api/users/${userId}/reset-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ newPassword }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to reset password");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};

export const updateUserRole = async (userId, role) => {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    throw new Error("No token found. Please log in.");
  }
  
  try {
    const response = await fetch(`${BASE_URL}/api/users/${userId}/role`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update role");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error updating role:", error);
    throw error;
  }
};

export const toggleUserActive = async (userId, active) => {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    throw new Error("No token found. Please log in.");
  }
  
  try {
    const response = await fetch(`${BASE_URL}/api/users/${userId}/active`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ active }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update account status");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error updating account status:", error);
    throw error;
  }
};

// Loan Officer API Functions
export const getAllLoans = async () => {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    throw new Error("No token found. Please log in.");
  }
  
  try {
    const response = await fetch(`${BASE_URL}/api/loans/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch loans");
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching all loans:", error);
    throw error;
  }
};

export const updateLoanStatus = async (loanId, status) => {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    throw new Error("No token found. Please log in.");
  }
  
  try {
    const response = await fetch(`${BASE_URL}/api/loans/${loanId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update loan status");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error updating loan status:", error);
    throw error;
  }
};

export const getClientsList = async () => {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    throw new Error("No token found. Please log in.");
  }
  
  try {
    const response = await fetch(`${BASE_URL}/api/users/clients`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch clients");
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error;
  }
};

export const updateClientProfile = async (clientId, profileData) => {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    throw new Error("No token found. Please log in.");
  }
  
  try {
    const response = await fetch(`${BASE_URL}/api/users/${clientId}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update client profile");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error updating client profile:", error);
    throw error;
  }
};

export const getSystemStats = async () => {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    throw new Error("No token found. Please log in.");
  }
  
  try {
    const response = await fetch(`${BASE_URL}/api/admin/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch system stats");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching system stats:", error);
    // Return default stats on error to prevent dashboard crash
    return {
      totalUsers: 0,
      totalLoans: 0,
      totalAmount: 0,
      pendingLoans: 0
    };
  }
};

export const processRepayment = async (loanId, amount, reference = "") => {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    throw new Error("No token found. Please log in.");
  }
  
  try {
    const response = await fetch(`${BASE_URL}/api/transactions/repayment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ loanId, amount, reference }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to process payment");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error processing payment:", error);
    throw error;
  }
};

export const getUserTransactions = async () => {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    throw new Error("No token found. Please log in.");
  }
  
  try {
    const response = await fetch(`${BASE_URL}/api/transactions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch transactions");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

export const getLoanTransactions = async (loanId) => {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    throw new Error("No token found. Please log in.");
  }
  
  try {
    const response = await fetch(`${BASE_URL}/api/transactions/loan/${loanId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch loan transactions");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching loan transactions:", error);
    throw error;
  }
};

// Complaint API Functions
export const submitComplaint = async (description) => {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    throw new Error("No token found. Please log in.");
  }
  
  try {
    const response = await fetch(`${BASE_URL}/api/complaints`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ description }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to submit complaint");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error submitting complaint:", error);
    throw error;
  }
};

export const getClientComplaints = async () => {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    throw new Error("No token found. Please log in.");
  }
  
  try {
    const response = await fetch(`${BASE_URL}/api/complaints/my-complaints`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch complaints");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching complaints:", error);
    throw error;
  }
};

export const getComplaintById = async (complaintId) => {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    throw new Error("No token found. Please log in.");
  }
  
  try {
    const response = await fetch(`${BASE_URL}/api/complaints/${complaintId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch complaint details");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching complaint details:", error);
    throw error;
  }
};

export const getAllComplaints = async () => {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    throw new Error("No token found. Please log in.");
  }
  
  try {
    const response = await fetch(`${BASE_URL}/api/complaints/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch all complaints");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching all complaints:", error);
    throw error;
  }
};

export const updateComplaintStatus = async (complaintId, status, responseText = "") => {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    throw new Error("No token found. Please log in.");
  }
  
  try {
    const response = await fetch(`${BASE_URL}/api/complaints/${complaintId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status, response: responseText }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update complaint status");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error updating complaint status:", error);
    throw error;
  }
};

// Balance API Functions
export const getClientBalances = async () => {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    throw new Error("No token found. Please log in.");
  }
  
  try {
    const response = await fetch(`${BASE_URL}/api/balances`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch balance information");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching balance information:", error);
    throw error;
  }
};

export const getLoanDetails = async (loanId) => {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    throw new Error("No token found. Please log in.");
  }
  
  try {
    const response = await fetch(`${BASE_URL}/api/balances/loans/${loanId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch loan details");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching loan details:", error);
    throw error;
  }
};

export const getSavingsDetails = async () => {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    throw new Error("No token found. Please log in.");
  }
  
  try {
    const response = await fetch(`${BASE_URL}/api/balances/savings`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch savings details");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching savings details:", error);
    throw error;
  }
};

// Loan Officer API Functions
export const getAllApplications = async (params = {}) => {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    throw new Error("No token found. Please log in.");
  }
  
  try {
    // Build query string from params
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.order) queryParams.append('order', params.order);
    if (params.status) queryParams.append('status', params.status);
    if (params.clientId) queryParams.append('clientId', params.clientId);
    if (params.fromDate) queryParams.append('fromDate', params.fromDate);
    if (params.toDate) queryParams.append('toDate', params.toDate);
    if (params.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    const response = await fetch(`${BASE_URL}/api/loan-applications${queryString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch loan applications");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching loan applications:", error);
    throw error;
  }
};

export const getPendingApplications = async (params = {}) => {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    throw new Error("No token found. Please log in.");
  }
  
  try {
    // Build query string from params
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.order) queryParams.append('order', params.order);
    if (params.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    const response = await fetch(`${BASE_URL}/api/loan-applications/pending${queryString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch pending applications");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching pending applications:", error);
    throw error;
  }
};

export const getApplicationById = async (applicationId) => {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    throw new Error("No token found. Please log in.");
  }
  
  try {
    const response = await fetch(`${BASE_URL}/api/loan-applications/${applicationId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch application details");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching application details:", error);
    throw error;
  }
};

export const processApplication = async (applicationId, data) => {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    throw new Error("No token found. Please log in.");
  }
  
  try {
    const response = await fetch(`${BASE_URL}/api/loan-applications/${applicationId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to process application");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error processing application:", error);
    throw error;
  }
};

// User Profile Management API Functions
export const getUserProfile = async () => {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    throw new Error("No token found. Please log in.");
  }
  
  try {
    const response = await fetch(`${BASE_URL}/api/users/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch user profile");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (profileData) => {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    throw new Error("No token found. Please log in.");
  }
  
  try {
    const response = await fetch(`${BASE_URL}/api/users/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update user profile");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

export const updatePassword = async (currentPassword, newPassword) => {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    throw new Error("No token found. Please log in.");
  }
  
  try {
    const response = await fetch(`${BASE_URL}/api/users/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update password");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
};

// Loan Officer Client Management API Functions
export const getAllClients = async (params = {}) => {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    throw new Error("No token found. Please log in.");
  }
  
  try {
    // Build query string from params
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.order) queryParams.append('order', params.order);
    if (params.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    const response = await fetch(`${BASE_URL}/api/users/clients${queryString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch clients");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error;
  }
};

export const getClientById = async (clientId) => {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    throw new Error("No token found. Please log in.");
  }
  
  try {
    const response = await fetch(`${BASE_URL}/api/users/clients/${clientId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch client details");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching client details:", error);
    throw error;
  }
};

export const updateClient = async (clientId, profileData) => {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    throw new Error("No token found. Please log in.");
  }
  
  try {
    const response = await fetch(`${BASE_URL}/api/users/clients/${clientId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update client");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error updating client:", error);
    throw error;
  }
};

// Admin Loan Application Management API Functions
export const getAdminPendingApplications = async (params = {}) => {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    throw new Error("No token found. Please log in.");
  }
  
  try {
    // Build query string from params
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.order) queryParams.append('order', params.order);
    if (params.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    const response = await fetch(`${BASE_URL}/api/admin/loan-applications/pending${queryString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch pending applications");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching pending applications:", error);
    throw error;
  }
};

export const getAdminAllApplications = async (params = {}) => {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    throw new Error("No token found. Please log in.");
  }
  
  try {
    // Build query string from params
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.order) queryParams.append('order', params.order);
    if (params.status) queryParams.append('status', params.status);
    if (params.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    const response = await fetch(`${BASE_URL}/api/admin/loan-applications${queryString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch applications");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching applications:", error);
    throw error;
  }
};

export const getAdminApplicationById = async (applicationId) => {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    throw new Error("No token found. Please log in.");
  }
  
  try {
    const response = await fetch(`${BASE_URL}/api/admin/loan-applications/${applicationId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch application details");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching application details:", error);
    throw error;
  }
};

export const processAdminApplication = async (applicationId, data) => {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    throw new Error("No token found. Please log in.");
  }
  
  try {
    const response = await fetch(`${BASE_URL}/api/admin/loan-applications/${applicationId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to process application");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error processing application:", error);
    throw error;
  }
};

export const getAdminApplicationDocument = async (applicationId, documentId) => {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    throw new Error("No token found. Please log in.");
  }
  
  try {
    const response = await fetch(`${BASE_URL}/api/admin/loan-applications/${applicationId}/documents/${documentId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch document");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching document:", error);
    throw error;
  }
};
