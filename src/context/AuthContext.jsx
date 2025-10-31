// import React, { createContext, useState, useEffect } from "react";
// import axios from "axios";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // fetch user from backend if token exists
//   const fetchUser = async () => {
//     const token = localStorage.getItem("accessToken");
//     if (!token) {
//       setUser(null);
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUser(res.data); // backend returns user object
//     } catch (err) {
//       console.error("Error fetching user:", err);
//       setUser(null);
//       localStorage.removeItem("accessToken"); // remove invalid token
//     }

//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchUser();
//   }, []);

//   // login helper
//   const login = (token, userData) => {
//     localStorage.setItem("accessToken", token);
//     setUser(userData);
//   };

//   const logout = () => {
//     localStorage.removeItem("accessToken");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// context/AuthContext.jsx - IMPROVED
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

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
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error("Error fetching user:", err);
      setUser(null);
      localStorage.removeItem("accessToken");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("accessToken", token);
    setUser(userData);
    
    // Redirect based on role immediately after login
    if (userData?.role === "seller") {
      window.location.href = "/sell-to-company";
    } else {
      window.location.href = "/dashboard";
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