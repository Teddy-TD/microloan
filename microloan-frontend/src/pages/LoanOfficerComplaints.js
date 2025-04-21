import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Alert,
  CircularProgress,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getAssignedComplaints } from '../services/api';

const LoanOfficerComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ currentPage: 1, limit: 10, totalCount: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const navigate = useNavigate();

  const fetchComplaints = async (page = pagination.currentPage, limit = pagination.limit) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAssignedComplaints({ page, limit, status: statusFilter, search: searchTerm });
      setComplaints(response.complaints);
      setPagination({
        currentPage: response.pagination.currentPage,
        limit: response.pagination.limit,
        totalCount: response.pagination.totalCount
      });
    } catch (err) {
      console.error('Error fetching assigned complaints:', err);
      setError(err.message || 'Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints(1);
  }, [statusFilter, searchTerm]);

  const handleChangePage = (event, newPage) => {
    fetchComplaints(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    fetchComplaints(1, parseInt(event.target.value, 10));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Assigned Complaints
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? (
        <CircularProgress />
      ) : (
        <Paper>
          <Box sx={{ p: 2, display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
            <TextField
              label="Search"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => { if (e.key === 'Enter') fetchComplaints(1); }}
            />
            <FormControl size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="assigned">Assigned</MenuItem>
                <MenuItem value="resolved">Resolved</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Complaint ID</TableCell>
                <TableCell>Client Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Submitted Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {complaints.map((c) => (
                <TableRow key={c.complaintId} hover>
                  <TableCell>{c.complaintId.substring(0, 8)}...</TableCell>
                  <TableCell>{c.clientName}</TableCell>
                  <TableCell>
                    {c.description.length > 50 ? `${c.description.substring(0, 50)}...` : c.description}
                  </TableCell>
                  <TableCell>{new Date(c.submittedAt).toLocaleDateString()}</TableCell>
                  <TableCell>{c.status}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => navigate(`/loan-officer/complaints/${c.complaintId}`)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={pagination.totalCount}
            page={pagination.currentPage - 1}
            rowsPerPage={pagination.limit}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Paper>
      )}
    </Container>
  );
};

export default LoanOfficerComplaints;
