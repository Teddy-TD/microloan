import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Button, 
  TextField,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { updateUserProfile } from '../services/api';

const ProfileView = ({ profile, onProfileUpdate }) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    address: {
      street: profile?.address?.street || '',
      city: profile?.address?.city || '',
      region: profile?.address?.region || '',
      postalCode: profile?.address?.postalCode || ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleEditToggle = () => {
    if (editMode) {
      // Reset form data when canceling edit
      setFormData({
        name: profile?.name || '',
        email: profile?.email || '',
        phone: profile?.phone || '',
        address: {
          street: profile?.address?.street || '',
          city: profile?.address?.city || '',
          region: profile?.address?.region || '',
          postalCode: profile?.address?.postalCode || ''
        }
      });
    }
    setEditMode(!editMode);
    setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested address fields
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const updatedProfile = await updateUserProfile(formData);
      onProfileUpdate(updatedProfile);
      setEditMode(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        {!editMode ? (
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            onClick={handleEditToggle}
          >
            Edit Profile
          </Button>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<CancelIcon />}
              onClick={handleEditToggle}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              onClick={handleSubmit}
              disabled={loading}
            >
              Save Changes
            </Button>
          </Box>
        )}
      </Box>

      {!editMode ? (
        // Read-only view
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Full Name" 
                  secondary={profile?.name || 'Not provided'} 
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <EmailIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Email Address" 
                  secondary={profile?.email || 'Not provided'} 
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <PhoneIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Phone Number" 
                  secondary={profile?.phone || 'Not provided'} 
                />
              </ListItem>
            </List>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Address Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Street Address" 
                  secondary={profile?.address?.street || 'Not provided'} 
                />
              </ListItem>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <ListItem>
                    <ListItemText 
                      primary="City" 
                      secondary={profile?.address?.city || 'Not provided'} 
                    />
                  </ListItem>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <ListItem>
                    <ListItemText 
                      primary="Region/State" 
                      secondary={profile?.address?.region || 'Not provided'} 
                    />
                  </ListItem>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <ListItem>
                    <ListItemText 
                      primary="Postal Code" 
                      secondary={profile?.address?.postalCode || 'Not provided'} 
                    />
                  </ListItem>
                </Grid>
              </Grid>
            </List>
          </CardContent>
        </Card>
      ) : (
        // Edit form
        <form onSubmit={handleSubmit}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    required
                  />
                </Grid>
              </Grid>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Address Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Street Address"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="City"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Region/State"
                    name="address.region"
                    value={formData.address.region}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Postal Code"
                    name="address.postalCode"
                    value={formData.address.postalCode}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </form>
      )}
    </Box>
  );
};

export default ProfileView;
