// components/Hero.jsx - FIXED category card height for laptop screens
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Truck, RotateCcw, ShieldCheck, Leaf, ChevronRight, ChevronLeft } from "lucide-react";
import axios from "axios";

// Import your images
import bgHeroImage from "../assets/heroBgImage.jpg";
import heroMobileImage from "../assets/heroMobilePhones.png";
import heroAccessoriesImage from "../assets/heroAccessories.png";

const Hero = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/categories`);
        setCategories(res.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Fallback categories with your images
        setCategories([
          { _id: '1', name: 'Mobile Phones', image: heroMobileImage },
          { _id: '2', name: 'Accessories', image: heroAccessoriesImage },
          { _id: '3', name: 'Electronics', image: heroMobileImage }, // Using same as fallback
          { _id: '4', name: 'Computers', image: heroAccessoriesImage }, // Using same as fallback
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const scrollLeft = () => {
    const container = document.getElementById('categories-scroll');
    container.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    const container = document.getElementById('categories-scroll');
    container.scrollBy({ left: 300, behavior: 'smooth' });
  };

  const checkScroll = () => {
    const container = document.getElementById('categories-scroll');
    if (container) {
      setShowLeftArrow(container.scrollLeft > 0);
      setShowRightArrow(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  useEffect(() => {
    const container = document.getElementById('categories-scroll');
    if (container) {
      container.addEventListener('scroll', checkScroll);
      checkScroll(); // Initial check
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', checkScroll);
      }
    };
  }, [categories]);

  return (
    <div className="w-[90%] mx-auto">
      {/* Promo Bar */}
      <div className="bg-gradient-to-r from-[#000000] to-[#666666] text-white text-center py-2.5 px-4">
        <p className="text-sm">
          <span className="mr-1">🎉</span>
          Save big 5% EXTRA on iPhones & Oppo - Code: MACPAD5
        </p>
      </div>

      {/* Hero Banner */}
      <div className="relative bg-[#212121] overflow-hidden min-h-[60vh]  lg:h-[90vh]">
        {/* Background Image with Darker Overlay */}
        <div className="absolute inset-0 bg-black">
          <img
            src={bgHeroImage}
            alt="Hero background"
            className="w-full h-full object-cover opacity-40"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-16">
          <div className="flex flex-col items-center text-center gap-6 sm:gap-8 lg:gap-10">
            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-4 sm:mb-8 lg:mb-12 px-2">
              Mobitrade products with at least a 12-month warranty
            </h1>

            {/* Categories Section with Horizontal Scroll */}
            <div className="w-full max-w-4xl">
              <div className="relative">
                {/* Scroll Buttons - Always visible on larger screens */}
                <button 
                  onClick={scrollLeft}
                  className={`hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-20 w-12 h-12 bg-[#212121]/90 hover:bg-[#212121] text-white rounded-full items-center justify-center transition-all shadow-2xl border border-gray-600 hover:scale-105 ${
                    !showLeftArrow ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
                  }`}
                  disabled={!showLeftArrow}
                >
                  <ChevronLeft size={24} />
                </button>
                
                <button 
                  onClick={scrollRight}
                  className={`hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-20 w-12 h-12 bg-[#212121]/90 hover:bg-[#212121] text-white rounded-full items-center justify-center transition-all shadow-2xl border border-gray-600 hover:scale-105 ${
                    !showRightArrow ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
                  }`}
                  disabled={!showRightArrow}
                >
                  <ChevronRight size={24} />
                </button>

                {/* Categories Scroll Container */}
                <div 
                  id="categories-scroll"
                  className="flex overflow-x-auto gap-4 sm:gap-6 pb-4 scrollbar-hide scroll-smooth px-4 lg:px-0"
                  onScroll={checkScroll}
                >
                  {categories.map((category) => (
                    <Link
                      key={category._id}
                      to={`/products?category=${category.name.toLowerCase()}`}
                      className="flex-shrink-0 w-48 sm:w-56 lg:w-64 transform hover:scale-105 transition-transform duration-300"
                    >
                      <div className="bg-[#212121]/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 hover:bg-[#212121]/90 transition-all duration-300 cursor-pointer border border-gray-700 hover:border-gray-600 h-64 flex flex-col justify-between"> {/* Fixed height and flex layout */}
                        {/* Category Image as Background */}
                        <div className="flex justify-center items-center h-40"> {/* Fixed image container height */}
                          <img
                            src={category.image || heroMobileImage}
                            alt={category.name}
                            className="h-full w-auto object-contain max-h-full"
                          />
                        </div>
                        <p className="text-white text-center font-medium text-base sm:text-lg mt-4"> {/* Added margin top */}
                          {category.name}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Scroll Indicator for Mobile */}
                <div className="lg:hidden flex justify-center mt-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Link
                to="/products"
                className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
              >
                Explore All Products
              </Link>
              <Link
                to="/register"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors"
              >
                Start Selling
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-4 sm:py-6">
        <div className="mx-auto px-2 sm:px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {/* Feature 1 */}
            <div className="flex items-center gap-2 sm:gap-3 justify-center sm:justify-start">
              <Truck
                size={32}
                strokeWidth={1.5}
                className="text-gray-900 sm:w-10 sm:h-10 shrink-0"
              />
              <p className="text-xs sm:text-sm text-gray-900">
                Shipping costs included
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center gap-2 sm:gap-3 justify-center sm:justify-start">
              <RotateCcw
                size={32}
                strokeWidth={1.5}
                className="text-gray-900 sm:w-10 sm:h-10 shrink-0"
              />
              <p className="text-xs sm:text-sm text-gray-900">
                30-day money-back guarantee
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center gap-2 sm:gap-3 justify-center sm:justify-start">
              <ShieldCheck
                size={32}
                strokeWidth={1.5}
                className="text-gray-900 sm:w-10 sm:h-10 shrink-0"
              />
              <p className="text-xs sm:text-sm text-gray-900">
                Minimum 12-month warranty
              </p>
            </div>

            {/* Feature 4 */}
            <div className="flex items-center gap-2 sm:gap-3 justify-center sm:justify-start">
              <Leaf
                size={32}
                strokeWidth={1.5}
                className="text-gray-900 sm:w-10 sm:h-10 shrink-0"
              />
              <p className="text-sm text-gray-900">
                More environmentally friendly than new
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;