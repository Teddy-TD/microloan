import { useState } from "react";
import { Box, Container, Typography, TextField, Button, Alert } from "@mui/material";
import { loginUser } from "../services/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
  
    try {
      const data = await loginUser(email, password);
  
      // ✅ Redirect users based on their role
      if (data.user.role === "admin") {
        navigate("/admin-dashboard");
      } else if (data.user.role === "loan_officer") {
        navigate("/loan-officer-dashboard");
      } else {
        navigate("/client-dashboard");
      }
    } catch (err) {
      console.error("❌ Login Failed:", err);
      setError(err.message);
    }
  };


  return (
    <Box sx={{ py: 10, backgroundColor: "#F5F7FA", textAlign: "center", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Container maxWidth="sm" sx={{ background: "#fff", p: 4, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" fontWeight="bold" color="#1E3A8A" sx={{ mb: 2 }}>Welcome</Typography>
        <Typography variant="body1" sx={{ mb: 4, color: "#555" }}>Login to continue</Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Box component="form" sx={{ mt: 2 }} onSubmit={handleLogin}>
          <TextField label="Email" variant="outlined" fullWidth sx={{ mb: 2 }} value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField label="Password" variant="outlined" type="password" fullWidth sx={{ mb: 2 }} value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button type="submit" variant="contained" fullWidth sx={{ backgroundColor: "#3B82F6", "&:hover": { backgroundColor: "#1E3A8A" }, mb: 2 }}>
            Login
          </Button>
        </Box>

        {/* ✅ Updated Signup Option with onClick to Navigate */}
        <Typography variant="body2" sx={{ mt: 2 }}>
          Don't have an account? 
          <Button onClick={() => navigate("/register")} sx={{ color: "#3B82F6", fontWeight: "bold" }}>
            Sign Up
          </Button>
        </Typography>
      </Container>
    </Box>
  );
};

export default Login;
