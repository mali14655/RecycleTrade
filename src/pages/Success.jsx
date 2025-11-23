import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import Footer from "../components/Footer";
import Breadcrumb from "../components/Breadcrumb";

const Success = () => {
  const { clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // clear local cart (guest)
    clearCart();
    // for logged-in user, also call backend clear to be safe 
    if (user) {
      axios.delete(`${import.meta.env.VITE_API_URL}/cart/clear`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      }).catch(() => {});
    }
  }, []);

  const handleGoToHome = () => {
    navigate("/");
  };

  const handleGoToDashboard = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumb />
      
      {/* Main Content */}
      <div className="max-w-[90%] md:max-w-2xl mx-auto py-12 md:py-20">
        <div className="text-center">
          {/* Animated Success Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-green-100 rounded-full flex items-center justify-center animate-scale-in">
                <svg
                  className="w-12 h-12 md:w-14 md:h-14 text-green-500 animate-checkmark"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path
                    d="M20 6L9 17l-5-5"
                    className="stroke-dasharray-24 stroke-dashoffset-24 animate-draw-check"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Your order is successfully placed
          </h1>
          <p className="text-sm md:text-base text-gray-600 max-w-md mx-auto mb-8 px-4">
            Thank you for your purchase! Your order has been confirmed and will be processed shortly.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Go to Home Button */}
            <button 
              onClick={handleGoToHome}
              className="inline-flex items-center gap-3 px-8 py-3 bg-white border-2 border-gray-900 text-gray-900 font-semibold rounded-lg hover:bg-gray-900 hover:text-white transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              GO TO HOME
            </button>

            {/* Dashboard Button (only show if user is logged in) */}
            {user && (
              <button 
                onClick={handleGoToDashboard}
                className="inline-flex items-center gap-3 px-8 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition-colors"
              >
                GO TO DASHBOARD
              </button>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Success;
