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
  ListItemText,
  Paper
} from '@mui/material';
import { 
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Notes as NotesIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { updateClient } from '../services/api';

const ClientProfileDetail = ({ 
  client, 
  loading, 
  error, 
  onClientUpdate 
}) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: client?.name || '',
    email: client?.email || '',
    phone: client?.phone || '',
    address: {
      street: client?.address?.street || '',
      city: client?.address?.city || '',
      region: client?.address?.region || '',
      postalCode: client?.address?.postalCode || ''
    },
    reviewNotes: client?.reviewNotes || ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Update form data when client data changes
  React.useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || '',
        email: client.email || '',
        phone: client.phone || '',
        address: {
          street: client.address?.street || '',
          city: client.address?.city || '',
          region: client.address?.region || '',
          postalCode: client.address?.postalCode || ''
        },
        reviewNotes: client.reviewNotes || ''
      });
    }
  }, [client]);

  const handleEditToggle = () => {
    if (editMode) {
      // Reset form data when canceling edit
      setFormData({
        name: client?.name || '',
        email: client?.email || '',
        phone: client?.phone || '',
        address: {
          street: client?.address?.street || '',
          city: client?.address?.city || '',
          region: client?.address?.region || '',
          postalCode: client?.address?.postalCode || ''
        },
        reviewNotes: client?.reviewNotes || ''
      });
      setFormErrors({});
    }
    setEditMode(!editMode);
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
    
    // Clear field-specific error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (formData.reviewNotes && formData.reviewNotes.length < 2) {
      errors.reviewNotes = 'Review notes must be at least 2 characters long';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      const updatedClient = await updateClient(client._id, formData);
      setEditMode(false);
      onClientUpdate(updatedClient.client);
    } catch (err) {
      console.error('Error updating client profile:', err);
      setFormErrors({ 
        submit: err.message || 'Failed to update client profile' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return format(new Date(dateString), 'MMM dd, yyyy h:mm a');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        Error loading client profile: {error}
      </Alert>
    );
  }

  if (!client) {
    return (
      <Alert severity="info" sx={{ my: 2 }}>
        No client profile found
      </Alert>
    );
  }

  return (
    <Box>
      {formErrors.submit && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {formErrors.submit}
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
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              onClick={handleSubmit}
              disabled={submitting}
            >
              Save Changes
            </Button>
          </Box>
        )}
      </Box>

      {!editMode ? (
        // Read-only view
        <Grid container spacing={3}>
          {/* Client Information */}
          <Grid item xs={12} md={6}>
            <Card sx={{ mb: 3, height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Client Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Full Name" 
                      secondary={client.name || 'Not provided'} 
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <EmailIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Email Address" 
                      secondary={client.email || 'Not provided'} 
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <PhoneIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Phone Number" 
                      secondary={client.phone || 'Not provided'} 
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Address Information */}
          <Grid item xs={12} md={6}>
            <Card sx={{ mb: 3, height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
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
                      secondary={client.address?.street || 'Not provided'} 
                    />
                  </ListItem>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <ListItem>
                        <ListItemText 
                          primary="City" 
                          secondary={client.address?.city || 'Not provided'} 
                        />
                      </ListItem>
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <ListItem>
                        <ListItemText 
                          primary="Region/State" 
                          secondary={client.address?.region || 'Not provided'} 
                        />
                      </ListItem>
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <ListItem>
                        <ListItemText 
                          primary="Postal Code" 
                          secondary={client.address?.postalCode || 'Not provided'} 
                        />
                      </ListItem>
                    </Grid>
                  </Grid>
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Review Information */}
          <Grid item xs={12}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Review Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, backgroundColor: '#f9f9f9' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <HistoryIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="subtitle1">
                          Account Created
                        </Typography>
                      </Box>
                      <Typography variant="body2">
                        {formatDate(client.createdAt)}
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, backgroundColor: '#f9f9f9' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <HistoryIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="subtitle1">
                          Last Updated
                        </Typography>
                      </Box>
                      <Typography variant="body2">
                        {formatDate(client.updatedAt)}
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, backgroundColor: '#f9f9f9' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <HistoryIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="subtitle1">
                          Last Reviewed
                        </Typography>
                      </Box>
                      <Typography variant="body2">
                        {formatDate(client.lastReviewedAt)}
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, backgroundColor: '#f9f9f9' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="subtitle1">
                          Last Reviewed By
                        </Typography>
                      </Box>
                      <Typography variant="body2">
                        {client.lastReviewedBy ? client.lastReviewedBy.name : 'Never reviewed'}
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Paper sx={{ p: 2, backgroundColor: '#f9f9f9' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <NotesIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="subtitle1">
                          Review Notes
                        </Typography>
                      </Box>
                      <Typography variant="body2">
                        {client.reviewNotes || 'No review notes available'}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        // Edit form
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Client Information */}
            <Grid item xs={12} md={6}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Client Information
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
                        error={!!formErrors.name}
                        helperText={formErrors.name}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        required
                        error={!!formErrors.email}
                        helperText={formErrors.email}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Address Information */}
            <Grid item xs={12} md={6}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
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
            </Grid>
            
            {/* Review Notes */}
            <Grid item xs={12}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Review Notes
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <TextField
                    label="Review Notes"
                    name="reviewNotes"
                    value={formData.reviewNotes}
                    onChange={handleInputChange}
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                    placeholder="Add notes about this client (optional)"
                    error={!!formErrors.reviewNotes}
                    helperText={formErrors.reviewNotes}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </form>
      )}
    </Box>
  );
};

export default ClientProfileDetail;
