import React, { useState } from "react";
import axios from "axios";
import Breadcrumb from "../components/Breadcrumb";
import { buildApiEndpoint } from "../utils/api";
import { useLanguage } from "../context/LanguageContext";

export default function TrackOrder() {
  const { t } = useLanguage();
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) {
      setError(t("trackOrder.enterOrderOrTracking"));
      return;
    }

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const endpoint = buildApiEndpoint(`orders/track/${orderId}`);
      const res = await axios.get(endpoint);
      setOrder(res.data);
    } catch (err) {
      setError(t("trackOrder.orderNotFoundLong"));
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

  // NEW: show translated labels without changing backend values
  const getOrderStatusLabel = (status) => {
    if (status === "Processing") return t("trackOrder.orderStatus_processing");
    if (status === "Pending") return t("trackOrder.orderStatus_pending");
    return status;
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "Paid": return "bg-green-100 text-green-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // NEW: show translated labels without changing backend values
  const getPaymentStatusLabel = (status) => {
    if (status === "Paid") return t("trackOrder.paymentStatus_paid");
    if (status === "Pending") return t("trackOrder.paymentStatus_pending");
    return status;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <Breadcrumb />
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 mt-4 sm:mt-6 text-center">{t("trackOrder.title")}</h1>
      
      {/* Search Form */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6 sm:mb-8">
        <form onSubmit={handleTrackOrder} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder={t("trackOrder.enterOrderOrTracking")}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 whitespace-nowrap text-sm sm:text-base"
          >
            {loading ? t("trackOrder.tracking") : t("trackOrder.track")}
          </button>
        </form>
        {error && <p className="text-red-500 mt-2 text-sm sm:text-base">{error}</p>}
      </div>

      {/* Order Details */}
      {order && (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0 mb-6">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl font-semibold break-words">Order #{order._id.slice(-8)}</h2>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                {t("trackOrder.placedOn")} {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 sm:flex-nowrap sm:ml-4">
              <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap ${getStatusColor(order.orderStatus)}`}>
                {getOrderStatusLabel(order.orderStatus)}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap ${getPaymentStatusColor(order.paymentStatus)}`}>
                {getPaymentStatusLabel(order.paymentStatus)}
              </span>
            </div>
          </div>

          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
            <div>
              <h3 className="font-semibold mb-2 text-sm sm:text-base">{t("trackOrder.customerInformation")}</h3>
              {(order.guestInfo || order.userId) ? (
                <div className="space-y-1 text-sm">
                  <p className="font-medium">
                    {order.guestInfo?.firstName && order.guestInfo?.lastName
                      ? `${order.guestInfo.firstName} ${order.guestInfo.lastName}`
                      : order.guestInfo?.firstName || order.guestInfo?.lastName
                      ? `${order.guestInfo.firstName || ''}${order.guestInfo.lastName || ''}`.trim()
                      : order.userId?.name || 'N/A'}
                  </p>
                  <p><span className="font-medium">{t("auth.email")}:</span> {order.guestInfo?.email || order.userId?.email || 'N/A'}</p>
                  <p><span className="font-medium">{t("trackOrder.phone")}:</span> {order.guestInfo?.phone || order.userId?.phone || 'N/A'}</p>
                  {order.guestInfo?.gender && (
                    <p className="capitalize"><span className="font-medium">{t("trackOrder.gender")}:</span> {order.guestInfo.gender}</p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">{t("trackOrder.noCustomerInfo")}</p>
              )}
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-sm sm:text-base">
                {order.deliveryMethod === "delivery" ? t("trackOrder.deliveryAddress") : t("trackOrder.pickupLocation")}
              </h3>
              {order.deliveryMethod === "delivery" ? (
                order.guestInfo?.address ? (
                  <div className="space-y-1 text-sm">
                    <p>{order.guestInfo.address}</p>
                    {order.guestInfo.city && (
                      <p><span className="font-medium">{t("trackOrder.city")}:</span> {order.guestInfo.city}</p>
                    )}
                    {order.guestInfo.postalCode && (
                      <p><span className="font-medium">{t("trackOrder.postalCode")}:</span> {order.guestInfo.postalCode}</p>
                    )}
                    {order.guestInfo.country && (
                      <p><span className="font-medium">{t("trackOrder.country")}:</span> {order.guestInfo.country}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">{t("trackOrder.noDeliveryAddress")}</p>
                )
              ) : (
                order.outletId ? (
                  <div className="space-y-1 text-sm">
                    <p><strong>{order.outletId.name}</strong></p>
                    {order.outletId.address && <p>{order.outletId.address}</p>}
                    {order.outletId.location && <p>{order.outletId.location}</p>}
                    {order.outletId.phone && <p><span className="font-medium">{t("trackOrder.phone")}:</span> {order.outletId.phone}</p>}
                  </div>
                ) : (
                  <p className="text-gray-500">{t("trackOrder.noPickupLocation")}</p>
                )
              )}
            </div>
          </div>

          {/* Tracking Information - Only shows if tracking number exists */}
          {order.trackingNumber && (
            <div className="bg-blue-50 p-4 sm:p-6 rounded-lg mb-6">
              <h3 className="font-semibold mb-3 text-sm sm:text-base">{t("trackOrder.dhlTrackingInfo")}</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1"><strong>{t("trackOrder.trackingNumberLabel")}:</strong></p>
                  <p className="text-lg font-semibold text-gray-900">{order.trackingNumber}</p>
                </div>
                
                {/* Direct DHL Tracking Button */}
                <div className="pt-3 border-t border-blue-200">
                  <a
                    href={`https://www.dhl.com/en/express/tracking.html?AWB=${order.trackingNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 sm:px-6 rounded-lg transition-colors mb-4 text-sm sm:text-base"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <span className="text-center">{t("trackOrder.trackOnDhl")}</span>
                  </a>
                </div>

                <div className="pt-3 border-t border-blue-200">
                  <p className="text-sm text-gray-600 mb-3">
                    {t("trackOrder.embeddedTrackingHint")}
                  </p>
                  {/* Embedded DHL Tracking - Users stay on your website */}
                  <div className="w-full border border-gray-300 rounded-lg overflow-hidden bg-white">
                    <iframe
                      src={`https://www.dhl.com/en/express/tracking.html?AWB=${order.trackingNumber}`}
                      title="DHL Package Tracking"
                      className="w-full h-96 md:h-[500px] border-0"
                      allow="fullscreen"
                      loading="lazy"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    {t("trackOrder.trackingWidgetFallback")}{" "}
                    <a
                      href={`https://www.dhl.com/en/express/tracking.html?AWB=${order.trackingNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {t("trackOrder.openInNewTab")}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Order Items */}
          <div>
            <h3 className="font-semibold mb-4 text-sm sm:text-base">{t("trackOrder.orderItems")}</h3>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border-b pb-4">
                  <div className="flex items-start sm:items-center space-x-3 flex-1 min-w-0">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-100 rounded overflow-hidden flex items-center justify-center shrink-0">
                      <img
                        src={item.productId?.images?.[0] || "https://via.placeholder.com/60"}
                        alt={item.productId?.name}
                        className="w-full h-full object-contain p-0.5"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm sm:text-base break-words">{item.productId?.name || 'N/A'}</p>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">{t("trackOrder.qty")}: {item.quantity}</p>
                      <p className="text-xs sm:text-sm text-gray-500">{t("trackOrder.seller")}: {item.sellerId?.name || 'N/A'}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-base sm:text-lg shrink-0 sm:ml-4">€{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center text-base sm:text-lg font-bold gap-2">
              <span className="text-sm sm:text-base">{t("trackOrder.totalAmount")}</span>
              <span className="text-base sm:text-lg">€{order.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm text-gray-600 mt-2 gap-2">
              <span>{t("trackOrder.paymentMethod")}</span>
              <span className="capitalize text-right break-words">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm text-gray-600 gap-2">
              <span>{t("trackOrder.deliveryMethod")}</span>
              <span className="capitalize text-right break-words">{order.deliveryMethod}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}