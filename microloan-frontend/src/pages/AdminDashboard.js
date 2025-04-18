import { Box, Container, Typography } from "@mui/material";

const AdminDashboard = () => {
  return (
    <Box sx={{ py: 10, textAlign: "center" }}>
      <Container>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Admin Dashboard
        </Typography>
        <Typography variant="h6" mt={2}>
          Welcome to the Admin Dashboard. Manage users, loans, and reports here.
        </Typography>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
