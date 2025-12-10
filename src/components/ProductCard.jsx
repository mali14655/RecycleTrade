import React from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  // NEW: Stock management - Check if product is in stock
  const checkStockAvailability = () => {
    // Products without variants - assume unlimited stock (backward compatibility)
    if (!product.variants || product.variants.length === 0) {
      return { available: true, stock: null, message: "In Stock" };
    }
    
    // Products with variants - check if any enabled variant has stock
    const availableVariants = product.variants.filter(v => 
      v.enabled && (v.stock === undefined || v.stock > 0)
    );
    
    if (availableVariants.length === 0) {
      return { available: false, stock: 0, message: "Out of Stock" };
    }
    
    // Calculate total stock across all variants
    const totalStock = product.variants
      .filter(v => v.enabled)
      .reduce((sum, v) => sum + (v.stock || 0), 0);
    
    return { 
      available: true, 
      stock: totalStock, 
      message: totalStock > 0 ? `${totalStock} in stock` : "Limited Stock" 
    };
  };

  const stockStatus = checkStockAvailability();

  // Calculate average rating
  const calculateAverageRating = () => {
    if (!product.reviews || product.reviews.length === 0) return 0;
    const total = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / product.reviews.length;
  };

  const averageRating = calculateAverageRating();
  const reviewCount = product.reviews?.length || 0;

  // Render stars based on rating
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={14}
        className={
          index < rating
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }
      />
    ));
  };

  // NEW: Get first variant's images and price for display
  const getDisplayImage = () => {
    // If product has variants, use first variant's images
    if (product.variants && product.variants.length > 0) {
      const firstVariant = product.variants.find(v => v.enabled) || product.variants[0];
      if (firstVariant.images && firstVariant.images.length > 0) {
        return firstVariant.images[0];
      }
    }
    // Fallback to product images
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    return null;
  };

  const getDisplayPrice = () => {
    // If product has variants, use first variant's price
    if (product.variants && product.variants.length > 0) {
      const firstVariant = product.variants.find(v => v.enabled) || product.variants[0];
      if (firstVariant.price !== undefined && firstVariant.price !== null) {
        return firstVariant.price;
      }
    }
    // Fallback to product price
    return product.price || 0;
  };

  const displayImage = getDisplayImage();
  const displayPrice = getDisplayPrice();

  return (
    <div 
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer h-full flex flex-col border border-gray-200"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      {/* Product Image - Hero Section Style */}
      <div className="mb-4 flex justify-center items-center bg-gray-50 rounded-t-lg h-48 overflow-hidden">
        {displayImage ? (
          <img
            src={displayImage}
            alt={product.name}
            className="w-full h-full object-contain p-4 hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
            <span className="text-gray-400 text-sm">No Image</span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          {renderStars(averageRating)}
          <span className="text-xs text-gray-600 ml-1">
            ({reviewCount.toLocaleString()})
          </span>
        </div>

        {/* Product Name */}
        <h3 className="text-gray-900 font-medium mb-3 text-sm line-clamp-2 leading-tight">
          {product.name}
        </h3>

        {/* Price and Stock Status */}
        <div className="mt-auto">
          <div className="flex items-center justify-between">
            <p className="text-gray-900 font-semibold text-lg">
              €{displayPrice}
            </p>
            {/* Stock management - Stock status badge */}
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              stockStatus.available 
                ? stockStatus.stock !== null && stockStatus.stock > 0
                  ? 'bg-green-100 text-green-700'
                  : 'bg-blue-100 text-blue-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {stockStatus.message}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}