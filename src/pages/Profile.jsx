import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { FiUser, FiMail, FiPhone, FiShoppingBag, FiLogOut } from "react-icons/fi";

export default function Profile() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/orders`, {
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

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-gray-600">Please log in to view your profile.</p>
          <Link to="/login" className="text-black font-semibold hover:underline mt-4 inline-block">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const pendingOrders = orders.filter(order => order.orderStatus === "Pending").length;
  const completedOrders = orders.filter(order => order.orderStatus === "Processing" || order.orderStatus === "Delivered").length;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your account and view your orders</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-4xl font-bold">
                  {user?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">{user?.user?.name || "User"}</h2>
              <p className="text-gray-600 mt-1">{user?.user?.email || ""}</p>
            </div>

            <div className="space-y-4 border-t border-gray-200 pt-6">
              <div className="flex items-center gap-3 text-gray-700">
                <FiUser className="w-5 h-5" />
                <span className="text-sm font-medium">Account Type: Buyer</span>
              </div>
              {user?.user?.phone && (
                <div className="flex items-center gap-3 text-gray-700">
                  <FiPhone className="w-5 h-5" />
                  <span className="text-sm">{user?.user?.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-gray-700">
                <FiMail className="w-5 h-5" />
                <span className="text-sm">{user?.user?.email}</span>
              </div>
            </div>

            <button
              onClick={logout}
              className="w-full mt-6 flex items-center justify-center gap-2 bg-red-50 text-red-600 py-3 rounded-xl font-semibold hover:bg-red-100 transition-colors"
            >
              <FiLogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Stats and Orders */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FiShoppingBag className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{totalOrders}</p>
                  <p className="text-sm text-gray-600">Total Orders</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{pendingOrders}</p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">${totalSpent.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Total Spent</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Recent Orders</h3>
              <Link
                to="/orders"
                className="text-black font-semibold hover:underline text-sm"
              >
                View All
              </Link>
            </div>

            {loading ? (
              <div className="animate-pulse space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiShoppingBag className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No orders yet</h3>
                <p className="text-gray-600 mb-4">Start shopping to see your orders here</p>
                <Link
                  to="/products"
                  className="inline-block bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-900 transition-colors"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.slice(0, 5).map((order) => (
                  <Link
                    key={order._id}
                    to="/orders"
                    className="block border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-800">
                          Order #{order._id.slice(-8)}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(order.createdAt).toLocaleDateString()} • {order.items?.length || 0} item(s)
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-800">${order.total?.toFixed(2) || "0.00"}</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${
                          order.orderStatus === "Pending" 
                            ? "bg-yellow-100 text-yellow-800"
                            : order.orderStatus === "Processing"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}>
                          {order.orderStatus}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

