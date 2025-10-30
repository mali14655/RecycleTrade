import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

export default function Checkout() {
  const { cart = { items: [] }, clearCart } = useContext(CartContext); // default to items: []
  const { user } = useContext(AuthContext);

  const [guestInfo, setGuestInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  // calculate total safely
  const total = (cart?.items || []).reduce(
    (acc, item) => acc + (item.productId?.price || item.price || 0) * (item.quantity || 1),
    0
  );

  const handleGuestChange = (e) => {
    setGuestInfo({ ...guestInfo, [e.target.name]: e.target.value });
  };

  const handleStripeCheckout = async () => {
    if (!cart?.items?.length) {
      alert("Cart is empty");
      return;
    }

    try {
      setLoading(true);

      const payloadItems = (cart.items || []).map((item) => ({
        productId: item.productId?._id || item._id,
        name: item.productId?.name || item.name,
        price: item.productId?.price || item.price,
        image: item.productId?.images?.[0] || item.image,
        quantity: item.quantity || 1,
      }));

      const headers = user
        ? { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
        : {};

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/orders/stripe`, {
        items: payloadItems,
        guestInfo: user ? null : guestInfo,
      }, headers);

      window.location.href = res.data.url;
    } catch (error) {
      console.error("Stripe checkout failed:", error);
      alert("Stripe checkout failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleCOD = async () => {
    if (!cart?.items?.length) {
      alert("Cart is empty");
      return;
    }

    try {
      setLoading(true);

      const payloadItems = (cart.items || []).map((item) => ({
        productId: item.productId?._id || item._id,
        name: item.productId?.name || item.name,
        price: item.productId?.price || item.price,
        quantity: item.quantity || 1,
      }));

      await axios.post(
        `${import.meta.env.VITE_API_URL}/orders/cod`,
        {
          items: payloadItems,
          total,
          guestInfo: user ? null : guestInfo,
        },
        user
          ? { headers: { Authorization: `Bearer ${user.token}` } }
          : {}
      );

      clearCart();
      alert("Order placed successfully (COD)");
    } catch (error) {
      console.error("COD order failed:", error);
      alert("COD order failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>

      {!user && (
        <div className="space-y-4 border p-4 rounded mb-6">
          <h3 className="font-semibold text-lg">Guest Information</h3>
          {["name", "email", "phone", "address"].map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              value={guestInfo[field]}
              onChange={handleGuestChange}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="w-full p-2 border rounded"
              required
            />
          ))}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Total: ${total.toFixed(2)}</h3>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleStripeCheckout}
          disabled={loading || !(cart?.items?.length > 0)}
          className={`px-4 py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {loading ? "Processing..." : "Pay with Stripe"}
        </button>

        <button
          onClick={handleCOD}
          disabled={loading || !(cart?.items?.length > 0)}
          className={`px-4 py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}
        >
          {loading ? "Placing..." : "Cash on Delivery"}
        </button>
      </div>
    </div>
  );
}
