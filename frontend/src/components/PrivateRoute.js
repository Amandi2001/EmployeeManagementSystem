import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ roles, children }) => {
  const userRole = localStorage.getItem("role");

  if (!userRole || !roles.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default PrivateRoute;
