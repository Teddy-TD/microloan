import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Divider, 
  Button,
  Chip,
  Stack
} from '@mui/material';
import { 
  AccountBalance as AccountBalanceIcon,
  Savings as SavingsIcon,
  CalendarToday as CalendarIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const BalanceSummary = ({ balanceData, loading }) => {
  const navigate = useNavigate();
  
  if (loading) {
    return (
      <Card sx={{ mb: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Loading balance information...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (!balanceData) {
    return (
      <Card sx={{ mb: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="error">
            Unable to load balance information
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const { summary, loans, savingsAccount, recentTransactions } = balanceData;
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not scheduled';
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
        Account Summary
      </Typography>
      
      <Grid container spacing={3}>
        {/* Loan Balance Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: '100%', 
            boxShadow: 3, 
            transition: 'transform 0.3s', 
            '&:hover': { transform: 'translateY(-5px)' } 
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountBalanceIcon sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="h6">Loan Balance</Typography>
              </Box>
              <Typography variant="h4" color="text.primary" gutterBottom>
                {formatCurrency(summary.totalLoanBalance)}
              </Typography>
              
              {summary.nextPaymentDue && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <CalendarIcon sx={{ color: 'warning.main', mr: 1, fontSize: '1rem' }} />
                  <Typography variant="body2" color="text.secondary">
                    Next payment due: {formatDate(summary.nextPaymentDue)}
                  </Typography>
                </Box>
              )}
              
              <Button 
                variant="outlined" 
                size="small" 
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/repayment')}
                sx={{ mt: 2 }}
              >
                Make Payment
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Savings Balance Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: '100%', 
            boxShadow: 3, 
            transition: 'transform 0.3s', 
            '&:hover': { transform: 'translateY(-5px)' } 
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SavingsIcon sx={{ color: 'success.main', mr: 1 }} />
                <Typography variant="h6">Savings Balance</Typography>
              </Box>
              <Typography variant="h4" color="text.primary" gutterBottom>
                {formatCurrency(savingsAccount.balance)}
              </Typography>
              
              <Button 
                variant="outlined" 
                size="small" 
                color="success"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/savings')}
                sx={{ mt: 2 }}
              >
                View Savings
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Active Loans Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: '100%', 
            boxShadow: 3, 
            transition: 'transform 0.3s', 
            '&:hover': { transform: 'translateY(-5px)' } 
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Active Loans</Typography>
              
              {loans.length === 0 ? (
                <Typography variant="body1" color="text.secondary">
                  No active loans
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {loans.map((loan) => (
                    <Box key={loan.id}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          {loan.purpose}
                        </Typography>
                        <Chip 
                          label={formatCurrency(loan.balance)} 
                          size="small" 
                          color="primary" 
                          variant="outlined" 
                        />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <CalendarIcon sx={{ color: 'text.secondary', mr: 1, fontSize: '0.8rem' }} />
                        <Typography variant="caption" color="text.secondary">
                          Next payment: {formatDate(loan.nextPaymentDue)}
                        </Typography>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                    </Box>
                  ))}
                </Stack>
              )}
              
              <Button 
                variant="outlined" 
                size="small"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/client-dashboard')}
                sx={{ mt: 1 }}
              >
                View All Loans
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Recent Transactions */}
      <Card sx={{ mt: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Transactions
          </Typography>
          
          {recentTransactions && recentTransactions.length > 0 ? (
            <Box>
              {recentTransactions.map((transaction) => (
                <Box key={transaction.id} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body1">
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      color={transaction.type === 'repayment' ? 'error.main' : 'success.main'}
                    >
                      {transaction.type === 'repayment' ? '-' : '+'}{formatCurrency(transaction.amount)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(transaction.date)}
                    </Typography>
                    <Chip 
                      label={transaction.status} 
                      size="small" 
                      color={transaction.status === 'completed' ? 'success' : 'warning'} 
                      variant="outlined" 
                    />
                  </Box>
                  <Divider sx={{ mt: 1 }} />
                </Box>
              ))}
              
              <Button 
                variant="text" 
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/transactions')}
                sx={{ mt: 1 }}
              >
                View All Transactions
              </Button>
            </Box>
          ) : (
            <Typography variant="body1" color="text.secondary">
              No recent transactions
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default BalanceSummary;
