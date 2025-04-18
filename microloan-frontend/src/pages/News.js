import { useState } from "react";
import { Box, Container, Typography, Card, CardContent, Button } from "@mui/material";
import { motion } from "framer-motion";

const newsData = [
  { 
    title: "New Loan Features Added", 
    date: "March 10, 2025", 
    shortDescription: "We have introduced flexible loan plans with lower interest rates.",
    fullDescription: "We are offering extended repayment terms and customized loan packages to better suit our clients' needs. Check out our latest offerings on the Loans page."
  },
  { 
    title: "Security Update", 
    date: "March 5, 2025", 
    shortDescription: "Our system now includes multi-factor authentication for enhanced security.",
    fullDescription: "Multi-factor authentication adds an extra layer of protection to your account, reducing the risk of unauthorized access. We recommend enabling it in your settings."
  },
  { 
    title: "Partnership Announcement", 
    date: "March 1, 2025", 
    shortDescription: "We are partnering with more financial institutions to expand loan accessibility.",
    fullDescription: "Through these partnerships, we aim to provide more financing options and better interest rates for our customers. Stay tuned for more updates."
  }
];

const News = () => {
  const [expandedIndex, setExpandedIndex] = useState(null); // Track expanded news item

  return (
    <Box id="news" sx={{ py: 10, backgroundColor: "white", textAlign: "center", color: "#6495ed" }}>
      <Container>
        <Typography variant="h4" fontWeight="bold" color="#0D47A1" gutterBottom>
          Latest News
        </Typography>
        {newsData.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <Card 
              sx={{ 
                my: 3, 
                p: 2, 
                borderRadius: 3, 
                boxShadow: 4, 
                background: "linear-gradient(to right, #b0c4de, #4682b4)", 
                color: "white"
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold" color="inherit">
                  {item.title}
                </Typography>
                <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                  {item.date}
                </Typography>
                <Typography variant="body1" mt={1}>
                  {expandedIndex === index ? item.fullDescription : item.shortDescription}
                </Typography>

                {/* Read More / Read Less Button */}
                <Button 
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                  sx={{ 
                    mt: 2, 
                    color: "#0D47A1", 
                    fontWeight: "bold", 
                    textTransform: "none", 
                    backgroundColor: "white", 
                    "&:hover": { backgroundColor: "#BBDEFB" } 
                  }}
                >
                  {expandedIndex === index ? "Read Less" : "Read More"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Container>
    </Box>
  );
};

export default News;
