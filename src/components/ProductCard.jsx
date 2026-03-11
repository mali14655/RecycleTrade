import React from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  // NEW: Stock management - Format stock message based on quantity
  const formatStockMessage = (stock) => {
    if (stock === 0) return "Out of Stock";
    if (stock === 1) return "Only 1 left";
    if (stock === 2) return "Only 2 left";
    return "In Stock";
  };

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
      message: formatStockMessage(totalStock)
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

  // NEW: Always use common product images (product.images) for display on cards
  // Fallback to variant image if common image fails
  const getDisplayImage = () => {
    // Priority 1: Use product.images (common images) - shown on product cards
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    // Priority 2: Fallback to first variant's image if common image is not available
    if (product.variants && product.variants.length > 0) {
      const firstEnabledVariant = product.variants.find(v => v.enabled !== false) || product.variants[0];
      if (firstEnabledVariant?.images && firstEnabledVariant.images.length > 0) {
        return firstEnabledVariant.images[0];
      }
    }
    return null;
  };

  // NEW: Get minimum price from backend-computed product.price
  const getDisplayPrice = () => {
    // Backend already sets product.price to the minimum logical variant price (grouped without battery)
    // Simply use product.price here to avoid recomputing on the frontend
    const basePrice = Number(product.price);
    return { price: Number.isFinite(basePrice) ? basePrice : 0, hasVariants: !!(product.variants && product.variants.length > 0) };
  };

  const displayImage = getDisplayImage();
  const priceInfo = getDisplayPrice();

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
            onError={(e) => {
              // Priority 1: Try JPEG format as fallback
              if (displayImage && displayImage.includes('res.cloudinary.com')) {
                const uploadIndex = displayImage.indexOf('/upload/');
                if (uploadIndex !== -1 && !e.target.dataset.fallbackAttempted) {
                  let cleanUrl = displayImage.replace(/\/f_(auto|webp)\//g, '/').replace(/\/f_(auto|webp),/g, '/');
                  const beforeUpload = cleanUrl.substring(0, cleanUrl.indexOf('/upload/') + 8);
                  const afterUpload = cleanUrl.substring(cleanUrl.indexOf('/upload/') + 8);
                  e.target.dataset.fallbackAttempted = 'true';
                  e.target.src = beforeUpload + 'f_jpg,q_auto/' + afterUpload;
                  return;
                }
              }
              
              // Priority 2: If common image fails, try variant image as fallback
              if (!e.target.dataset.variantFallbackAttempted && product.variants && product.variants.length > 0) {
                const firstEnabledVariant = product.variants.find(v => v.enabled !== false) || product.variants[0];
                if (firstEnabledVariant?.images && firstEnabledVariant.images.length > 0) {
                  const variantImage = firstEnabledVariant.images[0];
                  // Only try variant if it's different from the current image
                  if (variantImage !== displayImage) {
                    e.target.dataset.variantFallbackAttempted = 'true';
                    e.target.src = variantImage;
                    return;
                  }
                }
              }
              
              // Final fallback to placeholder
              e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='18' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E";
              e.target.onerror = null;
            }}
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
            <div>
              {priceInfo.hasVariants && (
                <p className="text-xs text-gray-500 font-normal mb-0.5">Starts from</p>
              )}
              <p className="text-gray-900 font-semibold text-lg">
                €{priceInfo.price.toFixed(2)}
              </p>
            </div>
            {/* Stock management - Stock status badge */}
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              stockStatus.available 
                ? stockStatus.stock !== null && stockStatus.stock > 0
                  ? stockStatus.stock <= 2
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-green-100 text-green-700'
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