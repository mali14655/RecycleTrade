import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, roles }) => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("ProtectedRoute must be used inside AuthProvider");

  const { user, loading } = context;
  if (loading) return <div>Loading...</div>;

  if (!user) {
    localStorage.removeItem("accessToken");
    return <Navigate to="/login" replace />;
  }

  const role = user.role || user.user?.role;
  console.log("User Role:", role);
  console.log("Allowed Roles:", roles);

  if (roles && !roles.includes(role)) return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;
