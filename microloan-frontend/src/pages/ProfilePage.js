import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Tabs,
  Tab,
  Divider,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { 
  Person as PersonIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import ProfileView from '../components/ProfileView';
import PasswordUpdate from '../components/PasswordUpdate';
import { getUserProfile } from '../services/api';

const ProfilePage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      const data = await getUserProfile();
      setProfile(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err.message || 'Failed to load profile information');
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
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
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
          My Profile
        </Typography>

        <Divider sx={{ mb: 3 }} />

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
          <>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              sx={{ mb: 3 }}
            >
              <Tab icon={<PersonIcon />} label="Personal Information" />
              <Tab icon={<LockIcon />} label="Change Password" />
            </Tabs>

            {tabValue === 0 && (
              <ProfileView 
                profile={profile} 
                onProfileUpdate={handleProfileUpdate} 
              />
            )}

            {tabValue === 1 && (
              <PasswordUpdate 
                onPasswordUpdate={handlePasswordUpdate} 
              />
            )}
          </>
        )}
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

export default ProfilePage;
