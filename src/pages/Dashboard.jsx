import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import ProductModal from "../components/ProductModal";
import CategoryManager from "../components/CategoryManager";
import Breadcrumb from "../components/Breadcrumb";
import toast from "react-hot-toast";


// Dashboard Sidebar Component 
const DashboardSidebar = ({ activeSection, setActiveSection, user }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const adminMenuItems = [
    { id: "overview", label: "Dashboard Overview", icon: "📊" },
    { id: "categories", label: "Category Management", icon: "🗂️" },
    { id: "outlets", label: "Outlet Management", icon: "🏪" },
    { id: "products", label: "Product Management", icon: "📦" },
    { id: "online-orders", label: "Online Paid Orders", icon: "🚚" },
    { id: "pickup-orders", label: "Pickup Orders", icon: "🏪" },
    { id: "featured-products", label: "Featured Products", icon: "⭐" },
    { id: "seller-candidates-orders", label: "Seller Candidates Orders", icon: "👥" },
    { id: "seller-requests", label: "Seller Requests", icon: "👤" },
    { id: "seller-forms", label: "Seller Forms", icon: "📝" },
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
        const [
          sellersRes, 
          formsRes, 
          ordersRes,
          outletsRes
        ] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/admin/seller-requests`, 
            { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${import.meta.env.VITE_API_URL}/seller-company/admin/forms`, 
            { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${import.meta.env.VITE_API_URL}/orders/all`, 
            { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${import.meta.env.VITE_API_URL}/outlets/all`, 
            { headers: { Authorization: `Bearer ${token}` } })
        ]);

        setPendingSellers(sellersRes.data);
        setSellerForms(formsRes.data);
        setCompanyOrders(ordersRes.data);
        setOutlets(outletsRes.data);

        // For seller candidate orders, filter from all orders
        const candidateOrders = ordersRes.data.filter(order => 
          order.items.some(item => item.sellerId?.role === "seller_candidate")
        );
        setSellerCandidateOrders(candidateOrders);
      }

      // Seller candidate specific data
      if (user.user?.role === "seller_candidate") {
        const ordersRes = await axios.get(`${import.meta.env.VITE_API_URL}/orders/seller`, 
          { headers: { Authorization: `Bearer ${token}` } });
        setSellerOrders(ordersRes.data);
      }

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
      if (user.user?.role === "seller" || user.user?.role === "seller_candidate") {
        endpoint = `${import.meta.env.VITE_API_URL}/admin/seller-overview`;
      }

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
      
      case "featured-products":
        return <FeaturedProductsManagement 
          products={allProducts} 
          fetchAllData={fetchAllData}
          token={token}
        />;
      
      case "seller-candidates-orders":
        return <SellerCandidatesOrders 
          orders={sellerCandidateOrders} 
          fetchAllData={fetchAllData}
          token={token}
        />;
      
      case "seller-requests":
        return <SellerRequestsManagement 
          sellers={pendingSellers} 
          fetchAllData={fetchAllData}
          token={token}
        />;
      
      case "seller-forms":
        return <SellerFormsManagement 
          forms={sellerForms} 
          fetchAllData={fetchAllData}
          token={token}
        />;
      
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
    "online-orders": "Online Paid Orders",
    "pickup-orders": "Pickup Orders",
    "featured-products": "Featured Products",
    "seller-candidates-orders": "Seller Candidates Orders",
    "seller-requests": "Seller Requests",
    "seller-forms": "Seller Forms",
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
      value: `$${totalRevenue.toFixed(2)}`, 
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
                      ${order.total?.toFixed(2)}
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

  const onlineOrders = orders.filter(order => 
    order.deliveryMethod === "delivery" && order.paymentMethod === "Stripe"
  );

  const processOrder = async (orderId) => {
    const trackingNumber = trackingNumbers[orderId];
    
    if (!trackingNumber?.trim()) {
      alert("Please enter tracking number");
      return;
    }

    try {
      setProcessingOrders(prev => ({ ...prev, [orderId]: true }));
      
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/orders/${orderId}/process`,
        { trackingNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Order processed successfully! Tracking information sent to customer.");
      setTrackingNumbers(prev => ({ ...prev, [orderId]: "" }));
      setProcessingOrders(prev => ({ ...prev, [orderId]: false }));
      fetchAllData();
    } catch (error) {
      console.error("Error processing order:", error);
      alert(error.response?.data?.message || "Error processing order");
      setProcessingOrders(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const handleTrackingNumberChange = (orderId, value) => {
    setTrackingNumbers(prev => ({
      ...prev,
      [orderId]: value
    }));
  };

  const pendingOrders = onlineOrders.filter(order => order.orderStatus === "Pending");
  console.log(pendingOrders)
  const processedOrders = onlineOrders.filter(order => order.orderStatus === "Processing");
  console.log(processedOrders)

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
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Order Details</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Customer Details</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Items</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Amount</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingOrders.map((order) => (
                    <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-3">
                        <div className="text-sm">
                          <p className="font-medium text-gray-700">#{order._id.slice(-8)}</p>
                          <p className="text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                          <p className="text-xs text-gray-400">Payment: {order.paymentMethod}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="text-sm text-gray-600">
                          <p className="font-semibold text-gray-900 mb-1">
                            {order.userId 
                              ? order.userId.name 
                              : `${order.guestInfo?.firstName || ''} ${order.guestInfo?.lastName || ''}`.trim() || 'Guest Customer'
                            }
                          </p>
                          <div className="space-y-0.5">
                            <p className="text-xs text-gray-600">
                              <span className="font-medium">Email:</span> {order.userId ? order.userId.email : order.guestInfo?.email || 'N/A'}
                            </p>
                            <p className="text-xs text-gray-600">
                              <span className="font-medium">Phone:</span> {order.userId ? order.userId.phone : order.guestInfo?.phone || 'N/A'}
                            </p>
                            {order.guestInfo?.address && (
                              <p className="text-xs text-gray-600 mt-1">
                                <span className="font-medium">Address:</span> {order.guestInfo.address}
                                {order.guestInfo?.postalCode && `, ${order.guestInfo.postalCode}`}
                                {order.guestInfo?.country && `, ${order.guestInfo.country}`}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="text-sm text-gray-600 space-y-3">
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
                              if (item.variantId && item.productId?.variants) {
                                const variant = item.productId.variants.find(
                                  v => v._id?.toString() === item.variantId?.toString()
                                );
                                if (variant && variant.specs) {
                                  return variant.specs instanceof Map 
                                    ? Object.fromEntries(variant.specs) 
                                    : variant.specs;
                                }
                              }
                              return null;
                            };

                            const variantImage = getVariantImage();
                            const variantSpecs = getVariantSpecs();

                            return (
                              <div key={index} className="flex items-start gap-3 pb-2 border-b border-gray-100 last:border-b-0">
                                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                  <img
                                    src={variantImage}
                                    alt={item.productId?.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-gray-900">{item.productId?.name}</p>
                                  {variantSpecs && Object.keys(variantSpecs).length > 0 && (
                                    <div className="mt-1 flex flex-wrap gap-1.5">
                                      {Object.entries(variantSpecs).map(([key, value]) => (
                                        <span key={key} className="text-xs text-gray-600">
                                          <span className="font-medium capitalize">{key}:</span> {value}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                  <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                                  {item.sellerId && (
                                    <p className="text-xs text-gray-500">Seller: {item.sellerId.name}</p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </td>
                      <td className="p-3 text-sm font-semibold text-green-600">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="p-3">
                        <div className="flex flex-col space-y-2">
                          <input
                            type="text"
                            placeholder="Enter tracking number"
                            value={trackingNumbers[order._id] || ""}
                            onChange={(e) => handleTrackingNumberChange(order._id, e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-sm"
                          />
                          <button
                            onClick={() => processOrder(order._id)}
                            disabled={processingOrders[order._id] || !trackingNumbers[order._id]?.trim()}
                            className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {processingOrders[order._id] ? "Processing..." : "Process & Ship"}
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

        {/* Processed Orders Table */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Shipped Orders ({processedOrders.length})
          </h2>
          
          {processedOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No shipped orders</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Order Details</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Customer</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Tracking</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Items</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Amount</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Shipped Date</th>
                  </tr>
                </thead>
                <tbody>
                  {processedOrders.map((order) => (
                    <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-3">
                        <div className="text-sm">
                          <p className="font-medium text-gray-700">#{order._id.slice(-8)}</p>
                          <p className="text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {order.userId 
                              ? order.userId.name 
                              : `${order.guestInfo?.firstName || ''} ${order.guestInfo?.lastName || ''}`.trim() || 'Guest Customer'
                            }
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {order.userId ? order.userId.email : order.guestInfo?.email || 'N/A'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {order.userId ? order.userId.phone : order.guestInfo?.phone || 'N/A'}
                          </p>
                        </div>
                      </td>
                      <td className="p-3">
                        <p className="text-sm text-blue-600 font-medium">
                          {order.trackingNumber || "N/A"}
                        </p>
                        {order.trackingNumber && (
                          <p className="text-xs text-gray-500">Tracking added</p>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="text-sm text-gray-600 space-y-3">
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
                              if (item.variantId && item.productId?.variants) {
                                const variant = item.productId.variants.find(
                                  v => v._id?.toString() === item.variantId?.toString()
                                );
                                if (variant && variant.specs) {
                                  return variant.specs instanceof Map 
                                    ? Object.fromEntries(variant.specs) 
                                    : variant.specs;
                                }
                              }
                              return null;
                            };

                            const variantImage = getVariantImage();
                            const variantSpecs = getVariantSpecs();

                            return (
                              <div key={index} className="flex items-start gap-3 pb-2 border-b border-gray-100 last:border-b-0">
                                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                  <img
                                    src={variantImage}
                                    alt={item.productId?.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-gray-900">{item.productId?.name}</p>
                                  {variantSpecs && Object.keys(variantSpecs).length > 0 && (
                                    <div className="mt-1 flex flex-wrap gap-1.5">
                                      {Object.entries(variantSpecs).map(([key, value]) => (
                                        <span key={key} className="text-xs text-gray-600">
                                          <span className="font-medium capitalize">{key}:</span> {value}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                  <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </td>
                      <td className="p-3 text-sm font-semibold text-green-600">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="p-3 text-sm text-gray-500">
                        {new Date(order.updatedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
// Fixed Pickup Orders Management with proper details
const PickupOrdersManagement = ({ orders, fetchAllData, token }) => {
  const [processingOrders, setProcessingOrders] = useState({});

  const pickupOrders = orders.filter(order => order.deliveryMethod === "pickup");

  const processOrder = async (orderId) => {
    try {
      setProcessingOrders(prev => ({ ...prev, [orderId]: true }));
      
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/orders/${orderId}/process`,
        { isPickup: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Order processed successfully! Customer notified for pickup.");
      setProcessingOrders(prev => ({ ...prev, [orderId]: false }));
      fetchAllData();
    } catch (error) {
      console.error("Error processing order:", error);
      alert(error.response?.data?.message || "Error processing order");
      setProcessingOrders(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const pendingOrders = pickupOrders.filter(order => order.orderStatus === "Pending");
  const processedOrders = pickupOrders.filter(order => order.orderStatus === "Processing");

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
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Order Details</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Customer Details</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Outlet</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Items</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Payment</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Amount</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingOrders.map((order) => (
                    <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-3">
                        <div className="text-sm">
                          <p className="font-medium text-gray-700">#{order._id.slice(-8)}</p>
                          <p className="text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="text-sm text-gray-600">
                          <p className="font-semibold text-gray-900 mb-1">
                            {order.userId 
                              ? order.userId.name 
                              : `${order.guestInfo?.firstName || ''} ${order.guestInfo?.lastName || ''}`.trim() || 'Guest Customer'
                            }
                          </p>
                          <div className="space-y-0.5">
                            <p className="text-xs text-gray-600">
                              <span className="font-medium">Email:</span> {order.userId ? order.userId.email : order.guestInfo?.email || 'N/A'}
                            </p>
                            <p className="text-xs text-gray-600">
                              <span className="font-medium">Phone:</span> {order.userId ? order.userId.phone : order.guestInfo?.phone || 'N/A'}
                            </p>
                            {order.guestInfo?.gender && (
                              <p className="text-xs text-gray-600 capitalize">
                                <span className="font-medium">Gender:</span> {order.guestInfo.gender}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {order.outletId ? (
                          <div>
                            <p className="font-medium">{order.outletId.name}</p>
                            <p className="text-xs">{order.outletId.location}</p>
                            <p className="text-xs text-gray-500">{order.outletId.address}</p>
                            {order.outletId.phone && (
                              <p className="text-xs text-blue-600">📞 {order.outletId.phone}</p>
                            )}
                          </div>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="p-3">
                        <div className="text-sm text-gray-600 space-y-3">
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
                              if (item.variantId && item.productId?.variants) {
                                const variant = item.productId.variants.find(
                                  v => v._id?.toString() === item.variantId?.toString()
                                );
                                if (variant && variant.specs) {
                                  return variant.specs instanceof Map 
                                    ? Object.fromEntries(variant.specs) 
                                    : variant.specs;
                                }
                              }
                              return null;
                            };

                            const variantImage = getVariantImage();
                            const variantSpecs = getVariantSpecs();

                            return (
                              <div key={index} className="flex items-start gap-3 pb-2 border-b border-gray-100 last:border-b-0">
                                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                  <img
                                    src={variantImage}
                                    alt={item.productId?.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-gray-900">{item.productId?.name}</p>
                                  {variantSpecs && Object.keys(variantSpecs).length > 0 && (
                                    <div className="mt-1 flex flex-wrap gap-1.5">
                                      {Object.entries(variantSpecs).map(([key, value]) => (
                                        <span key={key} className="text-xs text-gray-600">
                                          <span className="font-medium capitalize">{key}:</span> {value}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                  <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                                  {item.sellerId && (
                                    <p className="text-xs text-gray-500">Seller: {item.sellerId.name}</p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.paymentStatus === 'Paid' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.paymentStatus}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">{order.paymentMethod}</p>
                      </td>
                      <td className="p-3 text-sm font-semibold text-green-600">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => processOrder(order._id)}
                          disabled={processingOrders[order._id]}
                          className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {processingOrders[order._id] ? "Processing..." : "Ready for Pickup"}
                        </button>
                        <p className="text-xs text-gray-500 mt-1 text-center">
                          Notify customer
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Ready for Pickup Orders Table */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Ready for Pickup ({processedOrders.length})
          </h2>
          
          {processedOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No orders ready for pickup</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Order Details</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Customer</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Outlet Details</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Items</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Amount</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Ready Since</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {processedOrders.map((order) => (
                    <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-3">
                        <div className="text-sm">
                          <p className="font-medium text-gray-700">#{order._id.slice(-8)}</p>
                          <p className="text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {order.userId 
                              ? order.userId.name 
                              : `${order.guestInfo?.firstName || ''} ${order.guestInfo?.lastName || ''}`.trim() || 'Guest Customer'
                            }
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {order.userId ? order.userId.email : order.guestInfo?.email || 'N/A'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {order.userId ? order.userId.phone : order.guestInfo?.phone || 'N/A'}
                          </p>
                        </div>
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {order.outletId && (
                          <div>
                            <p className="font-medium">{order.outletId.name}</p>
                            <p className="text-xs">{order.outletId.location}</p>
                            <p className="text-xs text-gray-500">{order.outletId.address}</p>
                            {order.outletId.phone && (
                              <p className="text-xs text-blue-600">📞 {order.outletId.phone}</p>
                            )}
                            {order.outletId.email && (
                              <p className="text-xs text-blue-600">✉️ {order.outletId.email}</p>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="text-sm text-gray-600 space-y-3">
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
                              if (item.variantId && item.productId?.variants) {
                                const variant = item.productId.variants.find(
                                  v => v._id?.toString() === item.variantId?.toString()
                                );
                                if (variant && variant.specs) {
                                  return variant.specs instanceof Map 
                                    ? Object.fromEntries(variant.specs) 
                                    : variant.specs;
                                }
                              }
                              return null;
                            };

                            const variantImage = getVariantImage();
                            const variantSpecs = getVariantSpecs();

                            return (
                              <div key={index} className="flex items-start gap-3 pb-2 border-b border-gray-100 last:border-b-0">
                                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                  <img
                                    src={variantImage}
                                    alt={item.productId?.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-gray-900">{item.productId?.name}</p>
                                  {variantSpecs && Object.keys(variantSpecs).length > 0 && (
                                    <div className="mt-1 flex flex-wrap gap-1.5">
                                      {Object.entries(variantSpecs).map(([key, value]) => (
                                        <span key={key} className="text-xs text-gray-600">
                                          <span className="font-medium capitalize">{key}:</span> {value}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                  <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </td>
                      <td className="p-3 text-sm font-semibold text-green-600">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="p-3 text-sm text-gray-500">
                        {new Date(order.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          Ready for Pickup
                        </span>
                        <p className="text-xs text-gray-500 mt-1">Customer notified</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
      alert("Form marked as processed!");
    } catch (err) {
      console.error("Error processing form:", err);
      alert("Error processing form");
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
                    <td className="p-3 text-sm text-gray-600">${form.price}</td>
                    <td className="p-3 text-sm font-semibold text-green-600">
                      ${(form.quantity * form.price).toFixed(2)}
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
                    <td className="p-3 text-sm text-gray-600">${form.price}</td>
                    <td className="p-3 text-sm font-semibold text-green-600">
                      ${(form.quantity * form.price).toFixed(2)}
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
      alert("Seller approved successfully!");
    } catch (err) {
      console.log(err);
      alert("Error approving seller");
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
      alert("Seller rejected successfully!");
    } catch (err) {
      console.log(err);
      alert("Error rejecting seller");
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

// Fixed Seller Candidates Orders
const SellerCandidatesOrders = ({ orders, fetchAllData, token }) => {
  const pendingOrders = orders.filter(order => order.orderStatus === "Pending");
  const processedOrders = orders.filter(order => order.orderStatus === "Processing");

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
                      {order.userId 
                        ? order.userId.name 
                        : `${order.guestInfo?.firstName} ${order.guestInfo?.lastName}`
                      }
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      {order.items.filter(item => item.sellerId?.role === "seller_candidate").length} item(s)
                    </td>
                    <td className="p-3 text-sm font-semibold text-green-600">
                      ${order.total.toFixed(2)}
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
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Processed Orders ({processedOrders.length})
        </h2>
        
        {processedOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No processed seller candidate orders</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
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
                      ${order.total.toFixed(2)}
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
      alert("Outlet created successfully!");
      resetForm();
      fetchAllData();
    } catch (error) {
      console.error("Error creating outlet:", error);
      alert("Failed to create outlet");
    }
  };

  const updateOutlet = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/outlets/${editingOutlet}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Outlet updated successfully!");
      resetForm();
      fetchAllData();
    } catch (error) {
      console.error("Error updating outlet:", error);
      alert("Failed to update outlet");
    }
  };

  const deleteOutlet = async (outletId) => {
    if (!window.confirm("Are you sure you want to delete this outlet?")) {
      return;
    }
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/outlets/${outletId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Outlet deleted successfully!");
      fetchAllData();
    } catch (error) {
      console.error("Error deleting outlet:", error);
      alert("Failed to delete outlet");
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
                  onClick={() => deleteOutlet(outlet._id)}
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
    </div>
  );
};

const ProductManagement = ({ myProducts, fetchAllData, setIsProductModalOpen, setEditingProduct, token, user }) => {
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [variantQuantities, setVariantQuantities] = useState({});
  const [savingQuantities, setSavingQuantities] = useState(false);

  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchAllData();
      } catch (err) {
        console.log(err);
      }
    }
  };

  // NEW: Open quantity edit modal
  const openQuantityEdit = (product) => {
    setSelectedProduct(product);
    
    // Initialize variant quantities from product
    const quantities = {};
    if (product.variants && product.variants.length > 0) {
      product.variants.forEach((variant, index) => {
        quantities[index] = variant.stock !== undefined ? variant.stock : 0;
      });
    }
    setVariantQuantities(quantities);
    setShowQuantityModal(true);
  };

  // NEW: Save quantity changes
  const saveQuantities = async () => {
    if (!selectedProduct || !selectedProduct.variants) return;
    
    setSavingQuantities(true);
    try {
      // Update variants with new quantities
      const updatedVariants = selectedProduct.variants.map((variant, index) => ({
        ...variant,
        stock: variantQuantities[index] !== undefined ? parseInt(variantQuantities[index]) || 0 : variant.stock || 0
      }));

      // Update product with new variants
      await axios.put(
        `${import.meta.env.VITE_API_URL}/products/${selectedProduct._id}`,
        { variants: updatedVariants },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchAllData();
      setShowQuantityModal(false);
      setSelectedProduct(null);
      setVariantQuantities({});
      
      // Show success message
      alert("Quantities updated successfully!");
    } catch (err) {
      console.error("Error updating quantities:", err);
      alert("Failed to update quantities. Please try again.");
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
                  ${(() => {
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
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                        title="Quick Edit Quantities"
                      >
                        Qty
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
                      onClick={() => deleteProduct(product._id)}
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

      {/* NEW: Quantity Edit Modal */}
      {showQuantityModal && selectedProduct && selectedProduct.variants && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-11/12 md:w-2/3 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Quantities - {selectedProduct.name}</h2>
              <button
                onClick={() => {
                  setShowQuantityModal(false);
                  setSelectedProduct(null);
                  setVariantQuantities({});
                }}
                className="text-red-600 font-bold text-lg hover:text-red-800"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {selectedProduct.variants.map((variant, index) => (
                <div key={index} className="border rounded p-4 bg-gray-50">
                  <div className="mb-2">
                    <h3 className="font-semibold text-sm">
                      Variant {index + 1}
                      {variant.specs && Object.keys(variant.specs).length > 0 && (
                        <span className="ml-2 text-xs text-gray-600">
                          ({Object.entries(variant.specs).map(([key, value]) => `${key}: ${value}`).join(', ')})
                        </span>
                      )}
                    </h3>
                    {variant.price !== undefined && (
                      <p className="text-xs text-gray-500">Price: ${variant.price}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium">Quantity:</label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={variantQuantities[index] !== undefined ? variantQuantities[index] : (variant.stock || 0)}
                      onChange={(e) => updateVariantQuantity(index, e.target.value)}
                      className="w-24 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <span className="text-xs text-gray-500">
                      {variant.enabled ? '' : '(Disabled)'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setShowQuantityModal(false);
                  setSelectedProduct(null);
                  setVariantQuantities({});
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
                {savingQuantities ? "Saving..." : "Save Quantities"}
              </button>
            </div>
          </div>
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
      alert(res.data.message);
    } catch (error) {
      console.error("Error toggling featured:", error);
      alert("Error updating featured status");
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
                  ${(() => {
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