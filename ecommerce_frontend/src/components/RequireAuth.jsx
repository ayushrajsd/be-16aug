import { useLocation, Navigate, Outlet } from "react-router-dom";
import {useAuth} from "../contexts/AuthProvider";

const RequireAuth = () => {
  const { authenticatedUser  } = useAuth();
  const location = useLocation();
  return authenticatedUser ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
