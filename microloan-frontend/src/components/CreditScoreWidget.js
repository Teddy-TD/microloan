import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  CircularProgress,
  Button,
  Tooltip,
  Divider
} from '@mui/material';
import { 
  CreditScore as CreditScoreIcon,
  Info as InfoIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const CreditScoreWidget = ({ 
  creditScore = 0, 
  monthlyIncome = 0,
  savingsBalance = 0,
  lastCreditScoreUpdate,
  loading = false 
}) => {
  const navigate = useNavigate();
  
  // Get color based on credit score
  const getScoreColor = (score) => {
    if (score < 20) return '#f44336'; // Poor - Red
    if (score < 40) return '#ff9800'; // Fair - Orange
    if (score < 60) return '#ffc107'; // Good - Yellow
    if (score < 80) return '#4caf50'; // Very Good - Green
    return '#2196f3'; // Excellent - Blue
  };
  
  // Get credit rating based on score
  const getCreditRating = (score) => {
    if (score < 20) return 'Poor';
    if (score < 40) return 'Fair';
    if (score < 60) return 'Good';
    if (score < 80) return 'Very Good';
    return 'Excellent';
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
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Paper>
    );
  }
  
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        borderRadius: 2,
        height: '100%',
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
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <CreditScoreIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" fontWeight="medium">
          Your Credit Score
          <Tooltip title="Your credit score affects your loan eligibility and terms. Higher scores may qualify you for better rates.">
            <InfoIcon fontSize="small" sx={{ ml: 1, color: 'text.secondary', verticalAlign: 'middle' }} />
          </Tooltip>
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Box sx={{ position: 'relative', width: 120, height: 120 }}>
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
              flexDirection: 'column'
            }}
          >
            <Typography variant="h4" component="div" fontWeight="bold">
              {creditScore}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              of 100
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ ml: 3 }}>
          <Typography variant="h5" fontWeight="medium" color={getScoreColor(creditScore)}>
            {getCreditRating(creditScore)}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Last updated: {formatDate(lastCreditScoreUpdate)}
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            <Button 
              variant="outlined" 
              size="small" 
              startIcon={<TrendingUpIcon />}
              onClick={() => navigate('/profile')}
            >
              Improve Score
            </Button>
          </Box>
        </Box>
      </Box>
      
      <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1 }}>
        <Typography variant="subtitle2" gutterBottom>
          Score Factors
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">Monthly Income:</Typography>
          <Typography variant="body2" fontWeight="medium">{formatCurrency(monthlyIncome)}</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">Savings Balance:</Typography>
          <Typography variant="body2" fontWeight="medium">{formatCurrency(savingsBalance)}</Typography>
        </Box>
      </Box>
      
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
        Increase your savings or update your income details to improve your score.
      </Typography>
    </Paper>
  );
};

export default CreditScoreWidget;
