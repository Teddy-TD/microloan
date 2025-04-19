import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Breadcrumbs,
  Link,
  Button
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  ArrowBack as ArrowBackIcon,
  Comment as CommentIcon
} from '@mui/icons-material';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import AdminComplaintDetail from '../components/AdminComplaintDetail';

const AdminComplaintDetailPage = () => {
  const { complaintId } = useParams();
  const navigate = useNavigate();

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
        <Link 
          component={RouterLink} 
          to="/admin/complaints" 
          underline="hover" 
          color="inherit"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <CommentIcon sx={{ mr: 0.5 }} fontSize="small" />
          Complaints
        </Link>
        <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
          Complaint Details
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
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/admin/complaints')}
            sx={{ mr: 2 }}
          >
            Back to Complaints
          </Button>
          <Typography variant="h5" component="h1" fontWeight="bold">
            Complaint Details
          </Typography>
        </Box>

        <AdminComplaintDetail complaintId={complaintId} />
      </Paper>
    </Container>
  );
};

export default AdminComplaintDetailPage;
