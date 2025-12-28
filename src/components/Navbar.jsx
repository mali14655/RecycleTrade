import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { ShoppingCart, User, Search, Menu, LogOut } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { useSearch } from "../context/SearchContext";
import axios from "axios";
import logo from "../assets/logo.jpeg";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const { searchQuery, updateSearch, clearSearch } = useSearch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  // NEW: Separate search suggestions state for desktop and mobile
  const [suggestions, setSuggestions] = useState([]);
  const [showDesktopSuggestions, setShowDesktopSuggestions] = useState(false);
  const [showMobileSuggestions, setShowMobileSuggestions] = useState(false);
  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const desktopSuggestionsRef = useRef(null);
  const mobileSuggestionsRef = useRef(null);
  // NEW: Track if we're doing immediate navigation (to bypass debounce)
  const isImmediateNavigation = useRef(false);
  const isUserTyping = useRef(false); // NEW: Track if user is actively typing
  const searchDebounceTimeoutRef = useRef(null); // NEW: Track debounce timeout

  const cartItemCount =
    cart?.items?.reduce((total, item) => total + (item.quantity || 1), 0) || 0;

  // Sync search query with URL params (especially when on products page)
  // BUT: Don't sync if user is actively typing to prevent overwriting their input
  useEffect(() => {
    // Skip sync if user is actively typing
    if (isUserTyping.current) {
      return;
    }
    
    const urlSearch = decodeURIComponent(searchParams.get('search') || '');
    // Only update if URL search differs from current search query
    // This prevents infinite loops and unnecessary updates
    if (urlSearch !== searchQuery) {
      updateSearch(urlSearch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]); // Track location.search to detect URL param changes

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

  // NEW: Fetch search suggestions as user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery && searchQuery.trim().length >= 2) {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/products/search-suggestions`,
            { params: { q: searchQuery } }
          );
          setSuggestions(res.data || []);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchSuggestions();
    }, 200); // Shorter debounce for suggestions

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // NEW: Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isDesktopSearch = desktopSearchRef.current?.contains(event.target);
      const isMobileSearch = mobileSearchRef.current?.contains(event.target);
      const isDesktopSuggestions = desktopSuggestionsRef.current?.contains(event.target);
      const isMobileSuggestions = mobileSuggestionsRef.current?.contains(event.target);
      
      // Close desktop suggestions if click is outside
      if (!isDesktopSearch && !isDesktopSuggestions) {
        setShowDesktopSuggestions(false);
      }
      
      // Close mobile suggestions if click is outside
      if (!isMobileSearch && !isMobileSuggestions) {
        setShowMobileSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // NEW: Real-time search - updates URL as you type with proper debounce
  // This debounces both typing and deleting text
  useEffect(() => {
    // Skip debounced navigation if we just did an immediate navigation
    if (isImmediateNavigation.current) {
      isImmediateNavigation.current = false;
      return;
    }
    
    // Mark that user is typing
    isUserTyping.current = true;
    
    // Clear any existing debounce timeout
    if (searchDebounceTimeoutRef.current) {
      clearTimeout(searchDebounceTimeoutRef.current);
    }
    
    // Debounce search updates - wait for user to stop typing/deleting
    searchDebounceTimeoutRef.current = setTimeout(() => {
      // User has stopped typing
      isUserTyping.current = false;
      
      const trimmedQuery = searchQuery.trim();
      
      // Get current URL search param
      const currentSearchParam = decodeURIComponent(searchParams.get('search') || '');
      
      // Only proceed if search actually changed
      if (trimmedQuery === currentSearchParam) {
        return; // No change, skip update
      }
      
      // If on products page, update URL with search query
      if (location.pathname === "/products") {
        const currentParams = new URLSearchParams(searchParams);
        
        // If search is empty, remove search param and restore category/price if needed
        if (!trimmedQuery) {
          currentParams.delete("search");
          // Don't restore category/price automatically - let user select them
        } else {
          // Search has value - set it and clear category/price
          currentParams.set("search", trimmedQuery);
          currentParams.delete("category");
          currentParams.delete("minPrice");
          currentParams.delete("maxPrice");
        }
        
        const newUrl = `/products?${currentParams.toString()}`;
        navigate(newUrl, { replace: true });
      }
      // If not on products page and there's a search query, navigate to products page
      else if (trimmedQuery) {
        const newUrl = `/products?search=${encodeURIComponent(trimmedQuery)}`;
        navigate(newUrl);
      }
      // If search is cleared and we're on products page, navigate without search
      else if (location.pathname === "/products" && !trimmedQuery && currentSearchParam) {
        const currentParams = new URLSearchParams();
        navigate(`/products?${currentParams.toString()}`, { replace: true });
      }
    }, 400); // 400ms debounce - wait for user to stop typing/deleting

    return () => {
      if (searchDebounceTimeoutRef.current) {
        clearTimeout(searchDebounceTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, location.pathname]); // Removed searchParams and navigate from dependencies

  const handleSearch = (e) => {
    e.preventDefault();
    // Set flag to bypass debounced navigation
    isImmediateNavigation.current = true;
    
    // Immediate navigation on Enter or search button click (no debounce)
    if (searchQuery.trim()) {
      const currentParams = new URLSearchParams();
      currentParams.set("search", searchQuery.trim());
      // Remove category and price from URL when search is set
      currentParams.delete("category");
      currentParams.delete("minPrice");
      currentParams.delete("maxPrice");
      
      if (location.pathname !== "/products") {
        navigate(`/products?${currentParams.toString()}`);
      } else {
        navigate(`/products?${currentParams.toString()}`, { replace: true });
      }
    } else {
      // If search is cleared, remove search from URL
      const currentParams = new URLSearchParams();
      currentParams.delete("search");
      if (location.pathname === "/products") {
        navigate(`/products?${currentParams.toString()}`, { replace: true });
      }
    }
  };

  const handleSearchChange = (value, isMobile = false) => {
    // Mark that user is actively typing - prevent URL sync from overwriting
    isUserTyping.current = true;
    
    updateSearch(value);
    // Only show suggestions for the active search bar
    if (isMobile) {
      setShowMobileSuggestions(true);
      setShowDesktopSuggestions(false);
    } else {
      setShowDesktopSuggestions(true);
      setShowMobileSuggestions(false);
    }
  };

  // NEW: Handle suggestion selection - immediate navigation
  const handleSuggestionClick = (suggestionName, isMobile = false) => {
    // Set flag to bypass debounced navigation
    isImmediateNavigation.current = true;
    
    const trimmedSuggestion = suggestionName.trim();
    console.log("Navbar: Suggestion clicked:", trimmedSuggestion, "Length:", trimmedSuggestion.length);
    
    // Update search query first - use FULL suggestion name
    updateSearch(trimmedSuggestion);
    setShowDesktopSuggestions(false);
    setShowMobileSuggestions(false);
    
    // Navigate immediately to products page with search (no debounce, bypasses the debounced effect)
    if (trimmedSuggestion) {
      const currentParams = new URLSearchParams();
      currentParams.set("search", trimmedSuggestion); // Full suggestion, not truncated
      // Remove category and price from URL when search is set
      currentParams.delete("category");
      currentParams.delete("minPrice");
      currentParams.delete("maxPrice");
      
      const newUrl = `/products?${currentParams.toString()}`;
      console.log("Navbar: Navigating immediately to:", newUrl);
      // Use replace: true to update URL immediately
      navigate(newUrl, { replace: true });
    }
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
          <div className="flex items-center justify-between h-14 gap-4">
            {/* Left Section: Logo + Navigation */}
            <div className="flex items-center gap-4 lg:gap-6 flex-shrink-0">
              {/* Logo */}
              <Link
                to="/"
                className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
                onClick={clearSearch}
              >
                <img 
                  src={logo} 
                  alt="F&S Smartphones" 
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg object-cover"
                />
                <span className="text-base sm:text-lg font-semibold text-gray-900 whitespace-nowrap">
                  F<span className="text-gray-500 font-normal">&</span>S Smartphones
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
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-xs xl:max-w-md mx-4">
              <form onSubmit={handleSearch} className="relative w-full" ref={desktopSearchRef}>
                <input
                  type="text"
                  placeholder="Search products or categories..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value, false)}
                  onFocus={() => {
                    if (suggestions.length > 0) {
                      setShowDesktopSuggestions(true);
                      setShowMobileSuggestions(false);
                    }
                  }}
                  className="w-full px-3 xl:px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 text-sm font-sans"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
                >
                  <Search size={18} />
                </button>
                
                {/* NEW: Search Suggestions Dropdown - Desktop Only */}
                {showDesktopSuggestions && suggestions.length > 0 && (
                  <div
                    ref={desktopSuggestionsRef}
                    className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
                  >
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleSuggestionClick(suggestion.name, false)}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-2"
                      >
                        <Search size={14} className="text-gray-400" />
                        <span>{suggestion.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </form>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 flex-shrink-0">
              {/* User Menu */}
              {user ? (
                <div className="relative">
                  {/* NEW: For buyers, clicking icon goes directly to profile */}
                  {user.user?.role === "buyer" ? (
                    <Link
                      to="/profile"
                      className="text-gray-700 hover:text-gray-900 transition-colors"
                      title="Go to Profile"
                    >
                      <User size={20} className="sm:w-5 sm:h-5" />
                    </Link>
                  ) : (
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      <User size={20} className="sm:w-5 sm:h-5" />
                    </button>
                  )}

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
                      {/* NEW: Profile link for buyers */}
                      {user.user?.role === "buyer" && (
                        <Link
                          to="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                        >
                          <User size={16} />
                          My Profile
                        </Link>
                      )}
                      {user.user?.role === "admin" && (
                        <Link
                          to="/dashboard"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                        >
                          <User size={16} />
                          Dashboard
                        </Link>
                      )}
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
            <form onSubmit={handleSearch} className="relative w-full" ref={mobileSearchRef}>
              <input
                type="text"
                placeholder="Search products or categories..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value, true)}
                onFocus={() => {
                  if (suggestions.length > 0) {
                    setShowMobileSuggestions(true);
                    setShowDesktopSuggestions(false);
                  }
                }}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 text-sm font-sans"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
              >
                <Search size={18} />
              </button>
              
              {/* NEW: Search Suggestions Dropdown - Mobile Only */}
              {showMobileSuggestions && suggestions.length > 0 && (
                <div
                  ref={mobileSuggestionsRef}
                  className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
                >
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion.name, true)}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-2"
                    >
                      <Search size={14} className="text-gray-400" />
                      <span>{suggestion.name}</span>
                    </button>
                  ))}
                </div>
              )}
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
