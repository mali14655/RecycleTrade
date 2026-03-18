import React from "react";
import { ArrowRight, ShieldCheck, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
// NEW: Payment method icons
import visaLogo from "../assets/cards/visa_white.svg";
import mastercardLogo from "../assets/cards/mastercard.svg";
import applePayLogo from "../assets/cards/pay_apple_pay.svg";
import googlePayLogo from "../assets/cards/pay_google_pay.svg";
import klarnaLogo from "../assets/cards/klarna.svg";
import paypalLogo from "../assets/cards/pay_paypal_logo.svg";

const CartSummary = ({ total, onCheckout }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const subtotal = total || 0;

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout();
    } else {
      navigate("/checkout");
    }
  };

  // NEW: Calculate Klarna installment (Pay in 3)
  const klarnaInstallment = subtotal > 0 ? (subtotal / 3).toFixed(2) : "0.00";

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
      <h2 className="text-xl font-bold text-gray-900 mb-6">{t("cartSummary.orderSummary")}</h2>
      <div className="space-y-4 mb-6">
        {/* Sub-total */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">{t("cart.subtotal")}:</span>
          <span className="text-gray-900 font-semibold">€{subtotal.toFixed(2)}</span>
        </div>
        {/* Shipping */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">{t("cart.shipping")}:</span>
          <span className="text-gray-900 font-semibold">{t("cart.free")}</span>
        </div>
        {/* Discount */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">{t("cartSummary.discount")}:</span>
          <span className="text-gray-900 font-semibold">-</span>
        </div>
        {/* Tax */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <span className="text-gray-600">{t("cartSummary.tax")}:</span>
          <span className="text-gray-900 font-semibold">-</span>
        </div>
        {/* Total */}
        <div className="flex justify-between items-center pt-2">
          <span className="text-lg font-semibold text-gray-900">{t("cart.total")}:</span>
          <span className="text-xl font-bold text-gray-900">€{subtotal.toFixed(2)} EUR</span>
        </div>
      </div>
      {/* Checkout Button */}
      <button 
        onClick={handleCheckout}
        className="w-full bg-black text-white py-3.5 rounded-lg font-semibold hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
      >
        <span>{t("cart.proceedToCheckout")}</span>
        <ArrowRight size={20} />
      </button>

      {/* NEW: Payment Methods & Installment Info Section */}
      <div className="mt-6 pt-5 border-t border-gray-200">
        {/* Payment method icons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          <div className="flex items-center justify-center h-8 px-2.5 bg-white rounded border border-gray-200">
            <img src={visaLogo} alt="Visa" className="h-5 object-contain" />
          </div>
          <div className="flex items-center justify-center h-8 px-2.5 bg-white rounded border border-gray-200">
            <img src={mastercardLogo} alt="Mastercard" className="h-5 object-contain" />
          </div>
          <div className="flex items-center justify-center h-8 px-2.5 bg-white rounded border border-gray-200">
            <img src={paypalLogo} alt="PayPal" className="h-5 object-contain" />
          </div>
          <div className="flex items-center justify-center h-8 px-2.5 bg-white rounded border border-gray-200">
            <img src={applePayLogo} alt="Apple Pay" className="h-5 object-contain" />
          </div>
          <div className="flex items-center justify-center h-8 px-2.5 bg-white rounded border border-gray-200">
            <img src={googlePayLogo} alt="Google Pay" className="h-5 object-contain" />
          </div>
          <div className="flex items-center justify-center h-8 px-2.5 bg-white rounded border border-gray-200">
            <img src={klarnaLogo} alt="Klarna" className="h-5 object-contain" />
          </div>
        </div>

        {/* NEW: Installment options info */}
        <div className="space-y-2.5">
          {/* PayPal Pay Later */}
          <div className="flex items-start gap-2.5 p-2.5 bg-amber-50 rounded-lg border border-amber-100">
            <img src={paypalLogo} alt="PayPal" className="h-5 object-contain mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-800">{t("cartSummary.payNowPaypal")}</p>
              <p className="text-[11px] text-gray-500">{t("cartSummary.paypalInstallments")}</p>
            </div>
          </div>
          {/* Klarna */}
          <div className="flex items-start gap-2.5 p-2.5 bg-pink-50 rounded-lg border border-pink-100">
            <img src={klarnaLogo} alt="Klarna" className="h-5 object-contain mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-800">{t("cartSummary.klarnaTitle")}</p>
              <p className="text-[11px] text-gray-500">
                3 × €{klarnaInstallment} {t("product.financeHint")}
              </p>
            </div>
          </div>
        </div>

        {/* Secure payment badge */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-400">
          <Lock size={12} />
          <span>{t("cartSummary.securePayment")}</span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;

