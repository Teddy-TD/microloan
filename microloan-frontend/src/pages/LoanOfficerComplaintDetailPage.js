import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  TextField,
  Alert,
  CircularProgress
} from '@mui/material';
import { getAssignedComplaintById, resolveAssignedComplaint } from '../services/api';

const LoanOfficerComplaintDetailPage = () => {
  const { complaintId } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchComplaint();
  }, [complaintId]);

  const fetchComplaint = async () => {
    try {
      setLoading(true);
      const data = await getAssignedComplaintById(complaintId);
      setComplaint(data);
      setNotes(data.officerNotes || '');
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load complaint');
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async () => {
    try {
      setLoading(true);
      await resolveAssignedComplaint(complaintId, notes);
      setSuccess('Complaint resolved successfully');
      fetchComplaint();
    } catch (err) {
      setError(err.message || 'Failed to resolve complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Button onClick={() => navigate(-1)} sx={{ mb: 2 }}>&lt; Back</Button>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>Complaint Details</Typography>
          <Typography><strong>ID:</strong> {complaint.complaintId}</Typography>
          <Typography><strong>Client:</strong> {complaint.clientName}</Typography>
          <Typography><strong>Description:</strong> {complaint.description}</Typography>
          <Typography><strong>Status:</strong> {complaint.status}</Typography>
          <Typography><strong>Submitted:</strong> {new Date(complaint.submittedAt).toLocaleString()}</Typography>
          {complaint.resolvedAt && (
            <Typography><strong>Resolved:</strong> {new Date(complaint.resolvedAt).toLocaleString()}</Typography>
          )}
          <Typography sx={{ mt: 1 }}><strong>Admin Notes:</strong> {complaint.adminNotes}</Typography>
          <Typography sx={{ mt: 1 }}><strong>Your Notes:</strong> {complaint.officerNotes}</Typography>

          {complaint.status !== 'resolved' && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>Resolve Complaint</Typography>
              {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
              <TextField
                label="Officer Notes"
                fullWidth
                multiline
                minRows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button variant="contained" color="primary" onClick={handleResolve}>
                Resolve
              </Button>
            </Box>
          )}
        </Paper>
      )}
    </Container>
  );
};

export default LoanOfficerComplaintDetailPage;
