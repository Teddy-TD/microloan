import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  TablePagination,
  Button
} from '@mui/material';
import { getClientComplaints } from '../services/api';

const ComplaintsList = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const data = await getClientComplaints();
        setComplaints(data);
      } catch (err) {
        setError('Failed to load complaints. Please try again later.');
        console.error('Error fetching complaints:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved':
        return 'success';
      case 'assigned':
        return 'info';
      default:
        return 'warning';
    }
  };

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

  if (complaints.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 3, my: 2 }}>
        <Typography variant="body1" align="center">
          You haven't submitted any complaints yet.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, my: 3 }}>
      <Typography variant="h6" gutterBottom>
        My Complaints
      </Typography>
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date Submitted</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Response</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {complaints
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((complaint) => (
                <TableRow key={complaint._id}>
                  <TableCell>{formatDate(complaint.submittedAt)}</TableCell>
                  <TableCell>
                    {complaint.description.length > 100
                      ? `${complaint.description.substring(0, 100)}...`
                      : complaint.description}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={getStatusLabel(complaint.status)} 
                      color={getStatusColor(complaint.status)} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    {complaint.response 
                      ? (complaint.response.length > 100 
                          ? `${complaint.response.substring(0, 100)}...` 
                          : complaint.response)
                      : 'No response yet'}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outlined" 
                      size="small"
                      href={`/complaints/${complaint._id}`}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={complaints.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default ComplaintsList;
