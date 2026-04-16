import React from "react";
import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const adminData = JSON.parse(localStorage.getItem("adminData"));

  if (!adminData) {
    // Redirect to admin login if not logged in
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
