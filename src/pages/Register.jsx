import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import bgImage from "../assets/loginPagesBg.jpg";
import { FiUserPlus } from "react-icons/fi";
import toast from "react-hot-toast";
import Breadcrumb from "../components/Breadcrumb";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("buyer");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Show loading toast
    const toastId = toast.loading(
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-black/10 rounded-full flex items-center justify-center">
          <FiUserPlus size={16} className="text-black" />
        </div>
        <div>
          <p className="font-medium text-gray-900">Creating Account</p>
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
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          name,
          email,
          password,
          phone,
          role,
        },
        { withCredentials: true }
      );

      localStorage.setItem("accessToken", res.data.accessToken);
      
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
              <p className="font-medium text-gray-900">Account Created</p>
              <p className="text-sm text-gray-600">Welcome to Mobitrade!</p>
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

      // Redirect after success
      setTimeout(() => {
        nav("/dashboard");
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
              <p className="font-medium text-gray-900">Registration Failed</p>
              <p className="text-sm text-gray-600">{err.response?.data?.message || 'Registration error'}</p>
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
        {/* <Breadcrumb /> */}
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
            <span>Create your account</span>
          </div>
        </div>

        {/* Register Card */}
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 sm:p-10">
          {/* Toggle Tabs */}
          <div className="flex gap-0 bg-gray-50 rounded-full p-1 mb-10">
            <button
              className={`flex-1 flex justify-center items-center gap-2 py-3.5 rounded-full text-sm font-medium transition-all bg-white text-gray-900 shadow-sm`}
            >
              <FiUserPlus size={18} />
              <span>Create Account</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="space-y-6">
            {/* Full Name Input */}
            <div>
              <label className="block text-base font-semibold text-gray-900 mb-3">
                Full Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-5 py-4 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all text-base text-gray-700 placeholder:text-gray-400"
                required
              />
            </div>

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

            {/* Account Type Select */}
            <div>
              <label className="block text-base font-semibold text-gray-900 mb-3">
                Account Type
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all text-base text-gray-700"
                required
              >
                <option value="buyer">Buyer</option>
                <option value="seller_candidate">Seller (C2C)</option>
                <option value="seller">Seller to Company</option>
              </select>
            </div>

            {/* Phone Input (only for sellers) */}
            {(role === "seller" || role === "seller_candidate") && (
              <div>
                <label className="block text-base font-semibold text-gray-900 mb-3">
                  Phone Number
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full px-5 py-4 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all text-base text-gray-700 placeholder:text-gray-400"
                />
              </div>
            )}

            {/* Create Account Button */}
            <button 
              disabled={loading}
              type="submit"
              className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-900 transition-colors mt-8 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            {/* Sign In Link */}
            <p className="text-center text-base text-gray-700 pt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-black font-semibold hover:underline">
                Sign in here
              </Link>
            </p>
          </form>
        </div>

        {/* Footer Text */}
        <p className="text-center text-sm text-white/80 mt-10">
          By continuing, you agree to our{" "}
          <a href="#" className="text-white font-semibold hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-white font-semibold hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}