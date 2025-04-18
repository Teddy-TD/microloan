import { Box, Container, Typography, TextField, Button, Grid, IconButton } from "@mui/material";
import { motion } from "framer-motion";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa"; // Import icons

const Contact  = () => {
  return (
    <Box id="contact" sx={{ py: 10, backgroundColor: "white", color: "#0D47A1" }}>
      <Container>
        <Grid container spacing={6} alignItems="center">
          
          {/* Left Side: Contact Form */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <Typography variant="h4" fontWeight="bold">
                Contact Us
              </Typography>
              <Typography variant="h6" mt={2} sx={{ maxWidth: "600px" }}>
                Have any questions? Reach out to us, and we’ll be happy to assist you.
              </Typography>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }} 
              whileInView={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 1, delay: 0.5 }}
            >
              <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 2, maxWidth: "500px" }}>
                <TextField label="Your Name" variant="outlined" fullWidth />
                <TextField label="Your Email" variant="outlined" fullWidth />
                <TextField label="Message" variant="outlined" fullWidth multiline rows={4} />
                <Button 
                  variant="contained" 
                  size="large" 
                  sx={{ 
                    mt: 2, 
                    background: "linear-gradient(to right, #1565C0, #0D47A1)", 
                    color: "white",
                    "&:hover": { background: "#0D47A1" } 
                  }}
                >
                  Send Message
                </Button>
              </Box>
            </motion.div>
          </Grid>

          {/* Right Side: Locations & Social Media */}
          <Grid item xs={12} md={6}>
            <motion.div 
              initial={{ opacity: 0, x: 50 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              transition={{ duration: 1, delay: 0.3 }}
            >
              {/* Location Details */}
              <Typography variant="h5" fontWeight="bold">
                Our Locations
              </Typography>
              <Typography mt={1} display="flex" alignItems="center">
                <FaMapMarkerAlt style={{ marginRight: 10, color: "#1565C0" }} /> Wolkite, Ethiopia
              </Typography>
              <Typography mt={1} display="flex" alignItems="center">
                <FaPhone style={{ marginRight: 10, color: "#1565C0" }} /> +251-916-862-672
              </Typography>
              <Typography mt={1} display="flex" alignItems="center">
                <FaEnvelope style={{ marginRight: 10, color: "#1565C0" }} /> contact@agarmicrofinance.com
              </Typography>

              {/* Social Media Links */}
              <Box mt={3}>
                <Typography variant="h6" fontWeight="bold">Follow Us</Typography>
                <Box mt={1} display="flex" gap={2}>
                  <IconButton sx={{ color: "#1565C0", "&:hover": { color: "#0D47A1" } }}><FaFacebook size={28} /></IconButton>
                  <IconButton sx={{ color: "#1565C0", "&:hover": { color: "#0D47A1" } }}><FaTwitter size={28} /></IconButton>
                  <IconButton sx={{ color: "#1565C0", "&:hover": { color: "#0D47A1" } }}><FaInstagram size={28} /></IconButton>
                  <IconButton sx={{ color: "#1565C0", "&:hover": { color: "#0D47A1" } }}><FaLinkedin size={28} /></IconButton>
                </Box>
              </Box>
            </motion.div>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
};

export default Contact;
