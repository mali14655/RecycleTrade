import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb"; // Add this import

export default function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [outlets, setOutlets] = useState([]);
  const [selectedOutlet, setSelectedOutlet] = useState("");
  
  // Form state
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    gender: "",
    
    // Address Information
    address: "",
    country: "",
    postalCode: "",
    
    // Contact Information
    email: "",
    phone: "",
    
    // Delivery Method
    deliveryMethod: "delivery",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchOutlets();
    // Pre-fill user data if logged in
    if (user?.user) {
      setFormData(prev => ({
        ...prev,
        email: user.user.email || "",
      }));
    }
  }, [user]);

  const fetchOutlets = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/outlets`);
      setOutlets(res.data);
    } catch (error) {
      console.error("Error fetching outlets:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Personal Information
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.gender) newErrors.gender = "Please select gender";
    
    // Contact Information
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    
    // Address validation for delivery
    if (formData.deliveryMethod === "delivery") {
      if (!formData.address.trim()) newErrors.address = "Address is required for delivery";
      if (!formData.country.trim()) newErrors.country = "Country is required";
      if (!formData.postalCode.trim()) newErrors.postalCode = "Postal code is required";
    }
    
    // Outlet validation for pickup
    if (formData.deliveryMethod === "pickup" && !selectedOutlet) {
      newErrors.outlet = "Please select an outlet for pickup";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStripeCheckout = async () => {
    if (!validateForm()) {
      alert("Please fill all required fields correctly");
      return;
    }

    try {
      setLoading(true);
      
      const payloadItems = cart.items.map((item) => ({
        productId: item.productId?._id || item._id,
        name: item.productId?.name || item.name,
        price: item.productId?.price || item.price,
        image: item.productId?.images?.[0] || item.image,
        quantity: item.quantity || 1,
        variantId: item.variantId || null,
        sellerId: item.productId?.sellerId?._id || item.sellerId,
      }));

      const orderData = {
        items: payloadItems,
        guestInfo: user ? null : formData,
        deliveryMethod: formData.deliveryMethod,
        outletId: formData.deliveryMethod === "pickup" ? selectedOutlet : null
      };

      const headers = user
        ? { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
        : {};

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/orders/stripe`,
        orderData,
        headers
      );

      window.location.href = res.data.url;
    } catch (error) {
      console.error("Stripe checkout failed:", error);
      alert(error.response?.data?.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePickupOrder = async () => {
    if (!validateForm()) {
      alert("Please fill all required fields correctly");
      return;
    }

    try {
      setLoading(true);
      
      const payloadItems = cart.items.map((item) => ({
        productId: item.productId?._id || item._id,
        name: item.productId?.name || item.name,
        price: item.productId?.price || item.price,
        quantity: item.quantity || 1,
        variantId: item.variantId || null,
        sellerId: item.productId?.sellerId?._id || item.sellerId,
      }));

      const total = cart.items.reduce((sum, item) => sum + (item.productId?.price || item.price) * item.quantity, 0);

      const orderData = {
        items: payloadItems,
        total: total,
        guestInfo: user ? null : formData,
        outletId: selectedOutlet
      };

      const headers = user
        ? { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
        : {};

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/orders/pickup`,
        orderData,
        headers
      );

      clearCart();
      alert(res.data.message);
      navigate("/orders");
    } catch (error) {
      console.error("Pickup order failed:", error);
      alert(error.response?.data?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  if (!cart?.items?.length) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Breadcrumb />
        <div className="max-w-4xl mx-auto text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some products to proceed to checkout</p>
          <button
            onClick={() => navigate("/products")}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const total = cart.items.reduce((sum, item) => sum + (item.productId?.price || item.price) * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumb />
      
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-8">
            {/* Personal Information */}
            <section className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Gender *</label>
                <div className="flex space-x-4">
                  {["male", "female", "other"].map(gender => (
                    <label key={gender} className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value={gender}
                        checked={formData.gender === gender}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <span className="capitalize">{gender}</span>
                    </label>
                  ))}
                </div>
                {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
              </div>
            </section>

            {/* Contact Information */}
            <section className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
              </div>
            </section>

            {/* Delivery Method */}
            <section className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Delivery Method</h2>
              <div className="space-y-4">
                <label className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="delivery"
                    checked={formData.deliveryMethod === "delivery"}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <div>
                    <span className="font-medium">Home Delivery</span>
                    <p className="text-sm text-gray-600">Get your order delivered to your doorstep (Online payment required)</p>
                  </div>
                </label>
                
                <label className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="pickup"
                    checked={formData.deliveryMethod === "pickup"}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <div>
                    <span className="font-medium">Pickup from Outlet</span>
                    <p className="text-sm text-gray-600">Collect your order from a nearby outlet (No payment required)</p>
                  </div>
                </label>
              </div>

              {/* Address Fields for Delivery */}
              {formData.deliveryMethod === "delivery" && (
                <div className="mt-6">
                  <label className="block text-sm font-medium mb-2">Delivery Address *</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className={`w-full p-3 border rounded-lg ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter your complete delivery address"
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Country *</label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className={`w-full p-3 border rounded-lg ${errors.country ? 'border-red-500' : 'border-gray-300'}`}
                        required
                      />
                      {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Postal Code *</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className={`w-full p-3 border rounded-lg ${errors.postalCode ? 'border-red-500' : 'border-gray-300'}`}
                        required
                      />
                      {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Outlet Selection for Pickup */}
              {formData.deliveryMethod === "pickup" && (
                <div className="mt-6">
                  <label className="block text-sm font-medium mb-2">Select Outlet *</label>
                  <select
                    value={selectedOutlet}
                    onChange={(e) => setSelectedOutlet(e.target.value)}
                    className={`w-full p-3 border rounded-lg ${errors.outlet ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Choose an outlet</option>
                    {outlets.map(outlet => (
                      <option key={outlet._id} value={outlet._id}>
                        {outlet.name} - {outlet.location}
                      </option>
                    ))}
                  </select>
                  {errors.outlet && <p className="text-red-500 text-sm mt-1">{errors.outlet}</p>}
                  
                  {/* Show selected outlet details */}
                  {selectedOutlet && (
                    <div className="mt-3 p-4 bg-gray-50 rounded-lg border">
                      <h4 className="font-semibold text-lg mb-2">Selected Outlet:</h4>
                      {outlets.find(o => o._id === selectedOutlet) && (
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><strong>Name:</strong> {outlets.find(o => o._id === selectedOutlet).name}</p>
                          <p><strong>Location:</strong> {outlets.find(o => o._id === selectedOutlet).location}</p>
                          <p><strong>Address:</strong> {outlets.find(o => o._id === selectedOutlet).address}</p>
                          <p><strong>Phone:</strong> {outlets.find(o => o._id === selectedOutlet).phone || 'Not provided'}</p>
                          <p><strong>Email:</strong> {outlets.find(o => o._id === selectedOutlet).email || 'Not provided'}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cart.items.map((item, index) => {
                  const product = item.productId || item;
                  return (
                    <div key={index} className="flex justify-between items-center border-b pb-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.images?.[0] || "https://via.placeholder.com/60"}
                          alt={product.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          {item.variantSpecs && (
                            <p className="text-xs text-gray-400">
                              {Object.entries(item.variantSpecs).map(([key, value]) => (
                                <span key={key} className="mr-2">{key}: {value}</span>
                              ))}
                            </p>
                          )}
                        </div>
                      </div>
                      <p className="font-semibold">
                        ${((product.price || product.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{formData.deliveryMethod === "delivery" ? "Free" : "Pickup"}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Buttons - Show different options based on delivery method */}
              <div className="mt-6 space-y-3">
                {formData.deliveryMethod === "delivery" ? (
                  // Home Delivery - Only online payment
                  <button
                    onClick={handleStripeCheckout}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Processing..." : "Pay Online"}
                  </button>
                ) : (
                  // Pickup from Outlet - Only show order button (no payment)
                  <button
                    onClick={handlePickupOrder}
                    disabled={loading || !selectedOutlet}
                    className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Placing Order..." : "Place Pickup Order"}
                  </button>
                )}
              </div>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  {formData.deliveryMethod === "delivery" 
                    ? "Your order will be delivered to your address. Online payment required." 
                    : "You will collect your order from the selected outlet. No payment required."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}