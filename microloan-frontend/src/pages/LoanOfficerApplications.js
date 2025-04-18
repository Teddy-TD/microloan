import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Tabs,
  Tab,
  Alert,
  Button,
  Breadcrumbs,
  Link
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  Pending as PendingIcon,
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import LoanApplicationsTable from '../components/LoanApplicationsTable';
import { getAllApplications, getPendingApplications } from '../services/api';

const LoanOfficerApplications = () => {
  const [tabValue, setTabValue] = useState(0);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0
  });
  const [sortBy, setSortBy] = useState('applicationDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filters, setFilters] = useState({
    status: 'pending',
    search: ''
  });

  useEffect(() => {
    fetchApplications();
  }, [tabValue, pagination.currentPage, pagination.limit, sortBy, sortOrder, filters]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (tabValue === 0) {
        // All applications with current filter
        response = await getAllApplications({
          page: pagination.currentPage,
          limit: pagination.limit,
          sortBy,
          order: sortOrder,
          status: filters.status,
          search: filters.search
        });
      } else if (tabValue === 1) {
        // Pending applications
        response = await getPendingApplications({
          page: pagination.currentPage,
          limit: pagination.limit,
          sortBy,
          order: sortOrder,
          search: filters.search
        });
      } else {
        // Filtered by status based on tab
        const statusMap = {
          2: 'approved',
          3: 'rejected'
        };
        
        response = await getAllApplications({
          page: pagination.currentPage,
          limit: pagination.limit,
          sortBy,
          order: sortOrder,
          status: statusMap[tabValue],
          search: filters.search
        });
      }
      
      setApplications(response.loans);
      setPagination({
        currentPage: response.pagination.currentPage,
        limit: pagination.limit,
        totalCount: response.pagination.totalCount,
        totalPages: response.pagination.totalPages
      });
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError(err.message || 'Failed to load loan applications');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setPagination({
      ...pagination,
      currentPage: 1 // Reset to first page when changing tabs
    });
    
    // Update filters based on tab
    if (newValue === 0) {
      setFilters({ ...filters, status: '' }); // All applications
    } else if (newValue === 1) {
      setFilters({ ...filters, status: 'pending' }); // Pending applications
    } else if (newValue === 2) {
      setFilters({ ...filters, status: 'approved' }); // Approved applications
    } else if (newValue === 3) {
      setFilters({ ...filters, status: 'rejected' }); // Rejected applications
    }
  };

  const handlePageChange = (newPage) => {
    setPagination({
      ...pagination,
      currentPage: newPage
    });
  };

  const handleLimitChange = (newLimit) => {
    setPagination({
      ...pagination,
      limit: newLimit,
      currentPage: 1 // Reset to first page when changing limit
    });
  };

  const handleSortChange = (column, order) => {
    setSortBy(column);
    setSortOrder(order);
  };

  const handleFilterChange = (newFilters) => {
    setFilters({
      ...filters,
      ...newFilters
    });
    setPagination({
      ...pagination,
      currentPage: 1 // Reset to first page when changing filters
    });
  };

  const handleRefresh = () => {
    fetchApplications();
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
          Loan Applications
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h1" fontWeight="bold">
            Loan Applications
          </Typography>
          
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<DashboardIcon />} label="All Applications" />
          <Tab icon={<PendingIcon />} label="Pending" />
          <Tab icon={<ApprovedIcon />} label="Approved" />
          <Tab icon={<RejectedIcon />} label="Rejected" />
        </Tabs>

        <LoanApplicationsTable 
          applications={applications}
          loading={loading}
          error={error}
          pagination={pagination}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </Paper>
    </Container>
  );
};

export default LoanOfficerApplications;
