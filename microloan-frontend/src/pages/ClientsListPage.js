import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Alert,
  Button,
  Breadcrumbs,
  Link
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import ClientListTable from '../components/ClientListTable';
import { getAllClients } from '../services/api';

const ClientsListPage = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filters, setFilters] = useState({
    search: ''
  });

  useEffect(() => {
    fetchClients();
  }, [pagination.currentPage, pagination.limit, sortBy, sortOrder, filters]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getAllClients({
        page: pagination.currentPage,
        limit: pagination.limit,
        sortBy,
        order: sortOrder,
        search: filters.search
      });
      
      setClients(response.clients);
      setPagination({
        currentPage: response.pagination.currentPage,
        limit: pagination.limit,
        totalCount: response.pagination.totalCount,
        totalPages: response.pagination.totalPages
      });
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError(err.message || 'Failed to load clients');
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
    fetchClients();
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
          <PeopleIcon sx={{ mr: 0.5 }} fontSize="small" />
          Client Profiles
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
            Client Profiles
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

        <ClientListTable 
          clients={clients}
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

export default ClientsListPage;
