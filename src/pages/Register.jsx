import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import bgImage from "../assets/loginPagesBg.jpg";
import logo from "../assets/logo.jpeg";
import { FiUserPlus } from "react-icons/fi";
import toast from "react-hot-toast";
import Breadcrumb from "../components/Breadcrumb";
import { buildApiEndpoint } from "../utils/api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  // const [role, setRole] = useState("buyer"); // COMMENTED OUT: Only buyer registration
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
      const endpoint = buildApiEndpoint('auth/register');
      console.log('[REGISTER] Calling endpoint:', endpoint);
      
      const res = await axios.post(
        endpoint,
        {
          name,
          email,
          password,
          phone,
          role: "buyer", // NEW: Force buyer role
        },
        { withCredentials: true }
      );

      // NEW: Don't set token - user needs to verify email first
      // User is NOT logged in until email is verified
      // No accessToken or refreshToken is returned from backend
      // localStorage.setItem("accessToken", res.data.accessToken); // COMMENTED: No token until verification
      
      // NEW: Show different message based on email sending status
      setTimeout(() => {
        if (res.data.emailSent === false) {
          // Email sending failed
          toast.error(
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Account Created</p>
                <p className="text-sm text-gray-600">Verification email could not be sent. Please use 'Resend Verification' on the login page.</p>
              </div>
            </div>, 
            {
              id: toastId,
              icon: null,
              duration: 6000,
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
        } else {
          // Email sent successfully
          toast.success(
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Account Created</p>
                <p className="text-sm text-gray-600">Please check your email to verify your account</p>
              </div>
            </div>, 
            {
              id: toastId,
              icon: null,
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
        }
      }, 800);

      // NEW: Redirect to login page after registration
      setTimeout(() => {
        nav("/login");
      }, 2000);
      
    } catch (err) {
      console.error(err.response?.data || err.message);
      
      // NEW: Show better error messages
      let errorMessage = 'Registration error';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
        // Improve specific error messages
        if (errorMessage.includes('already registered') || errorMessage.includes('Email already')) {
          errorMessage = 'This email is already registered. Please use a different email or try logging in.';
        } else if (errorMessage.includes('email') && errorMessage.includes('invalid')) {
          errorMessage = 'Please enter a valid email address.';
        } else if (errorMessage.includes('password') && errorMessage.includes('length')) {
          errorMessage = 'Password must be at least 6 characters long.';
        }
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
              <p className="font-medium text-gray-900">Registration Failed</p>
              <p className="text-sm text-gray-600">{errorMessage}</p>
            </div>
          </div>, 
          {
            id: toastId,
            icon: null,
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
        <div className="flex flex-col gap-3 sm:gap-5 text-center mb-6 w-full max-w-md px-4">
          {/* Logo and Name - Always stacked */}
          <div className="flex flex-col items-center justify-center gap-3 mb-2">
            <img 
              src={logo} 
              alt="F&S Smartphones" 
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl object-cover shadow-lg shrink-0"
            />
            <span className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-center">
              F<span className="text-white/80 font-normal">&</span>S Smartphones
            </span>
          </div>

          <div className="text-white text-base sm:text-lg font-medium">
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

            {/* Account Type Select - COMMENTED OUT: Only buyer registration for now */}
            {/* <div>
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
            </div> */}

            {/* Phone Input (only for sellers) - COMMENTED OUT */}
            {/* {(role === "seller" || role === "seller_candidate") && (
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
            )} */}

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