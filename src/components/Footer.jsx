// components/layout/Footer.jsx - UPDATED with new F&S Smartphones design
import React from "react";
import { Link } from "react-router-dom";
import { Facebook } from "lucide-react";
import logo from "../assets/logo.jpeg";
import visaLogo from "../assets/cards/visa_white.svg";
import mastercardLogo from "../assets/cards/mastercard.svg";
import applePayLogo from "../assets/cards/pay_apple_pay.svg";
import googlePayLogo from "../assets/cards/pay_google_pay.svg";
import klarnaLogo from "../assets/cards/klarna.svg";
// NEW: PayPal payment icon
import paypalLogo from "../assets/cards/pay_paypal_logo.svg";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img 
                src={logo} 
                alt="F&S Smartphones" 
                className="w-8 h-8 rounded object-cover"
              />
              <span className="text-xl font-semibold">F&S Smartphones</span>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Your trusted marketplace for refurbished phones and accessories.
              Quality devices at great prices.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/share/1C1KruCLJi/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Visit our Facebook page"
              >
                <Facebook size={20} />
                <span className="text-sm font-medium">Facebook</span>
              </a>
            </div>
          </div>

          {/* Shop Section */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Shop</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/products"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=electronics"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Phones
                </Link>
              </li>
              {/* <li>
                <Link
                  to="/products?category=accessories"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Accessories
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Refurbished
                </Link>
              </li>
              <li>
                <Link
                  to="/products?featured=true"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  New Products
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/track-order"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* About F&S Smartphones Section */}
          <div>
            <h3 className="font-semibold text-lg mb-4">About F&S Smartphones</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  About Us
                </Link>
              </li>
              {/* COMMENTED OUT: Selling feature not available
              <li>
                <Link
                  to="/sell-to-company"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Sell Your Device
                </Link>
              </li>
              */}
            </ul>
          </div>
        </div>

        {/* Payment Methods Section */}
        <div className="pt-8 border-t border-gray-800 mb-6">
          <h4 className="text-sm font-semibold text-white mb-4">Payment Methods</h4>
          <div className="flex flex-wrap items-center gap-3">
            {/* Visa */}
            <div className="flex items-center justify-center h-10 px-3 bg-white rounded shadow-sm hover:shadow-md transition-shadow">
              <img src={visaLogo} alt="Visa" className="h-6 object-contain" />
            </div>
            {/* Mastercard */}
            <div className="flex items-center justify-center h-10 px-3 bg-white rounded shadow-sm hover:shadow-md transition-shadow">
              <img src={mastercardLogo} alt="Mastercard" className="h-6 object-contain" />
            </div>
            {/* Apple Pay */}
            <div className="flex items-center justify-center h-10 px-3 bg-white rounded shadow-sm hover:shadow-md transition-shadow">
              <img src={applePayLogo} alt="Apple Pay" className="h-6 object-contain" />
            </div>
            {/* Google Pay */}
            <div className="flex items-center justify-center h-10 px-3 bg-white rounded shadow-sm hover:shadow-md transition-shadow">
              <img src={googlePayLogo} alt="Google Pay" className="h-6 object-contain" />
            </div>
            {/* Klarna */}
            <div className="flex items-center justify-center h-10 px-3 bg-white rounded shadow-sm hover:shadow-md transition-shadow">
              <img src={klarnaLogo} alt="Klarna" className="h-6 object-contain" />
            </div>
            {/* NEW: PayPal */}
            <div className="flex items-center justify-center h-10 px-3 bg-white rounded shadow-sm hover:shadow-md transition-shadow">
              <img src={paypalLogo} alt="PayPal" className="h-6 object-contain" />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-4 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} F&S Smartphones. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              to="/privacy"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/accessibility"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;