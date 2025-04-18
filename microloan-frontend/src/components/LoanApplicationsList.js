import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { getClientLoans } from '../services/api';

const LoanApplicationsList = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const data = await getClientLoans();
        setLoans(data);
      } catch (err) {
        setError('Failed to load loan applications. Please try again later.');
        console.error('Error fetching loans:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'warning';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

  if (loans.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 3, my: 2 }}>
        <Typography variant="body1" align="center">
          You haven't submitted any loan applications yet.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, my: 3 }}>
      <Typography variant="h6" gutterBottom>
        My Loan Applications
      </Typography>
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Application Date</TableCell>
              <TableCell>Amount (Birr)</TableCell>
              <TableCell>Duration (Months)</TableCell>
              <TableCell>Purpose</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Updated</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loans.map((loan) => (
              <TableRow key={loan._id}>
                <TableCell>{formatDate(loan.applicationDate)}</TableCell>
                <TableCell>{loan.amount.toLocaleString()}</TableCell>
                <TableCell>{loan.duration}</TableCell>
                <TableCell>{loan.purpose}</TableCell>
                <TableCell>
                  <Chip 
                    label={loan.status.charAt(0).toUpperCase() + loan.status.slice(1)} 
                    color={getStatusColor(loan.status)} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>{formatDate(loan.updatedAt)}</TableCell>
                <TableCell>
                  <Button 
                    variant="outlined" 
                    size="small"
                    href={`/loans/${loan._id}`}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default LoanApplicationsList;
