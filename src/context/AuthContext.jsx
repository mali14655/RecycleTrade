import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { buildApiEndpoint } from "../utils/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const endpoint = buildApiEndpoint('auth/me');
      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true, // NEW: Include cookies for refresh token
      });
      setUser(res.data);
    } catch (err) {
      // NEW: If token expired, try to refresh it
      if (err.response?.status === 401 && err.response?.data?.message !== 'No token') {
        try {
          console.log("Access token expired, attempting to refresh...");
          const refreshEndpoint = buildApiEndpoint('auth/refresh');
          
          const refreshRes = await axios.post(
            refreshEndpoint,
            {},
            { withCredentials: true } // Include refresh token cookie
          );
          
          // Update token and retry
          localStorage.setItem("accessToken", refreshRes.data.accessToken);
          setUser(refreshRes.data.user);
          console.log("Token refreshed successfully");
        } catch (refreshErr) {
          console.error("Token refresh failed:", refreshErr);
          // Refresh failed, clear everything
          setUser(null);
          localStorage.removeItem("accessToken");
        }
      } else if (err.response?.data?.requiresVerification) {
        // User not verified
        setUser(null);
        localStorage.removeItem("accessToken");
      } else {
        // Other error
        setUser(null);
        localStorage.removeItem("accessToken");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("accessToken", token);
    setUser(userData);
    
    // NEW: Redirect based on role - buyers go to profile instead of dashboard
    if (userData?.role === "seller") {
      window.location.href = "/sell-to-company";
    } else {
      window.location.href = "/profile"; // NEW: Redirect buyers to profile
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};