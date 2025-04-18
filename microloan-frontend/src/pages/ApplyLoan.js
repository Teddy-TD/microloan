import { useState } from "react";
import { Box, Container, Typography, TextField, Button, Alert } from "@mui/material";
import { applyLoan } from "../services/api";

const ApplyLoan = () => {
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleApplyLoan = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!amount || !duration) {
      setError("Please enter both loan amount and duration.");
      return;
    }

    try {
      console.log("📨 Sending Loan Application:", { amount, duration });

      const response = await applyLoan(Number(amount), Number(duration));

      console.log("✅ Loan Application Success:", response);

      if (response.message) {
        setMessage(response.message); // Show success message
      } else {
        setMessage("Loan application submitted successfully!");
      }
    } catch (err) {
      console.error("❌ Loan Application Failed:", err);

      if (err.response) {
        setError(err.response.data.message || "An error occurred");
      } else {
        setError("Failed to connect to the server. Please try again.");
      }
    }
  };

  return (
    <Box sx={{ py: 10, backgroundColor: "#FFFFFF", textAlign: "center" }}>
      <Container maxWidth="sm">
        <Typography variant="h4" fontWeight="bold" color="#1E3A8A">
          Apply for a Loan
        </Typography>
        {message && <Alert severity="success" sx={{ my: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
        <Box component="form" sx={{ mt: 4 }} onSubmit={handleApplyLoan}>
          <TextField
            label="Loan Amount"
            type="number"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <TextField
            label="Duration (months)"
            type="number"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ backgroundColor: "#3B82F6", "&:hover": { backgroundColor: "#1E3A8A" } }}
          >
            Apply Now
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ApplyLoan;
