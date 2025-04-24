import { Navigate, Outlet } from "react-router-dom";
import { getUser } from "../services/auth";

const PrivateRoute = ({ allowedRoles = [] }) => {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return <Outlet />;
};

export default PrivateRoute;
