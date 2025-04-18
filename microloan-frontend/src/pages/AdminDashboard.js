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
  CardContent,
  IconButton,
  Tooltip,
  Chip,
  TableContainer,
  TablePagination
} from "@mui/material";
import { 
  getAllUsers, 
  addUser, 
  removeUser, 
  resetUserPassword, 
  updateUserRole,
  toggleUserActive,
  getAllLoans,
  getSystemStats,
  updateClientProfile
} from "../services/api";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockResetIcon from '@mui/icons-material/LockReset';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
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
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Dialog states
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openResetDialog, setOpenResetDialog] = useState(false);
  const [openRoleDialog, setOpenRoleDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Form states
  const [addUserForm, setAddUserForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "client"
  });
  const [editUserForm, setEditUserForm] = useState({
    name: "",
    email: ""
  });
  const [resetPasswordForm, setResetPasswordForm] = useState({
    newPassword: ""
  });
  const [roleForm, setRoleForm] = useState({
    role: ""
  });

  const applyFilters = () => {
    let filtered = [...users];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter(user => user.role === roleFilter);
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      filtered = filtered.filter(user => user.active === isActive);
    }
    
    setFilteredUsers(filtered);
    setPage(0); // Reset to first page when filters change
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, searchTerm, roleFilter, statusFilter, applyFilters]);

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
      setFilteredUsers(usersData);
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleRoleFilterChange = (event) => {
    setRoleFilter(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setRoleFilter("all");
    setStatusFilter("all");
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
      const response = await addUser(addUserForm);
      setUsers([...users, response.user]);
      setOpenAddDialog(false);
      setError(null);
    } catch (err) {
      console.error("Error adding user:", err);
      setError("Failed to add user: " + err.message);
    }
  };

  // Edit User Dialog
  const handleOpenEditDialog = (user) => {
    setSelectedUser(user);
    setEditUserForm({
      name: user.name,
      email: user.email
    });
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditUserForm({
      ...editUserForm,
      [name]: value
    });
  };

  const handleUpdateUser = async () => {
    try {
      // Use the updateClientProfile function which works for any user when called by an admin
      await updateClientProfile(selectedUser._id, editUserForm);
      
      // Update the local state
      setUsers(users.map(user => 
        user._id === selectedUser._id 
          ? { ...user, ...editUserForm } 
          : user
      ));
      
      setOpenEditDialog(false);
      setError(null);
    } catch (err) {
      console.error("Error updating user:", err);
      setError("Failed to update user: " + err.message);
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
      setError("Failed to reset password: " + err.message);
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
      setError("Failed to update role: " + err.message);
    }
  };

  // Delete User Dialog
  const handleOpenDeleteDialog = (user) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteUser = async () => {
    try {
      await removeUser(selectedUser._id);
      setUsers(users.filter(user => user._id !== selectedUser._id));
      setOpenDeleteDialog(false);
      setError(null);
    } catch (err) {
      console.error("Error removing user:", err);
      setError("Failed to remove user: " + err.message);
    }
  };

  // Toggle User Active Status
  const handleToggleActive = async (user) => {
    try {
      const newActiveStatus = !user.active;
      await toggleUserActive(user._id, newActiveStatus);
      
      // Update the local state
      setUsers(users.map(u => 
        u._id === user._id 
          ? { ...u, active: newActiveStatus } 
          : u
      ));
      
      setError(null);
    } catch (err) {
      console.error("Error toggling user active status:", err);
      setError("Failed to update account status: " + err.message);
    }
  };

  // Get role display name and color
  const getRoleDisplay = (role) => {
    switch (role) {
      case 'admin':
        return { label: 'Administrator', color: 'error' };
      case 'loan_officer':
        return { label: 'Loan Officer', color: 'warning' };
      case 'client':
        return { label: 'Client', color: 'info' };
      default:
        return { label: role, color: 'default' };
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
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                    <Typography variant="h6">User Account Management</Typography>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      startIcon={<PersonAddIcon />}
                      onClick={handleOpenAddDialog}
                    >
                      Add New User
                    </Button>
                  </Box>
                  
                  {/* Search and Filter Controls */}
                  <Paper sx={{ p: 2, mb: 3 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          placeholder="Search by name or email"
                          variant="outlined"
                          size="small"
                          value={searchTerm}
                          onChange={handleSearchChange}
                          InputProps={{
                            startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Filter by Role</InputLabel>
                          <Select
                            value={roleFilter}
                            label="Filter by Role"
                            onChange={handleRoleFilterChange}
                          >
                            <MenuItem value="all">All Roles</MenuItem>
                            <MenuItem value="admin">Administrators</MenuItem>
                            <MenuItem value="loan_officer">Loan Officers</MenuItem>
                            <MenuItem value="client">Clients</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Filter by Status</InputLabel>
                          <Select
                            value={statusFilter}
                            label="Filter by Status"
                            onChange={handleStatusFilterChange}
                          >
                            <MenuItem value="all">All Statuses</MenuItem>
                            <MenuItem value="active">Active</MenuItem>
                            <MenuItem value="inactive">Deactivated</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Button 
                          fullWidth 
                          variant="outlined" 
                          onClick={clearFilters}
                          startIcon={<FilterListIcon />}
                        >
                          Clear
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                  
                  {filteredUsers.length === 0 ? (
                    <Alert severity="info" sx={{ my: 2 }}>No users found matching your filters.</Alert>
                  ) : (
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                      <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader>
                          <TableHead>
                            <TableRow>
                              <TableCell><b>Name</b></TableCell>
                              <TableCell><b>Email</b></TableCell>
                              <TableCell><b>Role</b></TableCell>
                              <TableCell><b>Status</b></TableCell>
                              <TableCell align="center"><b>Actions</b></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {filteredUsers
                              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                              .map((user) => {
                                const roleInfo = getRoleDisplay(user.role);
                                return (
                                  <TableRow key={user._id} hover>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                      <Chip 
                                        label={roleInfo.label} 
                                        color={roleInfo.color} 
                                        size="small" 
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Chip 
                                        icon={user.active ? <CheckCircleIcon /> : <BlockIcon />}
                                        label={user.active ? "Active" : "Deactivated"} 
                                        color={user.active ? "success" : "default"} 
                                        size="small" 
                                        variant={user.active ? "filled" : "outlined"}
                                      />
                                    </TableCell>
                                    <TableCell align="center">
                                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                        <Tooltip title="Edit User">
                                          <IconButton 
                                            size="small" 
                                            color="primary"
                                            onClick={() => handleOpenEditDialog(user)}
                                          >
                                            <EditIcon fontSize="small" />
                                          </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Reset Password">
                                          <IconButton 
                                            size="small" 
                                            color="warning"
                                            onClick={() => handleOpenResetDialog(user)}
                                          >
                                            <LockResetIcon fontSize="small" />
                                          </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Change Role">
                                          <IconButton 
                                            size="small" 
                                            color="info"
                                            onClick={() => handleOpenRoleDialog(user)}
                                          >
                                            <AdminPanelSettingsIcon fontSize="small" />
                                          </IconButton>
                                        </Tooltip>
                                        <Tooltip title={user.active ? "Deactivate Account" : "Activate Account"}>
                                          <IconButton 
                                            size="small" 
                                            color={user.active ? "default" : "success"}
                                            onClick={() => handleToggleActive(user)}
                                          >
                                            {user.active ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
                                          </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete User">
                                          <IconButton 
                                            size="small" 
                                            color="error"
                                            onClick={() => handleOpenDeleteDialog(user)}
                                          >
                                            <DeleteIcon fontSize="small" />
                                          </IconButton>
                                        </Tooltip>
                                      </Box>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={filteredUsers.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                      />
                    </Paper>
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
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                name="name"
                label="Full Name"
                type="text"
                fullWidth
                variant="outlined"
                value={addUserForm.name}
                onChange={handleAddInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email Address"
                type="email"
                fullWidth
                variant="outlined"
                value={addUserForm.email}
                onChange={handleAddInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="password"
                label="Password"
                type="password"
                fullWidth
                variant="outlined"
                value={addUserForm.password}
                onChange={handleAddInputChange}
                required
                helperText="Minimum 6 characters recommended"
              />
            </Grid>
            <Grid item xs={12}>
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
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Cancel</Button>
          <Button 
            onClick={handleAddUser} 
            variant="contained" 
            color="primary"
            disabled={!addUserForm.name || !addUserForm.email || !addUserForm.password}
          >
            Add User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                name="name"
                label="Full Name"
                type="text"
                fullWidth
                variant="outlined"
                value={editUserForm.name}
                onChange={handleEditInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email Address"
                type="email"
                fullWidth
                variant="outlined"
                value={editUserForm.email}
                onChange={handleEditInputChange}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button 
            onClick={handleUpdateUser} 
            variant="contained" 
            color="primary"
            disabled={!editUserForm.name || !editUserForm.email}
          >
            Update User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={openResetDialog} onClose={handleCloseResetDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent >
          <Typography variant="body2" sx={{ mb: 2 }}>
            Resetting password for: <b>{selectedUser?.name}</b>
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
            required
            helperText="Minimum 6 characters recommended"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResetDialog}>Cancel</Button>
          <Button 
            onClick={handleResetPassword} 
            variant="contained" 
            color="primary"
            disabled={!resetPasswordForm.newPassword}
          >
            Reset Password
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Role Dialog */}
      <Dialog open={openRoleDialog} onClose={handleCloseRoleDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Update User Role</DialogTitle>
        <DialogContent >
          <Typography variant="body2" sx={{ mb: 2 }}>
            Changing role for: <b>{selectedUser?.name}</b>
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
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            <b>Note:</b> Changing a user's role will affect their permissions and access to different parts of the system.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRoleDialog}>Cancel</Button>
          <Button onClick={handleUpdateRole} variant="contained" color="primary">
            Update Role
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to permanently delete the user <b>{selectedUser?.name}</b>?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            This action cannot be undone. All data associated with this user will be permanently removed.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteUser} variant="contained" color="error">
            Delete User
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
