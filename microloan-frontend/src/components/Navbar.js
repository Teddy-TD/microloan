import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";
import { Link as ScrollLink } from "react-scroll";
import { Link as RouterLink } from "react-router-dom";

const Navbar = () => {
  return (
    <AppBar
      position="fixed"
      sx={{
        background: "linear-gradient(to right, #1565C0, #0D47A1)", // Deep blue gradient
        padding: "10px 0",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Logo & Brand Name */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img src="/logo.png" alt="Agar Microfinance" style={{ height: 50, marginRight: 10 }} />
          <Typography variant="h6" fontWeight="bold" sx={{ color: "white", textTransform: "uppercase", letterSpacing: "1px" }}>
            AGAR Microfinance
          </Typography>
        </Box>

        {/* Navigation Links */}
        <div>
          {["Home", "Services", "About", "News", "Contact"].map((text, index) => (
            <Button
              key={index}
              color="inherit"
              component={ScrollLink}
              to={text.toLowerCase().replace(" ", "")}
              smooth
              duration={500}
              sx={{
                mx: 2,
                color: "#FFFFFF", // White text for contrast
                fontWeight: "bold",
                transition: "0.3s",
                "&:hover": { transform: "scale(1.1)", color: "#42A5F5" }, // Light blue hover effect
              }}
            >
              {text}
            </Button>
          ))}

          {/* Login Button */}
          <Button
            component={RouterLink}
            to="/login"
            sx={{
              mx: 2,
              color: "#FFFFFF",
              fontWeight: "bold",
              border: "2px solid #42A5F5", // Light blue border
              borderRadius: "20px",
              padding: "5px 15px",
              transition: "0.3s",
              "&:hover": {
                backgroundColor: "#42A5F5", // Light blue hover
                color: "#212121",
              },
            }}
          >
            Login
          </Button>

          {/* Register Button */}
          <Button
            component={RouterLink}
            to="/register"
            sx={{
              mx: 2,
              backgroundColor: "#42A5F5", // Accent warm orange for contrast
              color: "#FFFFFF", // White text
              fontWeight: "bold",
              borderRadius: "20px",
              padding: "5px 15px",
              transition: "0.3s",
              "&:hover": {
                backgroundColor: "#0D47A1", // Light blue hover effect
                color: "#FFFFFF",
              },
            }}
          >
            Register
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
