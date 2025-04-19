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
  TablePagination,
  InputAdornment
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
  updateClientProfile,
  getAdminAllApplications,
  getAdminPendingApplications,
  getAdminComplaints
} from "../services/api";
import { 
  PersonAdd, 
  Edit, 
  Delete, 
  LockReset, 
  AdminPanelSettings, 
  Block, 
  CheckCircle, 
  Search, 
  FilterList, 
  Description, 
  Refresh, 
  Dashboard, 
  Pending, 
  Visibility, 
  ArrowUpward, 
  ArrowDownward,
  Comment as CommentIcon
} from '@mui/icons-material';
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [applications, setApplications] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLoans: 0,
    totalAmount: 0,
    pendingLoans: 0,
    pendingComplaints: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Loan Applications Tab States
  const [appTabValue, setAppTabValue] = useState(0);
  const [appSearchTerm, setAppSearchTerm] = useState("");
  const [appLoading, setAppLoading] = useState(false);
  const [appError, setAppError] = useState(null);
  const [appPagination, setAppPagination] = useState({
    currentPage: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0
  });
  const [appSortBy, setAppSortBy] = useState('applicationDate');
  const [appSortOrder, setAppSortOrder] = useState('desc');
  
  // Complaint Management Tab States
  const [complaintTabValue, setComplaintTabValue] = useState(0);
  const [complaintSearchTerm, setComplaintSearchTerm] = useState("");
  const [complaintLoading, setComplaintLoading] = useState(false);
  const [complaintError, setComplaintError] = useState(null);
  const [complaintPagination, setComplaintPagination] = useState({
    currentPage: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0
  });
  const [complaintSortBy, setComplaintSortBy] = useState('submittedAt');
  const [complaintSortOrder, setComplaintSortOrder] = useState('desc');
  const [complaintFilters, setComplaintFilters] = useState({
    status: '',
    search: ''
  });
  
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
    applyFilters();
  }, [users, searchTerm, roleFilter, statusFilter]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (tabValue === 2) {
      fetchApplicationsByTab(appTabValue);
    } else if (tabValue === 3) {
      fetchComplaintsByTab(complaintTabValue);
    }
  }, [tabValue]);

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

  const fetchApplicationsByTab = async (tabIndex) => {
    try {
      setAppLoading(true);
      setAppError(null);
      let response;

      if (tabIndex === 0) { // All Applications
        response = await getAdminAllApplications({
          page: appPagination.currentPage,
          limit: appPagination.limit,
          sortBy: appSortBy,
          order: appSortOrder,
          search: appSearchTerm
        });
      } else if (tabIndex === 1) { // Pending Applications
        response = await getAdminPendingApplications({
          page: appPagination.currentPage,
          limit: appPagination.limit,
          sortBy: appSortBy,
          order: appSortOrder,
          search: appSearchTerm
        });
      }

      if (response) {
        setApplications(response.applications);
        setAppPagination({
          currentPage: response.pagination.currentPage,
          limit: response.pagination.limit,
          totalCount: response.pagination.totalCount,
          totalPages: response.pagination.totalPages
        });
      }
    } catch (err) {
      console.error("Error fetching applications:", err);
      setAppError(err.message || "Failed to load applications");
    } finally {
      setAppLoading(false);
    }
  };

  const fetchComplaintsByTab = async (tabIndex) => {
    try {
      setComplaintLoading(true);
      setComplaintError(null);
      
      let statusFilter = '';
      switch(tabIndex) {
        case 1: // Open
          statusFilter = 'open';
          break;
        case 2: // Assigned
          statusFilter = 'assigned';
          break;
        case 3: // Resolved
          statusFilter = 'resolved';
          break;
        default: // All Complaints
          statusFilter = '';
      }
      
      const response = await getAdminComplaints({
        page: complaintPagination.currentPage,
        limit: complaintPagination.limit,
        sortBy: complaintSortBy,
        order: complaintSortOrder,
        status: statusFilter,
        search: complaintSearchTerm
      });
      
      if (response) {
        setComplaints(response.complaints);
        setComplaintPagination({
          currentPage: response.pagination.currentPage,
          limit: response.pagination.limit,
          totalCount: response.pagination.totalCount,
          totalPages: response.pagination.totalPages
        });
      }
    } catch (err) {
      console.error("Error fetching complaints:", err);
      setComplaintError(err.message || "Failed to load complaints");
    } finally {
      setComplaintLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Loan Applications Tab Handlers
  const handleAppTabChange = (event, newValue) => {
    setAppTabValue(newValue);
    fetchApplicationsByTab(newValue);
  };
  
  const handleComplaintTabChange = (event, newValue) => {
    setComplaintTabValue(newValue);
    setComplaintPagination({
      ...complaintPagination,
      currentPage: 1 // Reset to first page when changing tabs
    });
    fetchComplaintsByTab(newValue);
  };
  
  const handleComplaintSearchChange = (e) => {
    setComplaintSearchTerm(e.target.value);
  };
  
  const handleComplaintSearch = () => {
    setComplaintPagination({
      ...complaintPagination,
      currentPage: 1 // Reset to first page when searching
    });
    fetchComplaintsByTab(complaintTabValue);
  };
  
  const handleComplaintSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleComplaintSearch();
    }
  };
  
  const handleComplaintPageChange = (event, newPage) => {
    setComplaintPagination({
      ...complaintPagination,
      currentPage: newPage + 1
    });
    fetchComplaintsByTab(complaintTabValue);
  };
  
  const handleComplaintLimitChange = (event) => {
    const newLimit = parseInt(event.target.value, 10);
    setComplaintPagination({
      ...complaintPagination,
      limit: newLimit,
      currentPage: 1 // Reset to first page when changing limit
    });
    fetchComplaintsByTab(complaintTabValue);
  };
  
  const handleComplaintSortChange = (column) => {
    const newOrder = complaintSortBy === column && complaintSortOrder === 'asc' ? 'desc' : 'asc';
    setComplaintSortBy(column);
    setComplaintSortOrder(newOrder);
    fetchComplaintsByTab(complaintTabValue);
  };
  
  const handleComplaintRefresh = () => {
    fetchComplaintsByTab(complaintTabValue);
  };
  
  const handleAppPageChange = (event, newPage) => {
    fetchApplicationsPage(newPage + 1);
  };
  
  const fetchApplicationsPage = async (page) => {
    setAppLoading(true);
    try {
      let status = '';
      if (appTabValue === 1) status = 'pending';
      else if (appTabValue === 2) status = 'approved';
      else if (appTabValue === 3) status = 'rejected';
      
      const response = await getAdminAllApplications({
        page,
        limit: appPagination.limit,
        sortBy: appSortBy,
        order: appSortOrder,
        status,
        search: appSearchTerm
      });
      
      setApplications(response.applications || []);
      setAppPagination({
        currentPage: response.pagination?.currentPage || 1,
        limit: response.pagination?.limit || 10,
        totalCount: response.pagination?.totalCount || 0,
        totalPages: response.pagination?.totalPages || 0
      });
      setAppError(null);
    } catch (err) {
      console.error("Error fetching applications page:", err);
      setAppError("Failed to fetch applications. Please try again later.");
    } finally {
      setAppLoading(false);
    }
  };
  
  const handleAppLimitChange = (event) => {
    const newLimit = parseInt(event.target.value);
    setAppPagination({
      ...appPagination,
      limit: newLimit
    });
    
    fetchApplicationsWithLimit(newLimit);
  };
  
  const fetchApplicationsWithLimit = async (limit) => {
    setAppLoading(true);
    try {
      let status = '';
      if (appTabValue === 1) status = 'pending';
      else if (appTabValue === 2) status = 'approved';
      else if (appTabValue === 3) status = 'rejected';
      
      const response = await getAdminAllApplications({
        page: 1,
        limit,
        sortBy: appSortBy,
        order: appSortOrder,
        status,
        search: appSearchTerm
      });
      
      setApplications(response.applications || []);
      setAppPagination({
        currentPage: response.pagination?.currentPage || 1,
        limit: response.pagination?.limit || 10,
        totalCount: response.pagination?.totalCount || 0,
        totalPages: response.pagination?.totalPages || 0
      });
      setAppError(null);
    } catch (err) {
      console.error("Error fetching applications with new limit:", err);
      setAppError("Failed to fetch applications. Please try again later.");
    } finally {
      setAppLoading(false);
    }
  };
  
  const handleAppSearchChange = (event) => {
    setAppSearchTerm(event.target.value);
  };
  
  const handleAppSearch = () => {
    fetchApplicationsSearch();
  };
  
  const handleAppSearchKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleAppSearch();
    }
  };
  
  const fetchApplicationsSearch = async () => {
    setAppLoading(true);
    try {
      let status = '';
      if (appTabValue === 1) status = 'pending';
      else if (appTabValue === 2) status = 'approved';
      else if (appTabValue === 3) status = 'rejected';
      
      const response = await getAdminAllApplications({
        page: 1,
        limit: appPagination.limit,
        sortBy: appSortBy,
        order: appSortOrder,
        status,
        search: appSearchTerm
      });
      
      setApplications(response.applications || []);
      setAppPagination({
        currentPage: response.pagination?.currentPage || 1,
        limit: response.pagination?.limit || 10,
        totalCount: response.pagination?.totalCount || 0,
        totalPages: response.pagination?.totalPages || 0
      });
      setAppError(null);
    } catch (err) {
      console.error("Error searching applications:", err);
      setAppError("Failed to search applications. Please try again later.");
    } finally {
      setAppLoading(false);
    }
  };
  
  const handleAppSortChange = (column) => {
    const newOrder = appSortBy === column && appSortOrder === 'asc' ? 'desc' : 'asc';
    setAppSortBy(column);
    setAppSortOrder(newOrder);
    
    fetchApplicationsSort(column, newOrder);
  };
  
  const fetchApplicationsSort = async (column, order) => {
    setAppLoading(true);
    try {
      let status = '';
      if (appTabValue === 1) status = 'pending';
      else if (appTabValue === 2) status = 'approved';
      else if (appTabValue === 3) status = 'rejected';
      
      const response = await getAdminAllApplications({
        page: appPagination.currentPage,
        limit: appPagination.limit,
        sortBy: column,
        order,
        status,
        search: appSearchTerm
      });
      
      setApplications(response.applications || []);
      setAppPagination({
        currentPage: response.pagination?.currentPage || 1,
        limit: response.pagination?.limit || 10,
        totalCount: response.pagination?.totalCount || 0,
        totalPages: response.pagination?.totalPages || 0
      });
      setAppError(null);
    } catch (err) {
      console.error("Error sorting applications:", err);
      setAppError("Failed to sort applications. Please try again later.");
    } finally {
      setAppLoading(false);
    }
  };
  
  const handleAppRefresh = () => {
    fetchApplicationsByTab(appTabValue);
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
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
                      <Typography variant="h6">Loan Applications</Typography>
                      <Typography variant="h4">{stats.pendingLoans}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Pending applications requiring review
                      </Typography>
                    </CardContent>
                    <Box sx={{ p: 2, pt: 0 }}>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        fullWidth
                        startIcon={<Description />}
                        onClick={() => navigate('/admin/applications')}
                      >
                        Manage Applications
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              </Grid>

              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="dashboard tabs">
                  <Tab label="User Management" />
                  <Tab label="Loan Overview" />
                  <Tab label="Loan Applications" />
                  <Tab label="Complaint Management" />
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
                      startIcon={<PersonAdd />}
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
                            startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />
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
                          startIcon={<FilterList />}
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
                                        icon={user.active ? <CheckCircle /> : <Block />}
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
                                            <Edit fontSize="small" />
                                          </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Reset Password">
                                          <IconButton 
                                            size="small" 
                                            color="warning"
                                            onClick={() => handleOpenResetDialog(user)}
                                          >
                                            <LockReset fontSize="small" />
                                          </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Change Role">
                                          <IconButton 
                                            size="small" 
                                            color="info"
                                            onClick={() => handleOpenRoleDialog(user)}
                                          >
                                            <AdminPanelSettings fontSize="small" />
                                          </IconButton>
                                        </Tooltip>
                                        <Tooltip title={user.active ? "Deactivate Account" : "Activate Account"}>
                                          <IconButton 
                                            size="small" 
                                            color={user.active ? "default" : "success"}
                                            onClick={() => handleToggleActive(user)}
                                          >
                                            {user.active ? <Block fontSize="small" /> : <CheckCircle fontSize="small" />}
                                          </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete User">
                                          <IconButton 
                                            size="small" 
                                            color="error"
                                            onClick={() => handleOpenDeleteDialog(user)}
                                          >
                                            <Delete fontSize="small" />
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

              {/* Loan Applications Tab */}
              {tabValue === 2 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
                    <Typography variant="h6">Loan Applications Management</Typography>
                    <Button 
                      variant="outlined" 
                      startIcon={<Refresh />}
                      onClick={handleAppRefresh}
                      disabled={appLoading}
                    >
                      Refresh
                    </Button>
                  </Box>
                  
                  {appError && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                      {appError}
                    </Alert>
                  )}
                  
                  {/* Tabs */}
                  <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs 
                      value={appTabValue} 
                      onChange={handleAppTabChange}
                      indicatorColor="primary"
                      textColor="primary"
                      variant="fullWidth"
                    >
                      <Tab 
                        icon={<Dashboard />} 
                        label="All Applications" 
                        iconPosition="start"
                      />
                      <Tab 
                        icon={<Pending />} 
                        label="Pending" 
                        iconPosition="start"
                      />
                      <Tab 
                        icon={<CheckCircle />} 
                        label="Approved" 
                        iconPosition="start"
                      />
                      <Tab 
                        icon={<Block />} 
                        label="Rejected" 
                        iconPosition="start"
                      />
                    </Tabs>
                  </Box>
                  
                  {/* Search Bar */}
                  <Box sx={{ mb: 3 }}>
                    <TextField
                      fullWidth
                      placeholder="Search by client name or purpose"
                      variant="outlined"
                      size="small"
                      value={appSearchTerm}
                      onChange={handleAppSearchChange}
                      onKeyPress={handleAppSearchKeyPress}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handleAppSearch} edge="end">
                              <FilterList />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                  
                  {/* Applications Table */}
                  {appLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <>
                      <TableContainer component={Paper} elevation={2}>
                        <Table>
                          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableRow>
                              <TableCell>
                                <Box 
                                  sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    cursor: 'pointer' 
                                  }}
                                  onClick={() => handleAppSortChange('_id')}
                                >
                                  Application ID
                                  {appSortBy === '_id' && (
                                    appSortOrder === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />
                                  )}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box 
                                  sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    cursor: 'pointer' 
                                  }}
                                  onClick={() => handleAppSortChange('clientName')}
                                >
                                  Client Name
                                  {appSortBy === 'clientName' && (
                                    appSortOrder === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />
                                  )}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box 
                                  sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    cursor: 'pointer' 
                                  }}
                                  onClick={() => handleAppSortChange('loanAmount')}
                                >
                                  Loan Amount
                                  {appSortBy === 'loanAmount' && (
                                    appSortOrder === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />
                                  )}
                                </Box>
                              </TableCell>
                              <TableCell>Purpose</TableCell>
                              <TableCell>
                                <Box 
                                  sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    cursor: 'pointer' 
                                  }}
                                  onClick={() => handleAppSortChange('applicationDate')}
                                >
                                  Application Date
                                  {appSortBy === 'applicationDate' && (
                                    appSortOrder === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />
                                  )}
                                </Box>
                              </TableCell>
                              <TableCell>Status</TableCell>
                              <TableCell align="center">Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {applications.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={7} align="center">
                                  <Typography variant="body1" sx={{ py: 2 }}>
                                    No loan applications found
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            ) : (
                              applications.map((application) => (
                                <TableRow key={application.applicationId} hover>
                                  <TableCell>
                                    <Typography variant="body2" fontFamily="monospace">
                                      {application.applicationId.substring(0, 8)}...
                                    </Typography>
                                  </TableCell>
                                  <TableCell>{application.clientName}</TableCell>
                                  <TableCell>{formatCurrency(application.loanAmount)}</TableCell>
                                  <TableCell>{application.purpose}</TableCell>
                                  <TableCell>{formatDate(application.applicationDate)}</TableCell>
                                  <TableCell>
                                    <Chip 
                                      label={application.status || 'pending'} 
                                      size="small"
                                      color={
                                        application.status === 'approved' ? 'success' :
                                        application.status === 'rejected' ? 'error' :
                                        'warning'
                                      }
                                    />
                                  </TableCell>
                                  <TableCell align="center">
                                    <Button
                                      variant="outlined"
                                      size="small"
                                      startIcon={<Visibility />}
                                      onClick={() => navigate(`/admin/applications/${application.applicationId}`)}
                                    >
                                      View
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      
                      {/* Pagination */}
                      <TablePagination
                        component="div"
                        count={appPagination.totalCount}
                        page={appPagination.currentPage - 1}
                        onPageChange={handleAppPageChange}
                        rowsPerPage={parseInt(appPagination.limit || 10)}
                        onRowsPerPageChange={handleAppLimitChange}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
                        sx={{ mt: 2 }}
                      />
                    </>
                  )}
                </Box>
              )}
              
              {/* Complaint Management Tab */}
              {tabValue === 3 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
                    <Typography variant="h6">Complaint Management</Typography>
                    <Button 
                      variant="outlined" 
                      startIcon={<Refresh />}
                      onClick={handleComplaintRefresh}
                      disabled={complaintLoading}
                    >
                      Refresh
                    </Button>
                  </Box>
                  
                  {complaintError && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                      {complaintError}
                    </Alert>
                  )}
                  
                  {/* Tabs */}
                  <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs 
                      value={complaintTabValue} 
                      onChange={handleComplaintTabChange}
                      indicatorColor="primary"
                      textColor="primary"
                      variant="fullWidth"
                    >
                      <Tab 
                        icon={<Dashboard />} 
                        label="All Complaints" 
                        iconPosition="start"
                      />
                      <Tab 
                        icon={<Pending />} 
                        label="Open" 
                        iconPosition="start"
                      />
                      <Tab 
                        icon={<AdminPanelSettings />} 
                        label="Assigned" 
                        iconPosition="start"
                      />
                      <Tab 
                        icon={<CheckCircle />} 
                        label="Resolved" 
                        iconPosition="start"
                      />
                    </Tabs>
                  </Box>
                  
                  {/* Search Bar */}
                  <Box sx={{ mb: 3 }}>
                    <TextField
                      fullWidth
                      placeholder="Search by client name or description"
                      variant="outlined"
                      size="small"
                      value={complaintSearchTerm}
                      onChange={handleComplaintSearchChange}
                      onKeyPress={handleComplaintSearchKeyPress}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handleComplaintSearch} edge="end">
                              <FilterList />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                  
                  {/* Complaints Table */}
                  {complaintLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <>
                      <TableContainer component={Paper} elevation={2}>
                        <Table>
                          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableRow>
                              <TableCell>
                                <Box 
                                  sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    cursor: 'pointer' 
                                  }}
                                  onClick={() => handleComplaintSortChange('_id')}
                                >
                                  Complaint ID
                                  {complaintSortBy === '_id' && (
                                    complaintSortOrder === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />
                                  )}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box 
                                  sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    cursor: 'pointer' 
                                  }}
                                  onClick={() => handleComplaintSortChange('clientName')}
                                >
                                  Client Name
                                  {complaintSortBy === 'clientName' && (
                                    complaintSortOrder === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />
                                  )}
                                </Box>
                              </TableCell>
                              <TableCell>Description</TableCell>
                              <TableCell>
                                <Box 
                                  sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    cursor: 'pointer' 
                                  }}
                                  onClick={() => handleComplaintSortChange('status')}
                                >
                                  Status
                                  {complaintSortBy === 'status' && (
                                    complaintSortOrder === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />
                                  )}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box 
                                  sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    cursor: 'pointer' 
                                  }}
                                  onClick={() => handleComplaintSortChange('submittedAt')}
                                >
                                  Submitted At
                                  {complaintSortBy === 'submittedAt' && (
                                    complaintSortOrder === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />
                                  )}
                                </Box>
                              </TableCell>
                              <TableCell>Assigned To</TableCell>
                              <TableCell align="center">Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {complaints.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={7} align="center">
                                  <Typography variant="body1" sx={{ py: 2 }}>
                                    No complaints found
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            ) : (
                              complaints.map((complaint) => (
                                <TableRow key={complaint.complaintId} hover>
                                  <TableCell>
                                    <Typography variant="body2" fontFamily="monospace">
                                      {complaint.complaintId.substring(0, 8)}...
                                    </Typography>
                                  </TableCell>
                                  <TableCell>{complaint.clientName}</TableCell>
                                  <TableCell>
                                    {complaint.description.length > 50 
                                      ? `${complaint.description.substring(0, 50)}...` 
                                      : complaint.description}
                                  </TableCell>
                                  <TableCell>
                                    <Chip 
                                      label={complaint.status} 
                                      color={
                                        complaint.status === 'resolved' ? 'success' :
                                        complaint.status === 'assigned' ? 'info' :
                                        'warning'
                                      }
                                      size="small"
                                    />
                                  </TableCell>
                                  <TableCell>{formatDate(complaint.submittedAt)}</TableCell>
                                  <TableCell>
                                    {complaint.assignedTo ? complaint.assignedTo.name : 'Unassigned'}
                                  </TableCell>
                                  <TableCell align="center">
                                    <Button
                                      variant="outlined"
                                      size="small"
                                      startIcon={<Visibility />}
                                      onClick={() => navigate(`/admin/complaints/${complaint.complaintId}`)}
                                    >
                                      View
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      
                      {/* Pagination */}
                      <TablePagination
                        component="div"
                        count={complaintPagination.totalCount}
                        page={complaintPagination.currentPage - 1}
                        onPageChange={handleComplaintPageChange}
                        rowsPerPage={parseInt(complaintPagination.limit || 10)}
                        onRowsPerPageChange={handleComplaintLimitChange}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
                        sx={{ mt: 2 }}
                      />
                    </>
                  )}
                  
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<CommentIcon />}
                      onClick={() => navigate('/admin/complaints')}
                    >
                      View All Complaints
                    </Button>
                  </Box>
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
                size="small"
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
                size="small"
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
                size="small"
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
                size="small"
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
                size="small"
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
