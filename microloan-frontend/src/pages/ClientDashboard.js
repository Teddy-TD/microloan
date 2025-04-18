import { useEffect, useState } from "react";
import { Box, Container, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, Alert } from "@mui/material";
import { getClientLoans } from "../services/api"; // ✅ Fetch loans from API
import { useNavigate } from "react-router-dom";

const ClientDashboard = () => {
  const [loans, setLoans] = useState([]); // ✅ Default state as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const data = await getClientLoans();
        console.log("✅ Loans fetched:", data);

        // ✅ Ensure `loans` is always an array
        if (Array.isArray(data)) {
          setLoans(data);
        } else {
          setLoans([]); // ✅ Prevents `map` error
          setError("Unexpected API response.");
        }
      } catch (err) {
        console.error("❌ Error fetching loans:", err);
        setError("Failed to fetch loans.");
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, []);

  return (
    <Box sx={{ py: 10, backgroundColor: "#F5F7FA", minHeight: "100vh" }}>
      <Container maxWidth="md" sx={{ background: "#fff", p: 4, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" fontWeight="bold" color="#1E3A8A" sx={{ mb: 3 }}>Client Dashboard</Typography>

        {/* ✅ Show Loading Spinner */}
        {loading && <CircularProgress />}

        {/* ✅ Show Error Message */}
        {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}

        {/* ✅ Apply for Loan Button */}
        <Button 
  variant="contained" 
  sx={{ backgroundColor: "#3B82F6", "&:hover": { backgroundColor: "#1E3A8A" }, mb: 3 }}
  onClick={() => navigate("/apply-loan")}
>
  Apply for a Loan
</Button>

        {/* ✅ Show Loans Only If Available */}
        <Typography variant="h6" sx={{ mb: 2 }}>Your Loans</Typography>
        {loans.length === 0 ? (
          <Typography>No loans found.</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Amount</b></TableCell>
                <TableCell><b>Duration</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell><b>Action</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loans.map((loan) => (
                <TableRow key={loan._id}>
                  <TableCell>${loan.amount}</TableCell>
                  <TableCell>{loan.duration} months</TableCell>
                  <TableCell>{loan.status}</TableCell>
                  <TableCell>
                    {loan.status === "approved" && (
                      <Button 
                        variant="contained" size="small" 
                        sx={{ backgroundColor: "#FFD700", "&:hover": { backgroundColor: "#E5C100" } }}
                        onClick={() => navigate(`/repay-loan/${loan._id}`)}
                      >
                        Repay
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Container>
    </Box>
  );
};

export default ClientDashboard;
