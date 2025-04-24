import { useEffect, useState } from "react";
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  CircularProgress, 
  Alert,
  Tabs,
  Tab,
  Paper,
  Card,
  Grid,
  TextField
} from "@mui/material";
import { getClientLoans, getUserProfile, getSavingsDetails } from "../services/api";
import { useNavigate } from "react-router-dom";
import LoanApplicationForm from "../components/LoanApplicationForm";
import LoanApplicationsList from "../components/LoanApplicationsList";

const ClientDashboard = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);
  const [savingsBalance, setSavingsBalance] = useState(0);
  const [savingsLoading, setSavingsLoading] = useState(true);
  const [savingsError, setSavingsError] = useState(null);
  const [inputIncome, setInputIncome] = useState("");
  const [inputSavings, setInputSavings] = useState("");
  const [calcIncomeScore, setCalcIncomeScore] = useState(null);
  const [calcSavingsScore, setCalcSavingsScore] = useState(null);
  const [calcTotalScore, setCalcTotalScore] = useState(null);

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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setUserProfile(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setProfileError("Failed to load profile.");
      } finally {
        setProfileLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchSavings = async () => {
      try {
        const data = await getSavingsDetails();
        setSavingsBalance(data.balance ?? 0);
      } catch (err) {
        console.error("Error fetching savings:", err);
        setSavingsError("Failed to load savings.");
      } finally {
        setSavingsLoading(false);
      }
    };
    fetchSavings();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCalculate = () => {
    const income = parseFloat(inputIncome) || 0;
    const savings = parseFloat(inputSavings) || 0;
    const incomeScore = Math.min(Math.floor(income / 100), 50);
    const savingsScore = Math.min(Math.floor(savings / 100), 50);
    setCalcIncomeScore(incomeScore);
    setCalcSavingsScore(savingsScore);
    setCalcTotalScore(incomeScore + savingsScore);
  };

  return (
    <Box sx={{ py: 4, backgroundColor: "#F5F7FA", minHeight: "100vh" }}>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Typography variant="h4" fontWeight="bold" color="#1E3A8A" sx={{ mb: 3 }}>
            Client Dashboard
          </Typography>

          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Dashboard Overview" />
            <Tab label="Apply for Loan" />
            <Tab label="My Applications" />
            <Tab label="Credit Score" />
          </Tabs>

          {/* Dashboard Overview Tab */}
          {tabValue === 0 && (
            <Box>
              {/* ✅ Show Loading Spinner */}
              {loading && <CircularProgress />}

              {/* ✅ Show Error Message */}
              {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}

              {/* Quick Actions */}
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button 
                  variant="contained" 
                  sx={{ backgroundColor: "#3B82F6", "&:hover": { backgroundColor: "#1E3A8A" } }}
                  onClick={() => setTabValue(1)}
                >
                  Apply for a New Loan
                </Button>
                
                <Button 
                  variant="contained"
                  color="success"
                  onClick={() => navigate("/repayment")}
                >
                  Make a Payment
                </Button>
                
                <Button 
                  variant="contained"
                  color="secondary"
                  onClick={() => navigate("/complaints")}
                >
                  Submit Complaint
                </Button>
                
                <Button 
                  variant="contained"
                  color="info"
                  onClick={() => navigate("/balance")}
                >
                  View Balances
                </Button>
                {profileLoading ? (
                  <CircularProgress size={24} />
                ) : profileError ? (
                  <Typography variant="body2" color="error" sx={{ alignSelf: "center" }}>
                    --
                  </Typography>
                ) : (
                  <Button variant="contained" color="warning" sx={{ textTransform: "none" }}>
                    Credit Score: {userProfile.creditScore}
                  </Button>
                )}
                
                <Button 
                  variant="contained"
                  color="primary"
                  onClick={() => navigate("/profile")}
                >
                  My Profile
                </Button>
                
                <Button 
                  variant="outlined" 
                  onClick={() => setTabValue(2)}
                >
                  View My Applications
                </Button>
              </Box>

              {/* ✅ Show Loans Only If Available */}
              <Typography variant="h6" sx={{ mb: 2 }}>Recent Loans</Typography>
              {loans.length === 0 ? (
                <Typography>No loans found. Apply for your first loan today!</Typography>
              ) : (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><b>Amount</b></TableCell>
                      <TableCell><b>Duration</b></TableCell>
                      <TableCell><b>Purpose</b></TableCell>
                      <TableCell><b>Status</b></TableCell>
                      <TableCell><b>Action</b></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loans.slice(0, 5).map((loan) => (
                      <TableRow key={loan._id}>
                        <TableCell>{loan.amount.toLocaleString()} Birr</TableCell>
                        <TableCell>{loan.duration} months</TableCell>
                        <TableCell>{loan.purpose}</TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              backgroundColor: 
                                loan.status === "approved" ? "#DFF7E8" : 
                                loan.status === "rejected" ? "#FFEAEA" : "#FFF9E6",
                              color: 
                                loan.status === "approved" ? "#0D9F4F" : 
                                loan.status === "rejected" ? "#E53E3E" : "#B7791F",
                              borderRadius: 1,
                              px: 1,
                              py: 0.5,
                              display: "inline-block",
                              fontWeight: "medium"
                            }}
                          >
                            {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                          </Box>
                        </TableCell>
                        <TableCell>
                          {loan.status === "approved" && (
                            <Button 
                              variant="contained" 
                              size="small" 
                              sx={{ backgroundColor: "#FFD700", "&:hover": { backgroundColor: "#E5C100" } }}
                              onClick={() => navigate(`/repay-loan/${loan._id}`)}
                            >
                              Repay
                            </Button>
                          )}
                          <Button 
                            variant="outlined" 
                            size="small"
                            sx={{ ml: 1 }}
                            onClick={() => navigate(`/loans/${loan._id}`)}
                          >
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              
              {loans.length > 5 && (
                <Box sx={{ mt: 2, textAlign: 'right' }}>
                  <Button 
                    variant="text" 
                    onClick={() => setTabValue(2)}
                  >
                    View All Applications
                  </Button>
                </Box>
              )}
            </Box>
          )}

          {/* Apply for Loan Tab */}
          {tabValue === 1 && (
            <LoanApplicationForm />
          )}

          {/* My Applications Tab */}
          {tabValue === 2 && (
            <LoanApplicationsList />
          )}

          {/* Credit Score Tab */}
          {tabValue === 3 && (
            <Box>
              <Typography variant="h5" fontWeight="bold" color="primary" sx={{ mb: 3 }}>
                Credit Score Calculator
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Monthly Income"
                    variant="outlined"
                    fullWidth
                    value={inputIncome}
                    onChange={(e) => setInputIncome(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Savings Balance"
                    variant="outlined"
                    fullWidth
                    value={inputSavings}
                    onChange={(e) => setInputSavings(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" onClick={handleCalculate}>
                    Calculate Credit Score
                  </Button>
                </Grid>
              </Grid>
              {calcTotalScore !== null && (
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4} md={3}>
                    <Card variant="outlined" sx={{ p: 2, textAlign: "center" }}>
                      <Typography variant="subtitle2" color="textSecondary">Income Score</Typography>
                      <CircularProgress variant="determinate" value={(calcIncomeScore/50)*100} size={60} thickness={4} sx={{ my: 1 }} />
                      <Typography variant="h5">{calcIncomeScore}</Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4} md={3}>
                    <Card variant="outlined" sx={{ p: 2, textAlign: "center" }}>
                      <Typography variant="subtitle2" color="textSecondary">Savings Score</Typography>
                      <CircularProgress variant="determinate" value={(calcSavingsScore/50)*100} size={60} thickness={4} sx={{ my: 1 }} />
                      <Typography variant="h5">{calcSavingsScore}</Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4} md={3}>
                    <Card variant="outlined" sx={{ p: 2, textAlign: "center" }}>
                      <Typography variant="subtitle2" color="textSecondary">Total Score</Typography>
                      <CircularProgress variant="determinate" value={calcTotalScore} size={80} thickness={4} sx={{ my: 1 }} />
                      <Typography variant="h4">{calcTotalScore}</Typography>
                    </Card>
                  </Grid>
                </Grid>
              )}
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default ClientDashboard;
