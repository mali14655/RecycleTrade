import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import toast from "react-hot-toast";
import { Truck, Lock } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import visaLogo from "../assets/cards/visa_white.svg";
import mastercardLogo from "../assets/cards/mastercard.svg";
import applePayLogo from "../assets/cards/pay_apple_pay.svg";
import googlePayLogo from "../assets/cards/pay_google_pay.svg";
import klarnaLogo from "../assets/cards/klarna.svg";
// NEW: PayPal payment icon
import paypalLogo from "../assets/cards/pay_paypal_logo.svg";

// Country list
const COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "Italy", "Spain",
  "Netherlands", "Belgium", "Switzerland", "Austria", "Sweden", "Norway", "Denmark", "Finland",
  "Poland", "Portugal", "Greece", "Ireland", "Czech Republic", "Hungary", "Romania", "Bulgaria",
  "Croatia", "Slovakia", "Slovenia", "Lithuania", "Latvia", "Estonia", "Luxembourg", "Malta",
  "Cyprus", "Japan", "South Korea", "China", "India", "Singapore", "Malaysia", "Thailand",
  "Indonesia", "Philippines", "Vietnam", "Taiwan", "Hong Kong", "New Zealand", "South Africa",
  "Egypt", "Nigeria", "Kenya", "Morocco", "Tunisia", "Ghana", "Brazil", "Mexico", "Argentina",
  "Chile", "Colombia", "Peru", "Venezuela", "Ecuador", "Uruguay", "Paraguay", "Bolivia",
  "Saudi Arabia", "United Arab Emirates", "Israel", "Turkey", "Russia", "Ukraine", "Belarus",
  "Kazakhstan", "Uzbekistan", "Pakistan", "Bangladesh", "Sri Lanka", "Nepal", "Myanmar",
  "Cambodia", "Laos", "Mongolia", "Afghanistan", "Iraq", "Iran", "Jordan", "Lebanon",
  "Qatar", "Kuwait", "Bahrain", "Oman", "Yemen", "Syria", "Libya", "Algeria", "Sudan",
  "Ethiopia", "Tanzania", "Uganda", "Rwanda", "Zimbabwe", "Botswana", "Namibia", "Mozambique",
  "Angola", "Zambia", "Malawi", "Madagascar", "Mauritius", "Seychelles", "Iceland",
  "Greenland", "Fiji", "Papua New Guinea", "Samoa", "Tonga", "Vanuatu", "Solomon Islands"
].sort();

// City list per country (extendable). For countries without a predefined list, we'll fall back to a free-text input.
const CITY_OPTIONS = {
  Germany: [
    "Berlin", "Hamburg", "Munich", "Cologne", "Frankfurt", "Stuttgart",
    "Düsseldorf", "Dortmund", "Essen", "Leipzig", "Bremen", "Dresden",
    "Hanover", "Nuremberg", "Duisburg", "Bochum", "Wuppertal", "Bielefeld",
    "Bonn", "Mannheim",
    "Other" // Allow custom city entry
  ]
};

export default function Checkout() {
  const { t, language } = useLanguage();
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
    city: "",
    cityOther: "",
    country: "Germany",
    postalCode: "",
    
    // Contact Information
    email: "",
    phone: "",
    
    // Delivery Method
    deliveryMethod: "delivery",
  });

  const [errors, setErrors] = useState({});
  const [promoCode, setPromoCode] = useState("");
  const [promoState, setPromoState] = useState({
    applied: false,
    loading: false,
    error: "",
    info: null, // { code, discountPercent, discountAmount }
  });

  // NEW: Delivery date window helper (reuse same logic as product detail)
  const getDeliveryWindow = () => {
    const today = new Date();
    const start = new Date(today);
    const end = new Date(today);
    start.setDate(start.getDate() + 1);
    end.setDate(end.getDate() + 2);

    const formatter = new Intl.DateTimeFormat(language === "de" ? "de-DE" : "en-GB", {
      day: '2-digit',
      month: 'short'
    });

    const startStr = formatter.format(start);
    const endStr = formatter.format(end);

    return `${startStr} - ${endStr}`;
  };

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

  // Helper: calculate cart total (without discounts)
  const calculateCartTotal = () => {
    if (!cart.items || cart.items.length === 0) return 0;
    return cart.items.reduce((sum, item) => {
      let itemPrice = item.price || item.productId?.price || 0;
      if (item.variantId && item.productId?.variants) {
        const variant = item.productId.variants.find(
          v => v._id?.toString() === item.variantId?.toString()
        );
        if (variant) {
          itemPrice = variant.price;
        }
      }
      return sum + itemPrice * (item.quantity || 1);
    }, 0);
  };

  const baseTotal = calculateCartTotal();
  const discountAmount = promoState.applied && promoState.info ? promoState.info.discountAmount : 0;
  const finalTotal = Math.max(baseTotal - discountAmount, 0);

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
    if (!formData.firstName.trim()) newErrors.firstName = t("checkout.firstNameRequired");
    if (!formData.lastName.trim()) newErrors.lastName = t("checkout.lastNameRequired");
    if (!formData.gender) newErrors.gender = t("checkout.genderRequired");
    
    // Contact Information
    if (!formData.email.trim()) newErrors.email = t("checkout.emailRequired");
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = t("checkout.emailInvalid");
    if (!formData.phone.trim()) newErrors.phone = t("checkout.phoneRequired");
    
    // Address validation for delivery
    if (formData.deliveryMethod === "delivery") {
      if (!formData.address.trim()) newErrors.address = t("checkout.addressRequired");
      if (!formData.city.trim()) {
        newErrors.city = t("checkout.cityRequired");
      } else if (
        formData.city === "Other" &&
        !formData.cityOther.trim()
      ) {
        // When user selects "Other", custom city name becomes mandatory
        newErrors.cityOther = t("checkout.cityOtherRequired");
      }
      if (!formData.country.trim()) newErrors.country = t("checkout.countryRequired");
      if (!formData.postalCode.trim()) newErrors.postalCode = t("checkout.postalCodeRequired");
    }
    
    // Outlet validation for pickup
    if (formData.deliveryMethod === "pickup" && !selectedOutlet) {
      newErrors.outlet = t("checkout.outletRequired");
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStripeCheckout = async () => {
    if (!validateForm()) {
      toast.error(
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">{t("checkout.validationErrorTitle")}</p>
            <p className="text-sm text-gray-600">{t("checkout.validationErrorSubtitle")}</p>
          </div>
        </div>,
        { icon: null }
      );
      return;
    }

    try {
      setLoading(true);
      
      const payloadItems = cart.items.map((item) => {
        // Get variant price if variant exists
        let itemPrice = item.price || item.productId?.price || 0;
        let variantImage = item.productId?.images?.[0] || item.image;
        let variantSpecs = null;
        if (item.variantId && item.productId?.variants) {
          const variant = item.productId.variants.find(
            v => v._id?.toString() === item.variantId?.toString()
          );
          if (variant) {
            itemPrice = variant.price;
            if (variant.images && variant.images.length > 0) {
              variantImage = variant.images[0];
            }
            if (variant.specs) {
              variantSpecs = variant.specs instanceof Map
                ? Object.fromEntries(variant.specs)
                : variant.specs;
            }
          }
        }

        return {
          productId: item.productId?._id || item._id,
          name: item.productId?.name || item.name,
          price: itemPrice,
          image: variantImage,
          quantity: item.quantity || 1,
          variantId: item.variantId || null,
          variantSpecs: variantSpecs || undefined,
          sellerId: item.productId?.sellerId?._id || item.sellerId,
          category: item.productId?.category || item.category,
        };
      });

      const guestInfoToSend = {
        ...formData,
        city: formData.cityOther && formData.city === "Other" ? formData.cityOther : formData.city,
      };

      const orderData = {
        items: payloadItems,
        guestInfo: guestInfoToSend, // Always use form data for shipping/delivery details
        deliveryMethod: formData.deliveryMethod,
        outletId: formData.deliveryMethod === "pickup" ? selectedOutlet : null,
        promo: promoState.applied && promoState.info ? {
          code: promoState.info.code,
          discountPercent: promoState.info.discountPercent,
          discountAmount,
        } : null,
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
      toast.error(
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">{t("checkout.checkoutFailedTitle")}</p>
            <p className="text-sm text-gray-600">{error.response?.data?.message || t("checkout.checkoutFailed")}</p>
          </div>
        </div>,
        { icon: null }
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePickupOrder = async () => {
    if (!validateForm()) {
      toast.error(
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Validation Error</p>
            <p className="text-sm text-gray-600">Please fill all required fields correctly</p>
          </div>
        </div>,
        { icon: null }
      );
      return;
    }

    try {
      setLoading(true);
      
      const payloadItems = cart.items.map((item) => {
        // Get variant price if variant exists
        let itemPrice = item.price || item.productId?.price || 0;
        let variantImage = item.productId?.images?.[0] || item.image;
        let variantSpecs = null;
        if (item.variantId && item.productId?.variants) {
          const variant = item.productId.variants.find(
            v => v._id?.toString() === item.variantId?.toString()
          );
          if (variant) {
            itemPrice = variant.price;
            if (variant.images && variant.images.length > 0) {
              variantImage = variant.images[0];
            }
            if (variant.specs) {
              variantSpecs = variant.specs instanceof Map
                ? Object.fromEntries(variant.specs)
                : variant.specs;
            }
          }
        }

        return {
          productId: item.productId?._id || item._id,
          name: item.productId?.name || item.name,
          price: itemPrice,
          image: variantImage,
          quantity: item.quantity || 1,
          variantId: item.variantId || null,
          variantSpecs: variantSpecs || undefined,
          sellerId: item.productId?.sellerId?._id || item.sellerId,
          category: item.productId?.category || item.category,
        };
      });

      const total = cart.items.reduce((sum, item) => {
        // Get variant price if variant exists
        let itemPrice = item.price || item.productId?.price || 0;
        if (item.variantId && item.productId?.variants) {
          const variant = item.productId.variants.find(
            v => v._id?.toString() === item.variantId?.toString()
          );
          if (variant) {
            itemPrice = variant.price;
          }
        }
        return sum + itemPrice * item.quantity;
      }, 0);

      const orderData = {
        items: payloadItems,
        total: total,
        guestInfo: {
          ...formData,
          city: formData.cityOther && formData.city === "Other" ? formData.cityOther : formData.city,
        }, // Always use form data for shipping/delivery details
        outletId: selectedOutlet,
        promo: promoState.applied && promoState.info ? {
          code: promoState.info.code,
          discountPercent: promoState.info.discountPercent,
          discountAmount,
        } : null,
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
      navigate("/success");
    } catch (error) {
      console.error("Pickup order failed:", error);
      toast.error(
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">{t("checkout.orderFailedTitle")}</p>
            <p className="text-sm text-gray-600">{error.response?.data?.message || t("checkout.orderFailed")}</p>
          </div>
        </div>
      );
    } finally {
      setLoading(false);
    }
  };

  if (!cart?.items?.length) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Breadcrumb />
        <div className="max-w-[90%] mx-auto px-4 py-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m0 0L17 21" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("checkout.emptyCartTitle")}</h2>
              <p className="text-gray-600 mb-8">{t("checkout.emptyCartSubtitle")}</p>
              <button
                onClick={() => navigate("/products")}
                className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors"
              >
                {t("checkout.continueShopping")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const total = baseTotal;

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumb />
      
      <div className="max-w-[90%] mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{t("checkout.title")}</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-8">
            {/* Personal Information */}
            <section className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t("checkout.personalInfo")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t("checkout.firstName")} *</label>
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
                  <label className="block text-sm font-medium mb-2">{t("checkout.lastName")} *</label>
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
                <label className="block text-sm font-medium mb-2">{t("checkout.gender")} *</label>
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
                      <span className="capitalize">
                        {gender === "male"
                          ? t("checkout.genderMale")
                          : gender === "female"
                          ? t("checkout.genderFemale")
                          : t("checkout.genderOther")}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
              </div>
            </section>

            {/* Contact Information */}
            <section className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t("checkout.contactInfo")}</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t("checkout.emailAddress")} *</label>
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
                  <label className="block text-sm font-medium mb-2">{t("checkout.phoneNumber")} *</label>
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
            <section className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t("checkout.deliveryMethod")}</h2>
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
                    <span className="font-medium">{t("checkout.homeDelivery")}</span>
                    <p className="text-sm text-gray-600">{t("checkout.homeDeliveryDesc")}</p>
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
                    <span className="font-medium">{t("checkout.pickupOutlet")}</span>
                    <p className="text-sm text-gray-600">{t("checkout.pickupDesc")}</p>
                  </div>
                </label>
              </div>

              {/* Delivery date info for home delivery */}
              {formData.deliveryMethod === "delivery" && (
                <div className="mt-4">
                  <div className="w-full rounded-xl bg-blue-50 px-4 py-3 flex items-center gap-2 text-sm sm:text-base text-gray-900">
                    <Truck className="w-5 h-5 text-gray-700 shrink-0" />
                    <span className="font-medium">
                      {t("checkout.freeDeliveryWindow", { window: getDeliveryWindow() })}
                    </span>
                  </div>
                </div>
              )}

              {/* Address Fields for Delivery */}
              {formData.deliveryMethod === "delivery" && (
                <div className="mt-6">
                  <label className="block text-sm font-medium mb-2">{t("checkout.deliveryAddress")} *</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className={`w-full p-3 border rounded-lg ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder={t("checkout.deliveryAddressPlaceholder")}
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    {/* Country */}
                    <div>
                      <label className="block text-sm font-medium mb-2">{t("checkout.country")} *</label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className={`w-full p-3 border rounded-lg ${errors.country ? 'border-red-500' : 'border-gray-300'} bg-white`}
                        required
                      >
                        {/* Default Germany */}
                        {COUNTRIES.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                      {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-sm font-medium mb-2">{t("checkout.city")} *</label>
                      {CITY_OPTIONS[formData.country] ? (
                        <>
                          <select
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className={`w-full p-3 border rounded-lg ${errors.city ? 'border-red-500' : 'border-gray-300'} bg-white`}
                            required
                          >
                            <option value="">{t("checkout.selectCity")}</option>
                            {CITY_OPTIONS[formData.country].map((city) => (
                              <option key={city} value={city}>
                                {city}
                              </option>
                            ))}
                          </select>
                          {/* If "Other" selected, show custom city input */}
                          {formData.city === "Other" && (
                            <input
                              type="text"
                              name="cityOther"
                              value={formData.cityOther}
                              onChange={handleInputChange}
                              className={`mt-2 w-full p-3 border rounded-lg ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                              placeholder={t("checkout.enterCity")}
                              required
                            />
                          )}
                        </>
                      ) : (
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`w-full p-3 border rounded-lg ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder={t("checkout.enterCity")}
                          required
                        />
                      )}
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>

                    {/* Postal Code */}
                    <div>
                      <label className="block text-sm font-medium mb-2">{t("checkout.postalCode")} *</label>
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
                  <label className="block text-sm font-medium mb-2">{t("checkout.selectOutlet")} *</label>
                  <select
                    value={selectedOutlet}
                    onChange={(e) => setSelectedOutlet(e.target.value)}
                    className={`w-full p-3 border rounded-lg ${errors.outlet ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">{t("checkout.selectOutlet")}</option>
                    {outlets.map(outlet => (
                      <option key={outlet._id} value={outlet._id}>
                        {outlet.name} - {outlet.location}
                      </option>
                    ))}
                  </select>
                  {errors.outlet && <p className="text-red-500 text-sm mt-1">{errors.outlet}</p>}
                  
                  {/* Show selected outlet details */}
                  {selectedOutlet && (
                    <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-lg text-gray-900 mb-2">{t("checkout.selectedOutlet")}</h4>
                      {outlets.find(o => o._id === selectedOutlet) && (
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><strong className="text-gray-900">{t("checkout.outletName")}:</strong> {outlets.find(o => o._id === selectedOutlet).name}</p>
                          <p><strong className="text-gray-900">{t("checkout.outletLocation")}:</strong> {outlets.find(o => o._id === selectedOutlet).location}</p>
                          <p><strong className="text-gray-900">{t("checkout.outletAddress")}:</strong> {outlets.find(o => o._id === selectedOutlet).address}</p>
                          <p><strong className="text-gray-900">{t("checkout.phone")}:</strong> {outlets.find(o => o._id === selectedOutlet).phone || t("checkout.notProvided")}</p>
                          <p><strong className="text-gray-900">{t("checkout.email")}:</strong> {outlets.find(o => o._id === selectedOutlet).email || t("checkout.notProvided")}</p>
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
            <div className="bg-white p-6 rounded-lg border border-gray-200 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t("checkout.orderSummary")}</h2>
              
              <div className="space-y-4 mb-6">
                {cart.items.map((item, index) => {
                  const product = item.productId || item;
                  
                  // Get variant image and specs
                  const getVariantImage = () => {
                    if (item.variantId && product.variants) {
                      const variant = product.variants.find(
                        v => v._id?.toString() === item.variantId?.toString()
                      );
                      if (variant && variant.images && variant.images.length > 0) {
                        return variant.images[0];
                      }
                    }
                    return product.images?.[0] || "https://via.placeholder.com/60";
                  };

                  const getVariantSpecs = () => {
                    let variantSpecsObj = null;
                    
                    if (item.variantSpecs) {
                      variantSpecsObj = item.variantSpecs instanceof Map 
                        ? Object.fromEntries(item.variantSpecs) 
                        : item.variantSpecs;
                    } else if (item.variantId && product.variants) {
                      const variant = product.variants.find(
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
                    if (variantSpecsObj && product.specs) {
                      const productSpecsObj = product.specs instanceof Map 
                        ? Object.fromEntries(product.specs) 
                        : product.specs;
                      
                      const productSpecKeys = Object.keys(productSpecsObj);

                      // Helper: detect battery spec name
                      const isBatteryKey = (key) => {
                        const normalized = String(key || "").toLowerCase();
                        return normalized === "battery condition" || normalized === "battery";
                      };
                      
                      // Filter variant specs to only include those NOT in product.specs (i.e., multiple specs)
                      // Also hide any battery-related specs from checkout display (for all products)
                      const filteredSpecs = Object.entries(variantSpecsObj).filter(
                        ([key]) => !productSpecKeys.includes(key) && !isBatteryKey(key)
                      );
                      
                      return filteredSpecs.length > 0 ? Object.fromEntries(filteredSpecs) : null;
                    }
                    
                    return variantSpecsObj;
                  };

                  // Get variant price if variant exists
                  let itemPrice = item.price || product.price || 0;
                  if (item.variantId && product.variants) {
                    const variant = product.variants.find(
                      v => v._id?.toString() === item.variantId?.toString()
                    );
                    if (variant) {
                      itemPrice = variant.price;
                    }
                  }

                  const variantImage = getVariantImage();
                  const variantSpecs = getVariantSpecs();

                  return (
                    <div key={index} className="flex justify-between items-center border-b pb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex items-center justify-center shrink-0">
                          <img
                            src={variantImage}
                            alt={product.name}
                            className="w-full h-full object-contain p-0.5"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{product.name}</p>
                          {variantSpecs && Object.keys(variantSpecs).length > 0 && (
                            <div className="mt-0.5 flex flex-wrap gap-x-1.5 gap-y-1">
                              {Object.entries(variantSpecs).map(([key, value]) => (
                                <span key={key} className="text-xs text-gray-500">
                                  <span className="font-medium capitalize">{key}:</span> {value}
                                </span>
                              ))}
                            </div>
                          )}
                          <p className="text-sm text-gray-500 mt-1">{t("trackOrder.qty")}: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-semibold">
                        €{(itemPrice * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between">
                  <span>{t("checkout.subtotal")}</span>
                  <span>€{baseTotal.toFixed(2)}</span>
                </div>

                {/* Promo code input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => {
                      setPromoCode(e.target.value);
                      if (promoState.error) {
                        setPromoState((prev) => ({ ...prev, error: "" }));
                      }
                    }}
                    placeholder={t("checkout.enterPromoCode")}
                    className="flex-1 px-3 py-2 border rounded-lg text-sm"
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      if (!promoCode.trim()) {
                        setPromoState((prev) => ({ ...prev, error: t("checkout.promoRequired") }));
                        return;
                      }
                      try {
                        setPromoState({ applied: false, loading: true, error: "", info: null });

                        const itemsForValidation = cart.items.map((item) => {
                          let itemPrice = item.price || item.productId?.price || 0;
                          if (item.variantId && item.productId?.variants) {
                            const variant = item.productId.variants.find(
                              (v) => v._id?.toString() === item.variantId?.toString()
                            );
                            if (variant) {
                              itemPrice = variant.price;
                            }
                          }
                          return {
                            productId: item.productId?._id || item._id,
                            category: item.productId?.category || item.category,
                            price: itemPrice,
                            quantity: item.quantity || 1,
                          };
                        });

                        const res = await axios.post(
                          `${import.meta.env.VITE_API_URL}/promocodes/validate`,
                          {
                            code: promoCode,
                            items: itemsForValidation,
                          }
                        );

                        setPromoState({
                          applied: true,
                          loading: false,
                          error: "",
                          info: {
                            code: res.data.promo.code,
                            discountPercent: res.data.promo.discountPercent,
                            discountAmount: res.data.discountAmount,
                          },
                        });

                        toast.success(t("checkout.promoAppliedToast", { code: res.data.promo.code }));
                      } catch (error) {
                        console.error("Promo validation failed:", error);
                        setPromoState({
                          applied: false,
                          loading: false,
                          error:
                            error.response?.data?.message ||
                            t("checkout.promoInvalid"),
                          info: null,
                        });
                      }
                    }}
                    className="px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={promoState.loading}
                  >
                    {promoState.loading ? t("checkout.checking") : promoState.applied ? t("checkout.applied") : t("checkout.apply")}
                  </button>
                </div>
                {promoState.error && (
                  <p className="text-xs text-red-500">{promoState.error}</p>
                )}
                {promoState.applied && promoState.info && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>
                      Promo ({promoState.info.code}) -{promoState.info.discountPercent}%{" "}
                    </span>
                    <span>-€{discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>{t("checkout.shipping")}</span>
                  <span>{formData.deliveryMethod === "delivery" ? t("checkout.free") : t("checkout.pickup")}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>{t("checkout.total")}</span>
                  <span>€{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Buttons - Show different options based on delivery method */}
              <div className="mt-6 space-y-3">
                {formData.deliveryMethod === "delivery" ? (
                  // Home Delivery - Only online payment
                  <button
                    onClick={handleStripeCheckout}
                    disabled={loading}
                    className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? `${t("admin.processing")}...` : t("checkout.payNow")}
                  </button>
                ) : (
                  // Pickup from Outlet - Only show order button (no payment)
                  <button
                    onClick={handlePickupOrder}
                    disabled={loading || !selectedOutlet}
                    className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? `${t("admin.processing")}...` : t("checkout.payAtPickup")}
                  </button>
                )}
              </div>

              {/* NEW: Enhanced Payment Methods Display - Only show for delivery */}
              {formData.deliveryMethod === "delivery" && (
                <div className="mt-5 pt-5 border-t border-gray-200">
                  <p className="text-sm font-semibold text-gray-700 mb-3">{t("checkout.paymentNote")}</p>
                  
                  {/* Payment option descriptions */}
                  <div className="space-y-2.5 mb-4">
                    {/* Credit/Debit Cards */}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex items-center gap-1.5 shrink-0">
                        <img src={visaLogo} alt="Visa" className="h-5 object-contain" />
                        <img src={mastercardLogo} alt="Mastercard" className="h-5 object-contain" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800">{t("checkout.creditDebit")}</p>
                      </div>
                    </div>

                    {/* PayPal */}
                    <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                      <img src={paypalLogo} alt="PayPal" className="h-5 object-contain shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800">{t("checkout.paypalPayNowInstallments")}</p>
                        <p className="text-xs text-gray-500">{t("checkout.paypalPayLater")}</p>
                      </div>
                    </div>

                    {/* Klarna */}
                    <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg border border-pink-100">
                      <img src={klarnaLogo} alt="Klarna" className="h-5 object-contain shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800">{t("checkout.klarnaPayIn3")}</p>
                        <p className="text-xs text-gray-500">
                          3 × €{(finalTotal / 3).toFixed(2)} {t("product.financeHint")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* All accepted payment icons */}
                  <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
                    <div className="flex items-center justify-center h-7 px-2 bg-white rounded border border-gray-200">
                      <img src={visaLogo} alt="Visa" className="h-4 object-contain" />
                    </div>
                    <div className="flex items-center justify-center h-7 px-2 bg-white rounded border border-gray-200">
                      <img src={mastercardLogo} alt="Mastercard" className="h-4 object-contain" />
                    </div>
                    <div className="flex items-center justify-center h-7 px-2 bg-white rounded border border-gray-200">
                      <img src={paypalLogo} alt="PayPal" className="h-4 object-contain" />
                    </div>
                    <div className="flex items-center justify-center h-7 px-2 bg-white rounded border border-gray-200">
                      <img src={applePayLogo} alt="Apple Pay" className="h-4 object-contain" />
                    </div>
                    <div className="flex items-center justify-center h-7 px-2 bg-white rounded border border-gray-200">
                      <img src={googlePayLogo} alt="Google Pay" className="h-4 object-contain" />
                    </div>
                    <div className="flex items-center justify-center h-7 px-2 bg-white rounded border border-gray-200">
                      <img src={klarnaLogo} alt="Klarna" className="h-4 object-contain" />
                    </div>
                  </div>

                  {/* Secure payment badge */}
                  <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
                    <Lock size={12} />
                    <span>{t("product.securePayment")}</span>
                  </div>
                </div>
              )}

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  {formData.deliveryMethod === "delivery" 
                    ? t("checkout.deliveryPaymentNote") 
                    : t("checkout.pickupPaymentNote")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

