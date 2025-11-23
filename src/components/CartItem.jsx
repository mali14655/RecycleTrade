import React from "react";
import { X, Plus, Minus } from "lucide-react";

const CartItem = ({ item, onRemove, onUpdateQuantity, product }) => {
  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(product._id, item.quantity - 1, item.variantId || null);
    }
  };

  const handleIncrease = () => {
    onUpdateQuantity(product._id, item.quantity + 1, item.variantId || null);
  };

  const handleRemove = () => {
    onRemove(product._id, item.variantId || null);
  };

  // Get variant images if variant exists
  const getVariantImage = () => {
    if (item.variantId && product.variants) {
      const variant = product.variants.find(v => v._id?.toString() === item.variantId?.toString());
      if (variant && variant.images && variant.images.length > 0) {
        return variant.images[0];
      }
    }
    // Fallback to product images or item images
    return item.images?.[0] || product.images?.[0] || "https://via.placeholder.com/80/80";
  };

  // Get variant specs from item or product
  const getVariantSpecs = () => {
    if (item.variantSpecs) {
      return item.variantSpecs instanceof Map 
        ? Object.fromEntries(item.variantSpecs) 
        : item.variantSpecs;
    }
    if (item.variantId && product.variants) {
      const variant = product.variants.find(v => v._id?.toString() === item.variantId?.toString());
      if (variant && variant.specs) {
        return variant.specs instanceof Map 
          ? Object.fromEntries(variant.specs) 
          : variant.specs;
      }
    }
    return null;
  };

  // Get variant price if variant exists
  const getVariantPrice = () => {
    if (item.variantId && product.variants) {
      const variant = product.variants.find(v => v._id?.toString() === item.variantId?.toString());
      if (variant) {
        return variant.price;
      }
    }
    // Use stored price from item, or fallback to product price
    return item.price || product.price || 0;
  };

  const price = getVariantPrice();
  const subtotal = price * item.quantity;
  const image = getVariantImage();
  const variantSpecs = getVariantSpecs();

  return (
    <div className="py-4 border-b border-gray-200">
      {/* Desktop Layout */}
      <div className="hidden sm:grid sm:grid-cols-12 sm:gap-4 sm:items-center">
        {/* Remove Button + Image */}
        <div className="col-span-1 flex items-center justify-center">
          <button 
            onClick={handleRemove}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        {/* Product Image + Name */}
        <div className="col-span-4 flex items-center gap-3">
          <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
            <img
              src={image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
              {product.name}
            </h3>
            {variantSpecs && Object.keys(variantSpecs).length > 0 && (
              <div className="mt-1 flex flex-wrap gap-2">
                {Object.entries(variantSpecs).slice(0, 3).map(([key, value]) => (
                  <span key={key} className="text-xs text-gray-600">
                    <span className="font-medium capitalize">{key}:</span> {value}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Price */}
        <div className="col-span-2 text-center">
          <span className="text-gray-900 font-medium text-base">
            ${price.toFixed(2)}
          </span>
        </div>
        {/* Quantity Controls */}
        <div className="col-span-3 flex items-center justify-center gap-3">
          <button 
            onClick={handleDecrease}
            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            <Minus size={16} />
          </button>
          <input
            type="text"
            value={String(item.quantity).padStart(2, "0")}
            readOnly
            className="w-12 text-center border border-gray-300 rounded py-1 text-sm font-medium"
          />
          <button 
            onClick={handleIncrease}
            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
        {/* Subtotal */}
        <div className="col-span-2 text-right">
          <span className="text-gray-900 font-semibold text-base">
            ${subtotal.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="sm:hidden space-y-3">
        {/* Top Row: Image + Info + Remove */}
        <div className="flex gap-3">
          <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
            <img
              src={image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
              {product.name}
            </h3>
            {variantSpecs && Object.keys(variantSpecs).length > 0 && (
              <div className="mb-2 flex flex-wrap gap-1.5">
                {Object.entries(variantSpecs).slice(0, 2).map(([key, value]) => (
                  <span key={key} className="text-xs text-gray-600">
                    <span className="font-medium capitalize">{key}:</span> {value}
                  </span>
                ))}
              </div>
            )}
            <p className="text-base font-semibold text-gray-900">
              ${price.toFixed(2)}
            </p>
          </div>
          <button 
            onClick={handleRemove}
            className="text-red-500 hover:text-red-700 transition-colors h-fit"
          >
            <X size={20} />
          </button>
        </div>
        {/* Bottom Row: Quantity + Subtotal */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              onClick={handleDecrease}
              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              <Minus size={16} />
            </button>
            <input
              type="text"
              value={String(item.quantity).padStart(2, "0")}
              readOnly
              className="w-12 text-center border border-gray-300 rounded py-1 text-sm font-medium"
            />
            <button 
              onClick={handleIncrease}
              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
          <div>
            <span className="text-xs text-gray-600 mr-2">Subtotal:</span>
            <span className="text-base font-bold text-gray-900">
              ${subtotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;

