import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { getSavingsDetails, updateSavingsDetails } from '../services/api';
import { useNavigate } from 'react-router-dom';

const SavingsPage = () => {
  const [savings, setSavings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [balanceInput, setBalanceInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSavings = async () => {
      try {
        const data = await getSavingsDetails();
        setSavings(data.savingsAccount);
        setBalanceInput(data.savingsAccount.balance.toString());
        setError(null);
      } catch (err) {
        console.error('Error fetching savings details:', err);
        setError(err.message || 'Failed to load savings');
      } finally {
        setLoading(false);
      }
    };
    fetchSavings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const amount = parseFloat(balanceInput);
      const updated = await updateSavingsDetails(amount);
      setSavings({ ...savings, balance: updated.balance, transactions: updated.transactions });
      setSuccess('Savings updated successfully');
    } catch (err) {
      console.error('Error updating savings:', err);
      setError(err.message || 'Failed to update savings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          My Savings
        </Typography>
        <Button variant="text" onClick={() => navigate('/client-dashboard')} sx={{ mb: 2 }}>
          Back to Dashboard
        </Button>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            <TextField
              label="Balance"
              type="number"
              value={balanceInput}
              onChange={e => setBalanceInput(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <Button variant="contained" color="primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default SavingsPage;
