import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  Grid,
  Chip,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Check as CheckIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { 
  getAdminComplaintById, 
  updateAdminComplaintStatus, 
  assignComplaint, 
  resolveComplaint,
  getLoanOfficers
} from '../services/api';

const AdminComplaintDetail = ({ complaintId }) => {
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loanOfficers, setLoanOfficers] = useState([]);
  
  // Dialog states
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [openResolveDialog, setOpenResolveDialog] = useState(false);
  
  // Form states
  const [assignForm, setAssignForm] = useState({
    assignedTo: ''
  });
  const [statusForm, setStatusForm] = useState({
    status: '',
    assignedTo: ''
  });
  const [resolveForm, setResolveForm] = useState({
    adminNotes: ''
  });
  
  // Success message state
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchComplaintDetails();
    fetchLoanOfficers();
  }, [complaintId]);

  const fetchComplaintDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminComplaintById(complaintId);
      setComplaint(data);
    } catch (err) {
      console.error('Error fetching complaint details:', err);
      setError(err.message || 'Failed to load complaint details');
    } finally {
      setLoading(false);
    }
  };

  const fetchLoanOfficers = async () => {
    try {
      const data = await getLoanOfficers();
      setLoanOfficers(data);
    } catch (err) {
      console.error('Error fetching loan officers:', err);
    }
  };

  const handleOpenAssignDialog = () => {
    setAssignForm({
      assignedTo: complaint?.assignedTo?.id || ''
    });
    setOpenAssignDialog(true);
  };

  const handleCloseAssignDialog = () => {
    setOpenAssignDialog(false);
  };

  const handleAssignInputChange = (e) => {
    setAssignForm({
      ...assignForm,
      [e.target.name]: e.target.value
    });
  };

  const handleAssignComplaint = async () => {
    try {
      setLoading(true);
      await assignComplaint(complaintId, assignForm.assignedTo);
      setSuccessMessage('Complaint assigned successfully');
      handleCloseAssignDialog();
      fetchComplaintDetails();
    } catch (err) {
      setError(err.message || 'Failed to assign complaint');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenStatusDialog = () => {
    setStatusForm({
      status: complaint?.status || '',
      assignedTo: complaint?.assignedTo?.id || ''
    });
    setOpenStatusDialog(true);
  };

  const handleCloseStatusDialog = () => {
    setOpenStatusDialog(false);
  };

  const handleStatusInputChange = (e) => {
    setStatusForm({
      ...statusForm,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateStatus = async () => {
    try {
      setLoading(true);
      await updateAdminComplaintStatus(complaintId, statusForm);
      setSuccessMessage('Status updated successfully');
      handleCloseStatusDialog();
      fetchComplaintDetails();
    } catch (err) {
      setError(err.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenResolveDialog = () => {
    setResolveForm({
      adminNotes: complaint?.adminNotes || ''
    });
    setOpenResolveDialog(true);
  };

  const handleCloseResolveDialog = () => {
    setOpenResolveDialog(false);
  };

  const handleResolveInputChange = (e) => {
    setResolveForm({
      ...resolveForm,
      [e.target.name]: e.target.value
    });
  };

  const handleResolveComplaint = async () => {
    try {
      setLoading(true);
      await resolveComplaint(complaintId, resolveForm.adminNotes);
      setSuccessMessage('Complaint resolved successfully');
      handleCloseResolveDialog();
      fetchComplaintDetails();
    } catch (err) {
      setError(err.message || 'Failed to resolve complaint');
    } finally {
      setLoading(false);
    }
  };

  const clearSuccessMessage = () => {
    setSuccessMessage('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'warning';
      case 'assigned':
        return 'info';
      case 'resolved':
        return 'success';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  if (loading && !complaint) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !complaint) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!complaint) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        No complaint found with the provided ID.
      </Alert>
    );
  }

  return (
    <Box>
      {successMessage && (
        <Alert 
          severity="success" 
          sx={{ mb: 3 }}
          onClose={clearSuccessMessage}
        >
          {successMessage}
        </Alert>
      )}
      
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}
      
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" fontWeight="bold">
            Complaint Details
          </Typography>
          <Chip 
            label={complaint.status} 
            color={getStatusColor(complaint.status)} 
          />
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight="bold">
              Complaint ID
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {complaint.complaintId}
            </Typography>
            
            <Typography variant="subtitle1" fontWeight="bold">
              Submitted At
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {formatDate(complaint.submittedAt)}
            </Typography>
            
            {complaint.resolvedAt && (
              <>
                <Typography variant="subtitle1" fontWeight="bold">
                  Resolved At
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {formatDate(complaint.resolvedAt)}
                </Typography>
              </>
            )}
            
            {complaint.assignedTo && (
              <>
                <Typography variant="subtitle1" fontWeight="bold">
                  Assigned To
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {complaint.assignedTo.name} ({complaint.assignedTo.email})
                </Typography>
              </>
            )}
            
            {complaint.adminHandledBy && (
              <>
                <Typography variant="subtitle1" fontWeight="bold">
                  Handled By
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {complaint.adminHandledBy.name} ({complaint.adminHandledBy.email})
                </Typography>
              </>
            )}
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight="bold">
              Client Information
            </Typography>
            <Typography variant="body1">
              {complaint.clientName}
            </Typography>
            <Typography variant="body1">
              {complaint.clientEmail}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {complaint.clientPhone || 'No phone provided'}
            </Typography>
            
            <Typography variant="subtitle1" fontWeight="bold">
              Description
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, mb: 2, backgroundColor: '#f9f9f9' }}>
              <Typography variant="body1">
                {complaint.description}
              </Typography>
            </Paper>
            
            {complaint.adminNotes && (
              <>
                <Typography variant="subtitle1" fontWeight="bold">
                  Admin Notes
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, mb: 2, backgroundColor: '#f5f5f5' }}>
                  <Typography variant="body1">
                    {complaint.adminNotes}
                  </Typography>
                </Paper>
              </>
            )}
            
            {complaint.response && (
              <>
                <Typography variant="subtitle1" fontWeight="bold">
                  Response to Client
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, mb: 2, backgroundColor: '#e8f4fd' }}>
                  <Typography variant="body1">
                    {complaint.response}
                  </Typography>
                </Paper>
              </>
            )}
          </Grid>
        </Grid>
      </Paper>
      
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        {complaint.status !== 'resolved' && (
          <>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<AssignmentIcon />}
              onClick={handleOpenAssignDialog}
              disabled={loading}
            >
              Assign to Loan Officer
            </Button>
            
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<EditIcon />}
              onClick={handleOpenStatusDialog}
              disabled={loading}
            >
              Update Status
            </Button>
            
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckIcon />}
              onClick={handleOpenResolveDialog}
              disabled={loading}
            >
              Resolve Complaint
            </Button>
          </>
        )}
      </Box>
      
      {/* Assign Dialog */}
      <Dialog open={openAssignDialog} onClose={handleCloseAssignDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Assign Complaint to Loan Officer</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Loan Officer</InputLabel>
            <Select
              name="assignedTo"
              value={assignForm.assignedTo}
              onChange={handleAssignInputChange}
              label="Loan Officer"
            >
              <MenuItem value="">
                <em>None (Unassign)</em>
              </MenuItem>
              {loanOfficers.map((officer) => (
                <MenuItem key={officer._id} value={officer._id}>
                  {officer.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAssignDialog}>Cancel</Button>
          <Button 
            onClick={handleAssignComplaint} 
            variant="contained" 
            color="primary"
            disabled={!assignForm.assignedTo}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Status Dialog */}
      <Dialog open={openStatusDialog} onClose={handleCloseStatusDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Update Complaint Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={statusForm.status}
              onChange={handleStatusInputChange}
              label="Status"
            >
              <MenuItem value="open">Open</MenuItem>
              <MenuItem value="assigned">Assigned</MenuItem>
              <MenuItem value="resolved">Resolved</MenuItem>
            </Select>
          </FormControl>
          
          {statusForm.status === 'assigned' && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Assign To</InputLabel>
              <Select
                name="assignedTo"
                value={statusForm.assignedTo}
                onChange={handleStatusInputChange}
                label="Assign To"
              >
                <MenuItem value="">
                  <em>Select a Loan Officer</em>
                </MenuItem>
                {loanOfficers.map((officer) => (
                  <MenuItem key={officer._id} value={officer._id}>
                    {officer.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusDialog}>Cancel</Button>
          <Button 
            onClick={handleUpdateStatus} 
            variant="contained" 
            color="primary"
            disabled={!statusForm.status || (statusForm.status === 'assigned' && !statusForm.assignedTo)}
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Resolve Dialog */}
      <Dialog open={openResolveDialog} onClose={handleCloseResolveDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Resolve Complaint</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Resolving this complaint will mark it as completed and notify the client.
          </Typography>
          
          <TextField
            autoFocus
            margin="dense"
            name="adminNotes"
            label="Admin Notes (Optional)"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={resolveForm.adminNotes}
            onChange={handleResolveInputChange}
            placeholder="Add any notes about how this complaint was resolved"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResolveDialog}>Cancel</Button>
          <Button 
            onClick={handleResolveComplaint} 
            variant="contained" 
            color="success"
          >
            Resolve Complaint
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminComplaintDetail;
