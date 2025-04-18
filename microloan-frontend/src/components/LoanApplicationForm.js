import React, { useState } from 'react';
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
  CircularProgress
} from '@mui/material';
import { applyForLoan } from '../services/api';

const LoanApplicationForm = () => {
  const [formData, setFormData] = useState({
    amount: '',
    duration: '',
    purpose: '',
    documents: []
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fileNames, setFileNames] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({
      ...formData,
      documents: files
    });
    setFileNames(files.map(file => file.name));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate form data
      if (!formData.amount || formData.amount < 1000) {
        throw new Error('Loan amount must be at least 1000');
      }
      if (!formData.duration) {
        throw new Error('Loan duration is required');
      }
      if (!formData.purpose) {
        throw new Error('Loan purpose is required');
      }

      // Create FormData object to handle file uploads
      const data = new FormData();
      data.append('amount', formData.amount);
      data.append('duration', formData.duration);
      data.append('purpose', formData.purpose);
      
      // Append each document to the FormData
      formData.documents.forEach(file => {
        data.append('documents', file);
      });

      // Submit loan application
      const response = await applyForLoan(data);
      
      // Clear form on success
      setFormData({
        amount: '',
        duration: '',
        purpose: '',
        documents: []
      });
      setFileNames([]);
      setSuccess('Loan application submitted successfully!');
    } catch (err) {
      setError(err.message || 'Failed to submit loan application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const purposeOptions = [
    'Business Expansion',
    'Education',
    'Home Improvement',
    'Medical Expenses',
    'Debt Consolidation',
    'Personal',
    'Other'
  ];

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto', my: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Loan Application
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
      
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="Loan Amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">Birr</InputAdornment>,
              }}
              helperText="Minimum amount: 1000 Birr"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="Loan Duration (months)"
              name="duration"
              type="number"
              value={formData.duration}
              onChange={handleChange}
              InputProps={{
                endAdornment: <InputAdornment position="end">months</InputAdornment>,
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Loan Purpose</InputLabel>
              <Select
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                label="Loan Purpose"
              >
                {purposeOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ p: 1.5 }}
            >
              Upload Supporting Documents (PDF/JPG)
              <input
                type="file"
                hidden
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
            </Button>
            
            {fileNames.length > 0 && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Selected files:
                </Typography>
                {fileNames.map((name, index) => (
                  <Typography key={index} variant="body2" sx={{ ml: 1 }}>
                    • {name}
                  </Typography>
                ))}
              </Box>
            )}
          </Grid>
          
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Submit Application'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default LoanApplicationForm;
