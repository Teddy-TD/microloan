import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Tabs, 
  Tab 
} from '@mui/material';
import LoanRepaymentForm from '../components/LoanRepaymentForm';
import TransactionHistory from '../components/TransactionHistory';

const LoanRepaymentPage = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ py: 4, backgroundColor: "#F5F7FA", minHeight: "100vh" }}>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Typography variant="h4" fontWeight="bold" color="#1E3A8A" sx={{ mb: 3 }}>
            Loan Repayments
          </Typography>

          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Make a Payment" />
            <Tab label="Transaction History" />
          </Tabs>

          {/* Make a Payment Tab */}
          {tabValue === 0 && (
            <LoanRepaymentForm />
          )}

          {/* Transaction History Tab */}
          {tabValue === 1 && (
            <TransactionHistory />
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default LoanRepaymentPage;
