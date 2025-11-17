// pages/TrackOrder.jsx
import React, { useState } from "react";
import axios from "axios";

export default function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) {
      setError("Please enter order ID or tracking number");
      return;
    }

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/orders/track/${orderId}`);
      setOrder(res.data);
    } catch (err) {
      setError("Order not found. Please check your order ID or tracking number.");
      console.error("Error tracking order:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing": return "bg-green-100 text-green-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "Paid": return "bg-green-100 text-green-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Track Your Order</h1>
      
      {/* Search Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <form onSubmit={handleTrackOrder} className="flex gap-4">
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Enter Order ID or Tracking Number"
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Tracking..." : "Track Order"}
          </button>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {/* Order Details */}
      {order && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-semibold">Order #{order._id.slice(-8)}</h2>
              <p className="text-gray-600">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                {order.orderStatus}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                {order.paymentStatus}
              </span>
            </div>
          </div>

          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold mb-2">Customer Information</h3>
              <p>{order.guestInfo?.firstName} {order.guestInfo?.lastName}</p>
              <p>{order.guestInfo?.email}</p>
              <p>{order.guestInfo?.phone}</p>
              <p className="capitalize">Gender: {order.guestInfo?.gender}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                {order.deliveryMethod === "delivery" ? "Delivery Address" : "Pickup Location"}
              </h3>
              {order.deliveryMethod === "delivery" ? (
                <p>{order.guestInfo?.address}</p>
              ) : (
                order.outletId && (
                  <div>
                    <p><strong>{order.outletId.name}</strong></p>
                    <p>{order.outletId.address}</p>
                    <p>{order.outletId.location}</p>
                    {order.outletId.phone && <p>Phone: {order.outletId.phone}</p>}
                  </div>
                )
              )}
            </div>
          </div>

          {/* Tracking Information */}
          {order.trackingNumber && (
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold mb-2">Tracking Information</h3>
              <p><strong>Tracking Number:</strong> {order.trackingNumber}</p>
              <p className="text-sm text-blue-600 mt-1">
                Your order has been shipped and can be tracked using the number above.
              </p>
            </div>
          )}

          {/* Order Items */}
          <div>
            <h3 className="font-semibold mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center border-b pb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.productId?.images?.[0] || "https://via.placeholder.com/60"}
                      alt={item.productId?.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div>
                      <p className="font-medium">{item.productId?.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-sm text-gray-500">Seller: {item.sellerId?.name}</p>
                    </div>
                  </div>
                  <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total Amount</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>Payment Method</span>
              <span className="capitalize">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Delivery Method</span>
              <span className="capitalize">{order.deliveryMethod}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}