import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  CircularProgress,
  Alert
} from '@mui/material';
import { getClientBalances } from '../services/api';
import BalanceSummary from '../components/BalanceSummary';

const BalancePage = () => {
  const [balanceData, setBalanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBalanceData = async () => {
      try {
        setLoading(true);
        const data = await getClientBalances();
        setBalanceData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching balance data:', err);
        setError(err.message || 'Failed to load balance information');
      } finally {
        setLoading(false);
      }
    };

    fetchBalanceData();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          borderRadius: 2,
          background: 'linear-gradient(to right, #f5f7fa, #ffffff)'
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            color: '#1a237e',
            mb: 3
          }}
        >
          Account Balance
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <BalanceSummary balanceData={balanceData} loading={loading} />
        )}
      </Paper>
    </Container>
  );
};

export default BalancePage;
