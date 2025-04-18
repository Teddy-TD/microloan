import { Box, Container, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import About from "./About";
import Services from "./Services";
import News from "./News";
import Contact from "./Contact";

const Home = () => {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <Box
        id="home"
        sx={{
          height: "100vh",
          backgroundImage: "url('/Home1.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            background: "linear-gradient(to right, #6495ed, rgba(0, 0, 0, 0.6))",
          }}
        />

        <Container sx={{ position: "relative", textAlign: "center", color: "#fff" }}>
          <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <Typography variant="h3" fontWeight="bold" sx={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}>
              Empowering Communities Through Microfinance
            </Typography>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }}>
            <Typography variant="h6" mt={2} sx={{ maxWidth: "600px", mx: "auto", textShadow: "1px 1px 3px rgba(0,0,0,0.5)" }}>
              Agar Microfinance provides financial solutions to small businesses and individuals.
            </Typography>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, delay: 1 }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                mt: 3,
                backgroundColor: "#007BFF", // Changed to Blue
                "&:hover": { backgroundColor: "#0056b3" }, // Darker blue on hover
                borderRadius: "30px",
                padding: "10px 30px",
              }}
            >
              Get Started
            </Button>
          </motion.div>
        </Container>
      </Box>

      {/* Other Sections */}
      <About />
      <Services />
      <News />
      <Contact />
    </>
  );
};

export default Home;
