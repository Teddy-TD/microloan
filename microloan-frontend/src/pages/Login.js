import { useState } from "react";
import { Box, Container, Typography, TextField, Button, Alert, Paper } from "@mui/material";
import { loginUser } from "../services/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await loginUser(formData.email, formData.password);
      console.log("Login successful:", data);
      
      // Redirect based on user role
      if (data.user.role === "admin") {
        navigate("/admin-dashboard");
      } else if (data.user.role === "loan_officer") {
        navigate("/loan-officer-dashboard");
      } else {
        navigate("/client-dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ py: 10, backgroundColor: "#F5F7FA", minHeight: "100vh" }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" fontWeight="bold" color="#1E3A8A" sx={{ mb: 3, textAlign: "center" }}>
            Login
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                backgroundColor: "#3B82F6",
                "&:hover": { backgroundColor: "#1E3A8A" },
                py: 1.5,
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography variant="body2">
              Don't have an account?{" "}
              <Button
                variant="text"
                color="primary"
                onClick={() => navigate("/register")}
              >
                Register
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
