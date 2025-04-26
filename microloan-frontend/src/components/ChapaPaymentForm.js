import React, { useState } from "react";
import { Box, Typography, TextField, Button, CircularProgress, Alert } from "@mui/material";
import axios from "axios";

// Base URL for payment API
const API_BASE = "http://localhost:5000/api/payment";

const ChapaPaymentForm = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Retrieve user info from localStorage
  const userData = JSON.parse(localStorage.getItem("user")) || {};
  const email = userData.email || "";
  const nameParts = (userData.name || "").split(" ");
  const first_name = nameParts[0] || "";
  const last_name = nameParts.slice(1).join(" ") || "";
  const phone_number = userData.phoneNumber || "";

  const handleInit = async () => {
    setError("");
    if (!amount || isNaN(amount)) {
      setError("Enter a valid amount");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${API_BASE}/initialize`,
        { amount: parseFloat(amount), email, first_name, last_name, phone_number },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { checkout_url } = response.data;
      window.open(checkout_url, "_blank");
    } catch (err) {
      setError(err.response?.data?.message || "Initialization failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Enter payment amount
      </Typography>
      <TextField
        label="Amount"
        variant="outlined"
        fullWidth
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        sx={{ mb: 2 }}
      />
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Button variant="contained" color="primary" onClick={handleInit} disabled={loading}>
        {loading ? <CircularProgress size={24} /> : "Pay with Chapa"}
      </Button>
    </Box>
  );
};

export default ChapaPaymentForm;
