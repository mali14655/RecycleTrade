import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import bgImage from "../assets/loginPagesBg.jpg";
import { FiLock } from "react-icons/fi";
import toast from "react-hot-toast";
import { buildApiEndpoint } from "../utils/api";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  useEffect(() => {
    console.log('[RESET-PASSWORD] Token from URL:', token);
    console.log('[RESET-PASSWORD] Full URL:', window.location.href);
    console.log('[RESET-PASSWORD] Search params:', window.location.search);
    
    if (!token) {
      console.error('[RESET-PASSWORD] No token found in URL');
      toast.error("Invalid reset link. Please request a new one.");
      setTimeout(() => {
        navigate("/forgot-password");
      }, 2000);
    } else {
      console.log('[RESET-PASSWORD] Token found, length:', token.length);
    }
  }, [token, navigate]);

  const submit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    const toastId = toast.loading(
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-black/10 rounded-full flex items-center justify-center">
          <FiLock size={16} className="text-black" />
        </div>
        <div>
          <p className="font-medium text-gray-900">Resetting Password</p>
          <p className="text-sm text-gray-600">Please wait...</p>
        </div>
      </div>,
      {
        position: "top-center",
        duration: 2000,
        style: {
          background: "#ffffff",
          color: "#1f2937",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          padding: "16px",
          fontSize: "14px",
          fontWeight: "500",
          maxWidth: "380px",
        },
      }
    );

    try {
      const endpoint = buildApiEndpoint('auth/reset-password');
      console.log('[RESET-PASSWORD] Calling endpoint:', endpoint);
      console.log('[RESET-PASSWORD] Sending token:', token ? `${token.substring(0, 10)}...` : 'none');
      console.log('[RESET-PASSWORD] Token length:', token?.length);
      console.log('[RESET-PASSWORD] Password length:', password?.length);
      
      const response = await axios.post(endpoint, {
        token,
        password,
      }, {
        withCredentials: true
      });
      
      console.log('[RESET-PASSWORD] Response:', response.data);

      setTimeout(() => {
        toast.success(
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">Password Reset</p>
              <p className="text-sm text-gray-600">Your password has been reset successfully</p>
            </div>
          </div>,
          {
            id: toastId,
            duration: 3000,
            position: "top-center",
            style: {
              background: "#ffffff",
              color: "#1f2937",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              padding: "16px",
              fontSize: "14px",
              fontWeight: "500",
              maxWidth: "380px",
            },
          }
        );
      }, 800);

      // NEW: Redirect based on user role - admin goes to admin login, others to client login
      setTimeout(() => {
        if (response.data.userRole === "admin") {
          navigate("/admin/login");
        } else {
          navigate("/login");
        }
      }, 2000);
    } catch (err) {
      setTimeout(() => {
        toast.error(
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">Error</p>
              <p className="text-sm text-gray-600">{err.response?.data?.message || "Failed to reset password"}</p>
            </div>
          </div>,
          {
            id: toastId,
            duration: 4000,
            position: "top-center",
            style: {
              background: "#ffffff",
              color: "#1f2937",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              padding: "16px",
              fontSize: "14px",
              fontWeight: "500",
              maxWidth: "380px",
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

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="flex flex-col gap-5 text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-3xl font-bold">M</span>
            </div>
            <span className="text-white text-5xl font-bold tracking-tight">Mobitrade</span>
          </div>
          <div className="text-white text-lg font-medium">
            <span>Set New Password</span>
          </div>
        </div>

        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 sm:p-10">
          <form onSubmit={submit} className="space-y-6">
            <div>
              <label className="block text-base font-semibold text-gray-900 mb-3">New Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                className="w-full px-5 py-4 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all text-base text-gray-700"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-900 mb-3">Confirm Password</label>
              <input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                className="w-full px-5 py-4 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all text-base text-gray-700"
                required
                minLength={6}
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-900 transition-colors mt-8 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>

            <p className="text-center text-base text-gray-700 pt-4">
              <Link to="/login" className="text-black font-semibold hover:underline">
                Back to Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

