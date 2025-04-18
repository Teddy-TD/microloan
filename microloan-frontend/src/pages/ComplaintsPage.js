import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Tabs, 
  Tab 
} from '@mui/material';
import ComplaintForm from '../components/ComplaintForm';
import ComplaintsList from '../components/ComplaintsList';

const ComplaintsPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [refreshList, setRefreshList] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleComplaintSubmitted = () => {
    // Switch to the list tab and trigger a refresh
    setTabValue(1);
    setRefreshList(true);
  };

  return (
    <Box sx={{ py: 4, backgroundColor: "#F5F7FA", minHeight: "100vh" }}>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Typography variant="h4" fontWeight="bold" color="#1E3A8A" sx={{ mb: 3 }}>
            Complaints & Support
          </Typography>

          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Submit a Complaint" />
            <Tab label="My Complaints" />
          </Tabs>

          {/* Submit a Complaint Tab */}
          {tabValue === 0 && (
            <ComplaintForm onComplaintSubmitted={handleComplaintSubmitted} />
          )}

          {/* My Complaints Tab */}
          {tabValue === 1 && (
            <ComplaintsList key={refreshList ? 'refresh' : 'normal'} />
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default ComplaintsPage;
