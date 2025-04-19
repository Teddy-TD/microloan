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
  People as PeopleIcon,
  Person as PersonIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import ClientProfileDetail from '../components/ClientProfileDetail';
import { getClientById } from '../services/api';

const ClientProfilePage = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchClientDetails();
  }, [clientId]);

  const fetchClientDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getClientById(clientId);
      setClient(data);
    } catch (err) {
      console.error('Error fetching client details:', err);
      setError(err.message || 'Failed to load client details');
    } finally {
      setLoading(false);
    }
  };

  const handleClientUpdate = (updatedClient) => {
    setClient(updatedClient);
    setNotification({
      open: true,
      message: 'Client profile updated successfully',
      severity: 'success'
    });
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
          to="/loan-officer/clients" 
          underline="hover" 
          color="inherit"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <PeopleIcon sx={{ mr: 0.5 }} fontSize="small" />
          Client Profiles
        </Link>
        <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
          <PersonIcon sx={{ mr: 0.5 }} fontSize="small" />
          Client Details
        </Typography>
      </Breadcrumbs>

      <Box sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/loan-officer/clients')}
        >
          Back to Clients
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
          {loading ? 'Loading Client Profile...' : client ? `Client Profile: ${client.name}` : 'Client Profile'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <ClientProfileDetail 
          client={client}
          loading={loading}
          error={error}
          onClientUpdate={handleClientUpdate}
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

export default ClientProfilePage;
