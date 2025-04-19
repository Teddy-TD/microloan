import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid,
  Tabs,
  Tab,
  Breadcrumbs,
  Link,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  VpnKey as VpnKeyIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { getUserProfile } from '../services/api';
import LoanOfficerProfileView from '../components/LoanOfficerProfileView';
import PasswordUpdate from '../components/PasswordUpdate';

const LoanOfficerProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getUserProfile();
      setProfile(data);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(updatedProfile);
    setNotification({
      open: true,
      message: 'Profile updated successfully',
      severity: 'success'
    });
  };

  const handlePasswordUpdate = () => {
    setNotification({
      open: true,
      message: 'Password updated successfully',
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
        <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
          <PersonIcon sx={{ mr: 0.5 }} fontSize="small" />
          My Profile
        </Typography>
      </Breadcrumbs>

      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          borderRadius: 2,
          mb: 4
        }}
      >
        <Typography variant="h5" component="h1" fontWeight="bold" sx={{ mb: 3 }}>
          My Profile
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {notification.open && (
          <Alert 
            severity={notification.severity} 
            sx={{ mb: 3 }}
            onClose={handleCloseNotification}
          >
            {notification.message}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                aria-label="profile tabs"
              >
                <Tab 
                  icon={<PersonIcon />} 
                  label="Profile Information" 
                  id="profile-tab-0"
                  aria-controls="profile-tabpanel-0"
                />
                <Tab 
                  icon={<VpnKeyIcon />} 
                  label="Change Password" 
                  id="profile-tab-1"
                  aria-controls="profile-tabpanel-1"
                />
              </Tabs>
            </Box>

            <Box
              role="tabpanel"
              hidden={tabValue !== 0}
              id="profile-tabpanel-0"
              aria-labelledby="profile-tab-0"
            >
              {tabValue === 0 && profile && (
                <LoanOfficerProfileView 
                  profile={profile} 
                  onProfileUpdate={handleProfileUpdate}
                />
              )}
            </Box>

            <Box
              role="tabpanel"
              hidden={tabValue !== 1}
              id="profile-tabpanel-1"
              aria-labelledby="profile-tab-1"
            >
              {tabValue === 1 && (
                <PasswordUpdate 
                  onPasswordUpdate={handlePasswordUpdate}
                />
              )}
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default LoanOfficerProfilePage;
