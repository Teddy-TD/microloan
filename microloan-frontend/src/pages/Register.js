import { useState } from "react";
import { Box, Container, Typography, TextField, Button, Alert } from "@mui/material";
import { registerUser } from "../services/api";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log("📨 Sending registration data:", { name, email, password });

    try {
      await registerUser(name, email, password);
      console.log("✅ Registration Successful");

      setSuccess("Client registered successfully! Redirecting to login...");
      setError(null); 

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("❌ Registration Failed:", err);
      setError(err.response?.data?.message || "An unexpected error occurred");
      setSuccess(null);
    }
  };

  return (
    <Box sx={{ py: 10, backgroundColor: "#F5F7FA", textAlign: "center", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Container maxWidth="sm" sx={{ background: "#fff", p: 4, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" fontWeight="bold" color="#1E3A8A" sx={{ mb: 2 }}>Create Account</Typography>
        <Typography variant="body1" sx={{ mb: 4, color: "#555" }}>Join Agar Microfinance</Typography>

        {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Box component="form" sx={{ mt: 2 }} onSubmit={handleRegister}>
          <TextField label="Full Name" variant="outlined" fullWidth sx={{ mb: 2 }} value={name} onChange={(e) => setName(e.target.value)} />
          <TextField label="Email" variant="outlined" fullWidth sx={{ mb: 2 }} value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField label="Password" variant="outlined" type="password" fullWidth sx={{ mb: 2 }} value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button type="submit" variant="contained" fullWidth sx={{ backgroundColor: "#3B82F6", "&:hover": { backgroundColor: "#1E3A8A" }, mb: 2 }}>
            Sign Up
          </Button>
        </Box>

        {/* ✅ Updated Login Option with onClick to Navigate */}
        <Typography variant="body2" sx={{ mt: 2 }}>
          Already have an account? 
          <Button onClick={() => navigate("/login")} sx={{ color: "#3B82F6", fontWeight: "bold" }}>
            Login
          </Button>
        </Typography>
      </Container>
    </Box>
  );
};

export default Register;
