// components/layout/Footer.jsx - UPDATED with new F&S Smartphones design
import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import logo from "../assets/logo.jpeg";

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
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Youtube size={20} />
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

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
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
              to="/cookies"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;