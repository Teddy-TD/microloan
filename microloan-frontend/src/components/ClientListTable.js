import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  Typography, 
  Box, 
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  Tooltip
} from '@mui/material';
import { 
  Search as SearchIcon,
  FilterList as FilterIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const ClientListTable = ({ 
  clients, 
  loading, 
  error, 
  pagination, 
  onPageChange, 
  onLimitChange,
  onSortChange,
  sortBy,
  sortOrder,
  onFilterChange,
  filters
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleViewClient = (clientId) => {
    navigate(`/loan-officer/clients/${clientId}`);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    onFilterChange({ ...filters, search: searchTerm });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSortClick = (column) => {
    if (sortBy === column) {
      onSortChange(column, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      onSortChange(column, 'asc');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const renderSortIcon = (column) => {
    if (sortBy !== column) return null;
    
    return sortOrder === 'asc' 
      ? <ArrowUpwardIcon fontSize="small" /> 
      : <ArrowDownwardIcon fontSize="small" />;
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
      <Box sx={{ my: 2 }}>
        <Typography color="error" variant="body1">
          Error loading clients: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Search Bar */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search by name, email or phone"
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyPress={handleKeyPress}
          sx={{ mr: 2, flexGrow: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSearch} edge="end">
                  <FilterIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Clients Table */}
      <TableContainer component={Paper} elevation={2}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    cursor: 'pointer' 
                  }}
                  onClick={() => handleSortClick('name')}
                >
                  Name
                  {renderSortIcon('name')}
                </Box>
              </TableCell>
              <TableCell>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    cursor: 'pointer' 
                  }}
                  onClick={() => handleSortClick('email')}
                >
                  Email
                  {renderSortIcon('email')}
                </Box>
              </TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    cursor: 'pointer' 
                  }}
                  onClick={() => handleSortClick('createdAt')}
                >
                  Created At
                  {renderSortIcon('createdAt')}
                </Box>
              </TableCell>
              <TableCell>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    cursor: 'pointer' 
                  }}
                  onClick={() => handleSortClick('lastReviewedAt')}
                >
                  Last Reviewed
                  {renderSortIcon('lastReviewedAt')}
                </Box>
              </TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body1" sx={{ py: 2 }}>
                    No clients found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              clients.map((client) => (
                <TableRow key={client._id} hover>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.phone || '-'}</TableCell>
                  <TableCell>{formatDate(client.createdAt)}</TableCell>
                  <TableCell>{formatDate(client.lastReviewedAt)}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="View/Edit Client Profile">
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleViewClient(client._id)}
                      >
                        View/Edit
                      </Button>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Pagination */}
      {pagination && (
        <TablePagination
          component="div"
          count={pagination.totalCount}
          page={pagination.currentPage - 1}
          onPageChange={(e, newPage) => onPageChange(newPage + 1)}
          rowsPerPage={parseInt(pagination.limit || 10)}
          onRowsPerPageChange={(e) => onLimitChange(parseInt(e.target.value))}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
          sx={{ mt: 2 }}
        />
      )}
    </Box>
  );
};

export default ClientListTable;
