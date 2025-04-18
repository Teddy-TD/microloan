import { Box, Container, Typography, Grid, Card, CardContent } from "@mui/material";
import { FaHandHoldingUsd, FaChartLine, FaShieldAlt, FaFileInvoice } from "react-icons/fa";

const Services = () => {
  const services = [
    { title: "Loan Application", description: "Apply for microloans anytime, anywhere.", icon: <FaHandHoldingUsd /> },
    { title: "Loan Tracking", description: "Easily check your loan status and repayment history.", icon: <FaChartLine /> },
    { title: "Secure Transactions", description: "Your financial data is protected with encryption.", icon: <FaShieldAlt /> },
    { title: "Automated Reports", description: "Generate reports for financial analysis.", icon: <FaFileInvoice /> },
  ];

  return (
    <Box id="services" sx={{ py: 8, backgroundColor: "white" }}>
      <Container>
        <Typography variant="h4" align="center" fontWeight="bold" color="#0D47A1" gutterBottom>
          Our Services
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {services.map((service, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  boxShadow: 4,
                  transition: "0.3s",
                  background: "linear-gradient(to right, #1565C0, #0D47A1)", // Deep blue gradient
                  color: "#FFFFFF",
                  "&:hover": { transform: "scale(1.05)", backgroundColor: "#1976D2" },
                }}
              >
                <CardContent sx={{ textAlign: "center" }}>
                  <Box sx={{ fontSize: 40, mb: 2 }}>{service.icon}</Box>
                  <Typography variant="h6" fontWeight="bold">{service.title}</Typography>
                  <Typography>{service.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Services;
