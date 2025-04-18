import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Divider, 
  Button,
  Chip,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  FormLabel,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  AttachMoney as AttachMoneyIcon,
  Description as DescriptionIcon,
  CalendarToday as CalendarIcon,
  InsertDriveFile as FileIcon,
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

const LoanApplicationDetail = ({ 
  application, 
  loading, 
  error, 
  onApprove, 
  onReject 
}) => {
  const [decision, setDecision] = useState('');
  const [approvedAmount, setApprovedAmount] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');
  const [repaymentSchedule, setRepaymentSchedule] = useState([{ dueDate: '', amount: '' }]);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Set initial values when application data is loaded
  React.useEffect(() => {
    if (application) {
      setApprovedAmount(application.loanAmount);
    }
  }, [application]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const handleDecisionChange = (event) => {
    setDecision(event.target.value);
    setFormErrors({});
  };

  const handleApprovedAmountChange = (event) => {
    setApprovedAmount(event.target.value);
  };

  const handleReviewNotesChange = (event) => {
    setReviewNotes(event.target.value);
  };

  const handleAddPayment = () => {
    setRepaymentSchedule([...repaymentSchedule, { dueDate: '', amount: '' }]);
  };

  const handleRemovePayment = (index) => {
    const newSchedule = [...repaymentSchedule];
    newSchedule.splice(index, 1);
    setRepaymentSchedule(newSchedule);
  };

  const handleScheduleChange = (index, field, value) => {
    const newSchedule = [...repaymentSchedule];
    newSchedule[index][field] = value;
    setRepaymentSchedule(newSchedule);
  };

  const validateForm = () => {
    const errors = {};

    if (!decision) {
      errors.decision = 'Please select a decision';
    }

    if (decision === 'approved') {
      if (!approvedAmount || parseFloat(approvedAmount) <= 0) {
        errors.approvedAmount = 'Approved amount must be greater than 0';
      }

      // Validate repayment schedule
      let hasScheduleErrors = false;
      let totalAmount = 0;

      repaymentSchedule.forEach((payment, index) => {
        if (!payment.dueDate) {
          errors[`schedule_${index}_date`] = 'Due date is required';
          hasScheduleErrors = true;
        } else {
          const dueDate = new Date(payment.dueDate);
          if (dueDate < new Date()) {
            errors[`schedule_${index}_date`] = 'Due date must be in the future';
            hasScheduleErrors = true;
          }
        }

        if (!payment.amount || parseFloat(payment.amount) <= 0) {
          errors[`schedule_${index}_amount`] = 'Amount must be greater than 0';
          hasScheduleErrors = true;
        } else {
          totalAmount += parseFloat(payment.amount);
        }
      });

      if (hasScheduleErrors) {
        errors.schedule = 'Please fix errors in the repayment schedule';
      } else if (Math.abs(totalAmount - parseFloat(approvedAmount)) > 0.01) {
        errors.schedule = `Total repayment amount (${formatCurrency(totalAmount)}) must equal approved amount (${formatCurrency(approvedAmount)})`;
      }
    } else if (decision === 'rejected') {
      if (!reviewNotes.trim()) {
        errors.reviewNotes = 'Please provide a reason for rejection';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      if (decision === 'approved') {
        await onApprove(application.applicationId, {
          approvedAmount: parseFloat(approvedAmount),
          repaymentSchedule: repaymentSchedule.map(item => ({
            dueDate: item.dueDate,
            amount: parseFloat(item.amount)
          })),
          reviewNotes
        });
      } else {
        await onReject(application.applicationId, reviewNotes);
      }
    } catch (error) {
      console.error('Error processing application:', error);
      setFormErrors({ submit: error.message || 'Failed to process application' });
    } finally {
      setSubmitting(false);
    }
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
        Error loading application details: {error}
      </Alert>
    );
  }

  if (!application) {
    return (
      <Alert severity="info" sx={{ my: 2 }}>
        No application details found
      </Alert>
    );
  }

  return (
    <Box>
      {formErrors.submit && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {formErrors.submit}
        </Alert>
      )}

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
                    primary="Name" 
                    secondary={application.clientName} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Email" 
                    secondary={application.clientEmail} 
                  />
                </ListItem>
                
                {application.clientPhone && (
                  <ListItem>
                    <ListItemIcon>
                      <PhoneIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Phone" 
                      secondary={application.clientPhone} 
                    />
                  </ListItem>
                )}
                
                {application.clientAddress && (
                  <ListItem>
                    <ListItemIcon>
                      <HomeIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Address" 
                      secondary={application.clientAddress} 
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Loan Application Details */}
        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 3, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Loan Application Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <AttachMoneyIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Loan Amount" 
                    secondary={formatCurrency(application.loanAmount)} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <CalendarIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Duration" 
                    secondary={`${application.loanDuration} months`} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <DescriptionIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Purpose" 
                    secondary={application.purpose} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <CalendarIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Application Date" 
                    secondary={formatDate(application.applicationDate)} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemText 
                    primary="Status" 
                    secondary={
                      <Chip 
                        label={application.status} 
                        size="small"
                        color={
                          application.status === 'approved' ? 'success' :
                          application.status === 'rejected' ? 'error' :
                          'warning'
                        }
                        sx={{ mt: 1 }}
                      />
                    } 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Documents */}
        <Grid item xs={12}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Documents
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {application.documents && application.documents.length > 0 ? (
                <Grid container spacing={2}>
                  {application.documents.map((doc, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Paper 
                        elevation={2} 
                        sx={{ 
                          p: 2, 
                          display: 'flex', 
                          alignItems: 'center',
                          '&:hover': { backgroundColor: '#f5f5f5' }
                        }}
                      >
                        <FileIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body2" sx={{ flexGrow: 1 }}>
                          Document {index + 1}
                        </Typography>
                        <Button 
                          variant="outlined" 
                          size="small"
                          href={doc}
                          target="_blank"
                        >
                          View
                        </Button>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No documents attached
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Application Processing Form */}
        {application.status === 'pending' && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Process Application
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <FormControl component="fieldset" sx={{ mb: 3 }}>
                  <FormLabel component="legend">Decision</FormLabel>
                  <RadioGroup
                    name="decision"
                    value={decision}
                    onChange={handleDecisionChange}
                    row
                  >
                    <FormControlLabel 
                      value="approved" 
                      control={<Radio />} 
                      label="Approve" 
                    />
                    <FormControlLabel 
                      value="rejected" 
                      control={<Radio />} 
                      label="Reject" 
                    />
                  </RadioGroup>
                  {formErrors.decision && (
                    <Typography color="error" variant="caption">
                      {formErrors.decision}
                    </Typography>
                  )}
                </FormControl>
                
                {decision === 'approved' && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Approval Details
                    </Typography>
                    
                    <TextField
                      label="Approved Amount"
                      type="number"
                      value={approvedAmount}
                      onChange={handleApprovedAmountChange}
                      fullWidth
                      margin="normal"
                      InputProps={{
                        startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                      }}
                      error={!!formErrors.approvedAmount}
                      helperText={formErrors.approvedAmount}
                    />
                    
                    <Box sx={{ mt: 3, mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1">
                          Repayment Schedule
                        </Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<AddIcon />}
                          onClick={handleAddPayment}
                        >
                          Add Payment
                        </Button>
                      </Box>
                      
                      {formErrors.schedule && (
                        <Alert severity="error" sx={{ mt: 1 }}>
                          {formErrors.schedule}
                        </Alert>
                      )}
                      
                      {repaymentSchedule.map((payment, index) => (
                        <Box 
                          key={index} 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 2,
                            mt: 2,
                            p: 2,
                            border: '1px solid #e0e0e0',
                            borderRadius: 1,
                            backgroundColor: '#f9f9f9'
                          }}
                        >
                          <Typography variant="body2" sx={{ minWidth: '80px' }}>
                            Payment {index + 1}:
                          </Typography>
                          
                          <TextField
                            label="Due Date"
                            type="date"
                            value={payment.dueDate}
                            onChange={(e) => handleScheduleChange(index, 'dueDate', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            sx={{ flexGrow: 1 }}
                            error={!!formErrors[`schedule_${index}_date`]}
                            helperText={formErrors[`schedule_${index}_date`]}
                          />
                          
                          <TextField
                            label="Amount"
                            type="number"
                            value={payment.amount}
                            onChange={(e) => handleScheduleChange(index, 'amount', e.target.value)}
                            InputProps={{
                              startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                            }}
                            sx={{ flexGrow: 1 }}
                            error={!!formErrors[`schedule_${index}_amount`]}
                            helperText={formErrors[`schedule_${index}_amount`]}
                          />
                          
                          <Tooltip title="Remove Payment">
                            <IconButton 
                              color="error" 
                              onClick={() => handleRemovePayment(index)}
                              disabled={repaymentSchedule.length === 1}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
                
                <TextField
                  label="Review Notes"
                  multiline
                  rows={4}
                  value={reviewNotes}
                  onChange={handleReviewNotesChange}
                  fullWidth
                  margin="normal"
                  placeholder={decision === 'rejected' ? "Please provide a reason for rejection" : "Optional notes"}
                  error={!!formErrors.reviewNotes}
                  helperText={formErrors.reviewNotes}
                />
                
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    color={decision === 'approved' ? 'success' : 'error'}
                    onClick={handleSubmit}
                    disabled={!decision || submitting}
                    sx={{ minWidth: '150px' }}
                  >
                    {submitting ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      decision === 'approved' ? 'Approve Loan' : 
                      decision === 'rejected' ? 'Reject Application' : 
                      'Submit Decision'
                    )}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default LoanApplicationDetail;
