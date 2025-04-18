import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import { submitComplaint } from '../services/api';

const ComplaintForm = ({ onComplaintSubmitted }) => {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate form data
      if (!description.trim()) {
        throw new Error('Please provide a description of your complaint');
      }

      // Submit complaint
      const response = await submitComplaint(description);
      
      // Clear form on success
      setDescription('');
      setSuccess('Your complaint has been submitted successfully. We will review it shortly.');
      
      // Notify parent component if callback provided
      if (onComplaintSubmitted && typeof onComplaintSubmitted === 'function') {
        onComplaintSubmitted(response.complaint);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto', my: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Submit a Complaint
      </Typography>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        If you have any issues or concerns with our services, please let us know by submitting a complaint below.
        Our team will review your complaint and respond as soon as possible.
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
        <TextField
          fullWidth
          required
          multiline
          rows={6}
          label="Complaint Description"
          placeholder="Please describe your issue or complaint in detail..."
          value={description}
          onChange={handleDescriptionChange}
          sx={{ mb: 3 }}
        />
        
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          disabled={loading || !description.trim()}
        >
          {loading ? <CircularProgress size={24} /> : 'Submit Complaint'}
        </Button>
      </Box>
    </Paper>
  );
};

export default ComplaintForm;
