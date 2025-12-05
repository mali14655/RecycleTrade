import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import bgImage from "../assets/loginPagesBg.jpg";
import { FiUser } from "react-icons/fi";
import toast from 'react-hot-toast';
import Breadcrumb from '../components/Breadcrumb';
import { buildApiEndpoint } from '../utils/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // NEW: Restore rememberMe preference from localStorage
  const [rememberMe, setRememberMe] = useState(localStorage.getItem("rememberMe") === "true");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Show loading toast
    const toastId = toast.loading(
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-black/10 rounded-full flex items-center justify-center">
          <FiUser size={16} className="text-black" />
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
      const endpoint = buildApiEndpoint('auth/login');
      console.log('[LOGIN] Calling endpoint:', endpoint);
      
      const res = await axios.post(
        endpoint,
        { email, password, rememberMe }, // NEW: Include rememberMe
        { withCredentials: true }
      );

      // NEW: Store remember me preference
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberMe");
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
              <p className="font-medium text-gray-900">Login Successful</p>
              <p className="text-sm text-gray-600">Welcome back!</p>
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

      // NEW: Redirect buyers to profile instead of dashboard
      setTimeout(() => {
        if (res.data.user.role === "seller") {
          navigate('/sell-to-company');
        } else {
          navigate('/profile'); // NEW: Redirect to profile for buyers
        }
      }, 1200);
      
    } catch (err) {
      console.error(err.response?.data || err.message);
      
      // NEW: Handle email verification required
      if (err.response?.data?.requiresVerification) {
        setTimeout(() => {
          toast.error(
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Email Not Verified</p>
                <p className="text-sm text-gray-600">{err.response?.data?.message || 'Please verify your email first'}</p>
              </div>
            </div>, 
            {
              id: toastId,
              duration: 5000,
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
        return;
      }
      
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
              <p className="text-sm text-gray-600">{err.response?.data?.message || 'Login error'}</p>
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

      {/* Breadcrumb */}
      <div className="relative z-20 pt-6">
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12 -mt-16">
        {/* Logo */}
        <div className="flex flex-col gap-5 text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-3xl font-bold">M</span>
            </div>
            <span className="text-white text-5xl font-bold tracking-tight">
              Mobitrade
            </span>
          </div>

          <div className="text-white text-lg font-medium">
            <span>Sign in to your account</span>
          </div>
        </div>

        {/* Sign In Card */}
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 sm:p-10">
          {/* Toggle Tabs */}
          <div className="flex gap-0 bg-gray-50 rounded-full p-1 mb-10">
            <button
              className={`flex-1 flex justify-center items-center gap-2 py-3.5 rounded-full text-sm font-medium transition-all bg-white text-gray-900 shadow-sm`}
            >
              <FiUser size={18} />
              <span>User Login</span>
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
                placeholder="your@email.com"
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

            {/* Remember Me & Forgot Password */}
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
              <Link
                to="/forgot-password"
                className="text-base text-gray-900 hover:text-black font-medium"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button 
              disabled={loading}
              type="submit"
              className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-900 transition-colors mt-8 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-base text-gray-700 pt-4">
              Don't have an account?{" "}
              <Link to="/register" className="text-black font-semibold hover:underline">
                Sign up here
              </Link>
            </p>
          </form>
        </div>

        {/* Footer Text */}
        <p className="text-center text-sm text-white/80 mt-10">
          By continuing, you agree to our{" "}
          <Link to="/terms" className="text-white font-semibold hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-white font-semibold hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}