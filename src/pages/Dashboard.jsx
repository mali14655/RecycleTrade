import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import ProductModal from "../components/ProductModal";
import CategoryManager from "../components/CategoryManager";
import Breadcrumb from "../components/Breadcrumb";
import ConfirmModal from "../components/ConfirmModal";
import toast from "react-hot-toast";


// Dashboard Sidebar Component 
const DashboardSidebar = ({ activeSection, setActiveSection, user }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const adminMenuItems = [
    { id: "overview", label: "Dashboard Overview", icon: "📊" },
    { id: "categories", label: "Category Management", icon: "🗂️" },
    { id: "outlets", label: "Outlet Management", icon: "🏪" },
    { id: "products", label: "Product Management", icon: "📦" },
    { id: "reviews-management", label: "Reviews Management", icon: "💬" },
    { id: "online-orders", label: "Online Paid Orders", icon: "🚚" },
    { id: "pickup-orders", label: "Pickup Orders", icon: "🏪" },
    { id: "online-processed", label: "Online Paid Processed", icon: "✅" },
    { id: "pickup-processed", label: "Pickup Processed", icon: "✅" },
    { id: "cancelled-orders", label: "Cancelled Orders", icon: "❌" },
    { id: "featured-products", label: "Featured Products", icon: "⭐" },
    // COMMENTED OUT: Seller features not available
    // { id: "seller-candidates-orders", label: "Seller Candidates Orders", icon: "👥" },
    // { id: "seller-requests", label: "Seller Requests", icon: "👤" },
    // { id: "seller-forms", label: "Seller Forms", icon: "📝" },
  ];

  const sellerCandidateMenuItems = [
    { id: "overview", label: "Dashboard Overview", icon: "📊" },
    { id: "products", label: "My Products", icon: "📦" },
    { id: "online-orders", label: "My Online Orders", icon: "🚚" },
  ];

  const menuItems = user?.user?.role === "admin" ? adminMenuItems : sellerCandidateMenuItems;

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-white border-r border-gray-200 transform
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 transition-transform duration-300 ease-in-out
        flex flex-col h-screen
      `}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">RT</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-sm text-gray-600 capitalize">
                {user?.user?.role?.replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                setIsMobileOpen(false);
              }}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-left
                ${activeSection === item.id
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="flex-1 font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-medium text-sm">
                {user?.user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.user?.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.user?.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Main Dashboard Component
export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [activeSection, setActiveSection] = useState("overview");

  // States for different sections
  const [pendingSellers, setPendingSellers] = useState([]);
  const [sellerForms, setSellerForms] = useState([]);
  const [sellerOrders, setSellerOrders] = useState([]);
  const [companyOrders, setCompanyOrders] = useState([]);
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [sellerCandidateOrders, setSellerCandidateOrders] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [myProducts, setMyProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("accessToken");

  // Fetch all data
  const fetchAllData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch dashboard overview data first
      await fetchDashboardOverview();

      // Common data
      const productsRes = await axios.get(`${import.meta.env.VITE_API_URL}/products`);
      setAllProducts(productsRes.data);
      
      if (user.user?.role === "seller_candidate" || user.user?.role === "admin") {
        setMyProducts(productsRes.data.filter((p) => p.sellerId?._id === user.user._id));
      }

      // Admin specific data
      if (user.user?.role === "admin") {
        // COMMENTED OUT: Seller-related API calls not needed
        // const [
        //   sellersRes, 
        //   formsRes, 
        //   ordersRes,
        //   cancelledOrdersRes,
        //   outletsRes
        // ] = await Promise.all([
        //   axios.get(`${import.meta.env.VITE_API_URL}/admin/seller-requests`, 
        //     { headers: { Authorization: `Bearer ${token}` } }),
        //   axios.get(`${import.meta.env.VITE_API_URL}/seller-company/admin/forms`, 
        //     { headers: { Authorization: `Bearer ${token}` } }),
        //   axios.get(`${import.meta.env.VITE_API_URL}/orders/all`, 
        //     { headers: { Authorization: `Bearer ${token}` } }),
        //   axios.get(`${import.meta.env.VITE_API_URL}/orders/cancelled`, 
        //     { headers: { Authorization: `Bearer ${token}` } }),
        //   axios.get(`${import.meta.env.VITE_API_URL}/outlets/all`, 
        //     { headers: { Authorization: `Bearer ${token}` } })
        // ]);

        // setPendingSellers(sellersRes.data);
        // setSellerForms(formsRes.data);
        
        const [
          ordersRes,
          cancelledOrdersRes,
          outletsRes
        ] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/orders/all`, 
            { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${import.meta.env.VITE_API_URL}/orders/cancelled`, 
            { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${import.meta.env.VITE_API_URL}/outlets/all`, 
            { headers: { Authorization: `Bearer ${token}` } })
        ]);

        setCompanyOrders(ordersRes.data);
        setCancelledOrders(cancelledOrdersRes.data);
        setOutlets(outletsRes.data);

        // COMMENTED OUT: Seller candidate orders not needed
        // For seller candidate orders, filter from all orders
        // const candidateOrders = ordersRes.data.filter(order => 
        //   order.items.some(item => item.sellerId?.role === "seller_candidate")
        // );
        // setSellerCandidateOrders(candidateOrders);
      }

      // COMMENTED OUT: Seller candidate feature not available
      // Seller candidate specific data
      // if (user.user?.role === "seller_candidate") {
      //   const ordersRes = await axios.get(`${import.meta.env.VITE_API_URL}/orders/seller`, 
      //     { headers: { Authorization: `Bearer ${token}` } });
      //   setSellerOrders(ordersRes.data);
      // }

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch dashboard overview data from backend
  const fetchDashboardOverview = async () => {
    try {
      let endpoint = `${import.meta.env.VITE_API_URL}/admin/overview`;
      // COMMENTED OUT: Seller feature not available
      // if (user.user?.role === "seller" || user.user?.role === "seller_candidate") {
      //   endpoint = `${import.meta.env.VITE_API_URL}/admin/seller-overview`;
      // }

      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboardData(res.data);
    } catch (error) {
      console.error("Error fetching dashboard overview:", error);
      // Set fallback data if API fails
      setDashboardData({
        monthlyRevenue: 0,
        orders: {
          total: 0,
          pending: 0,
          processed: 0
        },
        recentOrders: []
      });
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [user]);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Render different sections based on activeSection
  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <DashboardOverview user={user} dashboardData={dashboardData} data={{ 
          pendingSellers, sellerForms, companyOrders, sellerCandidateOrders, sellerOrders,
          allProducts, myProducts 
        }} />;
      
      case "categories":
        return <CategoryManagement />;
      
      case "outlets":
        return <OutletManagement outlets={outlets} fetchAllData={fetchAllData} token={token} />;
      
      case "products":
        return <ProductManagement 
          myProducts={myProducts} 
          fetchAllData={fetchAllData}
          setIsProductModalOpen={setIsProductModalOpen}
          setEditingProduct={setEditingProduct}
          token={token}
          user={user}
        />;
      
      case "online-orders":
        return <OnlineOrdersManagement 
          orders={companyOrders} 
          fetchAllData={fetchAllData}
          token={token}
          user={user}
        />;
      
      case "pickup-orders":
        return <PickupOrdersManagement 
          orders={companyOrders} 
          fetchAllData={fetchAllData}
          token={token}
        />;
      
      case "online-processed":
        return <OnlinePaidProcessedOrders 
          orders={companyOrders} 
          fetchAllData={fetchAllData}
          token={token}
          user={user}
        />;
      
      case "pickup-processed":
        return <PickupProcessedOrders 
          orders={companyOrders} 
          fetchAllData={fetchAllData}
          token={token}
        />;
      
      case "cancelled-orders":
        return <CancelledOrdersManagement 
          orders={cancelledOrders} 
          fetchAllData={fetchAllData}
          token={token}
        />;
      
      case "featured-products":
        return <FeaturedProductsManagement 
          products={allProducts} 
          fetchAllData={fetchAllData}
          token={token}
        />;
      
      case "reviews-management":
        return <ReviewsManagement 
          products={allProducts} 
          fetchAllData={fetchAllData}
          token={token}
        />;
      
      // COMMENTED OUT: Seller features not available
      // case "seller-candidates-orders":
      //   return <SellerCandidatesOrders 
      //     orders={sellerCandidateOrders} 
      //     fetchAllData={fetchAllData}
      //     token={token}
      //   />;
      
      // case "seller-requests":
      //   return <SellerRequestsManagement 
      //     sellers={pendingSellers} 
      //     fetchAllData={fetchAllData}
      //     token={token}
      //   />;
      
      // case "seller-forms":
      //   return <SellerFormsManagement 
      //     forms={sellerForms} 
      //     fetchAllData={fetchAllData}
      //     token={token}
      //   />;
      
      default:
        return <DashboardOverview user={user} dashboardData={dashboardData} data={{ 
          pendingSellers, sellerForms, companyOrders, sellerCandidateOrders, sellerOrders,
          allProducts, myProducts 
        }} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        user={user}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Mobile header */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">
            {getSectionTitle(activeSection)}
          </h1>
        </header>
        <Breadcrumb/>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : (
            renderSection()
          )}
        </main>
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditingProduct(null);
        }}
        token={token}
        fetchProducts={fetchAllData}
        product={editingProduct}
      />
    </div>
  );
}

// Helper function to get section title
function getSectionTitle(section) {
  const titles = {
    "overview": "Dashboard Overview",
    "categories": "Category Management",
    "outlets": "Outlet Management",
    "products": "Product Management",
    "reviews-management": "Reviews Management",
    "online-orders": "Online Paid Orders",
    "pickup-orders": "Pickup Orders",
    "online-processed": "Online Paid Processed",
    "pickup-processed": "Pickup Processed",
    "cancelled-orders": "Cancelled Orders",
    "featured-products": "Featured Products",
    // COMMENTED OUT: Seller features not available
    // "seller-candidates-orders": "Seller Candidates Orders",
    // "seller-requests": "Seller Requests",
    // "seller-forms": "Seller Forms",
  };
  return titles[section] || "Dashboard";
}

// Enhanced Dashboard Overview Component
const DashboardOverview = ({ user, dashboardData, data }) => {
  if (!dashboardData) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Calculate stats based on actual orders data
  const allOrders = data.companyOrders || [];
  
  // Total Revenue: Only from online paid orders (Stripe payments)
  const totalRevenue = allOrders
    .filter(order => order.paymentMethod === "Stripe" && order.paymentStatus === "Paid")
    .reduce((sum, order) => sum + order.total, 0);

  // Processed Orders: Both pickup and online orders that are processed
  const processedOrders = allOrders.filter(order => 
    order.orderStatus === "Processing"
  ).length;

  // Unprocessed Orders: Both pickup and online orders that are pending
  const unprocessedOrders = allOrders.filter(order => 
    order.orderStatus === "Pending"
  ).length;

  // Total Orders: All orders
  const totalOrders = allOrders.length;

  const stats = [
    { 
      label: "Total Revenue", 
      value: `€${totalRevenue.toFixed(2)}`, 
      color: "green",
      description: "Revenue from online paid orders"
    },
    { 
      label: "Total Orders", 
      value: totalOrders, 
      color: "blue",
      description: "All orders (pickup + online)"
    },
    { 
      label: "Processed Orders", 
      value: processedOrders, 
      color: "purple",
      description: "Ready for pickup + Shipped orders"
    },
    { 
      label: "Unprocessed Orders", 
      value: unprocessedOrders, 
      color: "yellow",
      description: "Pending pickup + Pending shipping"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.user?.name}! 👋</h1>
        <p className="text-green-100 capitalize">
          Role: {user.user?.role?.replace('_', ' ')}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.description}</p>
              </div>
              <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center ml-4`}>
                <span className={`text-${stat.color}-600 text-xl`}>
                  {stat.label.includes('Revenue') ? '💰' : 
                   stat.label.includes('Orders') ? '📦' : '📊'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
          <span className="text-sm text-gray-500">
            Showing {Math.min(allOrders.length, 5)} recent orders
          </span>
        </div>

        {allOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Order ID</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Customer</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Type</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Payment</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Amount</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Status</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody>
                {allOrders.slice(0, 5).map((order) => (
                  <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="p-3 text-sm text-gray-700 font-medium">#{order._id.slice(-8)}</td>
                    <td className="p-3 text-sm text-gray-600">
                      <div>
                        <p className="font-medium">
                          {order.userId 
                            ? order.userId.name 
                            : `${order.guestInfo?.firstName} ${order.guestInfo?.lastName}`
                          }
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.userId ? order.userId.email : order.guestInfo?.email}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.userId ? order.userId.phone : order.guestInfo?.phone}
                        </p>
                      </div>
                    </td>
                    <td className="p-3 text-sm text-gray-600 capitalize">
                      {order.deliveryMethod}
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.paymentStatus === 'Paid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.paymentStatus} ({order.paymentMethod})
                      </span>
                    </td>
                    <td className="p-3 text-sm font-semibold text-green-600">
                      €{order.total?.toFixed(2)}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.orderStatus === 'Pending' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Fixed Online Orders Management with separate tracking numbers
const OnlineOrdersManagement = ({ orders, fetchAllData, token, user }) => {
  const [processingOrders, setProcessingOrders] = useState({});
  const [trackingNumbers, setTrackingNumbers] = useState({});
  // NEW: Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Show paid orders AND pending payment orders (not cancelled)
  // Filter for online paid orders (delivery + Stripe + Paid/Pending)
  const onlineOrders = orders.filter(order => {
    const isDelivery = order.deliveryMethod === "delivery";
    const isStripe = order.paymentMethod === "Stripe";
    const isNotCancelled = order.orderStatus !== "Cancelled";
    const isPaidOrPending = order.paymentStatus === "Paid" || order.paymentStatus === "Pending";
    
    return isDelivery && isStripe && isNotCancelled && isPaidOrPending;
  });

  const processOrder = async (orderId) => {
    const trackingNumber = trackingNumbers[orderId];
    
    if (!trackingNumber?.trim()) {
      toast.error(
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Tracking Number Required</p>
            <p className="text-sm text-gray-600">Please enter tracking number</p>
          </div>
        </div>,
        { icon: null }
      );
      return;
    }

    try {
      setProcessingOrders(prev => ({ ...prev, [orderId]: true }));
      
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/orders/${orderId}/process`,
        { trackingNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Order Processed</p>
            <p className="text-sm text-gray-600">Tracking information sent to customer</p>
          </div>
        </div>,
        { icon: null }
      );
      setTrackingNumbers(prev => ({ ...prev, [orderId]: "" }));
      setProcessingOrders(prev => ({ ...prev, [orderId]: false }));
      fetchAllData();
    } catch (error) {
      console.error("Error processing order:", error);
      toast.error(
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Processing Failed</p>
            <p className="text-sm text-gray-600">{error.response?.data?.message || "Error processing order"}</p>
          </div>
        </div>,
        { icon: null }
      );
      setProcessingOrders(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const handleTrackingNumberChange = (orderId, value) => {
    setTrackingNumbers(prev => ({
      ...prev,
      [orderId]: value
    }));
  };

  // NEW: Handle checkbox change
  const handleCheckboxChange = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  // NEW: Handle select all
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedOrders(processedOrders.map(order => order._id));
    } else {
      setSelectedOrders([]);
    }
  };

  // NEW: Export PDF
  const handleExportPDF = () => {
    if (processedOrders.length === 0) {
      toast.error("No orders to export");
      return;
    }
    setShowExportModal(true);
  };

  const confirmExportPDF = async () => {
    try {
      setIsExporting(true);
      setShowExportModal(false);
      const orderIds = selectedOrders.length > 0 ? selectedOrders : processedOrders.map(o => o._id);
      
      // Build query string with multiple orderIds parameters
      const params = new URLSearchParams();
      orderIds.forEach(id => params.append('orderIds', id));
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/orders/processed/export-pdf?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );

      // Create blob and download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `processed-orders-${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success(`PDF exported successfully with ${orderIds.length} order(s)`);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to export PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  // NEW: Delete selected orders
  const handleDeleteSelected = () => {
    if (selectedOrders.length === 0) {
      toast.error("Please select at least one order to delete");
      return;
    }
    setShowDeleteModal(true);
  };

  const confirmDeleteOrders = async () => {
    try {
      setIsDeleting(true);
      setShowDeleteModal(false);
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/orders/processed/bulk-delete`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { orderIds: selectedOrders }
        }
      );

      toast.success(`Successfully deleted ${selectedOrders.length} order(s)`);
      setSelectedOrders([]);
      fetchAllData();
    } catch (error) {
      console.error("Error deleting orders:", error);
      toast.error(error.response?.data?.message || "Failed to delete orders. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter orders by search query (order ID)
  const filterOrdersBySearch = (orderList) => {
    if (!searchQuery.trim()) return orderList;
    const query = searchQuery.toLowerCase().trim();
    return orderList.filter(order => 
      order._id.toLowerCase().includes(query) || 
      order._id.slice(-8).toLowerCase().includes(query)
    );
  };

  // Only show pending orders (processed orders moved to separate section)
  const pendingOrders = filterOrdersBySearch(
    onlineOrders
      .filter(order => order.orderStatus === "Pending" && order.paymentStatus === "Paid")
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  );
  
  // Debug: Log orders to see what we're getting
  console.log("🔍 Online Paid Orders Debug:", {
    totalOrders: orders.length,
    onlineOrders: onlineOrders.length,
    pendingOrders: pendingOrders.length,
    sampleOrder: onlineOrders[0]
  });

  return (
    <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Online Paid Orders</h1>
            <p className="text-gray-600">Manage delivery orders with online payments</p>
          </div>
          <div className="text-sm text-gray-500">
            Total: {onlineOrders.length} orders
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by Order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Pending Orders Table */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Pending Orders ({pendingOrders.length})
          </h2>
          
          {pendingOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No pending online orders</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingOrders.map((order) => {
                // Fix name display - removes duplicates
                const getCustomerName = () => {
                  if (order.userId?.name) {
                    // Clean up user name if it has duplicates
                    const name = (order.userId.name || '').trim();
                    if (name) {
                      const parts = name.split(/\s+/);
                      const uniqueParts = [];
                      parts.forEach(part => {
                        if (part && !uniqueParts.some(existing => existing.toLowerCase() === part.toLowerCase())) {
                          uniqueParts.push(part);
                        }
                      });
                      return uniqueParts.join(' ');
                    }
                    return name;
                  }
                  const firstName = (order.guestInfo?.firstName || '').trim();
                  const lastName = (order.guestInfo?.lastName || '').trim();
                  
                  // Remove duplicates within firstName or lastName
                  const cleanFirstName = firstName ? firstName.split(/\s+/).filter((v, i, a) => a.indexOf(v) === i).join(' ') : '';
                  const cleanLastName = lastName ? lastName.split(/\s+/).filter((v, i, a) => a.indexOf(v) === i).join(' ') : '';
                  
                  if (cleanFirstName && cleanLastName) {
                    // If firstName already contains lastName, just return firstName
                    if (cleanFirstName.toLowerCase().includes(cleanLastName.toLowerCase())) {
                      return cleanFirstName;
                    }
                    // If lastName already contains firstName, just return lastName
                    if (cleanLastName.toLowerCase().includes(cleanFirstName.toLowerCase())) {
                      return cleanLastName;
                    }
                    // Normal case: combine them with a space
                    return `${cleanFirstName} ${cleanLastName}`;
                  }
                  return cleanFirstName || cleanLastName || 'Guest Customer';
                };

                return (
                  <div key={order._id} className="bg-white border-2 border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                    {/* Order Header */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-lg text-gray-900">Order #{order._id.slice(-8)}</p>
                          <p className="text-sm text-gray-500 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.paymentStatus === 'Paid' || order.paymentStatus === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : order.paymentStatus === 'Cancelled' || order.paymentStatus === 'Failed'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.paymentStatus === 'Paid' || order.paymentStatus === 'paid' 
                              ? '✅ Paid' 
                              : order.paymentStatus === 'Cancelled' || order.paymentStatus === 'Failed'
                              ? '❌ ' + (order.paymentStatus === 'Failed' ? 'Payment Failed' : 'Cancelled')
                              : '⏳ Pending'}
                          </span>
                          <span className="text-lg font-bold text-green-600">€{order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Order Content */}
                    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Customer Details */}
                      <div className="lg:col-span-1">
                        <h3 className="font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">Customer Details</h3>
                        <div className="space-y-2">
                          <p className="font-semibold text-gray-900">{getCustomerName()}</p>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p><span className="font-medium">📧 Email:</span> {order.guestInfo?.email || order.userId?.email || 'N/A'}</p>
                            <p><span className="font-medium">📱 Phone:</span> {order.guestInfo?.phone || order.userId?.phone || 'N/A'}</p>
                          </div>
                          {(order.guestInfo?.address || order.userId?.address) && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <p className="text-xs font-semibold text-gray-700 mb-1">📍 Delivery Address:</p>
                              <div className="text-xs text-gray-600 space-y-0.5">
                                <p>{order.guestInfo?.address || order.userId?.address || 'N/A'}</p>
                                {order.guestInfo?.postalCode && (
                                  <p><span className="font-medium">Postal Code:</span> {order.guestInfo.postalCode}</p>
                                )}
                                {order.guestInfo?.country && (
                                  <p><span className="font-medium">Country:</span> {order.guestInfo.country}</p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="lg:col-span-2">
                        <h3 className="font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">Order Items ({order.items.length})</h3>
                        <div className="space-y-3">
                          {order.items.map((item, index) => {
                            // Get variant image and specs
                            const getVariantImage = () => {
                              if (item.variantId && item.productId?.variants) {
                                const variant = item.productId.variants.find(
                                  v => v._id?.toString() === item.variantId?.toString()
                                );
                                if (variant && variant.images && variant.images.length > 0) {
                                  return variant.images[0];
                                }
                              }
                              return item.productId?.images?.[0] || "https://via.placeholder.com/60";
                            };

                            const getVariantSpecs = () => {
                              let variantSpecsObj = null;
                              
                              if (item.variantId && item.productId?.variants) {
                                const variant = item.productId.variants.find(
                                  v => v._id?.toString() === item.variantId?.toString()
                                );
                                if (variant && variant.specs) {
                                  variantSpecsObj = variant.specs instanceof Map 
                                    ? Object.fromEntries(variant.specs) 
                                    : variant.specs;
                                }
                              }
                              
                              // NEW: Filter out single specs - exclude specs that exist in product.specs
                              // Single specs should be in product.specs, multiple specs should be in variant.specs
                              if (variantSpecsObj && item.productId?.specs) {
                                const productSpecsObj = item.productId.specs instanceof Map 
                                  ? Object.fromEntries(item.productId.specs) 
                                  : item.productId.specs;
                                
                                const productSpecKeys = Object.keys(productSpecsObj);
                                
                                // Filter variant specs to only include those NOT in product.specs (i.e., multiple specs)
                                const filteredSpecs = Object.entries(variantSpecsObj).filter(
                                  ([key]) => !productSpecKeys.includes(key)
                                );
                                
                                return filteredSpecs.length > 0 ? Object.fromEntries(filteredSpecs) : null;
                              }
                              
                              return variantSpecsObj;
                            };

                            const variantImage = getVariantImage();
                            const variantSpecs = getVariantSpecs();

                            return (
                              <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="flex items-start gap-4">
                                  <div className="w-20 h-20 bg-white rounded-lg overflow-hidden shrink-0 border border-gray-200">
                                    <img
                                      src={variantImage}
                                      alt={item.productId?.name || item.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900">{item.productId?.name || item.name}</p>
                                    {variantSpecs && Object.keys(variantSpecs).length > 0 && (
                                      <div className="mt-2 flex flex-wrap gap-2">
                                        {Object.entries(variantSpecs).map(([key, value]) => (
                                          <span key={key} className="text-xs bg-white px-2 py-1 rounded border border-gray-200 text-gray-700">
                                            <span className="font-medium capitalize">{key}:</span> {value}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                    <div className="mt-2 flex items-center gap-4 text-sm">
                                      <span className="text-gray-600">
                                        <span className="font-medium">Quantity:</span> {item.quantity}
                                      </span>
                                      <span className="text-gray-600">
                                        <span className="font-medium">Price:</span> <span className="font-semibold text-green-600">€{item.price?.toFixed(2) || '0.00'}</span>
                                      </span>
                                      <span className="text-gray-700 font-semibold">
                                        Subtotal: €{((item.quantity || 1) * (item.price || 0)).toFixed(2)}
                                      </span>
                                    </div>
                                    {item.sellerId && (
                                      <p className="text-xs text-gray-500 mt-1">
                                        <span className="font-medium">Seller:</span> {item.sellerId.name}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Order Actions */}
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                      <div className="flex items-center gap-4">
                        <input
                          type="text"
                          placeholder="Enter tracking number"
                          value={trackingNumbers[order._id] || ""}
                          onChange={(e) => handleTrackingNumberChange(order._id, e.target.value)}
                          className="flex-1 max-w-md p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => processOrder(order._id)}
                          disabled={processingOrders[order._id] || !trackingNumbers[order._id]?.trim()}
                          className="bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {processingOrders[order._id] ? "Processing..." : "Process & Ship"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Processed Orders - REMOVED: Now in separate "Online Paid Processed" section */}
      </div>

    </div>
  );
};

// Fixed Pickup Orders Management with proper details
const PickupOrdersManagement = ({ orders, fetchAllData, token }) => {
  const [processingOrders, setProcessingOrders] = useState({});
  // NEW: State for selected processed orders
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  // NEW: Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  // NEW: Search state
  const [searchQuery, setSearchQuery] = useState("");

  const pickupOrders = orders.filter(order => order.deliveryMethod === "pickup");

  const processOrder = async (orderId) => {
    try {
      setProcessingOrders(prev => ({ ...prev, [orderId]: true }));
      
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/orders/${orderId}/process`,
        { isPickup: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Order Processed</p>
            <p className="text-sm text-gray-600">Customer notified for pickup</p>
          </div>
        </div>,
        { icon: null }
      );
      setProcessingOrders(prev => ({ ...prev, [orderId]: false }));
      fetchAllData();
    } catch (error) {
      console.error("Error processing order:", error);
      toast.error(
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Processing Failed</p>
            <p className="text-sm text-gray-600">{error.response?.data?.message || "Error processing order"}</p>
          </div>
        </div>,
        { icon: null }
      );
      setProcessingOrders(prev => ({ ...prev, [orderId]: false }));
    }
  };

  // NEW: Handle checkbox change
  const handleCheckboxChange = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  // NEW: Handle select all
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedOrders(processedOrders.map(order => order._id));
    } else {
      setSelectedOrders([]);
    }
  };

  // NEW: Export PDF
  const handleExportPDF = () => {
    if (processedOrders.length === 0) {
      toast.error("No orders to export");
      return;
    }
    setShowExportModal(true);
  };

  const confirmExportPDF = async () => {
    try {
      setIsExporting(true);
      setShowExportModal(false);
      const orderIds = selectedOrders.length > 0 ? selectedOrders : processedOrders.map(o => o._id);
      
      // Build query string with multiple orderIds parameters
      const params = new URLSearchParams();
      orderIds.forEach(id => params.append('orderIds', id));
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/orders/processed/export-pdf?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );

      // Create blob and download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `processed-orders-${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success(`PDF exported successfully with ${orderIds.length} order(s)`);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to export PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  // NEW: Delete selected orders
  const handleDeleteSelected = () => {
    if (selectedOrders.length === 0) {
      toast.error("Please select at least one order to delete");
      return;
    }
    setShowDeleteModal(true);
  };

  const confirmDeleteOrders = async () => {
    try {
      setIsDeleting(true);
      setShowDeleteModal(false);
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/orders/processed/bulk-delete`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { orderIds: selectedOrders }
        }
      );

      toast.success(`Successfully deleted ${selectedOrders.length} order(s)`);
      setSelectedOrders([]);
      fetchAllData();
    } catch (error) {
      console.error("Error deleting orders:", error);
      toast.error(error.response?.data?.message || "Failed to delete orders. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter orders by search query (order ID)
  const filterOrdersBySearch = (orderList) => {
    if (!searchQuery.trim()) return orderList;
    const query = searchQuery.toLowerCase().trim();
    return orderList.filter(order => 
      order._id.toLowerCase().includes(query) || 
      order._id.slice(-8).toLowerCase().includes(query)
    );
  };

  const pendingOrders = filterOrdersBySearch(
    pickupOrders
      .filter(order => order.orderStatus === "Pending")
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  );
  
  const processedOrders = filterOrdersBySearch(
    pickupOrders
      .filter(order => order.orderStatus === "Processing")
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Pickup Orders</h1>
            <p className="text-gray-600">Manage orders for outlet pickup</p>
          </div>
          <div className="text-sm text-gray-500">
            Total: {pickupOrders.length} orders
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by Order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Pending Orders Table */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Pending Pickup Orders ({pendingOrders.length})
          </h2>
          
          {pendingOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No pending pickup orders</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingOrders.map((order) => {
                // Fix name display - removes duplicates
                const getCustomerName = () => {
                  if (order.userId?.name) {
                    // Clean up user name if it has duplicates
                    const name = (order.userId.name || '').trim();
                    if (name) {
                      const parts = name.split(/\s+/);
                      const uniqueParts = [];
                      parts.forEach(part => {
                        if (part && !uniqueParts.some(existing => existing.toLowerCase() === part.toLowerCase())) {
                          uniqueParts.push(part);
                        }
                      });
                      return uniqueParts.join(' ');
                    }
                    return name;
                  }
                  const firstName = (order.guestInfo?.firstName || '').trim();
                  const lastName = (order.guestInfo?.lastName || '').trim();
                  
                  // Remove duplicates within firstName or lastName
                  const cleanFirstName = firstName ? firstName.split(/\s+/).filter((v, i, a) => a.indexOf(v) === i).join(' ') : '';
                  const cleanLastName = lastName ? lastName.split(/\s+/).filter((v, i, a) => a.indexOf(v) === i).join(' ') : '';
                  
                  if (cleanFirstName && cleanLastName) {
                    // If firstName already contains lastName, just return firstName
                    if (cleanFirstName.toLowerCase().includes(cleanLastName.toLowerCase())) {
                      return cleanFirstName;
                    }
                    // If lastName already contains firstName, just return lastName
                    if (cleanLastName.toLowerCase().includes(cleanFirstName.toLowerCase())) {
                      return cleanLastName;
                    }
                    // Normal case: combine them with a space
                    return `${cleanFirstName} ${cleanLastName}`;
                  }
                  return cleanFirstName || cleanLastName || 'Guest Customer';
                };

                return (
                  <div key={order._id} className="bg-white border-2 border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                    {/* Order Header */}
                    <div className="bg-gradient-to-r from-amber-50 to-amber-100 px-6 py-4 border-b border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-lg text-gray-900">Order #{order._id.slice(-8)}</p>
                          <p className="text-sm text-gray-500 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.paymentStatus === 'Paid' || order.paymentStatus === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : order.paymentStatus === 'Cancelled' || order.paymentStatus === 'Failed'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.paymentStatus === 'Paid' || order.paymentStatus === 'paid' 
                              ? '✅ Paid' 
                              : order.paymentStatus === 'Cancelled' || order.paymentStatus === 'Failed'
                              ? '❌ ' + (order.paymentStatus === 'Failed' ? 'Payment Failed' : 'Cancelled')
                              : '⏳ Pending'}
                          </span>
                          <span className="text-lg font-bold text-green-600">€{order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Order Content */}
                    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Customer Details */}
                      <div className="lg:col-span-1">
                        <h3 className="font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">Customer Details</h3>
                        <div className="space-y-2">
                          <p className="font-semibold text-gray-900">{getCustomerName()}</p>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p><span className="font-medium">📧 Email:</span> {order.guestInfo?.email || order.userId?.email || 'N/A'}</p>
                            <p><span className="font-medium">📱 Phone:</span> {order.guestInfo?.phone || order.userId?.phone || 'N/A'}</p>
                            {order.guestInfo?.gender && (
                              <p className="capitalize"><span className="font-medium">Gender:</span> {order.guestInfo.gender}</p>
                            )}
                          </div>
                          {(order.guestInfo?.address || order.userId?.address) && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <p className="text-xs font-semibold text-gray-700 mb-1">📍 Address:</p>
                              <div className="text-xs text-gray-600 space-y-0.5">
                                <p>{order.guestInfo?.address || order.userId?.address || 'N/A'}</p>
                                {order.guestInfo?.postalCode && (
                                  <p><span className="font-medium">Postal Code:</span> {order.guestInfo.postalCode}</p>
                                )}
                                {order.guestInfo?.country && (
                                  <p><span className="font-medium">Country:</span> {order.guestInfo.country}</p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Outlet & Items */}
                      <div className="lg:col-span-2 space-y-4">
                        {/* Outlet Details */}
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2 pb-2 border-b border-gray-200">Pickup Outlet</h3>
                          {order.outletId ? (
                            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                              <p className="font-semibold text-gray-900">{order.outletId.name}</p>
                              <p className="text-sm text-gray-600 mt-1">{order.outletId.location}</p>
                              <p className="text-xs text-gray-500">{order.outletId.address}</p>
                              {order.outletId.phone && (
                                <p className="text-xs text-blue-600 mt-1">📞 {order.outletId.phone}</p>
                              )}
                              {order.outletId.email && (
                                <p className="text-xs text-blue-600">✉️ {order.outletId.email}</p>
                              )}
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm">N/A</p>
                          )}
                        </div>

                        {/* Order Items */}
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">Order Items ({order.items.length})</h3>
                          <div className="space-y-3">
                            {order.items.map((item, index) => {
                              // Get variant image and specs
                              const getVariantImage = () => {
                                if (item.variantId && item.productId?.variants) {
                                  const variant = item.productId.variants.find(
                                    v => v._id?.toString() === item.variantId?.toString()
                                  );
                                  if (variant && variant.images && variant.images.length > 0) {
                                    return variant.images[0];
                                  }
                                }
                                return item.productId?.images?.[0] || "https://via.placeholder.com/60";
                              };

                              const getVariantSpecs = () => {
                                let variantSpecsObj = null;
                                
                                if (item.variantId && item.productId?.variants) {
                                  const variant = item.productId.variants.find(
                                    v => v._id?.toString() === item.variantId?.toString()
                                  );
                                  if (variant && variant.specs) {
                                    variantSpecsObj = variant.specs instanceof Map 
                                      ? Object.fromEntries(variant.specs) 
                                      : variant.specs;
                                  }
                                }
                                
                                // NEW: Filter out single specs - exclude specs that exist in product.specs
                                // Single specs should be in product.specs, multiple specs should be in variant.specs
                                if (variantSpecsObj && item.productId?.specs) {
                                  const productSpecsObj = item.productId.specs instanceof Map 
                                    ? Object.fromEntries(item.productId.specs) 
                                    : item.productId.specs;
                                  
                                  const productSpecKeys = Object.keys(productSpecsObj);
                                  
                                  // Filter variant specs to only include those NOT in product.specs (i.e., multiple specs)
                                  const filteredSpecs = Object.entries(variantSpecsObj).filter(
                                    ([key]) => !productSpecKeys.includes(key)
                                  );
                                  
                                  return filteredSpecs.length > 0 ? Object.fromEntries(filteredSpecs) : null;
                                }
                                
                                return variantSpecsObj;
                              };

                              const variantImage = getVariantImage();
                              const variantSpecs = getVariantSpecs();

                              return (
                                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                  <div className="flex items-start gap-4">
                                    <div className="w-20 h-20 bg-white rounded-lg overflow-hidden shrink-0 border border-gray-200">
                                      <img
                                        src={variantImage}
                                        alt={item.productId?.name || item.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-semibold text-gray-900">{item.productId?.name || item.name}</p>
                                      {variantSpecs && Object.keys(variantSpecs).length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-2">
                                          {Object.entries(variantSpecs).map(([key, value]) => (
                                            <span key={key} className="text-xs bg-white px-2 py-1 rounded border border-gray-200 text-gray-700">
                                              <span className="font-medium capitalize">{key}:</span> {value}
                                            </span>
                                          ))}
                                        </div>
                                      )}
                                      <div className="mt-2 flex items-center gap-4 text-sm">
                                        <span className="text-gray-600">
                                          <span className="font-medium">Quantity:</span> {item.quantity}
                                        </span>
                                        <span className="text-gray-600">
                                          <span className="font-medium">Price:</span> <span className="font-semibold text-green-600">€{item.price?.toFixed(2) || '0.00'}</span>
                                        </span>
                                        <span className="text-gray-700 font-semibold">
                                          Subtotal: €{((item.quantity || 1) * (item.price || 0)).toFixed(2)}
                                        </span>
                                      </div>
                                      {item.sellerId && (
                                        <p className="text-xs text-gray-500 mt-1">
                                          <span className="font-medium">Seller:</span> {item.sellerId.name}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Actions */}
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                      <button
                        onClick={() => processOrder(order._id)}
                        disabled={processingOrders[order._id]}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {processingOrders[order._id] ? "Processing..." : "Ready for Pickup - Notify Customer"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
// Fixed Seller Forms Management
const SellerFormsManagement = ({ forms, fetchAllData, token }) => {
  const processForm = async (id) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/seller-company/admin/forms/${id}/process`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAllData();
      toast.success(
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Form Processed</p>
            <p className="text-sm text-gray-600">Form marked as processed</p>
          </div>
        </div>,
        { icon: null }
      );
    } catch (err) {
      console.error("Error processing form:", err);
      toast.error(
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Processing Failed</p>
            <p className="text-sm text-gray-600">Error processing form</p>
          </div>
        </div>
      );
    }
  };

  const pendingForms = forms.filter(form => form.status === "pending");
  const processedForms = forms.filter(form => form.status === "processed");

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Seller Forms</h1>
          <p className="text-gray-600">Manage product forms submitted by sellers</p>
        </div>
        <div className="text-sm text-gray-500">
          {pendingForms.length} pending forms
        </div>
      </div>

      {/* Pending Forms */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Pending Forms ({pendingForms.length})
        </h2>
        
        {pendingForms.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No pending seller forms</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Product Name</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Seller</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Quantity</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Price</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Total Value</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Submitted</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingForms.map((form) => (
                  <tr key={form._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-3 text-sm font-medium text-gray-700">{form.productName}</td>
                    <td className="p-3 text-sm text-gray-600">{form.sellerId?.name || "Unknown"}</td>
                    <td className="p-3 text-sm text-gray-600">{form.quantity}</td>
                    <td className="p-3 text-sm text-gray-600">€{form.price}</td>
                    <td className="p-3 text-sm font-semibold text-green-600">
                      €{(form.quantity * form.price).toFixed(2)}
                    </td>
                    <td className="p-3 text-sm text-gray-500">
                      {new Date(form.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => processForm(form._id)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Mark as Processed
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Processed Forms */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Processed Forms ({processedForms.length})
        </h2>
        
        {processedForms.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No processed seller forms</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Product Name</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Seller</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Quantity</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Price</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Total Value</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Processed Date</th>
                </tr>
              </thead>
              <tbody>
                {processedForms.map((form) => (
                  <tr key={form._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-3 text-sm font-medium text-gray-700">{form.productName}</td>
                    <td className="p-3 text-sm text-gray-600">{form.sellerId?.name || "Unknown"}</td>
                    <td className="p-3 text-sm text-gray-600">{form.quantity}</td>
                    <td className="p-3 text-sm text-gray-600">€{form.price}</td>
                    <td className="p-3 text-sm font-semibold text-green-600">
                      €{(form.quantity * form.price).toFixed(2)}
                    </td>
                    <td className="p-3 text-sm text-gray-500">
                      {new Date(form.updatedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Fixed Seller Requests Management
const SellerRequestsManagement = ({ sellers, fetchAllData, token }) => {
  const approveSeller = async (id) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/verify-seller/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchAllData();
      toast.success(
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Seller Approved</p>
            <p className="text-sm text-gray-600">Seller approved successfully</p>
          </div>
        </div>,
        { icon: null }
      );
    } catch (err) {
      console.log(err);
      toast.error(
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Approval Failed</p>
            <p className="text-sm text-gray-600">Error approving seller</p>
          </div>
        </div>
      );
    }
  };

  const rejectSeller = async (id) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/reject-seller/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchAllData();
      toast.success(
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Seller Rejected</p>
            <p className="text-sm text-gray-600">Seller rejected successfully</p>
          </div>
        </div>,
        { icon: null }
      );
    } catch (err) {
      console.log(err);
      toast.error(
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Rejection Failed</p>
            <p className="text-sm text-gray-600">Error rejecting seller</p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Seller Requests</h1>
          <p className="text-gray-600">Approve or reject seller candidate applications</p>
        </div>
        <div className="text-sm text-gray-500">
          {sellers.length} pending requests
        </div>
      </div>

      {sellers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No pending seller requests</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Name</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Email</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Phone</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Applied On</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((seller) => (
                <tr key={seller._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-3 text-sm text-gray-700">{seller.name}</td>
                  <td className="p-3 text-sm text-gray-700">{seller.email}</td>
                  <td className="p-3 text-sm text-gray-700">{seller.phone || "Not provided"}</td>
                  <td className="p-3 text-sm text-gray-700">
                    {new Date(seller.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => approveSeller(seller._id)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => rejectSeller(seller._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// NEW: Online Paid Processed Orders Component
const OnlinePaidProcessedOrders = ({ orders, fetchAllData, token, user }) => {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // NEW: Only show paid and processed orders
  const onlineOrders = orders.filter(order => 
    order.deliveryMethod === "delivery" && 
    order.paymentMethod === "Stripe" && 
    order.paymentStatus === "Paid" &&
    order.orderStatus === "Processing"
  );

  // Filter orders by search query (order ID)
  const filterOrdersBySearch = (orderList) => {
    if (!searchQuery.trim()) return orderList;
    const query = searchQuery.toLowerCase().trim();
    return orderList.filter(order => 
      order._id.toLowerCase().includes(query) || 
      order._id.slice(-8).toLowerCase().includes(query)
    );
  };

  const processedOrders = filterOrdersBySearch(
    onlineOrders
      .filter(order => order.orderStatus === "Processing")
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  );

  // Helper function to get customer name
  const getCustomerName = (order) => {
    // First, try to get name from guestInfo (form data)
    const firstName = (order.guestInfo?.firstName || '').trim();
    const lastName = (order.guestInfo?.lastName || '').trim();
    
    if (firstName || lastName) {
      if (firstName && lastName) return `${firstName} ${lastName}`;
      return firstName || lastName || 'Guest Customer';
    }
    
    // Fallback to userId name only if no guestInfo exists
    if (order.userId?.name) {
      const name = (order.userId.name || '').trim();
      if (name) {
        const parts = name.split(/\s+/);
        const uniqueParts = [];
        parts.forEach(part => {
          if (part && !uniqueParts.some(existing => existing.toLowerCase() === part.toLowerCase())) {
            uniqueParts.push(part);
          }
        });
        return uniqueParts.join(' ');
      }
      return name;
    }
    
    return 'Guest Customer';
  };

  const handleCheckboxChange = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedOrders(processedOrders.map(order => order._id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleExportPDF = () => {
    if (processedOrders.length === 0) {
      toast.error("No orders to export");
      return;
    }
    setShowExportModal(true);
  };

  const confirmExportPDF = async () => {
    try {
      setIsExporting(true);
      setShowExportModal(false);
      const orderIds = selectedOrders.length > 0 ? selectedOrders : processedOrders.map(o => o._id);
      
      const params = new URLSearchParams();
      orderIds.forEach(id => params.append('orderIds', id));
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/orders/processed/export-pdf?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `online-processed-orders-${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success(`PDF exported successfully with ${orderIds.length} order(s)`);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to export PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedOrders.length === 0) {
      toast.error("Please select at least one order to delete");
      return;
    }
    setShowDeleteModal(true);
  };

  const confirmDeleteOrders = async () => {
    try {
      setIsDeleting(true);
      setShowDeleteModal(false);
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/orders/processed/bulk-delete`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { orderIds: selectedOrders }
        }
      );

      toast.success(`Successfully deleted ${selectedOrders.length} order(s)`);
      setSelectedOrders([]);
      fetchAllData();
    } catch (error) {
      console.error("Error deleting orders:", error);
      toast.error(error.response?.data?.message || "Failed to delete orders. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Online Paid Processed Orders</h1>
            <p className="text-gray-600">View and manage processed online paid orders</p>
          </div>
          <div className="text-sm text-gray-500">
            Total: {processedOrders.length} orders
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by Order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Processed Orders Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Processed Orders ({processedOrders.length})
              </h2>
              {processedOrders.length > 0 && (
                <button
                  onClick={() => handleSelectAll(selectedOrders.length !== processedOrders.length)}
                  className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium"
                >
                  {selectedOrders.length === processedOrders.length ? "Deselect All" : "Select All"}
                </button>
              )}
            </div>
            {processedOrders.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium"
                >
                  {isExporting ? "Exporting..." : `Export PDF ${selectedOrders.length > 0 ? `(${selectedOrders.length})` : '(All)'}`}
                </button>
                <button
                  onClick={handleDeleteSelected}
                  disabled={isDeleting || selectedOrders.length === 0}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium"
                >
                  {isDeleting ? "Deleting..." : `Delete ${selectedOrders.length > 0 ? `(${selectedOrders.length})` : ''}`}
                </button>
              </div>
            )}
          </div>

          {processedOrders.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {processedOrders.map((order) => (
                <div key={order._id} className="bg-white border-2 border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-shadow relative">
                  <div className="absolute top-4 right-4 z-10">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order._id)}
                      onChange={() => handleCheckboxChange(order._id)}
                      className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-lg text-gray-900">Order #{order._id.slice(-8)}</p>
                        <p className="text-sm text-gray-500 mt-1">Ordered: {new Date(order.createdAt).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-500">Shipped: {new Date(order.updatedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">€{order.total.toFixed(2)}</p>
                        <p className="text-sm text-blue-600 font-medium mt-1">
                          📦 {order.trackingNumber || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Order Content */}
                  <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Customer Details */}
                    <div className="lg:col-span-1">
                      <h3 className="font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">Customer Details</h3>
                      <div className="space-y-2">
                          <p className="font-semibold text-gray-900">{getCustomerName(order) || "N/A"}</p>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p><span className="font-medium">📧 Email:</span> {order.guestInfo?.email || order.userId?.email || 'N/A'}</p>
                            <p><span className="font-medium">📱 Phone:</span> {order.guestInfo?.phone || order.userId?.phone || 'N/A'}</p>
                        </div>
                        {(order.guestInfo?.address || order.userId?.address) && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-xs font-semibold text-gray-700 mb-1">📍 Delivery Address:</p>
                            <div className="text-xs text-gray-600 space-y-0.5">
                              <p>{order.guestInfo?.address || order.userId?.address || 'N/A'}</p>
                              {order.guestInfo?.postalCode && (
                                <p><span className="font-medium">Postal Code:</span> {order.guestInfo.postalCode}</p>
                              )}
                              {order.guestInfo?.country && (
                                <p><span className="font-medium">Country:</span> {order.guestInfo.country}</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="lg:col-span-2">
                      <h3 className="font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">Order Items ({order.items?.length || 0})</h3>
                      <div className="space-y-3">
                        {order.items?.map((item, index) => {
                          // Get variant image and specs
                          const getVariantImage = () => {
                            if (item.variantId && item.productId?.variants) {
                              const variant = item.productId.variants.find(
                                v => v._id?.toString() === item.variantId?.toString()
                              );
                              if (variant && variant.images && variant.images.length > 0) {
                                return variant.images[0];
                              }
                            }
                            return item.productId?.images?.[0] || "https://via.placeholder.com/60";
                          };

                          const getVariantSpecs = () => {
                            let variantSpecsObj = null;
                            
                            if (item.variantId && item.productId?.variants) {
                              const variant = item.productId.variants.find(
                                v => v._id?.toString() === item.variantId?.toString()
                              );
                              if (variant && variant.specs) {
                                variantSpecsObj = variant.specs instanceof Map 
                                  ? Object.fromEntries(variant.specs) 
                                  : variant.specs;
                              }
                            }
                            
                            // NEW: Filter out single specs - exclude specs that exist in product.specs
                            // Single specs should be in product.specs, multiple specs should be in variant.specs
                            if (variantSpecsObj && item.productId?.specs) {
                              const productSpecsObj = item.productId.specs instanceof Map 
                                ? Object.fromEntries(item.productId.specs) 
                                : item.productId.specs;
                              
                              const productSpecKeys = Object.keys(productSpecsObj);
                              
                              // Filter variant specs to only include those NOT in product.specs (i.e., multiple specs)
                              const filteredSpecs = Object.entries(variantSpecsObj).filter(
                                ([key]) => !productSpecKeys.includes(key)
                              );
                              
                              return filteredSpecs.length > 0 ? Object.fromEntries(filteredSpecs) : null;
                            }
                            
                            return variantSpecsObj;
                          };

                          const variantImage = getVariantImage();
                          const variantSpecs = getVariantSpecs();

                          return (
                            <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <div className="flex items-start gap-4">
                                <div className="w-20 h-20 bg-white rounded-lg overflow-hidden shrink-0 border border-gray-200">
                                  <img
                                    src={variantImage}
                                    alt={item.productId?.name || item.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-gray-900">{item.productId?.name || item.name}</p>
                                  {variantSpecs && Object.keys(variantSpecs).length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                      {Object.entries(variantSpecs).map(([key, value]) => (
                                        <span key={key} className="text-xs bg-white px-2 py-1 rounded border border-gray-200 text-gray-700">
                                          <span className="font-medium capitalize">{key}:</span> {value}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                  <div className="mt-2 flex items-center gap-4 text-sm">
                                    <span className="text-gray-600">
                                      <span className="font-medium">Quantity:</span> {item.quantity}
                                    </span>
                                    <span className="text-gray-600">
                                      <span className="font-medium">Price:</span> <span className="font-semibold text-green-600">€{item.price?.toFixed(2) || '0.00'}</span>
                                    </span>
                                    <span className="text-gray-700 font-semibold">
                                      Subtotal: €{((item.quantity || 1) * (item.price || 0)).toFixed(2)}
                                    </span>
                                  </div>
                                  {item.sellerId && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      <span className="font-medium">Seller:</span> {item.sellerId.name}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No processed orders found</p>
              {searchQuery && <p className="text-sm mt-2">Try a different search term</p>}
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteOrders}
        title="Delete Processed Orders"
        message={`Are you sure you want to delete ${selectedOrders.length} processed order(s)? This action cannot be undone.`}
      />

      <ConfirmModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onConfirm={confirmExportPDF}
        title="Export Processed Orders"
        message={`You are about to export ${selectedOrders.length > 0 ? selectedOrders.length : processedOrders.length} processed order(s) to PDF. The PDF will be downloaded to your device.`}
      />
    </div>
  );
};

// NEW: Cancelled Orders Management Component
const CancelledOrdersManagement = ({ orders, fetchAllData, token }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter orders by search query
  const filterOrdersBySearch = (orderList) => {
    if (!searchQuery.trim()) return orderList;
    const query = searchQuery.toLowerCase().trim();
    return orderList.filter(order => 
      order._id.toLowerCase().includes(query) || 
      order._id.slice(-8).toLowerCase().includes(query) ||
      (order.userId?.email && order.userId.email.toLowerCase().includes(query)) ||
      (order.guestInfo?.email && order.guestInfo.email.toLowerCase().includes(query))
    );
  };

  const filteredCancelledOrders = filterOrdersBySearch(
    orders.sort((a, b) => new Date(b.cancelledAt || b.createdAt) - new Date(a.cancelledAt || a.createdAt))
  );

  const getCustomerName = (order) => {
    if (order.userId?.name) return order.userId.name;
    const firstName = (order.guestInfo?.firstName || '').trim();
    const lastName = (order.guestInfo?.lastName || '').trim();
    if (firstName && lastName) return `${firstName} ${lastName}`;
    return firstName || lastName || 'Guest Customer';
  };

  const getCancellationReasonText = (reason) => {
    const reasons = {
      'abandoned': 'Payment not completed within 5 minutes',
      'user_cancelled': 'Cancelled by user',
      'stripe_cancelled': 'Cancelled on Stripe checkout page',
      'payment_failed': 'Payment failed',
      'stock_unavailable': 'Stock unavailable'
    };
    return reasons[reason] || reason || 'Unknown reason';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Cancelled Orders</h1>
            <p className="text-gray-600">View all cancelled orders and their reasons</p>
          </div>
          <div className="text-sm text-gray-500">
            Total: {filteredCancelledOrders.length} cancelled orders
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by Order ID or Email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Cancelled Orders List */}
        <div>
          {filteredCancelledOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredCancelledOrders.map((order) => {
                return (
                  <div key={order._id} className="bg-white border-2 border-red-200 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                    {/* Order Header */}
                    <div className="bg-gradient-to-r from-red-50 to-red-100 px-6 py-4 border-b border-red-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-lg text-gray-900">Order #{order._id.slice(-8)}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Created: {new Date(order.createdAt).toLocaleDateString()} | 
                            Cancelled: {order.cancelledAt ? new Date(order.cancelledAt).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            ❌ Cancelled
                          </span>
                          <span className="text-lg font-bold text-gray-600">€{order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Order Content */}
                    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Customer Details */}
                      <div className="lg:col-span-1">
                        <h3 className="font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">Customer Details</h3>
                        <div className="space-y-2">
                          <p className="font-semibold text-gray-900">{getCustomerName(order)}</p>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p><span className="font-medium">📧 Email:</span> {order.guestInfo?.email || order.userId?.email || 'N/A'}</p>
                            <p><span className="font-medium">📱 Phone:</span> {order.guestInfo?.phone || order.userId?.phone || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h4 className="font-semibold text-gray-900 mb-2">Cancellation Details</h4>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Reason:</span> {getCancellationReasonText(order.cancellationReason)}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">Payment Status:</span> 
                            <span className={`ml-2 px-2 py-1 rounded text-xs ${
                              order.paymentStatus === 'Failed' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {order.paymentStatus}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="lg:col-span-2">
                        <h3 className="font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">Order Items ({order.items?.length || 0})</h3>
                        <div className="space-y-3">
                          {order.items?.map((item, index) => {
                            const getVariantImage = () => {
                              if (item.variantId && item.productId?.variants) {
                                const variant = item.productId.variants.find(
                                  v => v._id?.toString() === item.variantId?.toString()
                                );
                                if (variant && variant.images && variant.images.length > 0) {
                                  return variant.images[0];
                                }
                              }
                              return item.productId?.images?.[0] || "https://via.placeholder.com/60";
                            };

                            const getVariantSpecs = () => {
                              let variantSpecsObj = null;
                              
                              if (item.variantId && item.productId?.variants) {
                                const variant = item.productId.variants.find(
                                  v => v._id?.toString() === item.variantId?.toString()
                                );
                                if (variant && variant.specs) {
                                  variantSpecsObj = variant.specs instanceof Map 
                                    ? Object.fromEntries(variant.specs) 
                                    : variant.specs;
                                }
                              }
                              
                              // NEW: Filter out single specs - exclude specs that exist in product.specs
                              // Single specs should be in product.specs, multiple specs should be in variant.specs
                              if (variantSpecsObj && item.productId?.specs) {
                                const productSpecsObj = item.productId.specs instanceof Map 
                                  ? Object.fromEntries(item.productId.specs) 
                                  : item.productId.specs;
                                
                                const productSpecKeys = Object.keys(productSpecsObj);
                                
                                // Filter variant specs to only include those NOT in product.specs (i.e., multiple specs)
                                const filteredSpecs = Object.entries(variantSpecsObj).filter(
                                  ([key]) => !productSpecKeys.includes(key)
                                );
                                
                                return filteredSpecs.length > 0 ? Object.fromEntries(filteredSpecs) : null;
                              }
                              
                              return variantSpecsObj;
                            };

                            const variantImage = getVariantImage();
                            const variantSpecs = getVariantSpecs();

                            return (
                              <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="flex items-start gap-4">
                                  <div className="w-20 h-20 bg-white rounded-lg overflow-hidden shrink-0 border border-gray-200">
                                    <img
                                      src={variantImage}
                                      alt={item.productId?.name || item.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900">{item.productId?.name || item.name}</p>
                                    {variantSpecs && Object.keys(variantSpecs).length > 0 && (
                                      <div className="mt-2 flex flex-wrap gap-2">
                                        {Object.entries(variantSpecs).map(([key, value]) => (
                                          <span key={key} className="text-xs bg-white px-2 py-1 rounded border border-gray-200 text-gray-700">
                                            <span className="font-medium capitalize">{key}:</span> {value}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                    <div className="mt-2 flex items-center gap-4 text-sm">
                                      <span className="text-gray-600">
                                        <span className="font-medium">Quantity:</span> {item.quantity}
                                      </span>
                                      <span className="text-gray-600">
                                        <span className="font-medium">Price:</span> <span className="font-semibold text-gray-600">€{item.price?.toFixed(2) || '0.00'}</span>
                                      </span>
                                      <span className="text-gray-700 font-semibold">
                                        Subtotal: €{((item.quantity || 1) * (item.price || 0)).toFixed(2)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-gray-900">Total:</span>
                            <span className="text-xl font-bold text-gray-600">€{order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No cancelled orders found</p>
              {searchQuery && <p className="text-sm mt-2">Try a different search term</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// NEW: Pickup Processed Orders Component
const PickupProcessedOrders = ({ orders, fetchAllData, token }) => {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const pickupOrders = orders.filter(order => order.deliveryMethod === "pickup");

  // Filter orders by search query (order ID)
  const filterOrdersBySearch = (orderList) => {
    if (!searchQuery.trim()) return orderList;
    const query = searchQuery.toLowerCase().trim();
    return orderList.filter(order => 
      order._id.toLowerCase().includes(query) || 
      order._id.slice(-8).toLowerCase().includes(query)
    );
  };

  const processedOrders = filterOrdersBySearch(
    pickupOrders
      .filter(order => order.orderStatus === "Processing")
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  );

  // Helper function to get customer name
  const getCustomerName = (order) => {
    // First, try to get name from guestInfo (form data)
    const firstName = (order.guestInfo?.firstName || '').trim();
    const lastName = (order.guestInfo?.lastName || '').trim();
    
    if (firstName || lastName) {
      if (firstName && lastName) return `${firstName} ${lastName}`;
      return firstName || lastName || 'Guest Customer';
    }
    
    // Fallback to userId name only if no guestInfo exists
    if (order.userId?.name) {
      const name = (order.userId.name || '').trim();
      if (name) {
        const parts = name.split(/\s+/);
        const uniqueParts = [];
        parts.forEach(part => {
          if (part && !uniqueParts.some(existing => existing.toLowerCase() === part.toLowerCase())) {
            uniqueParts.push(part);
          }
        });
        return uniqueParts.join(' ');
      }
      return name;
    }
    
    return 'Guest Customer';
  };

  const handleCheckboxChange = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedOrders(processedOrders.map(order => order._id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleExportPDF = () => {
    if (processedOrders.length === 0) {
      toast.error("No orders to export");
      return;
    }
    setShowExportModal(true);
  };

  const confirmExportPDF = async () => {
    try {
      setIsExporting(true);
      setShowExportModal(false);
      const orderIds = selectedOrders.length > 0 ? selectedOrders : processedOrders.map(o => o._id);
      
      const params = new URLSearchParams();
      orderIds.forEach(id => params.append('orderIds', id));
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/orders/processed/export-pdf?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `pickup-processed-orders-${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success(`PDF exported successfully with ${orderIds.length} order(s)`);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to export PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedOrders.length === 0) {
      toast.error("Please select at least one order to delete");
      return;
    }
    setShowDeleteModal(true);
  };

  const confirmDeleteOrders = async () => {
    try {
      setIsDeleting(true);
      setShowDeleteModal(false);
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/orders/processed/bulk-delete`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { orderIds: selectedOrders }
        }
      );

      toast.success(`Successfully deleted ${selectedOrders.length} order(s)`);
      setSelectedOrders([]);
      fetchAllData();
    } catch (error) {
      console.error("Error deleting orders:", error);
      toast.error(error.response?.data?.message || "Failed to delete orders. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Pickup Processed Orders</h1>
            <p className="text-gray-600">View and manage processed pickup orders</p>
          </div>
          <div className="text-sm text-gray-500">
            Total: {processedOrders.length} orders
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by Order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Processed Orders Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Processed Orders ({processedOrders.length})
              </h2>
              {processedOrders.length > 0 && (
                <button
                  onClick={() => handleSelectAll(selectedOrders.length !== processedOrders.length)}
                  className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium"
                >
                  {selectedOrders.length === processedOrders.length ? "Deselect All" : "Select All"}
                </button>
              )}
            </div>
            {processedOrders.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium"
                >
                  {isExporting ? "Exporting..." : `Export PDF ${selectedOrders.length > 0 ? `(${selectedOrders.length})` : '(All)'}`}
                </button>
                <button
                  onClick={handleDeleteSelected}
                  disabled={isDeleting || selectedOrders.length === 0}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium"
                >
                  {isDeleting ? "Deleting..." : `Delete ${selectedOrders.length > 0 ? `(${selectedOrders.length})` : ''}`}
                </button>
              </div>
            )}
          </div>

          {processedOrders.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {processedOrders.map((order) => (
                <div key={order._id} className="bg-white border-2 border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-shadow relative">
                  <div className="absolute top-4 right-4 z-10">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order._id)}
                      onChange={() => handleCheckboxChange(order._id)}
                      className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-lg text-gray-900">Order #{order._id.slice(-8)}</p>
                        <p className="text-sm text-gray-500 mt-1">Ordered: {new Date(order.createdAt).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-500">Processed: {new Date(order.updatedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">€{order.total.toFixed(2)}</p>
                        {order.outletId && (
                          <p className="text-sm text-blue-600 font-medium mt-1">
                            🏪 {order.outletId.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Order Content */}
                  <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Customer Details */}
                    <div className="lg:col-span-1">
                      <h3 className="font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">Customer Details</h3>
                      <div className="space-y-2">
                          <p className="font-semibold text-gray-900">{getCustomerName(order) || "N/A"}</p>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p><span className="font-medium">📧 Email:</span> {order.guestInfo?.email || order.userId?.email || 'N/A'}</p>
                            <p><span className="font-medium">📱 Phone:</span> {order.guestInfo?.phone || order.userId?.phone || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Outlet & Items */}
                    <div className="lg:col-span-2 space-y-4">
                      {/* Outlet Details */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2 pb-2 border-b border-gray-200">Pickup Outlet</h3>
                        {order.outletId ? (
                          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                            <p className="font-semibold text-gray-900">{order.outletId.name}</p>
                            <p className="text-sm text-gray-600 mt-1">{order.outletId.location || order.outletId.address}</p>
                            <p className="text-xs text-gray-500">{order.outletId.address}</p>
                            {order.outletId.phone && (
                              <p className="text-xs text-blue-600 mt-1">📞 {order.outletId.phone}</p>
                            )}
                            {order.outletId.email && (
                              <p className="text-xs text-blue-600">✉️ {order.outletId.email}</p>
                            )}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">N/A</p>
                        )}
                      </div>

                      {/* Order Items */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">Order Items ({order.items?.length || 0})</h3>
                        <div className="space-y-3">
                          {order.items?.map((item, index) => {
                            // Get variant image and specs
                            const getVariantImage = () => {
                              if (item.variantId && item.productId?.variants) {
                                const variant = item.productId.variants.find(
                                  v => v._id?.toString() === item.variantId?.toString()
                                );
                                if (variant && variant.images && variant.images.length > 0) {
                                  return variant.images[0];
                                }
                              }
                              return item.productId?.images?.[0] || "https://via.placeholder.com/60";
                            };

                            const getVariantSpecs = () => {
                              let variantSpecsObj = null;
                              
                              if (item.variantId && item.productId?.variants) {
                                const variant = item.productId.variants.find(
                                  v => v._id?.toString() === item.variantId?.toString()
                                );
                                if (variant && variant.specs) {
                                  variantSpecsObj = variant.specs instanceof Map 
                                    ? Object.fromEntries(variant.specs) 
                                    : variant.specs;
                                }
                              }
                              
                              // NEW: Filter out single specs - exclude specs that exist in product.specs
                              // Single specs should be in product.specs, multiple specs should be in variant.specs
                              if (variantSpecsObj && item.productId?.specs) {
                                const productSpecsObj = item.productId.specs instanceof Map 
                                  ? Object.fromEntries(item.productId.specs) 
                                  : item.productId.specs;
                                
                                const productSpecKeys = Object.keys(productSpecsObj);
                                
                                // Filter variant specs to only include those NOT in product.specs (i.e., multiple specs)
                                const filteredSpecs = Object.entries(variantSpecsObj).filter(
                                  ([key]) => !productSpecKeys.includes(key)
                                );
                                
                                return filteredSpecs.length > 0 ? Object.fromEntries(filteredSpecs) : null;
                              }
                              
                              return variantSpecsObj;
                            };

                            const variantImage = getVariantImage();
                            const variantSpecs = getVariantSpecs();

                            return (
                              <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="flex items-start gap-4">
                                  <div className="w-20 h-20 bg-white rounded-lg overflow-hidden shrink-0 border border-gray-200">
                                    <img
                                      src={variantImage}
                                      alt={item.productId?.name || item.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900">{item.productId?.name || item.name}</p>
                                    {variantSpecs && Object.keys(variantSpecs).length > 0 && (
                                      <div className="mt-2 flex flex-wrap gap-2">
                                        {Object.entries(variantSpecs).map(([key, value]) => (
                                          <span key={key} className="text-xs bg-white px-2 py-1 rounded border border-gray-200 text-gray-700">
                                            <span className="font-medium capitalize">{key}:</span> {value}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                    <div className="mt-2 flex items-center gap-4 text-sm">
                                      <span className="text-gray-600">
                                        <span className="font-medium">Quantity:</span> {item.quantity}
                                      </span>
                                      <span className="text-gray-600">
                                        <span className="font-medium">Price:</span> <span className="font-semibold text-green-600">€{item.price?.toFixed(2) || '0.00'}</span>
                                      </span>
                                      <span className="text-gray-700 font-semibold">
                                        Subtotal: €{((item.quantity || 1) * (item.price || 0)).toFixed(2)}
                                      </span>
                                    </div>
                                    {item.sellerId && (
                                      <p className="text-xs text-gray-500 mt-1">
                                        <span className="font-medium">Seller:</span> {item.sellerId.name}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No processed orders found</p>
              {searchQuery && <p className="text-sm mt-2">Try a different search term</p>}
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteOrders}
        title="Delete Processed Orders"
        message={`Are you sure you want to delete ${selectedOrders.length} processed order(s)? This action cannot be undone.`}
      />

      <ConfirmModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onConfirm={confirmExportPDF}
        title="Export Processed Orders"
        message={`You are about to export ${selectedOrders.length > 0 ? selectedOrders.length : processedOrders.length} processed order(s) to PDF. The PDF will be downloaded to your device.`}
      />
    </div>
  );
};

// Fixed Seller Candidates Orders
const SellerCandidatesOrders = ({ orders, fetchAllData, token }) => {
  // NEW: State for selected processed orders
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  // NEW: Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  // NEW: Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Filter orders by search query (order ID)
  const filterOrdersBySearch = (orderList) => {
    if (!searchQuery.trim()) return orderList;
    const query = searchQuery.toLowerCase().trim();
    return orderList.filter(order => 
      order._id.toLowerCase().includes(query) || 
      order._id.slice(-8).toLowerCase().includes(query)
    );
  };

  const pendingOrders = filterOrdersBySearch(
    orders
      .filter(order => order.orderStatus === "Pending")
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  );
  
  const processedOrders = filterOrdersBySearch(
    orders
      .filter(order => order.orderStatus === "Processing")
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  );

  // NEW: Handle checkbox change
  const handleCheckboxChange = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  // NEW: Handle select all
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedOrders(processedOrders.map(order => order._id));
    } else {
      setSelectedOrders([]);
    }
  };

  // NEW: Export PDF
  const handleExportPDF = () => {
    if (processedOrders.length === 0) {
      toast.error("No orders to export");
      return;
    }
    setShowExportModal(true);
  };

  const confirmExportPDF = async () => {
    try {
      setIsExporting(true);
      setShowExportModal(false);
      const orderIds = selectedOrders.length > 0 ? selectedOrders : processedOrders.map(o => o._id);
      
      // Build query string with multiple orderIds parameters
      const params = new URLSearchParams();
      orderIds.forEach(id => params.append('orderIds', id));
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/orders/processed/export-pdf?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );

      // Create blob and download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `processed-orders-${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success(`PDF exported successfully with ${orderIds.length} order(s)`);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to export PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  // NEW: Delete selected orders
  const handleDeleteSelected = () => {
    if (selectedOrders.length === 0) {
      toast.error("Please select at least one order to delete");
      return;
    }
    setShowDeleteModal(true);
  };

  const confirmDeleteOrders = async () => {
    try {
      setIsDeleting(true);
      setShowDeleteModal(false);
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/orders/processed/bulk-delete`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { orderIds: selectedOrders }
        }
      );

      toast.success(`Successfully deleted ${selectedOrders.length} order(s)`);
      setSelectedOrders([]);
      fetchAllData();
    } catch (error) {
      console.error("Error deleting orders:", error);
      toast.error(error.response?.data?.message || "Failed to delete orders. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Seller Candidates Orders</h1>
          <p className="text-gray-600">View orders from seller candidates</p>
        </div>
        <div className="text-sm text-gray-500">
          Total: {orders.length} orders
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by Order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Pending Orders */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Pending Orders ({pendingOrders.length})
        </h2>
        
        {pendingOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No pending seller candidate orders</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Order ID</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Seller</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Customer</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Items</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Amount</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody>
                {pendingOrders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-3 text-sm font-medium text-gray-700">
                      #{order._id.slice(-8)}
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      {order.items
                        .filter(item => item.sellerId?.role === "seller_candidate")
                        .map((item, index) => (
                          <div key={index}>
                            <p className="font-medium">{item.sellerId?.name}</p>
                            <p className="text-xs text-gray-500">{item.sellerId?.email}</p>
                          </div>
                        ))[0]}
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      {(() => {
                        if (order.userId?.name) {
                          return order.userId.name;
                        }
                        const firstName = (order.guestInfo?.firstName || '').trim();
                        const lastName = (order.guestInfo?.lastName || '').trim();
                        if (firstName && lastName) {
                          return `${firstName} ${lastName}`;
                        }
                        return firstName || lastName || 'Guest Customer';
                      })()}
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      {order.items.filter(item => item.sellerId?.role === "seller_candidate").length} item(s)
                    </td>
                    <td className="p-3 text-sm font-semibold text-green-600">
                      €{order.total.toFixed(2)}
                    </td>
                    <td className="p-3 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Processed Orders */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Processed Orders ({processedOrders.length})
            </h2>
            {processedOrders.length > 0 && (
              <button
                onClick={() => handleSelectAll(selectedOrders.length !== processedOrders.length)}
                className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium"
              >
                {selectedOrders.length === processedOrders.length ? "Deselect All" : "Select All"}
              </button>
            )}
          </div>
          {processedOrders.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium"
              >
                {isExporting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Exporting...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export PDF {selectedOrders.length > 0 ? `(${selectedOrders.length})` : '(All)'}
                  </>
                )}
              </button>
              <button
                onClick={handleDeleteSelected}
                disabled={isDeleting || selectedOrders.length === 0}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium"
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Selected ({selectedOrders.length})
                  </>
                )}
              </button>
            </div>
          )}
        </div>
        
        {processedOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No processed seller candidate orders</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">
                    <input
                      type="checkbox"
                      checked={selectedOrders.length === processedOrders.length && processedOrders.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Order ID</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Seller</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Customer</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Amount</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Processed Date</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {processedOrders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order._id)}
                        onChange={() => handleCheckboxChange(order._id)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="p-3 text-sm font-medium text-gray-700">
                      #{order._id.slice(-8)}
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      {order.items[0]?.sellerId?.name}
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      {order.userId?.name || `${order.guestInfo?.firstName} ${order.guestInfo?.lastName}`}
                    </td>
                    <td className="p-3 text-sm font-semibold text-green-600">
                      €{order.total.toFixed(2)}
                    </td>
                    <td className="p-3 text-sm text-gray-500">
                      {new Date(order.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Processed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* NEW: Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteOrders}
        title="Delete Processed Orders"
        message={`Are you sure you want to delete ${selectedOrders.length} processed order(s)? This action cannot be undone and the orders will be permanently removed from the database.`}
        confirmText="Delete Orders"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
      />

      {/* NEW: Export PDF Confirmation Modal */}
      <ConfirmModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onConfirm={confirmExportPDF}
        title="Export Orders to PDF"
        message={`You are about to export ${selectedOrders.length > 0 ? selectedOrders.length : processedOrders.length} processed order(s) to PDF. The PDF will be downloaded to your device.`}
        confirmText="Export PDF"
        cancelText="Cancel"
        type="info"
        isLoading={isExporting}
      />
    </div>
  );
};

// Keep all other existing components exactly as they are...
const CategoryManagement = () => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <h1 className="text-2xl font-bold mb-6">Category Management</h1>
      <CategoryManager />
    </div>
  );
};

const OutletManagement = ({ outlets, fetchAllData, token }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingOutlet, setEditingOutlet] = useState(null);
  const [formData, setFormData] = useState({
    name: "", location: "", address: "", phone: "", email: ""
  });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, outletId: null });

  const resetForm = () => {
    setFormData({ name: "", location: "", address: "", phone: "", email: "" });
    setEditingOutlet(null);
    setShowForm(false);
  };

  const handleEdit = (outlet) => {
    setEditingOutlet(outlet._id);
    setFormData({
      name: outlet.name || "",
      location: outlet.location || "",
      address: outlet.address || "",
      phone: outlet.phone || "",
      email: outlet.email || ""
    });
    setShowForm(true);
  };

  const createOutlet = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/outlets`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Outlet Created</p>
            <p className="text-sm text-gray-600">Outlet created successfully</p>
          </div>
        </div>,
        { icon: null }
      );
      resetForm();
      fetchAllData();
    } catch (error) {
      console.error("Error creating outlet:", error);
      toast.error(
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Creation Failed</p>
            <p className="text-sm text-gray-600">Failed to create outlet</p>
          </div>
        </div>
      );
    }
  };

  const updateOutlet = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/outlets/${editingOutlet}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Outlet Updated</p>
            <p className="text-sm text-gray-600">Outlet updated successfully</p>
          </div>
        </div>,
        { icon: null }
      );
      resetForm();
      fetchAllData();
    } catch (error) {
      console.error("Error updating outlet:", error);
      toast.error(
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Update Failed</p>
            <p className="text-sm text-gray-600">Failed to update outlet</p>
          </div>
        </div>
      );
    }
  };

  const handleDeleteClick = (outletId) => {
    setDeleteModal({ isOpen: true, outletId });
  };

  const deleteOutlet = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/outlets/${deleteModal.outletId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Outlet Deleted</p>
            <p className="text-sm text-gray-600">Outlet deleted successfully</p>
          </div>
        </div>
      );
      setDeleteModal({ isOpen: false, outletId: null });
      fetchAllData();
    } catch (error) {
      console.error("Error deleting outlet:", error);
      toast.error(
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Deletion Failed</p>
            <p className="text-sm text-gray-600">Failed to delete outlet</p>
          </div>
        </div>
      );
      setDeleteModal({ isOpen: false, outletId: null });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Outlet Management</h1>
          <p className="text-gray-600">Manage pickup locations</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700"
        >
          Add Outlet
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h4 className="font-semibold mb-3">{editingOutlet ? 'Edit Outlet' : 'Add New Outlet'}</h4>
          <form onSubmit={editingOutlet ? updateOutlet : createOutlet} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Outlet Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Address"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              className="p-2 border rounded md:col-span-2"
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="p-2 border rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="p-2 border rounded"
            />
            <div className="md:col-span-2 flex gap-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                {editingOutlet ? 'Update Outlet' : 'Create Outlet'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {outlets.map(outlet => (
          <div key={outlet._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-lg">{outlet.name}</h4>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(outlet)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  title="Edit"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(outlet._id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                  title="Delete"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 font-medium">{outlet.location}</p>
            <p className="text-sm text-gray-500 mt-1">{outlet.address}</p>
            {outlet.phone && <p className="text-sm text-gray-500 mt-1">📞 {outlet.phone}</p>}
            {outlet.email && <p className="text-sm text-gray-500 mt-1">✉️ {outlet.email}</p>}
          </div>
        ))}
      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, outletId: null })}
        onConfirm={deleteOutlet}
        title="Delete Outlet"
        message="Are you sure you want to delete this outlet? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

const ProductManagement = ({ myProducts, fetchAllData, setIsProductModalOpen, setEditingProduct, token, user }) => {
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [variantQuantities, setVariantQuantities] = useState({});
  const [variantPrices, setVariantPrices] = useState({});
  const [savingQuantities, setSavingQuantities] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, productId: null });
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleDeleteClick = (productId) => {
    setDeleteModal({ isOpen: true, productId });
  };

  const deleteProduct = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/products/${deleteModal.productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Product Deleted</p>
            <p className="text-sm text-gray-600">Product deleted successfully</p>
          </div>
        </div>
      );
      setDeleteModal({ isOpen: false, productId: null });
      fetchAllData();
    } catch (err) {
      console.log(err);
      toast.error(
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Deletion Failed</p>
            <p className="text-sm text-gray-600">Failed to delete product</p>
          </div>
        </div>
      );
      setDeleteModal({ isOpen: false, productId: null });
    }
  };

  // NEW: Open quantity and price edit modal
  const openQuantityEdit = async (product) => {
    setSelectedProduct(product);
    
    // NEW: Fetch category to filter multiple specs
    // Handle categoryRef - could be ObjectId string or populated object
    const categoryRefId = product.categoryRef?._id || product.categoryRef;
    
    if (categoryRefId) {
      try {
        const categoryRes = await axios.get(`${import.meta.env.VITE_API_URL}/categories/${categoryRefId}`);
        setSelectedCategory(categoryRes.data);
      } catch (err) {
        console.error("Error fetching category:", err);
        setSelectedCategory(null);
      }
    } else {
      setSelectedCategory(null);
    }
    
    // Initialize variant quantities and prices from product
    const quantities = {};
    const prices = {};
    if (product.variants && product.variants.length > 0) {
      product.variants.forEach((variant, index) => {
        quantities[index] = variant.stock !== undefined ? variant.stock : 0;
        prices[index] = variant.price !== undefined ? variant.price : 0;
      });
    }
    setVariantQuantities(quantities);
    setVariantPrices(prices);
    setShowQuantityModal(true);
  };

  // NEW: Save quantity and price changes
  const saveQuantities = async () => {
    if (!selectedProduct || !selectedProduct.variants) return;
    
    setSavingQuantities(true);
    try {
      // Update variants with new quantities and prices
      const updatedVariants = selectedProduct.variants.map((variant, index) => ({
        ...variant,
        stock: variantQuantities[index] !== undefined ? parseInt(variantQuantities[index]) || 0 : variant.stock || 0,
        price: variantPrices[index] !== undefined ? parseFloat(variantPrices[index]) || 0 : variant.price || 0
      }));

      // Update product with new variants, preserve existing common images
      const updatePayload = {
        variants: updatedVariants
      };
      // Only include images if they exist, to preserve existing ones on backend
      if (selectedProduct.images && selectedProduct.images.length > 0) {
        updatePayload.images = selectedProduct.images;
      }
      
      await axios.put(
        `${import.meta.env.VITE_API_URL}/products/${selectedProduct._id}`,
        updatePayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchAllData();
      setShowQuantityModal(false);
      setSelectedProduct(null);
      setVariantQuantities({});
      setVariantPrices({});
      setSelectedCategory(null);
      
      // Show success message
      toast.success(
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Updated Successfully</p>
            <p className="text-sm text-gray-600">Quantities and prices updated successfully</p>
          </div>
        </div>,
        { icon: null }
      );
    } catch (err) {
      console.error("Error updating quantities and prices:", err);
      toast.error(
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Update Failed</p>
            <p className="text-sm text-gray-600">Failed to update quantities and prices. Please try again</p>
          </div>
        </div>,
        { icon: null }
      );
    } finally {
      setSavingQuantities(false);
    }
  };

  // NEW: Update variant quantity in state
  const updateVariantQuantity = (index, value) => {
    setVariantQuantities(prev => ({
      ...prev,
      [index]: Math.max(0, parseInt(value) || 0)
    }));
  };

  // NEW: Update variant price in state
  const updateVariantPrice = (index, value) => {
    setVariantPrices(prev => ({
      ...prev,
      [index]: Math.max(0, parseFloat(value) || 0)
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {user.user?.role === "admin" ? "Product Management" : "My Products"}
          </h1>
          <p className="text-gray-600">
            {user.user?.role === "admin" ? "Manage all products" : "Manage your products"}
          </p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setIsProductModalOpen(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700"
        >
          Add Product
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-3 text-left text-sm font-semibold text-gray-600">Name</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">Price</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">Quantity</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">Category</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {myProducts.map((product) => (
              <tr key={product._id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-3 text-gray-700">{product.name}</td>
                <td className="p-3 text-gray-700">
                  €{(() => {
                    // NEW: Use first variant's price if available
                    if (product.variants && product.variants.length > 0) {
                      const firstVariant = product.variants.find(v => v.enabled) || product.variants[0];
                      if (firstVariant.price !== undefined && firstVariant.price !== null) {
                        return firstVariant.price;
                      }
                    }
                    return product.price || 0;
                  })()}
                </td>
                <td className="p-3 text-gray-700">
                  {(() => {
                    // NEW: Calculate total quantity from variants
                    if (product.variants && product.variants.length > 0) {
                      return product.variants
                        .filter(v => v.enabled)
                        .reduce((sum, v) => sum + (v.stock || 0), 0);
                    }
                    return product.quantity || 0;
                  })()}
                </td>
                <td className="p-3 text-gray-700">{product.category}</td>
                <td className="p-3">
                  <div className="flex space-x-2 flex-wrap gap-1">
                    {product.variants && product.variants.length > 0 && (
                      <button
                        onClick={() => openQuantityEdit(product)}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 flex items-center gap-1"
                        title="Quick Edit Quantities and Prices"
                      >
                        <span>Qty</span>
                        <span>€</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setEditingProduct(product);
                        setIsProductModalOpen(true);
                      }}
                      className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(product._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* NEW: Quantity and Price Edit Modal */}
      {showQuantityModal && selectedProduct && selectedProduct.variants && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-11/12 md:w-2/3 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Quantities & Prices - {selectedProduct.name}</h2>
              <button
                onClick={() => {
                  setShowQuantityModal(false);
                  setSelectedProduct(null);
                  setVariantQuantities({});
                  setVariantPrices({});
                  setSelectedCategory(null);
                }}
                className="text-red-600 font-bold text-lg hover:text-red-800"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {selectedProduct.variants.map((variant, index) => {
                // NEW: Filter specs to only show multiple specs (not single specs)
                // Get multiple spec names from category
                const multipleSpecNames = selectedCategory?.specs
                  ?.filter(spec => spec.type === 'multiple')
                  .map(spec => spec.name) || [];
                
                // Filter variant specs to only include multiple specs
                const variantSpecsObj = variant.specs instanceof Map 
                  ? Object.fromEntries(variant.specs) 
                  : (variant.specs || {});
                
                // NEW: Only show specs that are marked as 'multiple' in category
                // Since variants should only contain multiple specs (after ProductModal changes),
                // we filter based on category. If category is not available, show all variant specs
                // (which should already be only multiple specs for new products)
                const displaySpecs = selectedCategory && multipleSpecNames.length > 0
                  ? Object.entries(variantSpecsObj).filter(([key]) => multipleSpecNames.includes(key))
                  : Object.entries(variantSpecsObj); // Fallback: show all (should be only multiple specs anyway)
                
                return (
                <div key={index} className="border rounded p-4 bg-gray-50">
                  <div className="mb-3">
                    <h3 className="font-semibold text-sm">
                      Variant {index + 1}
                      {displaySpecs.length > 0 && (
                        <span className="ml-2 text-xs text-gray-600">
                          ({displaySpecs.map(([key, value]) => `${key}: ${value}`).join(', ')})
                        </span>
                      )}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium whitespace-nowrap">Quantity:</label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={variantQuantities[index] !== undefined ? variantQuantities[index] : (variant.stock || 0)}
                        onChange={(e) => updateVariantQuantity(index, e.target.value)}
                        className="w-24 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium whitespace-nowrap">Price (€):</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={variantPrices[index] !== undefined ? variantPrices[index] : (variant.price || 0)}
                        onChange={(e) => updateVariantPrice(index, e.target.value)}
                        className="w-32 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  {!variant.enabled && (
                    <span className="text-xs text-gray-500 mt-2 block">
                      (Disabled)
                    </span>
                  )}
                </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setShowQuantityModal(false);
                  setSelectedProduct(null);
                  setVariantQuantities({});
                  setVariantPrices({});
                  setSelectedCategory(null);
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                disabled={savingQuantities}
              >
                Cancel
              </button>
              <button
                onClick={saveQuantities}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={savingQuantities}
              >
                {savingQuantities ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, productId: null })}
        onConfirm={deleteProduct}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

// Reviews Management Component
const ReviewsManagement = ({ products, fetchAllData, token }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [editRating, setEditRating] = useState("");
  const [editComment, setEditComment] = useState("");
  const [editImageUrls, setEditImageUrls] = useState([]);
  const [editImageFiles, setEditImageFiles] = useState([]);
  const [editImagePreviews, setEditImagePreviews] = useState([]);
  const [editLoading, setEditLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Fetch reviews for selected product
  const fetchReviews = async (productId) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/products/${productId}/reviews`
      );
      setReviews(res.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to fetch reviews");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle product selection
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setEditingReview(null);
    setEditRating("");
    setEditComment("");
    setEditImageUrls([]);
    setEditImageFiles([]);
    editImagePreviews.forEach(url => URL.revokeObjectURL(url));
    setEditImagePreviews([]);
    fetchReviews(product._id);
  };

  // Upload images to Cloudinary
  const uploadImages = async (files) => {
    if (!files || files.length === 0) return [];
    
    const formData = new FormData();
    files.forEach(file => formData.append("images", file));
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/upload/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          timeout: 240000
        }
      );
      
      return response.data.images || [];
    } catch (err) {
      console.error("Error uploading images:", err);
      toast.error("Failed to upload images");
      return [];
    }
  };

  // Handle edit image change
  const handleEditImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + editImageUrls.length + editImageFiles.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }
    
    const newFiles = [...editImageFiles, ...files];
    setEditImageFiles(newFiles);
    
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setEditImagePreviews(newPreviews);
  };

  // Remove edit image
  const removeEditImage = (index, isExisting = false) => {
    if (isExisting) {
      const newUrls = editImageUrls.filter((_, i) => i !== index);
      setEditImageUrls(newUrls);
    } else {
      const newFiles = editImageFiles.filter((_, i) => i !== index);
      const newPreviews = editImagePreviews.filter((_, i) => i !== index);
      setEditImageFiles(newFiles);
      setEditImagePreviews(newPreviews);
      URL.revokeObjectURL(editImagePreviews[index]);
    }
  };

  // Handle edit review
  const handleEditReview = (review) => {
    setEditingReview(review);
    setEditRating(review.rating);
    setEditComment(review.comment || "");
    setEditImageUrls(review.images || []);
    setEditImageFiles([]);
    editImagePreviews.forEach(url => URL.revokeObjectURL(url));
    setEditImagePreviews([]);
  };

  // Save edited review
  const handleSaveEdit = async () => {
    if (!selectedProduct || !editingReview) return;

    setEditLoading(true);
    try {
      // Upload new images
      const newImageUrls = editImageFiles.length > 0 
        ? await uploadImages(editImageFiles)
        : [];
      
      // Combine existing and new images
      const allImageUrls = [...editImageUrls, ...newImageUrls];

      await axios.put(
        `${import.meta.env.VITE_API_URL}/products/${selectedProduct._id}/reviews/${editingReview._id}`,
        {
          rating: parseInt(editRating),
          comment: editComment,
          images: allImageUrls,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Review updated successfully");
      setEditingReview(null);
      setEditRating("");
      setEditComment("");
      setEditImageUrls([]);
      setEditImageFiles([]);
      editImagePreviews.forEach(url => URL.revokeObjectURL(url));
      setEditImagePreviews([]);
      fetchReviews(selectedProduct._id);
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error("Failed to update review");
    } finally {
      setEditLoading(false);
    }
  };

  // Handle delete review
  const handleDeleteReview = async (reviewId) => {
    if (!selectedProduct) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/products/${selectedProduct._id}/reviews/${reviewId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Review deleted successfully");
      setShowDeleteConfirm(null);
      fetchReviews(selectedProduct._id);
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    }
  };

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reviews Management</h1>
          <p className="text-gray-600">Manage product reviews - view, edit, and delete reviews</p>
        </div>
        {selectedProduct && (
          <button
            onClick={() => {
              setSelectedProduct(null);
              setReviews([]);
              setEditingReview(null);
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Back to Products
          </button>
        )}
      </div>

      {!selectedProduct ? (
        // Products List View
        <div>
          <div className="mb-4 text-sm text-gray-600">
            Click on a product to view and manage its reviews
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Product</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Category</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Reviews Count</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Average Rating</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-6 text-center text-gray-500">
                      No products found
                    </td>
                  </tr>
                ) : (
                  products.map((product) => {
                    const reviewCount = product.reviews?.length || 0;
                    const avgRating = reviewCount > 0
                      ? (product.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviewCount).toFixed(1)
                      : "0.0";

                    return (
                      <tr key={product._id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-3">
                          <div className="flex items-center space-x-3">
                            {(() => {
                              let displayImage = null;
                              if (product.variants && product.variants.length > 0) {
                                const firstVariant = product.variants.find(v => v.enabled) || product.variants[0];
                                displayImage = firstVariant.images?.[0] || null;
                              }
                              if (!displayImage && product.images && product.images.length > 0) {
                                displayImage = product.images[0];
                              }

                              return displayImage ? (
                                <img
                                  src={displayImage}
                                  alt={product.name}
                                  className="w-10 h-10 object-cover rounded-lg"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                  <span className="text-gray-400 text-xs">No Image</span>
                                </div>
                              );
                            })()}
                            <div>
                              <div className="font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500 line-clamp-1">{product.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium capitalize">
                            {product.category}
                          </span>
                        </td>
                        <td className="p-3 text-sm text-gray-600">
                          {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center space-x-1">
                            <span className="text-sm font-semibold text-gray-900">{avgRating}</span>
                            <span className="text-yellow-500">★</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => handleProductClick(product)}
                            className="px-3 py-1 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition-colors"
                          >
                            View Reviews
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // Reviews List View for Selected Product
        <div>
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              {(() => {
                let displayImage = null;
                if (selectedProduct.variants && selectedProduct.variants.length > 0) {
                  const firstVariant = selectedProduct.variants.find(v => v.enabled) || selectedProduct.variants[0];
                  displayImage = firstVariant.images?.[0] || null;
                }
                if (!displayImage && selectedProduct.images && selectedProduct.images.length > 0) {
                  displayImage = selectedProduct.images[0];
                }

                return displayImage ? (
                  <img
                    src={displayImage}
                    alt={selectedProduct.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-xs">No Image</span>
                  </div>
                );
              })()}
              <div>
                <h2 className="text-lg font-bold text-gray-900">{selectedProduct.name}</h2>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-gray-600">
                <strong>{reviews.length}</strong> {reviews.length === 1 ? "review" : "reviews"}
              </span>
              {reviews.length > 0 && (
                <span className="text-gray-600">
                  Average Rating: <strong>{averageRating}</strong> <span className="text-yellow-500">★</span>
                </span>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No reviews yet for this product</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  {editingReview && editingReview._id === review._id ? (
                    // Edit Mode
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Rating (1-5)
                        </label>
                        <select
                          value={editRating}
                          onChange={(e) => setEditRating(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        >
                          <option value="1">1 Star</option>
                          <option value="2">2 Stars</option>
                          <option value="3">3 Stars</option>
                          <option value="4">4 Stars</option>
                          <option value="5">5 Stars</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Comment
                        </label>
                        <textarea
                          value={editComment}
                          onChange={(e) => setEditComment(e.target.value)}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="Enter review comment..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Images (Max 5)
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleEditImageChange}
                          className="hidden"
                          id={`edit-review-images-${editingReview._id}`}
                          disabled={editImageUrls.length + editImageFiles.length >= 5}
                        />
                        <label
                          htmlFor={`edit-review-images-${editingReview._id}`}
                          className={`inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors text-sm ${
                            editImageUrls.length + editImageFiles.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          <span>Add Images</span>
                        </label>
                        
                        {/* Existing Images */}
                        {editImageUrls.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-3">
                            {editImageUrls.map((url, idx) => (
                              <div key={idx} className="relative group">
                                <img
                                  src={url}
                                  alt={`Review ${idx + 1}`}
                                  className="w-24 h-24 object-cover rounded-lg border border-gray-300"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeEditImage(idx, true)}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  style={{ fontSize: '12px', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* New Image Previews */}
                        {editImagePreviews.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-3">
                            {editImagePreviews.map((preview, idx) => (
                              <div key={idx} className="relative group">
                                <img
                                  src={preview}
                                  alt={`Preview ${idx + 1}`}
                                  className="w-24 h-24 object-cover rounded-lg border border-gray-300"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeEditImage(idx, false)}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  style={{ fontSize: '12px', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSaveEdit}
                          disabled={editLoading}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          {editLoading ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={() => {
                            setEditingReview(null);
                            setEditRating("");
                            setEditComment("");
                            setEditImageUrls([]);
                            setEditImageFiles([]);
                            editImagePreviews.forEach(url => URL.revokeObjectURL(url));
                            setEditImagePreviews([]);
                          }}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={`text-lg ${
                                    i < review.rating ? "text-yellow-500" : "text-gray-300"
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            <span className="text-sm font-semibold text-gray-700">
                              {review.rating}/5
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            <strong>
                              {review.userId
                                ? review.userId.name || "User"
                                : review.name || "Anonymous"}
                            </strong>
                            {review.email && !review.userId && (
                              <span className="ml-2 text-gray-500">({review.email})</span>
                            )}
                            {review.userId && review.userId.email && (
                              <span className="ml-2 text-gray-500">({review.userId.email})</span>
                            )}
                          </div>
                          {review.createdAt && (
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditReview(review)}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(review._id)}
                            className="px-3 py-1 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      {review.comment && (
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">{review.comment}</p>
                        </div>
                      )}
                      {/* Display Review Images */}
                      {review.images && review.images.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-3">
                          {review.images.map((imageUrl, imgIndex) => (
                            <div key={imgIndex} className="relative">
                              <img
                                src={imageUrl}
                                alt={`Review image ${imgIndex + 1}`}
                                className="w-24 h-24 object-cover rounded-lg border border-gray-300"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <ConfirmModal
              isOpen={!!showDeleteConfirm}
              onClose={() => setShowDeleteConfirm(null)}
              onConfirm={() => handleDeleteReview(showDeleteConfirm)}
              title="Delete Review"
              message="Are you sure you want to delete this review? This action cannot be undone."
              confirmText="Delete"
              cancelText="Cancel"
              confirmClass="bg-red-600 hover:bg-red-700"
            />
          )}
        </div>
      )}
    </div>
  );
};

const FeaturedProductsManagement = ({ products, fetchAllData, token }) => {
  const toggleFeatured = async (productId, currentStatus) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/products/${productId}/featured`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update local state
      fetchAllData();
      toast.success(
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Featured Status Updated</p>
            <p className="text-sm text-gray-600">{res.data.message}</p>
          </div>
        </div>,
        { icon: null }
      );
    } catch (error) {
      console.error("Error toggling featured:", error);
      toast.error(
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Update Failed</p>
            <p className="text-sm text-gray-600">Error updating featured status</p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Featured Products</h1>
          <p className="text-gray-600">Mark/unmark products as featured for the home page</p>
        </div>
        <div className="text-sm text-gray-500">
          {products.filter(p => p.featured).length} featured of {products.length} total
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-3 text-left text-sm font-semibold text-gray-600">Product</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">Seller</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">Price</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">Category</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-3">
                  <div className="flex items-center space-x-3">
                    {(() => {
                      // NEW: Use first variant's image if available
                      let displayImage = null;
                      if (product.variants && product.variants.length > 0) {
                        const firstVariant = product.variants.find(v => v.enabled) || product.variants[0];
                        displayImage = firstVariant.images?.[0] || null;
                      }
                      if (!displayImage && product.images && product.images.length > 0) {
                        displayImage = product.images[0];
                      }
                      
                      return displayImage ? (
                        <img
                          src={displayImage}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No Image</span>
                        </div>
                      );
                    })()}
                    <div>
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500 line-clamp-1">{product.description}</div>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-sm text-gray-600">
                  {product.sellerId?.name || "Unknown Seller"}
                  <div className="text-xs text-gray-400 capitalize">
                    {product.sellerId?.role?.replace("_", " ") || "Unknown"}
                  </div>
                </td>
                <td className="p-3 font-semibold text-green-600">
                  €{(() => {
                    // NEW: Use first variant's price if available
                    if (product.variants && product.variants.length > 0) {
                      const firstVariant = product.variants.find(v => v.enabled) || product.variants[0];
                      if (firstVariant.price !== undefined && firstVariant.price !== null) {
                        return firstVariant.price;
                      }
                    }
                    return product.price || 0;
                  })()}
                </td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium capitalize">
                    {product.category}
                  </span>
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.featured
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {product.featured ? "Featured" : "Not Featured"}
                  </span>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => toggleFeatured(product._id, product.featured)}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      product.featured
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    {product.featured ? "Remove Featured" : "Mark Featured"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

