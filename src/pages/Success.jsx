import React, { useEffect, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const Success = () => {
  const { clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // clear local cart (guest)
    clearCart(); // ensure this clears localStorage guestCart and CartContext state
    // for logged-in user, also call backend clear to be safe (webhook should already do it)
    if (user) {
      axios.delete(`${import.meta.env.VITE_API_URL}/cart/clear`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      }).catch(() => {});
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-50">
      <h1 className="text-3xl font-bold text-green-600 mb-4">🎉 Payment Successful!</h1>
      <p className="text-gray-700">Thank you — your order is confirmed.</p>
      <a href="/" className="mt-6 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700">Go to Home</a>
    </div>
  );
};

export default Success;
