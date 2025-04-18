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
  Chip,
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
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const LoanApplicationsTable = ({ 
  applications, 
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
  
  const handleViewApplication = (applicationId) => {
    navigate(`/loan-officer/applications/${applicationId}`);
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
          Error loading applications: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Search and Filter Bar */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search by client name or purpose"
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

      {/* Applications Table */}
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
                  onClick={() => handleSortClick('_id')}
                >
                  Application ID
                  {renderSortIcon('_id')}
                </Box>
              </TableCell>
              <TableCell>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    cursor: 'pointer' 
                  }}
                  onClick={() => handleSortClick('user.name')}
                >
                  Client Name
                  {renderSortIcon('user.name')}
                </Box>
              </TableCell>
              <TableCell>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    cursor: 'pointer' 
                  }}
                  onClick={() => handleSortClick('amount')}
                >
                  Loan Amount
                  {renderSortIcon('amount')}
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
                  onClick={() => handleSortClick('applicationDate')}
                >
                  Application Date
                  {renderSortIcon('applicationDate')}
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
                      label={application.status} 
                      size="small"
                      color={
                        application.status === 'approved' ? 'success' :
                        application.status === 'rejected' ? 'error' :
                        'warning'
                      }
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Application Details">
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewApplication(application.applicationId)}
                      >
                        View
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

export default LoanApplicationsTable;
