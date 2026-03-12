// components/Hero.jsx - COMPACT FIXED VERSION
import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Truck,
  RotateCcw,
  ShieldCheck,
  Leaf,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import axios from "axios";

// Import your images
import bgHeroImage from "../assets/heroBgImage.jpg";
import heroMobileImage from "../assets/heroMobilePhones.png";
import heroAccessoriesImage from "../assets/heroAccessories.png";

const Hero = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  // NEW: Active promo for hero bar
  const [activePromo, setActivePromo] = useState(null);

  // NEW: Build compact brand/category label for hero
  const getPromoCategorySummary = (promo) => {
    if (!promo) return "";
    const raw = promo.categories || [];

    const groups = new Set();
    raw.forEach((name) => {
      if (!name) return;
      const lower = String(name).toLowerCase();
      if (lower.includes("iphone")) {
        groups.add("iPhones");
      } else if (lower.includes("samsung")) {
        groups.add("Samsung");
      } else {
        groups.add(name);
      }
    });

    const list = Array.from(groups);
    if (list.length === 0) return "";
    if (list.length === 1) return list[0];
    if (list.length === 2) return `${list[0]} and ${list[1]}`;
    const allButLast = list.slice(0, -1).join(", ");
    const last = list[list.length - 1];
    return `${allButLast} and ${last}`;
  };
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/categories`
        );
        console.log(res.data    )
        setCategories(res.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Fallback categories with your images
        setCategories([
          { _id: "1", name: "Mobile Phones", image: heroMobileImage },
          { _id: "2", name: "Accessories", image: heroAccessoriesImage },
          { _id: "3", name: "Electronics", image: heroMobileImage },
          { _id: "4", name: "Computers", image: heroAccessoriesImage },
        ]);
      } finally {
        setLoading(false);
      }
    };

    const fetchActivePromo = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/promocodes/public/active`
        );
        setActivePromo(res.data);
      } catch (error) {
        console.error("Error fetching active promo:", error);
        setActivePromo(null);
      }
    };

    fetchCategories();
    fetchActivePromo();
  }, []);

  const scrollLeft = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const container = scrollContainerRef.current || document.getElementById("categories-scroll");
    if (container) {
      const currentScroll = container.scrollLeft;
      container.scrollTo({ left: currentScroll - 300, behavior: "smooth" });
    }
  };

  const scrollRight = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const container = scrollContainerRef.current || document.getElementById("categories-scroll");
    if (container) {
      const currentScroll = container.scrollLeft;
      container.scrollTo({ left: currentScroll + 300, behavior: "smooth" });
    }
  };

  const checkScroll = () => {
    const container = document.getElementById("categories-scroll");
    if (container) {
      setShowLeftArrow(container.scrollLeft > 0);
      setShowRightArrow(
        container.scrollLeft <
          container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  useEffect(() => {
    const container = document.getElementById("categories-scroll");
    if (container) {
      container.addEventListener("scroll", checkScroll);
      checkScroll(); // Initial check
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", checkScroll);
      }
    };
  }, [categories]);

  return (
    <div className="w-[95%] mx-auto">
      {/* Promo Bar */}
      {activePromo && !activePromo.isHidden && activePromo.isActive && (
        <div className="bg-gradient-to-r from-[#000000] to-[#666666] text-white text-center py-2 px-4">
          <p className="text-sm">
            <span className="mr-1">🎉</span>
            Save {activePromo.discountPercent}% EXTRA on{" "}
            {getPromoCategorySummary(activePromo)} - Code:{" "}
            <span className="font-semibold">{activePromo.code}</span>
          </p>
        </div>
      )}

      {/* Hero Banner - COMPACT HEIGHT */}
      <div className="relative bg-[#212121] overflow-hidden min-h-[50vh] lg:min-h-[60vh]">
        {/* Background Image with Darker Overlay */}
        <div className="absolute inset-0 bg-black">
          <img
            src={bgHeroImage}
            alt="Hero background"
            className="w-full h-full object-cover opacity-40"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="flex flex-col items-center text-center gap-4 sm:gap-6">
            {/* Title - COMPACT */}
            <h1 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-2 sm:mb-4 px-2">
              F&S Smartphones products with at least a 12-month warranty
            </h1>

            {/* Categories Section */}
            <div className="w-full max-w-4xl">
              <div className="relative">
                {/* Scroll Buttons */}
                <button
                  type="button"
                  onClick={scrollLeft}
                  className={`hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-30 w-10 h-10 bg-[#212121]/90 hover:bg-[#212121] text-white rounded-full items-center justify-center transition-all shadow-2xl border border-gray-600 hover:scale-105 pointer-events-auto ${
                    !showLeftArrow
                      ? "opacity-50 cursor-pointer"
                      : "opacity-100 cursor-pointer"
                  }`}
                  style={{ pointerEvents: 'auto' }}
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  type="button"
                  onClick={scrollRight}
                  className={`hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-30 w-10 h-10 bg-[#212121]/90 hover:bg-[#212121] text-white rounded-full items-center justify-center transition-all shadow-2xl border border-gray-600 hover:scale-105 pointer-events-auto ${
                    !showRightArrow
                      ? "opacity-50 cursor-pointer"
                      : "opacity-100 cursor-pointer"
                  }`}
                  style={{ pointerEvents: 'auto' }}
                >
                  <ChevronRight size={20} />
                </button>

                {/* Categories Scroll Container - HIDDEN SCROLLBAR */}
                <div
                  id="categories-scroll"
                  ref={scrollContainerRef}
                  className="flex overflow-x-auto gap-3 sm:gap-4 pb-3 scroll-smooth px-2 lg:px-0 hide-scrollbar"
                  onScroll={checkScroll}
                >
                  {categories.map((category) => (
                    <Link
                      key={category._id}
                      to={`/products?category=${category.name.toLowerCase()}`}
                      state={{ category: category.name }} // Yahan category pass karo
                      className="flex-shrink-0 w-40 sm:w-48 lg:w-56 transform hover:scale-105 transition-transform duration-300"
                    >
                      <div className="bg-[#212121]/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 hover:bg-[#212121]/90 transition-all duration-300 cursor-pointer border border-gray-700 hover:border-gray-600 h-48 flex flex-col justify-between">
                        {/* Category Image - COMPACT with rounded corners and white background */}
                        <div className="flex justify-center items-center h-28 mb-3 bg-white rounded-xl p-2">
                          <img
                            src={category.image || heroMobileImage}
                            alt={category.name}
                            className="h-full w-auto object-contain max-h-full rounded-lg"
                            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                          />
                        </div>
                        <p className="text-white text-center font-medium text-sm sm:text-base">
                          {category.name}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Buttons - COMPACT */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-6">
              <Link
                to="/products"
                className="bg-white text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg text-sm sm:text-base"
              >
                Explore All Products
              </Link>
              {/* COMMENTED OUT: Selling feature not available
              <Link
                to="/register"
                className="border-2 border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors text-sm sm:text-base"
              >
                Start Selling
              </Link>
              */}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section - COMPACT */}
      <div className="bg-white py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Feature 1 */}
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <Truck
                size={24}
                strokeWidth={1.5}
                className="text-gray-900 shrink-0"
              />
              <p className="text-xs sm:text-sm text-gray-900">
                Shipping costs included
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <RotateCcw
                size={24}
                strokeWidth={1.5}
                className="text-gray-900 shrink-0"
              />
              <p className="text-xs sm:text-sm text-gray-900">
                30-day money-back guarantee
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <ShieldCheck
                size={24}
                strokeWidth={1.5}
                className="text-gray-900 shrink-0"
              />
              <p className="text-xs sm:text-sm text-gray-900">
                Minimum 12-month warranty
              </p>
            </div>

            {/* Feature 4 */}
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <Leaf
                size={24}
                strokeWidth={1.5}
                className="text-gray-900 shrink-0"
              />
              <p className="text-xs sm:text-sm text-gray-900">
                More environmentally friendly
              </p>
            </div>
          </div>
        </div>
      </div>

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
    </div>
  );
};

export default Hero;
