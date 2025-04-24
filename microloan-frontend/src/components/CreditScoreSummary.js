import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Divider, 
  CircularProgress,
  Tooltip,
  Paper
} from '@mui/material';
import { 
  CreditScore as CreditScoreIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

const CreditScoreSummary = ({ 
  creditScore = 0, 
  creditRating = 'Not Rated',
  monthlyIncome = 0,
  savingsBalance = 0,
  lastCreditScoreUpdate,
  compact = false
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
  
  return (
    <Card sx={{ mb: compact ? 0 : 3 }}>
      <CardContent sx={{ p: compact ? 2 : 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CreditScoreIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant={compact ? "subtitle1" : "h6"} fontWeight="medium">
            Credit Score
            <Tooltip title="Credit score is calculated based on monthly income and savings balance">
              <InfoIcon fontSize="small" sx={{ ml: 1, color: 'text.secondary', verticalAlign: 'middle' }} />
            </Tooltip>
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ display: 'flex', flexDirection: compact ? 'row' : 'column', alignItems: compact ? 'center' : 'flex-start' }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            mb: compact ? 0 : 2,
            mr: compact ? 3 : 0
          }}>
            <Box sx={{ position: 'relative', width: compact ? 80 : 100, height: compact ? 80 : 100 }}>
              <CircularProgress 
                variant="determinate" 
                value={100} 
                size={compact ? 80 : 100} 
                thickness={4} 
                sx={{ color: 'grey.200', position: 'absolute', top: 0, left: 0 }} 
              />
              <CircularProgress 
                variant="determinate" 
                value={creditScore} 
                size={compact ? 80 : 100} 
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
                <Typography variant={compact ? "h5" : "h4"} component="div" fontWeight="bold">
                  {creditScore}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  of 100
                </Typography>
              </Box>
            </Box>
            
            <Typography variant={compact ? "subtitle1" : "h6"} sx={{ mt: 1 }} color={getScoreColor(creditScore)}>
              {creditRating}
            </Typography>
          </Box>
          
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">Monthly Income:</Typography>
              <Typography variant="body2" fontWeight="medium">{formatCurrency(monthlyIncome)}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">Savings Balance:</Typography>
              <Typography variant="body2" fontWeight="medium">{formatCurrency(savingsBalance)}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">Last Updated:</Typography>
              <Typography variant="body2">{formatDate(lastCreditScoreUpdate)}</Typography>
            </Box>
          </Box>
        </Box>
        
        {!compact && (
          <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              This credit score is calculated based on the client's monthly income and savings balance.
              A higher score indicates a lower risk borrower.
            </Typography>
          </Paper>
        )}
      </CardContent>
    </Card>
  );
};

export default CreditScoreSummary;
