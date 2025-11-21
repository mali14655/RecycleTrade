import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        let endpoint = `${import.meta.env.VITE_API_URL}/orders`;
        
        // If user is seller or seller_candidate, fetch their seller orders
        if (user?.user?.role === "seller" || user?.user?.role === "seller_candidate") {
          endpoint = `${import.meta.env.VITE_API_URL}/orders/seller`;
        }

        const res = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-32 rounded-lg mb-4"></div>
          ))}
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Processing": return "bg-blue-100 text-blue-800";
      case "Delivered": return "bg-green-100 text-green-800";
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
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        {user?.user?.role === "seller" || user?.user?.role === "seller_candidate" 
          ? "My Sales" 
          : "My Orders"
        }
      </h1>
      <p className="text-gray-600 mb-8">
        {user?.user?.role === "seller" || user?.user?.role === "seller_candidate" 
          ? "View all orders containing your products"
          : "Track your purchase history and order status"
        }
      </p>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No orders found</h3>
          <p className="text-gray-600">
            {user?.user?.role === "seller" || user?.user?.role === "seller_candidate" 
              ? "You haven't received any orders yet."
              : "You haven't placed any orders yet."
            }
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    Order #{order._id.slice(-8)}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()} • {order.paymentMethod}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium text-gray-700 mb-3">Items:</h4>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.productId?.images?.[0] || "https://via.placeholder.com/60"}
                          alt={item.productId?.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-800">{item.productId?.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          {(user?.user?.role === "seller" || user?.user?.role === "seller_candidate") && (
                            <p className="text-xs text-gray-400">
                              Buyer: {order.userId?.name || order.guestInfo?.name || 'Guest'}
                            </p>
                          )}
                        </div>
                      </div>
                      <p className="font-semibold text-gray-800">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Footer */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">
                      {order.userId 
                        ? `Customer: ${order.userId.name} (${order.userId.email})`
                        : `Guest: ${order.guestInfo?.name} (${order.guestInfo?.email})`
                      }
                    </p>
                    {order.guestInfo?.address && (
                      <p className="text-sm text-gray-600 mt-1">
                        Address: {order.guestInfo.address}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold text-green-600">${order.total.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}