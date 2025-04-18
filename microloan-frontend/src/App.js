import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import News from "./pages/News";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import LoanManagement from "./pages/LoanManagement";
import BorrowerManagement from "./pages/BorrowerManagement";
import MyLoans from "./pages/MyLoans";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

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

          {/* Protected Dashboard Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardLayout user={user} onLogout={logout} />}>
              <Route index element={<Dashboard user={user} />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
              
              {/* Admin Routes */}
              <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
                <Route path="users" element={<UserManagement />} />
                <Route path="loans" element={<LoanManagement />} />
              </Route>

              {/* Loan Officer Routes */}
              <Route element={<PrivateRoute allowedRoles={["loan_officer", "admin"]} />}>
                <Route path="borrowers" element={<BorrowerManagement />} />
                <Route path="loans" element={<LoanManagement />} />
              </Route>

              {/* Client Routes */}
              <Route element={<PrivateRoute allowedRoles={["client"]} />}>
                <Route path="my-loans" element={<MyLoans />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AnimatedRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
