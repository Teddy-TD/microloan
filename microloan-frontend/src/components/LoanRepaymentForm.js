import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import { getClientLoans, processRepayment } from '../services/api';

const LoanRepaymentForm = () => {
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState('');
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingLoans, setFetchingLoans] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const data = await getClientLoans();
        // Filter only approved loans with balance > 0
        const approvedLoans = data.filter(loan => 
          loan.status === 'approved' && loan.balance > 0
        );
        setLoans(approvedLoans);
      } catch (err) {
        setError('Failed to fetch loans. Please try again later.');
        console.error('Error fetching loans:', err);
      } finally {
        setFetchingLoans(false);
      }
    };

    fetchLoans();
  }, []);

  const handleLoanChange = (e) => {
    const loanId = e.target.value;
    setSelectedLoan(loanId);
    
    // Reset amount when loan changes
    setAmount('');
    setError('');
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
    setError('');
  };

  const handleReferenceChange = (e) => {
    setReference(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate form data
      if (!selectedLoan) {
        throw new Error('Please select a loan');
      }
      
      if (!amount || amount <= 0) {
        throw new Error('Please enter a valid payment amount');
      }

      // Get the selected loan object
      const loan = loans.find(loan => loan._id === selectedLoan);
      
      // Validate payment amount against loan balance
      if (Number(amount) > loan.balance) {
        throw new Error(`Payment amount cannot exceed the remaining balance (${loan.balance} Birr)`);
      }

      // Process payment
      const response = await processRepayment(selectedLoan, amount, reference);
      
      // Clear form on success
      setSelectedLoan('');
      setAmount('');
      setReference('');
      
      // Update the loans list to reflect the new balance
      setLoans(prevLoans => 
        prevLoans.map(loan => 
          loan._id === selectedLoan 
            ? { ...loan, balance: response.loan.balance, totalPaid: response.loan.totalPaid }
            : loan
        )
      );
      
      setSuccess('Payment processed successfully!');
    } catch (err) {
      setError(err.message || 'Failed to process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getSelectedLoanDetails = () => {
    if (!selectedLoan) return null;
    return loans.find(loan => loan._id === selectedLoan);
  };

  const selectedLoanDetails = getSelectedLoanDetails();

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto', my: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Loan Repayment
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      
      {fetchingLoans ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : loans.length === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          You don't have any active loans to repay.
        </Alert>
      ) : (
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Select Loan</InputLabel>
                <Select
                  value={selectedLoan}
                  onChange={handleLoanChange}
                  label="Select Loan"
                >
                  {loans.map((loan) => (
                    <MenuItem key={loan._id} value={loan._id}>
                      {loan.purpose} - {loan.amount.toLocaleString()} Birr ({loan.balance.toLocaleString()} Birr remaining)
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {selectedLoanDetails && (
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.paper' }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Loan Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        <strong>Purpose:</strong> {selectedLoanDetails.purpose}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        <strong>Duration:</strong> {selectedLoanDetails.duration} months
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        <strong>Total Amount:</strong> {selectedLoanDetails.amount.toLocaleString()} Birr
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        <strong>Remaining Balance:</strong> {selectedLoanDetails.balance.toLocaleString()} Birr
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        <strong>Total Paid:</strong> {selectedLoanDetails.totalPaid.toLocaleString()} Birr
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        <strong>Status:</strong> {selectedLoanDetails.status.charAt(0).toUpperCase() + selectedLoanDetails.status.slice(1)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            )}
            
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                Payment Information
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Payment Amount"
                type="number"
                value={amount}
                onChange={handleAmountChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Birr</InputAdornment>,
                }}
                helperText={selectedLoanDetails ? `Maximum payment: ${selectedLoanDetails.balance.toLocaleString()} Birr` : ''}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reference Number (Optional)"
                placeholder="Bank transaction ID or reference"
                value={reference}
                onChange={handleReferenceChange}
                helperText="Enter bank transaction ID or other payment reference if available"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={loading || !selectedLoan || !amount}
                sx={{ mt: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Process Payment'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}
    </Paper>
  );
};

export default LoanRepaymentForm;
