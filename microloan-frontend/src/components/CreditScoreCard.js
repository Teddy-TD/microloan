import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid,
  Divider,
  CircularProgress,
  Tooltip,
  Paper
} from '@mui/material';
import { 
  CreditScore as CreditScoreIcon,
  AccountBalance as AccountBalanceIcon,
  Savings as SavingsIcon,
  CalendarToday as CalendarIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

const CreditScoreCard = ({ 
  creditScore = 0, 
  creditRating = 'Not Rated',
  monthlyIncome = 0,
  savingsBalance = 0,
  lastCreditScoreUpdate,
  loading = false
}) => {
  
  // Get color based on credit score
  const getScoreColor = (score) => {
    if (score < 20) return '#f44336'; // Poor - Red
    if (score < 40) return '#ff9800'; // Fair - Orange
    if (score < 60) return '#ffc107'; // Good - Yellow
    if (score < 80) return '#4caf50'; // Very Good - Green
    return '#2196f3'; // Excellent - Blue
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return format(new Date(dateString), 'MMM dd, yyyy');
  };
  
  if (loading) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ textAlign: 'center', py: 3 }}>
          <CircularProgress />
          <Typography variant="body2" sx={{ mt: 2 }}>
            Loading credit score information...
          </Typography>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CreditScoreIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6">
            Credit Score
            <Tooltip title="Credit score is calculated based on monthly income and savings balance. Higher scores increase loan approval chances.">
              <InfoIcon fontSize="small" sx={{ ml: 1, color: 'text.secondary', verticalAlign: 'middle' }} />
            </Tooltip>
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        
        <Grid container spacing={3}>
          {/* Credit Score Display */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                textAlign: 'center',
                borderRadius: 2,
                position: 'relative',
                overflow: 'hidden',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '5px',
                  backgroundColor: getScoreColor(creditScore)
                }
              }}
            >
              <Box sx={{ position: 'relative', width: 120, height: 120, margin: '0 auto', mb: 2 }}>
                <CircularProgress 
                  variant="determinate" 
                  value={100} 
                  size={120} 
                  thickness={4} 
                  sx={{ color: 'grey.200', position: 'absolute', top: 0, left: 0 }} 
                />
                <CircularProgress 
                  variant="determinate" 
                  value={creditScore} 
                  size={120} 
                  thickness={4} 
                  sx={{ color: getScoreColor(creditScore), position: 'absolute', top: 0, left: 0 }} 
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {creditScore}
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="h6" gutterBottom>
                {creditRating}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CalendarIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  Last updated: {formatDate(lastCreditScoreUpdate)}
                </Typography>
              </Box>
            </Paper>
          </Grid>
          
          {/* Score Factors */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom fontWeight="medium">
              Score Factors
            </Typography>
            
            <Box sx={{ mb: 2, mt: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccountBalanceIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="body2">Monthly Income</Typography>
                </Box>
                <Typography variant="body2" fontWeight="medium">
                  {formatCurrency(monthlyIncome)}
                </Typography>
              </Box>
              <LinearProgressWithLabel 
                value={Math.min(monthlyIncome / 50, 100)} 
                color="#4caf50" 
              />
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SavingsIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="body2">Savings Balance</Typography>
                </Box>
                <Typography variant="body2" fontWeight="medium">
                  {formatCurrency(savingsBalance)}
                </Typography>
              </Box>
              <LinearProgressWithLabel 
                value={Math.min(savingsBalance / 50, 100)} 
                color="#2196f3" 
              />
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 3, fontStyle: 'italic' }}>
              Your credit score is calculated based on your monthly income and savings balance. 
              Increasing either factor will improve your score and loan eligibility.
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

// Custom linear progress with label
const LinearProgressWithLabel = ({ value, color }) => {
  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <Box 
          sx={{ 
            width: '100%',
            height: 8,
            borderRadius: 5,
            backgroundColor: 'rgba(0,0,0,0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              width: `${value}%`,
              height: '100%',
              borderRadius: 5,
              backgroundColor: color,
              transition: 'width 0.5s ease-in-out'
            }}
          />
        </Box>
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(value)}%`}</Typography>
      </Box>
    </Box>
  );
};

export default CreditScoreCard;
