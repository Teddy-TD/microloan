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
  Tooltip,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
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
  Delete as DeleteIcon,
  Work as WorkIcon,
  AccountBalance as AccountBalanceIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { getAdminApplicationDocument } from '../services/api';

const AdminApplicationDetail = ({ 
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
  const [documentUrls, setDocumentUrls] = useState({});
  const [documentLoading, setDocumentLoading] = useState({});

  // Set initial values when application data is loaded
  React.useEffect(() => {
    if (application) {
      setApprovedAmount(application.loanAmount || '');
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

  const handleViewDocument = async (documentId) => {
    if (documentUrls[documentId]) {
      // Document URL already fetched
      return;
    }

    setDocumentLoading({...documentLoading, [documentId]: true});

    try {
      const response = await getAdminApplicationDocument(application.applicationId, documentId);
      setDocumentUrls({
        ...documentUrls,
        [documentId]: response.documentUrl
      });
    } catch (error) {
      console.error('Error fetching document:', error);
    } finally {
      setDocumentLoading({...documentLoading, [documentId]: false});
    }
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
          repaymentSchedule,
          reviewNotes
        });
      } else if (decision === 'rejected') {
        await onReject(application.applicationId, reviewNotes);
      }
    } catch (error) {
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
        <Alert severity="error" sx={{ mb: 3 }}>
          {formErrors.submit}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Client Information */}
        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 3 }}>
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
                    secondary={application.clientName} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Email Address" 
                    secondary={application.clientEmail} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <PhoneIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Phone Number" 
                    secondary={application.clientPhone || 'Not provided'} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Address" 
                    secondary={
                      application.clientAddress ? 
                      `${application.clientAddress.street || ''}, 
                      ${application.clientAddress.city || ''}, 
                      ${application.clientAddress.region || ''} 
                      ${application.clientAddress.postalCode || ''}`.replace(/\s+/g, ' ').trim() : 
                      'Not provided'
                    } 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Income Information */}
        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Income Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <WorkIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Employment Status" 
                    secondary={application.clientIncome?.employmentStatus || 'Not provided'} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <AttachMoneyIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Monthly Income" 
                    secondary={
                      application.clientIncome?.monthlyIncome ? 
                      formatCurrency(application.clientIncome.monthlyIncome) : 
                      'Not provided'
                    } 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <AccountBalanceIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Other Income Sources" 
                    secondary={application.clientIncome?.otherIncomeSources || 'None'} 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Loan Application Details */}
        <Grid item xs={12}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Loan Application Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, backgroundColor: '#f9f9f9' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AttachMoneyIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="subtitle1">
                        Requested Amount
                      </Typography>
                    </Box>
                    <Typography variant="h5" color="primary.main">
                      {formatCurrency(application.loanAmount)}
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, backgroundColor: '#f9f9f9' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="subtitle1">
                        Loan Duration
                      </Typography>
                    </Box>
                    <Typography variant="h5">
                      {application.loanDuration} months
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, backgroundColor: '#f9f9f9' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <DescriptionIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="subtitle1">
                        Purpose
                      </Typography>
                    </Box>
                    <Typography variant="body1">
                      {application.purpose}
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, backgroundColor: '#f9f9f9' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="subtitle1">
                        Application Date
                      </Typography>
                    </Box>
                    <Typography variant="body1">
                      {formatDate(application.applicationDate)}
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, backgroundColor: '#f9f9f9' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <FileIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="subtitle1">
                        Documents
                      </Typography>
                    </Box>
                    {application.documents && application.documents.length > 0 ? (
                      <List>
                        {application.documents.map((doc, index) => (
                          <ListItem key={index} disablePadding sx={{ mt: 1 }}>
                            <ListItemIcon>
                              <FileIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText 
                              primary={
                                <Link 
                                  href={documentUrls[doc._id] || '#'} 
                                  target="_blank"
                                  onClick={
                                    !documentUrls[doc._id] ? 
                                    () => handleViewDocument(doc._id) : 
                                    undefined
                                  }
                                  sx={{ cursor: 'pointer' }}
                                >
                                  {doc.name || `Document ${index + 1}`}
                                  {documentLoading[doc._id] && (
                                    <CircularProgress size={16} sx={{ ml: 1 }} />
                                  )}
                                </Link>
                              }
                              secondary={doc.type || 'Unknown type'}
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No documents provided
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Application Review Form */}
        <Grid item xs={12}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Application Review
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {application.status !== 'pending' ? (
                <Box>
                  <Alert severity={application.status === 'approved' ? 'success' : 'error'} sx={{ mb: 3 }}>
                    This application has been {application.status}
                  </Alert>
                  
                  <Typography variant="subtitle1" gutterBottom>
                    Review Notes:
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {application.reviewNotes || 'No review notes provided'}
                  </Typography>
                  
                  {application.status === 'approved' && (
                    <Box>
                      <Typography variant="subtitle1" gutterBottom>
                        Approved Amount: {formatCurrency(application.approvedAmount)}
                      </Typography>
                      
                      <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                        Repayment Schedule:
                      </Typography>
                      {application.repaymentSchedule && application.repaymentSchedule.length > 0 ? (
                        <TableContainer component={Paper} sx={{ mt: 1 }}>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Payment #</TableCell>
                                <TableCell>Due Date</TableCell>
                                <TableCell align="right">Amount</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {application.repaymentSchedule.map((payment, index) => (
                                <TableRow key={index}>
                                  <TableCell>{index + 1}</TableCell>
                                  <TableCell>{formatDate(payment.dueDate)}</TableCell>
                                  <TableCell align="right">{formatCurrency(payment.amount)}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No repayment schedule available
                        </Typography>
                      )}
                    </Box>
                  )}
                </Box>
              ) : (
                <Box>
                  <FormControl component="fieldset" sx={{ mb: 3 }}>
                    <FormLabel component="legend">Decision</FormLabel>
                    <RadioGroup
                      row
                      name="decision"
                      value={decision}
                      onChange={handleDecisionChange}
                    >
                      <FormControlLabel value="approved" control={<Radio />} label="Approve" />
                      <FormControlLabel value="rejected" control={<Radio />} label="Reject" />
                    </RadioGroup>
                    {formErrors.decision && (
                      <Typography color="error" variant="caption">
                        {formErrors.decision}
                      </Typography>
                    )}
                  </FormControl>
                  
                  {decision === 'approved' && (
                    <Box sx={{ mb: 3 }}>
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
                      
                      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                        Repayment Schedule
                      </Typography>
                      
                      {formErrors.schedule && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                          {formErrors.schedule}
                        </Alert>
                      )}
                      
                      <Box sx={{ mb: 2 }}>
                        <Button
                          variant="outlined"
                          startIcon={<AddIcon />}
                          onClick={handleAddPayment}
                          size="small"
                        >
                          Add Payment
                        </Button>
                      </Box>
                      
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
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminApplicationDetail;
