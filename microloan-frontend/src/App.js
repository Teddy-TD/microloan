import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import News from "./pages/News";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import LoanOfficerDashboard from "./pages/LoanOfficerDashboard";
import ApplyLoan from "./pages/ApplyLoan";
import LoanRepaymentPage from "./pages/LoanRepaymentPage";
import ComplaintsPage from "./pages/ComplaintsPage";
import BalancePage from "./pages/BalancePage";
import LoanOfficerApplications from "./pages/LoanOfficerApplications";
import LoanApplicationDetailPage from "./pages/LoanApplicationDetailPage";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={location.pathname} 
        initial="initial" 
        animate="animate" 
        exit="exit" 
        variants={pageVariants}
      >
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/news" element={<News />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Client Routes */}
          <Route element={<PrivateRoute allowedRoles={["client"]} />}>
            <Route path="/client-dashboard" element={<ClientDashboard />} />
            <Route path="/apply-loan" element={<ApplyLoan />} />
            <Route path="/repayment" element={<LoanRepaymentPage />} />
            <Route path="/complaints" element={<ComplaintsPage />} />
            <Route path="/balance" element={<BalancePage />} />
          </Route>
          
          {/* Loan Officer Routes */}
          <Route element={<PrivateRoute allowedRoles={["loan_officer", "admin"]} />}>
            <Route path="/loan-officer-dashboard" element={<LoanOfficerDashboard />} />
            <Route path="/loan-officer/applications" element={<LoanOfficerApplications />} />
            <Route path="/loan-officer/applications/:applicationId" element={<LoanApplicationDetailPage />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
