import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

const RoleBasedRoutes = ({ children, requiredRole }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading....</div>;
  }
  if (!user) {
    return <Navigate to="/auth/sign-in" replace />;
  }
  if (!requiredRole.includes(user.role)) {
    const previousLocation = location.state?.from || "/auth/sign-in";
    return <Navigate to={previousLocation} replace />;
  }
  return children;
};

export default RoleBasedRoutes;
