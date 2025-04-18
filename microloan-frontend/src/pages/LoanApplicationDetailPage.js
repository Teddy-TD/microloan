import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Alert,
  Button,
  Breadcrumbs,
  Link,
  Snackbar
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  ArrowBack as ArrowBackIcon,
  List as ListIcon
} from '@mui/icons-material';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import LoanApplicationDetail from '../components/LoanApplicationDetail';
import { getApplicationById, processApplication } from '../services/api';

const LoanApplicationDetailPage = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchApplicationDetails();
  }, [applicationId]);

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getApplicationById(applicationId);
      setApplication(data);
    } catch (err) {
      console.error('Error fetching application details:', err);
      setError(err.message || 'Failed to load application details');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (applicationId, approvalData) => {
    try {
      await processApplication(applicationId, {
        status: 'approved',
        approvedAmount: approvalData.approvedAmount,
        repaymentSchedule: approvalData.repaymentSchedule,
        reviewNotes: approvalData.reviewNotes
      });
      
      setNotification({
        open: true,
        message: 'Loan application approved successfully',
        severity: 'success'
      });
      
      // Refresh application data
      fetchApplicationDetails();
    } catch (err) {
      console.error('Error approving application:', err);
      throw err;
    }
  };

  const handleReject = async (applicationId, reviewNotes) => {
    try {
      await processApplication(applicationId, {
        status: 'rejected',
        reviewNotes
      });
      
      setNotification({
        open: true,
        message: 'Loan application rejected',
        severity: 'info'
      });
      
      // Refresh application data
      fetchApplicationDetails();
    } catch (err) {
      console.error('Error rejecting application:', err);
      throw err;
    }
  };

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link 
          component={RouterLink} 
          to="/loan-officer-dashboard" 
          underline="hover" 
          color="inherit"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <DashboardIcon sx={{ mr: 0.5 }} fontSize="small" />
          Dashboard
        </Link>
        <Link 
          component={RouterLink} 
          to="/loan-officer/applications" 
          underline="hover" 
          color="inherit"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <ListIcon sx={{ mr: 0.5 }} fontSize="small" />
          Applications
        </Link>
        <Typography color="text.primary">
          Application Details
        </Typography>
      </Breadcrumbs>

      <Box sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/loan-officer/applications')}
        >
          Back to Applications
        </Button>
      </Box>

      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          borderRadius: 2,
          mb: 4
        }}
      >
        <Typography variant="h5" component="h1" fontWeight="bold" sx={{ mb: 3 }}>
          Loan Application Details
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <LoanApplicationDetail 
          application={application}
          loading={loading}
          error={error}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </Paper>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default LoanApplicationDetailPage;
