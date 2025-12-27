import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import bgImage from "../assets/loginPagesBg.jpg";
import logo from "../assets/logo.jpeg";
import { FiShield } from "react-icons/fi";
import toast from 'react-hot-toast';
import { buildApiEndpoint } from '../utils/api';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(localStorage.getItem("adminRememberMe") === "true");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // NEW: If a logged-in non-admin hits this page, push them back to the client login/home
  useEffect(() => {
    if (user?.user?.role && user.user.role !== "admin") {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  // NEW: If already an admin, go straight to dashboard
  if (user?.user?.role === "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Show loading toast
    const toastId = toast.loading(
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-black/10 rounded-full flex items-center justify-center">
          <FiShield size={16} className="text-black" />
        </div>
        <div>
          <p className="font-medium text-gray-900">Signing In</p>
          <p className="text-sm text-gray-600">Please wait...</p>
        </div>
      </div>, 
      {
        position: "top-center",
        duration: 2000,
        style: {
          background: '#ffffff',
          color: '#1f2937',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          padding: '16px',
          fontSize: '14px',
          fontWeight: '500',
          maxWidth: '380px'
        },
      }
    );
    
    try {
      // NEW: Use dedicated admin login endpoint
      const endpoint = buildApiEndpoint('auth/admin/login');
      console.log('[ADMIN-LOGIN] Calling endpoint:', endpoint);
      
      const res = await axios.post(
        endpoint,
        { email, password, rememberMe },
        { withCredentials: true }
      );

      // Store remember me preference for admin
      if (rememberMe) {
        localStorage.setItem("adminRememberMe", "true");
      } else {
        localStorage.removeItem("adminRememberMe");
      }

      // Call login() from AuthContext
      login(res.data.accessToken, res.data.user);
      
      // Show success toast
      setTimeout(() => {
        toast.success(
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">Admin Login Successful</p>
              <p className="text-sm text-gray-600">Welcome back, Administrator!</p>
            </div>
          </div>, 
          {
            id: toastId,
            duration: 3000,
            position: "top-center",
            style: {
              background: '#ffffff',
              color: '#1f2937',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              padding: '16px',
              fontSize: '14px',
              fontWeight: '500',
              maxWidth: '380px'
            },
          }
        );
      }, 800);

      // Redirect admin to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 1200);
      
    } catch (err) {
      console.error(err.response?.data || err.message);
      
      // Show error toast
      setTimeout(() => {
        toast.error(
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">Login Failed</p>
              <p className="text-sm text-gray-600">{err.response?.data?.message || 'Unauthorized access'}</p>
            </div>
          </div>, 
          {
            id: toastId,
            duration: 4000,
            position: "top-center",
            style: {
              background: '#ffffff',
              color: '#1f2937',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              padding: '16px',
              fontSize: '14px',
              fontWeight: '500',
              maxWidth: '380px'
            },
          }
        );
      }, 800);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundPosition: "center center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/30"></div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12 -mt-16">
        {/* Logo */}
        <div className="flex flex-col gap-3 sm:gap-5 text-center mb-6 w-full max-w-md px-4">
          {/* Logo and Name - Stack on mobile, side-by-side on desktop */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-2">
            <img 
              src={logo} 
              alt="F&S Smartphones" 
              className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl object-cover shadow-lg shrink-0"
            />
            <span className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              F&S Smartphones
            </span>
          </div>

          <div className="text-white text-base sm:text-lg font-medium">
            <span>Admin Portal - Sign in</span>
          </div>
        </div>

        {/* Sign In Card */}
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 sm:p-10">
          {/* Admin Badge */}
          <div className="flex gap-0 bg-gray-50 rounded-full p-1 mb-10">
            <button
              className={`flex-1 flex justify-center items-center gap-2 py-3.5 rounded-full text-sm font-medium transition-all bg-black text-white shadow-sm`}
            >
              <FiShield size={18} />
              <span>Admin Login</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-base font-semibold text-gray-900 mb-3">
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="admin@email.com"
                className="w-full px-5 py-4 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all text-base text-gray-700 placeholder:text-gray-400"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-base font-semibold text-gray-900 mb-3">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                className="w-full px-5 py-4 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all text-base text-gray-700"
                required
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black accent-black"
                />
                <span className="text-base text-gray-800">Remember me</span>
              </label>
            </div>

            {/* Sign In Button */}
            <button 
              disabled={loading}
              type="submit"
              className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-900 transition-colors mt-8 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

            {/* Forgot Password Link */}
            <p className="text-center text-base text-gray-700 pt-4">
              <Link to="/forgot-password" className="text-black font-semibold hover:underline">
                Forgot password?
              </Link>
            </p>
          </form>
        </div>

        {/* Footer Text */}
        <p className="text-center text-sm text-white/80 mt-10">
          Admin access only. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
}

