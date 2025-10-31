// import React, { useContext } from "react";
// import { Navigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";

// const ProtectedRoute = ({ children, roles }) => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("ProtectedRoute must be used inside AuthProvider");

//   const { user, loading } = context;
//   if (loading) return <div>Loading...</div>;

//   if (!user) {
//     localStorage.removeItem("accessToken");
//     return <Navigate to="/login" replace />;
//   }

//   const role = user.role || user.user?.role;
//   console.log("User Role:", role);
//   console.log("Allowed Roles:", roles);

//   if (roles && !roles.includes(role)) return <Navigate to="/" />;

//   return children;
// };

// export default ProtectedRoute;
// components/ProtectedRoute.jsx - UPDATED
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, roles = [] }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user is seller and trying to access dashboard, redirect to sell-to-company
  if (user.user?.role === "seller" && window.location.pathname === "/dashboard") {
    return <Navigate to="/sell-to-company" replace />;
  }

  // Check if route requires specific roles
  if (roles.length > 0 && !roles.includes(user.user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}