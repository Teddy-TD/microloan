import { useEffect, useState } from "react";
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  CircularProgress, 
  Alert,
  Paper,
  Tabs,
  Tab,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Grid,
  Chip
} from "@mui/material";
import { 
  Dashboard as DashboardIcon,
  List as ListIcon,
  Person as PersonIcon,
  Assessment as AssessmentIcon,
  People as PeopleIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getAllLoans, updateLoanStatus, getClientsList, updateClientProfile } from "../services/api";

const LoanOfficerDashboard = () => {
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [selectedClient, setSelectedClient] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [clientFormData, setClientFormData] = useState({
    name: "",
    email: ""
  });
  const [stats, setStats] = useState({
    pendingLoans: 0,
    approvedLoans: 0,
    rejectedLoans: 0,
    totalClients: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch loans and clients in parallel
      const [loansData, clientsData] = await Promise.all([
        getAllLoans(),
        getClientsList()
      ]);
      
      setLoans(loansData);
      const clientsList = clientsData.filter(client => client.role === "client");
      setClients(clientsList);
      
      // Calculate statistics
      const pendingCount = loansData.filter(loan => loan.status === "pending").length;
      const approvedCount = loansData.filter(loan => loan.status === "approved").length;
      const rejectedCount = loansData.filter(loan => loan.status === "rejected").length;
      
      setStats({
        pendingLoans: pendingCount,
        approvedLoans: approvedCount,
        rejectedLoans: rejectedCount,
        totalClients: clientsList.length
      });
      
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleStatusChange = async (loanId, newStatus) => {
    try {
      await updateLoanStatus(loanId, newStatus);
      // Update the local state to reflect the change
      setLoans(loans.map(loan => 
        loan._id === loanId ? { ...loan, status: newStatus } : loan
      ));
    } catch (err) {
      console.error("Error updating loan status:", err);
      setError("Failed to update loan status.");
    }
  };

  const handleOpenClientDialog = (client) => {
    setSelectedClient(client);
    setClientFormData({
      name: client.name,
      email: client.email
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClientFormData({
      ...clientFormData,
      [name]: value
    });
  };

  const handleUpdateClient = async () => {
    try {
      await updateClientProfile(selectedClient._id, clientFormData);
      // Update the local state
      setClients(clients.map(client => 
        client._id === selectedClient._id 
          ? { ...client, ...clientFormData } 
          : client
      ));
      setOpenDialog(false);
      setError(null);
    } catch (err) {
      console.error("Error updating client profile:", err);
      setError("Failed to update client profile.");
    }
  };

  return (
    <Box sx={{ py: 5, backgroundColor: "#F5F7FA", minHeight: "100vh" }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<PersonIcon />}
            onClick={() => navigate('/loan-officer/profile')}
          >
            My Profile
          </Button>
        </Box>
        
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" fontWeight="bold" color="#1E3A8A" sx={{ mb: 3 }}>
            Loan Officer Dashboard
          </Typography>

          {/* Loading and Error States */}
          {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />}
          {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}

          {!loading && (
            <>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="dashboard tabs">
                  <Tab label="Loan Applications" />
                  <Tab label="Client Profiles" />
                </Tabs>
              </Box>

              {/* Quick Navigation Cards */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        Pending Loans
                      </Typography>
                      <Typography variant="h4" sx={{ mb: 1, fontWeight: "bold" }}>
                        {stats.pendingLoans}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        Approved Loans
                      </Typography>
                      <Typography variant="h4" sx={{ mb: 1, fontWeight: "bold" }}>
                        {stats.approvedLoans}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        Rejected Loans
                      </Typography>
                      <Typography variant="h4" sx={{ mb: 1, fontWeight: "bold" }}>
                        {stats.rejectedLoans}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        Total Clients
                      </Typography>
                      <Typography variant="h4" sx={{ mb: 1, fontWeight: "bold" }}>
                        {stats.totalClients}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Loan Applications Tab */}
              {tabValue === 0 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Manage Loan Applications</Typography>
                    <Button 
                      variant="contained" 
                      color="primary"
                      startIcon={<ListIcon />}
                      onClick={() => navigate('/loan-officer/applications')}
                    >
                      Advanced Application Management
                    </Button>
                  </Box>
                  
                  {loans.length === 0 ? (
                    <Typography>No loan applications found.</Typography>
                  ) : (
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell><b>Client</b></TableCell>
                          <TableCell><b>Amount</b></TableCell>
                          <TableCell><b>Duration</b></TableCell>
                          <TableCell><b>Status</b></TableCell>
                          <TableCell><b>Actions</b></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {loans.map((loan) => (
                          <TableRow key={loan._id}>
                            <TableCell>{loan.client?.name || 'Unknown'}</TableCell>
                            <TableCell>${loan.amount}</TableCell>
                            <TableCell>{loan.duration} months</TableCell>
                            <TableCell>{loan.status}</TableCell>
                            <TableCell>
                              {loan.status === "pending" && (
                                <Box>
                                  <Button 
                                    variant="contained" 
                                    color="success" 
                                    size="small" 
                                    sx={{ mr: 1 }}
                                    onClick={() => handleStatusChange(loan._id, "approved")}
                                  >
                                    Approve
                                  </Button>
                                  <Button 
                                    variant="contained" 
                                    color="error" 
                                    size="small"
                                    onClick={() => handleStatusChange(loan._id, "rejected")}
                                  >
                                    Reject
                                  </Button>
                                </Box>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </Box>
              )}

              {/* Client Profiles Tab */}
              {tabValue === 1 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 2 }}>Manage Client Profiles</Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<PeopleIcon />}
                      onClick={() => navigate('/loan-officer/clients')}
                      sx={{ mr: 2 }}
                    >
                      View All Clients
                    </Button>
                    <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                      Use the new client management system for advanced filtering, sorting, and detailed profile reviews.
                    </Typography>
                  </Box>
                  
                  {clients.length === 0 ? (
                    <Typography>No clients found.</Typography>
                  ) : (
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell><b>Name</b></TableCell>
                          <TableCell><b>Email</b></TableCell>
                          <TableCell><b>Actions</b></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {clients.map((client) => (
                          <TableRow key={client._id}>
                            <TableCell>{client.name}</TableCell>
                            <TableCell>{client.email}</TableCell>
                            <TableCell>
                              <Button 
                                variant="contained" 
                                color="primary" 
                                size="small"
                                onClick={() => handleOpenClientDialog(client)}
                              >
                                Update Profile
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </Box>
              )}
            </>
          )}
        </Paper>
      </Container>

      {/* Client Update Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Update Client Profile</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            value={clientFormData.name}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={clientFormData.email}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleUpdateClient} variant="contained" color="primary">Update</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LoanOfficerDashboard;
