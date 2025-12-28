import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import bgImage from "../assets/loginPagesBg.jpg";
import logo from "../assets/logo.jpeg";
import { FiMail } from "react-icons/fi";
import toast from "react-hot-toast";
import { buildApiEndpoint } from "../utils/api";

export default function VerifyEmail() {
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [email, setEmail] = useState("");
  const [resending, setResending] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token]);

  const verifyEmail = async (verificationToken) => {
    setLoading(true);
    try {
      const endpoint = buildApiEndpoint('auth/verify-email');
      console.log('[VERIFY-EMAIL] Calling endpoint:', endpoint);
      console.log('[VERIFY-EMAIL] Token from URL:', verificationToken ? `${verificationToken.substring(0, 20)}...` : 'none');
      console.log('[VERIFY-EMAIL] Token length:', verificationToken?.length);
      console.log('[VERIFY-EMAIL] Full URL:', window.location.href);
      
      if (!verificationToken) {
        toast.error("No verification token found in the link. Please check your email.");
        return;
      }
      
      await axios.post(endpoint, {
        token: verificationToken,
      }, {
        withCredentials: true
      });

      setVerified(true);
      toast.success("Email verified successfully! You can now log in.");
      
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error('[VERIFY-EMAIL] Error:', err);
      console.error('[VERIFY-EMAIL] Response:', err.response?.data);
      
      const errorMessage = err.response?.data?.message || "Verification failed";
      const isExpired = err.response?.data?.expired;
      const isInvalid = err.response?.data?.invalid;
      
      if (isExpired) {
        toast.error(
          <div>
            <p className="font-semibold">Verification Link Expired</p>
            <p className="text-sm">Please request a new verification email.</p>
          </div>,
          { duration: 5000 }
        );
      } else if (isInvalid) {
        toast.error(
          <div>
            <p className="font-semibold">Invalid Verification Link</p>
            <p className="text-sm">Please check your email or request a new verification link.</p>
          </div>,
          { duration: 5000 }
        );
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setResending(true);
    try {
      const endpoint = buildApiEndpoint('auth/resend-verification');
      console.log('[RESEND-VERIFICATION] Calling endpoint:', endpoint);
      
      await axios.post(endpoint, {
        email,
      }, {
        withCredentials: true
      });

      toast.success("Verification email sent! Please check your inbox.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend verification email");
    } finally {
      setResending(false);
    }
  };

  if (token && !verified && !loading) {
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
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 sm:p-10 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-700">Verifying your email...</p>
          </div>
        </div>
      </div>
    );
  }

  if (verified) {
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
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 sm:p-10 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
            <p className="text-gray-600 mb-6">Your email has been verified successfully. Redirecting to login...</p>
            <Link to="/login" className="text-black font-semibold hover:underline">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
            <span>Verify Your Email</span>
          </div>
        </div>

        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 sm:p-10">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiMail size={24} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
            <p className="text-gray-600">
              We've sent a verification link to your email address. Please click the link to verify your account.
            </p>
          </div>

          <form onSubmit={resendVerification} className="space-y-6">
            <div>
              <label className="block text-base font-semibold text-gray-900 mb-3">Didn't receive the email?</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter your email"
                className="w-full px-5 py-4 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all text-base text-gray-700 placeholder:text-gray-400"
                required
              />
            </div>

            <button
              disabled={resending}
              type="submit"
              className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-900 transition-colors text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resending ? "Sending..." : "Resend Verification Email"}
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

