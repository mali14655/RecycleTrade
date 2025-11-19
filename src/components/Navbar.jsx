// components/Navbar.jsx - NEW FILE
import React, { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Heart, ShoppingCart, User, Search, Menu, LogOut } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const cartItemCount = cart?.items?.reduce((total, item) => total + (item.quantity || 1), 0) || 0;

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const navigation = [
    { name: 'Home', href: '/', current: location.pathname === '/' },
    { name: 'Products', href: '/products', current: location.pathname === '/products' },
    { name: 'Track Order', href: '/track-order', current: location.pathname === '/track-order' },
  ];

  if (user) {
    if (user.user?.role === 'admin' || user.user?.role === 'seller_candidate') {
      navigation.push({ 
        name: 'Dashboard', 
        href: '/dashboard', 
        current: location.pathname === '/dashboard' 
      });
    }
    if (user.user?.role === 'seller') {
      navigation.push({ 
        name: 'Sell to Company', 
        href: '/sell-to-company', 
        current: location.pathname === '/sell-to-company' 
      });
    }
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-[90%] mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white text-xl sm:text-2xl font-bold">M</span>
            </div>
            <span className="text-lg sm:text-xl font-semibold">Mobitrade</span>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`transition-colors text-sm xl:text-base ${
                  item.current 
                    ? "text-gray-900 font-medium" 
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-xs xl:max-w-md mx-4 xl:mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder="I'm looking for..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 xl:px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 text-sm"
              />
              <button 
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <Search size={18} />
              </button>
            </form>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
            <button className="hidden sm:block text-gray-700 hover:text-gray-900 transition-colors">
              <Heart size={20} className="sm:w-6 sm:h-6" />
            </button>
            
            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <User size={20} className="sm:w-6 sm:h-6" />
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-800">
                        {user.user?.name}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {user.user?.role?.replace('_', ' ')}
                      </p>
                    </div>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/login" 
                className="text-gray-700 hover:text-gray-900 transition-colors"
              >
                <User size={20} className="sm:w-6 sm:h-6" />
              </Link>
            )}

            {/* Cart */}
            <Link 
              to="/cart" 
              className="relative text-gray-700 hover:text-gray-900 transition-colors"
            >
              <ShoppingCart size={20} className="sm:w-6 sm:h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center font-medium">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden text-gray-700 hover:text-gray-900"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden pb-3">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              placeholder="I'm looking for..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 text-sm"
            />
            <button 
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <Search size={18} />
            </button>
          </form>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`transition-colors ${
                    item.current 
                      ? "text-gray-900 font-medium" 
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;