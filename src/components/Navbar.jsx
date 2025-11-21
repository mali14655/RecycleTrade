import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, User, Search, Menu, LogOut } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { useSearch } from "../context/SearchContext";
import axios from "axios";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const { searchQuery, updateSearch, clearSearch } = useSearch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  const cartItemCount =
    cart?.items?.reduce((total, item) => total + (item.quantity || 1), 0) || 0;

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/categories`
        );
        setCategories(res.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Fallback categories
        setCategories([
          { _id: "1", name: "Mobile Phones" },
          { _id: "2", name: "Accessories" },
          { _id: "3", name: "Electronics" },
          { _id: "4", name: "Computers" },
          { _id: "5", name: "Furniture" },
          { _id: "6", name: "Clothing" },
          { _id: "7", name: "Books" },
          { _id: "8", name: "Sports" },
        ]);
      }
    };

    fetchCategories();
  }, []);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (location.pathname !== "/products") {
        navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      } else {
        const newSearchParams = new URLSearchParams();
        newSearchParams.set("search", searchQuery);
        navigate(`/products?${newSearchParams.toString()}`);
      }
    }
  };

  const handleSearchChange = (value) => {
    updateSearch(value);
  };

  const navigation = [
    {
      name: "Products",
      href: "/products",
      current: location.pathname === "/products",
    },
    {
      name: "Track Order",
      href: "/track-order",
      current: location.pathname === "/track-order",
    },
  ];

  if (user?.user?.role === "admin") {
    navigation.push({
      name: "Dashboard",
      href: "/dashboard",
      current: location.pathname === "/dashboard",
    });
  }

  return (
    <>
      {/* Main Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50 font-sans">
        <div className="max-w-[90%] mx-auto px-2 sm:px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2"
              onClick={clearSearch}
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white text-xl sm:text-2xl font-bold font-serif">
                  M
                </span>
              </div>
              <span className="text-lg sm:text-xl font-semibold font-serif">
                Mobitrade
              </span>
            </Link>

            {/* Navigation Links - Desktop */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`transition-colors text-sm xl:text-base font-medium ${
                    item.current
                      ? "text-gray-900"
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
                  placeholder="Search products or categories..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full px-3 xl:px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 text-sm font-sans"
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
              {/* User Menu */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    <User size={20} className="sm:w-5 sm:h-5" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 font-sans">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-800">
                          {user.user?.name}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {user.user?.role?.replace("_", " ")}
                        </p>
                      </div>
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
                  <User size={20} className="sm:w-5 sm:h-5" />
                </Link>
              )}

              {/* Cart */}
              <Link
                to="/cart"
                className="relative text-gray-700 hover:text-gray-900 transition-colors"
              >
                <ShoppingCart size={20} className="sm:w-5 sm:h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium font-sans">
                    {cartItemCount > 9 ? "9+" : cartItemCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden text-gray-700 hover:text-gray-900"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu size={22} />
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="lg:hidden pb-3">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Search products or categories..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 text-sm font-sans"
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
            <div className="lg:hidden py-4 border-t border-gray-200 font-sans">
              <nav className="flex flex-col space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`transition-colors font-medium ${
                      item.current
                        ? "text-gray-900"
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
        {/* Categories Strip - Compact Height, No Arrows */}
        <div className="bg-[#212121] border-t border-gray-700">
          <div className="max-w-[90%] mx-auto">
            {/* Categories Scroll Container - Hidden Scrollbar */}
            <div
              id="categories-scroll"
              className="flex overflow-x-auto gap-3 py-2 scroll-smooth px-2 hide-scrollbar"
            >
              {categories.map((category) => (
                <Link
                  key={category._id}
                  to="/products" // Direct products page par jao
                  state={{ category: category.name }} // State mein category pass karo
                  className="flex-shrink-0 text-white hover:text-gray-300 transition-colors text-xs font-medium px-3 py-1 rounded-lg hover:bg-gray-800 whitespace-nowrap font-sans"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hide scrollbar CSS */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
};

export default Navbar;
