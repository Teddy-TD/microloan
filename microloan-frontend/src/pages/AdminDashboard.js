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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent
} from "@mui/material";
import { 
  getAllUsers, 
  addUser, 
  removeUser, 
  resetUserPassword, 
  updateUserRole,
  getAllLoans,
  getSystemStats
} from "../services/api";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLoans: 0,
    totalAmount: 0,
    pendingLoans: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  
  // Dialog states
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openResetDialog, setOpenResetDialog] = useState(false);
  const [openRoleDialog, setOpenRoleDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Form states
  const [addUserForm, setAddUserForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "client"
  });
  const [resetPasswordForm, setResetPasswordForm] = useState({
    newPassword: ""
  });
  const [roleForm, setRoleForm] = useState({
    role: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch users, loans, and stats in parallel
      const [usersData, loansData, statsData] = await Promise.all([
        getAllUsers(),
        getAllLoans(),
        getSystemStats()
      ]);
      
      setUsers(usersData);
      setLoans(loansData);
      setStats(statsData);
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

  // Add User Dialog
  const handleOpenAddDialog = () => {
    setAddUserForm({
      name: "",
      email: "",
      password: "",
      role: "client"
    });
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setAddUserForm({
      ...addUserForm,
      [name]: value
    });
  };

  const handleAddUser = async () => {
    try {
      const newUser = await addUser(addUserForm);
      setUsers([...users, newUser]);
      setOpenAddDialog(false);
      setError(null);
    } catch (err) {
      console.error("Error adding user:", err);
      setError("Failed to add user.");
    }
  };

  // Reset Password Dialog
  const handleOpenResetDialog = (user) => {
    setSelectedUser(user);
    setResetPasswordForm({ newPassword: "" });
    setOpenResetDialog(true);
  };

  const handleCloseResetDialog = () => {
    setOpenResetDialog(false);
  };

  const handleResetInputChange = (e) => {
    setResetPasswordForm({ newPassword: e.target.value });
  };

  const handleResetPassword = async () => {
    try {
      await resetUserPassword(selectedUser._id, resetPasswordForm.newPassword);
      setOpenResetDialog(false);
      setError(null);
    } catch (err) {
      console.error("Error resetting password:", err);
      setError("Failed to reset password.");
    }
  };

  // Update Role Dialog
  const handleOpenRoleDialog = (user) => {
    setSelectedUser(user);
    setRoleForm({ role: user.role });
    setOpenRoleDialog(true);
  };

  const handleCloseRoleDialog = () => {
    setOpenRoleDialog(false);
  };

  const handleRoleInputChange = (e) => {
    setRoleForm({ role: e.target.value });
  };

  const handleUpdateRole = async () => {
    try {
      await updateUserRole(selectedUser._id, roleForm.role);
      // Update the local state
      setUsers(users.map(user => 
        user._id === selectedUser._id 
          ? { ...user, role: roleForm.role } 
          : user
      ));
      setOpenRoleDialog(false);
      setError(null);
    } catch (err) {
      console.error("Error updating role:", err);
      setError("Failed to update role.");
    }
  };

  // Remove User
  const handleRemoveUser = async (userId) => {
    if (window.confirm("Are you sure you want to remove this user?")) {
      try {
        await removeUser(userId);
        setUsers(users.filter(user => user._id !== userId));
        setError(null);
      } catch (err) {
        console.error("Error removing user:", err);
        setError("Failed to remove user.");
      }
    }
  };

  return (
    <Box sx={{ py: 5, backgroundColor: "#F5F7FA", minHeight: "100vh" }}>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" fontWeight="bold" color="#1E3A8A" sx={{ mb: 3 }}>
            Administrator Dashboard
          </Typography>

          {/* Loading and Error States */}
          {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />}
          {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}

          {!loading && (
            <>
              {/* Dashboard Summary */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ bgcolor: '#e3f2fd' }}>
                    <CardContent>
                      <Typography variant="h6">Total Users</Typography>
                      <Typography variant="h4">{stats.totalUsers}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ bgcolor: '#e8f5e9' }}>
                    <CardContent>
                      <Typography variant="h6">Total Loans</Typography>
                      <Typography variant="h4">{stats.totalLoans}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ bgcolor: '#fff8e1' }}>
                    <CardContent>
                      <Typography variant="h6">Total Amount</Typography>
                      <Typography variant="h4">${stats.totalAmount}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ bgcolor: '#ffebee' }}>
                    <CardContent>
                      <Typography variant="h6">Pending Loans</Typography>
                      <Typography variant="h4">{stats.pendingLoans}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="dashboard tabs">
                  <Tab label="User Management" />
                  <Tab label="Loan Overview" />
                </Tabs>
              </Box>

              {/* User Management Tab */}
              {tabValue === 0 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6">Manage Users</Typography>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={handleOpenAddDialog}
                    >
                      Add New User
                    </Button>
                  </Box>
                  
                  {users.length === 0 ? (
                    <Typography>No users found.</Typography>
                  ) : (
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell><b>Name</b></TableCell>
                          <TableCell><b>Email</b></TableCell>
                          <TableCell><b>Role</b></TableCell>
                          <TableCell><b>Actions</b></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user._id}>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>
                              <Button 
                                variant="outlined" 
                                color="primary" 
                                size="small" 
                                sx={{ mr: 1 }}
                                onClick={() => handleOpenRoleDialog(user)}
                              >
                                Change Role
                              </Button>
                              <Button 
                                variant="outlined" 
                                color="warning" 
                                size="small" 
                                sx={{ mr: 1 }}
                                onClick={() => handleOpenResetDialog(user)}
                              >
                                Reset Password
                              </Button>
                              <Button 
                                variant="outlined" 
                                color="error" 
                                size="small"
                                onClick={() => handleRemoveUser(user._id)}
                              >
                                Remove
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </Box>
              )}

              {/* Loan Overview Tab */}
              {tabValue === 1 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 2 }}>Loan Overview</Typography>
                  {loans.length === 0 ? (
                    <Typography>No loans found.</Typography>
                  ) : (
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell><b>Client</b></TableCell>
                          <TableCell><b>Amount</b></TableCell>
                          <TableCell><b>Duration</b></TableCell>
                          <TableCell><b>Status</b></TableCell>
                          <TableCell><b>Created At</b></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {loans.map((loan) => (
                          <TableRow key={loan._id}>
                            <TableCell>{loan.client?.name || 'Unknown'}</TableCell>
                            <TableCell>${loan.amount}</TableCell>
                            <TableCell>{loan.duration} months</TableCell>
                            <TableCell>{loan.status}</TableCell>
                            <TableCell>{new Date(loan.createdAt).toLocaleDateString()}</TableCell>
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

      {/* Add User Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            value={addUserForm.name}
            onChange={handleAddInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={addUserForm.email}
            onChange={handleAddInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="password"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={addUserForm.password}
            onChange={handleAddInputChange}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={addUserForm.role}
              label="Role"
              onChange={handleAddInputChange}
            >
              <MenuItem value="client">Client</MenuItem>
              <MenuItem value="loan_officer">Loan Officer</MenuItem>
              <MenuItem value="admin">Administrator</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Cancel</Button>
          <Button onClick={handleAddUser} variant="contained" color="primary">Add User</Button>
        </DialogActions>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={openResetDialog} onClose={handleCloseResetDialog}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Resetting password for: {selectedUser?.name}
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            name="newPassword"
            label="New Password"
            type="password"
            fullWidth
            variant="outlined"
            value={resetPasswordForm.newPassword}
            onChange={handleResetInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResetDialog}>Cancel</Button>
          <Button onClick={handleResetPassword} variant="contained" color="primary">Reset Password</Button>
        </DialogActions>
      </Dialog>

      {/* Update Role Dialog */}
      <Dialog open={openRoleDialog} onClose={handleCloseRoleDialog}>
        <DialogTitle>Update User Role</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Changing role for: {selectedUser?.name}
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              value={roleForm.role}
              label="Role"
              onChange={handleRoleInputChange}
            >
              <MenuItem value="client">Client</MenuItem>
              <MenuItem value="loan_officer">Loan Officer</MenuItem>
              <MenuItem value="admin">Administrator</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRoleDialog}>Cancel</Button>
          <Button onClick={handleUpdateRole} variant="contained" color="primary">Update Role</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
