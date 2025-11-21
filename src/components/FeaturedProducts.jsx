import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const FeaturedProducts = ({ products = [], loading = false }) => {
  if (loading) {
    return (
      <div className="bg-gray-50 py-16">
        <div className="max-w-[90%] mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-6 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="bg-gray-50 py-16">
        <div className="max-w-[90%] mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">
            Featured Products
          </h2>
          <div className="text-center py-8">
            <p className="text-gray-600">No featured products available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-[90%] mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-10">
          Featured Products
        </h2>

        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            navigation={{
              prevEl: ".swiper-button-prev-custom",
              nextEl: ".swiper-button-next-custom",
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 3,
              },
              1024: {
                slidesPerView: 4,
              },
            }}
            className="featured-products-swiper"
          >
            {products.map((product) => (
              <SwiperSlide key={product._id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-black rounded-full flex items-center justify-center text-white hover:bg-gray-800 transition-colors shadow-lg">
            <ChevronLeft size={24} />
          </button>
          <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-black rounded-full flex items-center justify-center text-white hover:bg-gray-800 transition-colors shadow-lg">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;