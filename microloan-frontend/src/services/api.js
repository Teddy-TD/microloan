import axios from "axios";
const BASE_URL = "http://localhost:5000";
const API_URL = "http://localhost:5000/api/auth"; // ✅ Ensure this is correct

// ✅ Register Only Clients
export const registerUser = async (name, email, password) => {
  try {
    const res = await axios.post(`${API_URL}/register`, { name, email, password });
    return res.data;
  } catch (error) {
    console.error("❌ Registration Error:", error);
    throw error.response?.data?.message || "Server error";
  }
};

// ✅ Login for All Roles
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {  // Make sure BASE_URL is correct
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    const data = await response.json();

    // ✅ Store the token after login
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    return data;
  } catch (error) {
    console.error("❌ Login Error:", error);
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
    console.log("📨 API Response:", data);

    return Array.isArray(data) ? data : []; // ✅ Ensure it returns an array
  } catch (error) {
    console.error("❌ Error fetching client loans:", error);
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
        Authorization: `Bearer ${token}`,  // ✅ Send token in request
      },
      body: JSON.stringify({ amount, duration }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Loan application failed");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Loan API Error:", error);
    throw error;
  }
};
