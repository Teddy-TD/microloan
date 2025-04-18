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
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/loans", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    console.log("API Response:", data);

    return Array.isArray(data) ? data : []; 
  } catch (error) {
    console.error("Error fetching client loans:", error);
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
