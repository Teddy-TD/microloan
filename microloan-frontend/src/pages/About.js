import { Box, Container, Typography, Grid, Card, CardContent, Button } from "@mui/material";
import { FaUsers, FaGlobe, FaHandshake } from "react-icons/fa";
import { useState } from "react";

const About = () => {
  const [readMore, setReadMore] = useState(false);

  const aboutInfo = [
    { 
      title: "Who We Are", 
      description: "Agar Microfinance empowers small businesses & individuals with financial solutions.",
      fullDescription: "Agar Microfinance is dedicated to helping entrepreneurs and individuals with limited access to traditional banking services. Our goal is to provide fair and flexible financial solutions, ensuring that everyone has the opportunity to grow and succeed.",
      icon: <FaUsers />, 
      showReadMore: true 
    },
    { title: "Our Mission", description: "To provide accessible, secure, and reliable microloans to underserved communities.", icon: <FaGlobe /> },
    { title: "Why Choose Us", description: "We prioritize transparency, efficiency, and customer satisfaction.", icon: <FaHandshake /> },
  ];

  return (
    <Box id="about" sx={{ py: 8, backgroundColor: "white", color: "#0D47A1" }}> 
      <Container>
        <Typography variant="h4" align="center" fontWeight="bold" color="#0D47A1" gutterBottom>
          About Us
        </Typography>
        <Typography align="center" sx={{ maxWidth: 700, mx: "auto", mb: 4 }}>
          Agar Microfinance is committed to improving financial access and supporting economic growth.
        </Typography>

        {/* About Info Cards */}
        <Grid container spacing={4} justifyContent="center">
          {aboutInfo.map((info, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                sx={{ 
                  backgroundColor: "white", 
                  color: "#0D47A1", 
                  textAlign: "center", 
                  boxShadow: 3,
                  height: "100%", // Ensures all cards have equal height
                  display: "flex", 
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out", 
                  "&:hover": { transform: "translateY(-10px)", boxShadow: "5px 5px 15px rgba(0,0,0,0.3)", backgroundColor: "#42A5F5", color: "white" } 
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}> {/* Makes content fill the card */}
                  <Box sx={{ fontSize: 40, mb: 2, color: "#0D47A1" }}>{info.icon}</Box>
                  <Typography variant="h6" fontWeight="bold">{info.title}</Typography>
                  <Typography>{info.showReadMore && readMore ? info.fullDescription : info.description}</Typography>
                </CardContent>

                {/* Read More Button */}
                {info.showReadMore && (
                  <Box sx={{ pb: 2, textAlign: "center" }}>
                    <Button 
                      onClick={() => setReadMore(!readMore)} 
                      sx={{ color: "white", fontWeight: "bold", textTransform: "none", backgroundColor: "#0D47A1", "&:hover": { backgroundColor: "#4A1DCB" } }}
                    >
                      {readMore ? "Read Less" : "Read More"}
                    </Button>
                  </Box>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default About;
