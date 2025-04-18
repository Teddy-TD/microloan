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
  CircularProgress,
  Alert,
  TablePagination
} from '@mui/material';
import { getUserTransactions } from '../services/api';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getUserTransactions();
        setTransactions(data);
      } catch (err) {
        setError('Failed to load transaction history. Please try again later.');
        console.error('Error fetching transactions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount) => {
    return amount.toLocaleString() + ' Birr';
  };

  const getStatusColor = (status) => {
    return status === 'completed' ? 'success' : 'warning';
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'repayment':
        return 'Loan Repayment';
      case 'deposit':
        return 'Deposit';
      case 'withdrawal':
        return 'Withdrawal';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
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

  if (transactions.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 3, my: 2 }}>
        <Typography variant="body1" align="center">
          You don't have any transactions yet.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, my: 3 }}>
      <Typography variant="h6" gutterBottom>
        Transaction History
      </Typography>
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Reference</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((transaction) => (
                <TableRow key={transaction._id}>
                  <TableCell>{formatDate(transaction.transactionDate)}</TableCell>
                  <TableCell>{getTypeLabel(transaction.type)}</TableCell>
                  <TableCell>{formatAmount(transaction.amount)}</TableCell>
                  <TableCell>
                    {transaction.reference || '-'}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)} 
                      color={getStatusColor(transaction.status)} 
                      size="small" 
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={transactions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default TransactionHistory;
