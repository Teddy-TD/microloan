import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Breadcrumbs,
  Link,
  Button,
  Alert
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import AdminComplaintsTable from '../components/AdminComplaintsTable';
import { getAdminComplaints } from '../services/api';

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0
  });
  const [sortBy, setSortBy] = useState('submittedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filters, setFilters] = useState({
    status: '',
    search: ''
  });

  useEffect(() => {
    fetchComplaints();
  }, [pagination.currentPage, pagination.limit, sortBy, sortOrder, filters]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getAdminComplaints({
        page: pagination.currentPage,
        limit: pagination.limit,
        sortBy,
        order: sortOrder,
        status: filters.status,
        search: filters.search
      });
      
      setComplaints(response.complaints);
      setPagination({
        currentPage: response.pagination.currentPage,
        limit: pagination.limit,
        totalCount: response.pagination.totalCount,
        totalPages: response.pagination.totalPages
      });
    } catch (err) {
      console.error('Error fetching complaints:', err);
      setError(err.message || 'Failed to load complaints');
    } finally {
      setLoading(false);
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
    fetchComplaints();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link 
          component={RouterLink} 
          to="/admin-dashboard" 
          underline="hover" 
          color="inherit"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <DashboardIcon sx={{ mr: 0.5 }} fontSize="small" />
          Dashboard
        </Link>
        <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
          Complaint Management
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
            Complaint Management
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

        <AdminComplaintsTable 
          complaints={complaints}
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

export default AdminComplaints;
