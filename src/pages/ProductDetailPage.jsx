import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { ChevronLeft, ChevronRight, Star, ShoppingCart, User, Mail, MessageSquare, X, Edit2, Trash2, Image as ImageIcon, Maximize2 } from "lucide-react";
import toast from "react-hot-toast";
import Breadcrumb from "../components/Breadcrumb";
import InfoTooltip from "../components/InfoTooltip";
import { getAppearanceInfoText, getBatteryInfoText } from "../utils/productInfo";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [imageOpacity, setImageOpacity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSpecs, setSelectedSpecs] = useState({});
  const [reviews, setReviews] = useState([]);
  const { addToCart } = useContext(CartContext);

  // Fetch product and reviews
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching product:", id);
        const [productRes, reviewsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/products/${id}`),
          axios.get(`${import.meta.env.VITE_API_URL}/products/${id}/reviews`)
        ]);
        
        setProduct(productRes.data);
        setReviews(reviewsRes.data);
        console.log("Product fetched:", productRes.data);
        
        if (productRes.data.variants && productRes.data.variants.length > 0) {
          // Find first enabled variant that is in stock (if stock is defined)
          // If stock is undefined, assume unlimited and allow selection
          const firstInStockVariant = productRes.data.variants.find(v => 
            v.enabled && (v.stock === undefined || v.stock > 0)
          ) || productRes.data.variants.find(v => v.enabled) || productRes.data.variants[0];
          
          setSelectedVariant(firstInStockVariant);
          
          if (firstInStockVariant && firstInStockVariant.specs) {
            setSelectedSpecs(firstInStockVariant.specs);
          } else {
            setSelectedSpecs({});
          }
        } else {
          setSelectedVariant(null);
          setSelectedSpecs({});
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Product not found");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const getAvailableOptions = (specName) => {
    if (!product?.variants) return [];
    
    const options = new Set();
    product.variants.forEach(variant => {
      if (variant.enabled && variant.specs[specName]) {
        options.add(variant.specs[specName]);
      }
    });
    
    return Array.from(options);
  };

  // NEW: Stock management - Get stock status for variant option
  const getVariantStockForOption = (specName, optionValue) => {
    if (!product?.variants) return null;
    
    // Get all spec names from variants to know what we're working with
    const allSpecNames = product.variants.length > 0 ? 
      Object.keys(product.variants[0]?.specs || {}) : [];
    
    // Get other spec names (excluding the one we're checking)
    const otherSpecNames = allSpecNames.filter(s => s !== specName);
    
    // Get currently selected specs for OTHER specs (not the one we're checking)
    const selectedOtherSpecs = {};
    otherSpecNames.forEach(otherSpec => {
      if (selectedSpecs[otherSpec]) {
        selectedOtherSpecs[otherSpec] = selectedSpecs[otherSpec];
      }
    });
    
    // Build test specs: other selected specs + the option we're checking
    const testSpecs = {
      ...selectedOtherSpecs,
      [specName]: optionValue
    };
    
    // NEW: Helper function to normalize values for comparison (case-insensitive, whitespace-insensitive)
    const normalizeValue = (value) => {
      if (typeof value !== 'string') return value;
      return value.trim().toLowerCase();
    };

    // NEW: Helper function to check if a spec is a color spec
    const isColorSpec = (specName) => {
      const normalized = normalizeValue(specName);
      return normalized === 'color' || normalized === 'colour';
    };

    // NEW: Helper function to compare spec values (case-insensitive for color specs)
    const compareSpecValues = (specName, value1, value2) => {
      if (isColorSpec(specName)) {
        // For color specs, use case-insensitive and whitespace-insensitive comparison
        return normalizeValue(value1) === normalizeValue(value2);
      }
      // For other specs, use exact match
      return value1 === value2;
    };

    // Find variant matching the test specs (other selected + this option)
    // Match means all testSpecs keys must match, but variant can have additional specs
    const matchingVariant = product.variants.find(variant => 
      variant.enabled &&
      Object.keys(testSpecs).every(key => {
        if (!variant.specs || !variant.specs[key]) return false;
        return compareSpecValues(key, variant.specs[key], testSpecs[key]);
      })
    );
    
    // If we found a matching variant, return its stock
    if (matchingVariant) {
      return matchingVariant.stock;
    }
    
    // If no exact match (maybe not all specs selected yet), check if ANY variant with this option is available
    // This is important when user is selecting the first spec or when some specs aren't fully selected
    const variantsWithOption = product.variants.filter(variant => 
      variant.enabled && 
      variant.specs[specName] &&
      compareSpecValues(specName, variant.specs[specName], optionValue)
    );
    
    // If we have other specs selected, check if any variant with this option matches those other specs
    if (Object.keys(selectedOtherSpecs).length > 0) {
      const variantsMatchingOtherSpecs = variantsWithOption.filter(variant =>
        Object.keys(selectedOtherSpecs).every(key =>
          variant.specs[key] && compareSpecValues(key, variant.specs[key], selectedOtherSpecs[key])
        )
      );
      
      // Find first in-stock variant among those matching
      const inStockVariant = variantsMatchingOtherSpecs.find(variant => 
        variant.stock === undefined || variant.stock > 0
      );
      
      return inStockVariant ? (inStockVariant.stock ?? Infinity) : null;
    }
    
    // If no other specs selected, check if ANY variant with this option is in stock
    // This handles the case where user is selecting the first spec
    const inStockVariant = variantsWithOption.find(variant => 
      variant.stock === undefined || variant.stock > 0
    );
    
    // Return stock if found, or null if no in-stock variant exists
    return inStockVariant ? (inStockVariant.stock ?? Infinity) : null;
  };

  // NEW: Stock management - Check if variant is in stock
  const isVariantInStock = (variant) => {
    if (!variant) return false;
    // If stock is undefined, assume unlimited (backward compatibility)
    if (variant.stock === undefined) return true;
    return variant.stock > 0;
  };

  // NEW: Helper function to normalize values for comparison (case-insensitive, whitespace-insensitive)
  const normalizeValue = (value) => {
    if (typeof value !== 'string') return value;
    return value.trim().toLowerCase();
  };

  // NEW: Helper function to check if a spec is a color spec
  const isColorSpec = (specName) => {
    const normalized = normalizeValue(specName);
    return normalized === 'color' || normalized === 'colour';
  };

  // NEW: Helper function to compare spec values (case-insensitive for color specs)
  const compareSpecValues = (specName, value1, value2) => {
    if (isColorSpec(specName)) {
      // For color specs, use case-insensitive and whitespace-insensitive comparison
      return normalizeValue(value1) === normalizeValue(value2);
    }
    // For other specs, use exact match
    return value1 === value2;
  };

  const handleSpecChange = (specName, value) => {
    // Create new selected specs with the updated value
    const newSelectedSpecs = {
      ...selectedSpecs,
      [specName]: value
    };
    
    setSelectedSpecs(newSelectedSpecs);
    
    // Find matching variant with exact spec match
    // First try to find an exact match that is in stock
    let matchingVariant = product.variants.find(variant => {
      if (!variant.enabled) return false;
      
      // Check if all selected specs match (using normalized comparison for color specs)
      const allSelectedSpecsMatch = Object.keys(newSelectedSpecs).every(key => {
        if (!variant.specs || !variant.specs[key]) return false;
        return compareSpecValues(key, variant.specs[key], newSelectedSpecs[key]);
      });
      
      // Also check that variant has all the selected spec keys
      const variantHasAllSelectedKeys = Object.keys(newSelectedSpecs).every(key =>
        variant.specs && variant.specs.hasOwnProperty(key)
      );
      
      // Prefer in-stock variants
      const isInStock = variant.stock === undefined || variant.stock > 0;
      
      return allSelectedSpecsMatch && variantHasAllSelectedKeys && isInStock;
    });
    
    // If no in-stock variant found, find any matching variant (even if out of stock)
    if (!matchingVariant) {
      matchingVariant = product.variants.find(variant => {
        if (!variant.enabled) return false;
        
        const allSelectedSpecsMatch = Object.keys(newSelectedSpecs).every(key => {
          if (!variant.specs || !variant.specs[key]) return false;
          return compareSpecValues(key, variant.specs[key], newSelectedSpecs[key]);
        });
        
        const variantHasAllSelectedKeys = Object.keys(newSelectedSpecs).every(key =>
          variant.specs && variant.specs.hasOwnProperty(key)
        );
        
        return allSelectedSpecsMatch && variantHasAllSelectedKeys;
      });
    }
    
    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
    } else {
      setSelectedVariant(null);
    }
  };

  const getDisplayImages = () => {
    let images = [];
    if (selectedVariant?.images && selectedVariant.images.length > 0) {
      images = selectedVariant.images;
    } else {
      images = product?.images || [];
    }
    // Use original URLs - error handling will fallback to JPEG if WebP fails
    return images;
  };

  const handleAddToCart = async () => {
    if (!product.variants || product.variants.length === 0) {
      addToCart(product, 1);
      // Toast is handled in CartContext, no need to show here
      return;
    }

    if (!selectedVariant) {
      toast.error("Please select an available variant");
      return;
    }

    // NEW: Stock management - Check stock before adding to cart
    if (!isVariantInStock(selectedVariant)) {
      toast.error("This variant is out of stock");
      return;
    }

    const productToAdd = {
      ...product,
      price: selectedVariant.price,
      images: getDisplayImages(),
      variantId: selectedVariant._id,
      variantSpecs: selectedVariant.specs
    };
    
    addToCart(productToAdd, 1, selectedVariant);
    // Toast is handled in CartContext, no need to show here
  };

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading product...</p>
      </div>
    </div>
  );
  
  if (!product) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-500 text-lg">Product not found</p>
      </div>
    </div>
  );

  const displayImages = getDisplayImages();
  
  // Check if product has actual variants with multiple options (not just single-value specs)
  // Only show variant selection if there are multiple variants AND at least one spec has multiple values
  const hasMultipleVariants = product.variants && product.variants.length > 1;
  
  // Get all spec names from first variant
  const allSpecNames = product.variants && product.variants.length > 0 ? 
    Object.keys(product.variants[0]?.specs || {}) : [];
  
  // Check if any spec has multiple unique values (using getAvailableOptions logic)
  const hasVariantSpecs = hasMultipleVariants && allSpecNames.some(specName => {
    const options = getAvailableOptions(specName);
    return options.length > 1; // Multiple options = variant spec
  });
  
  // Only include specs that have multiple options
  const multipleSpecs = hasVariantSpecs ? 
    allSpecNames.filter(specName => getAvailableOptions(specName).length > 1) : [];
  
  const showVariantSelection = hasVariantSpecs && multipleSpecs.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <Breadcrumb currentPage={product?.name} />
      
      {/* Main Product Section */}
      <div className="max-w-[90%] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Left: Image Gallery */}
          <div>
            <div className="space-y-3">
              {/* Main Image */}
              <div className="relative bg-white rounded-lg border border-gray-200 p-3 flex items-center justify-center overflow-hidden" style={{ maxHeight: '450px', minHeight: '350px' }}>
                <div className="relative w-full h-full" style={{ maxWidth: '100%', maxHeight: '400px' }}>
                  <img
                    key={activeImage}
                    src={displayImages[activeImage] || "https://via.placeholder.com/600"}
                    alt={product.name}
                    className="w-full h-full object-contain transition-opacity duration-300 ease-in-out"
                    style={{ 
                      maxHeight: '400px', 
                      maxWidth: '100%',
                      opacity: imageOpacity
                    }}
                    onLoad={() => setImageOpacity(1)}
                    onError={(e) => {
                      const currentSrc = displayImages[activeImage];
                      // Try JPEG format as fallback
                      if (currentSrc && currentSrc.includes('res.cloudinary.com')) {
                        const uploadIndex = currentSrc.indexOf('/upload/');
                        if (uploadIndex !== -1 && !e.target.dataset.fallbackAttempted) {
                          let cleanUrl = currentSrc.replace(/\/f_(auto|webp)\//g, '/').replace(/\/f_(auto|webp),/g, '/');
                          const beforeUpload = cleanUrl.substring(0, cleanUrl.indexOf('/upload/') + 8);
                          const afterUpload = cleanUrl.substring(cleanUrl.indexOf('/upload/') + 8);
                          e.target.dataset.fallbackAttempted = 'true';
                          e.target.src = beforeUpload + 'f_jpg,q_auto/' + afterUpload;
                          return;
                        }
                      }
                      // Final fallback to placeholder
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect fill='%23e5e7eb' width='600' height='400'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='20' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3EImage not available%3C/text%3E%3C/svg%3E";
                      e.target.onerror = null;
                    }}
                  />
                </div>
              </div>

              {/* Thumbnail Navigation */}
              {displayImages.length > 1 && (
                <div className="relative flex items-center gap-2">
                  <button 
                    onClick={() => {
                      setImageOpacity(0);
                      setTimeout(() => {
                        setActiveImage(prev => prev > 0 ? prev - 1 : displayImages.length - 1);
                        setImageOpacity(1);
                      }, 150);
                    }}
                    className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors shrink-0"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <div className="flex-1 overflow-hidden">
                    <div className="flex gap-2 justify-center">
                      {displayImages.map((image, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            setImageOpacity(0);
                            setTimeout(() => {
                              setActiveImage(index);
                              setImageOpacity(1);
                            }, 150);
                          }}
                          className={`w-12 h-12 sm:w-14 sm:h-14 border-2 rounded-lg cursor-pointer overflow-hidden shrink-0 transition-all duration-200 ${
                            activeImage === index
                              ? "border-black scale-105"
                              : "border-gray-200 hover:border-gray-400"
                          }`}
                        >
                          <img
                            src={image}
                            alt={`${product.name} ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Try JPEG format as fallback
                              if (image && image.includes('res.cloudinary.com')) {
                                const uploadIndex = image.indexOf('/upload/');
                                if (uploadIndex !== -1 && !e.target.dataset.fallbackAttempted) {
                                  let cleanUrl = image.replace(/\/f_(auto|webp)\//g, '/').replace(/\/f_(auto|webp),/g, '/');
                                  const beforeUpload = cleanUrl.substring(0, cleanUrl.indexOf('/upload/') + 8);
                                  const afterUpload = cleanUrl.substring(cleanUrl.indexOf('/upload/') + 8);
                                  e.target.dataset.fallbackAttempted = 'true';
                                  e.target.src = beforeUpload + 'f_jpg,q_auto/' + afterUpload;
                                  return;
                                }
                              }
                              // Final fallback to placeholder
                              e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23e5e7eb' width='100' height='100'/%3E%3C/svg%3E";
                              e.target.onerror = null;
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setImageOpacity(0);
                      setTimeout(() => {
                        setActiveImage(prev => prev < displayImages.length - 1 ? prev + 1 : 0);
                        setImageOpacity(1);
                      }, 150);
                    }}
                    className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors shrink-0"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            {/* Reviews Rating - Product name ke upar */}
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={`${
                      i < Math.floor(averageRating) 
                        ? "fill-orange-400 text-orange-400" 
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">{averageRating} Star Rating</span>
              <span className="text-sm text-gray-400">({reviews.length} reviews)</span>
            </div>

            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {product.name} 
              
            </h1>

            {/* Category */}
            <p className="text-gray-500 text-sm capitalize">
              {product.category}
            </p>

            {/* Availability and Seller */}
            {/* <div className="flex flex-wrap items-center gap-4 text-sm"> */}
              {/* <div>
                <span className="text-gray-600">Seller: </span>
                <span className="text-gray-900 font-semibold">
                  {product.sellerId?.name || "Unknown"}
                </span>
              </div> */}
              {/* <div>
                <span className="text-gray-600">Category: </span>
                <span className="text-gray-900 font-semibold capitalize">
                  {product.category}
                </span>
              </div> */}
            {/* </div> */}

            {/* Price and Stock Status */}
            <div className="space-y-2">
              <div className="text-4xl font-bold text-gray-900">
                €{selectedVariant ? selectedVariant.price : product.price}
              </div>
              {/* Stock management - Stock status display */}
              {(() => {
                // Helper function to format stock message
                const formatStockMessage = (stock) => {
                  if (stock === 0) return "Out of Stock";
                  if (stock === 1) return "Only 1 left";
                  if (stock === 2) return "Only 2 left";
                  return "In Stock";
                };

                // If variant is selected, show its stock status
                if (selectedVariant) {
                  const inStock = isVariantInStock(selectedVariant);
                  const stock = selectedVariant.stock !== undefined ? selectedVariant.stock : null;
                  
                  // If stock is undefined (unlimited), show "In Stock"
                  const displayMessage = stock !== null ? formatStockMessage(stock) : "In Stock";
                  
                  return (
                    <div className="flex items-center gap-2">
                      <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                        inStock
                          ? stock !== null && stock <= 2
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {displayMessage}
                      </span>
                    </div>
                  );
                }
                // If product has no variants, show in stock
                if (!product.variants || product.variants.length === 0) {
                  return (
                    <div className="flex items-center gap-2">
                      <span className="text-sm px-3 py-1 rounded-full font-medium bg-blue-100 text-blue-700">
                        In Stock
                      </span>
                    </div>
                  );
                }
                // If product has variants but none selected, check if any are in stock
                const hasAvailableStock = product.variants.some(v => 
                  v.enabled && (v.stock === undefined || v.stock > 0)
                );
                return (
                  <div className="flex items-center gap-2">
                    <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                      hasAvailableStock
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {hasAvailableStock ? "Select variant to see stock" : "Out of Stock"}
                    </span>
                  </div>
                );
              })()}
            </div>

            {/* Variant Selection - Improved UI */}
            {showVariantSelection && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Select Variant</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {multipleSpecs.map(specName => {
                    const availableOptions = getAvailableOptions(specName);
                    // Check if this spec needs an info tooltip
                    const isAppearance = specName === 'Appearance (Phone Condition)' || specName === 'Appearance' || specName === 'appearance';
                    const isBattery = specName === 'Battery Condition' || specName === 'Battery' || specName === 'battery';
                    
                    // Display label without "(Phone Condition)" for appearance
                    const displayLabel = isAppearance ? 'Appearance' : specName;
                    
                    return (
                      <div key={specName} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 capitalize flex items-center gap-1">
                          {displayLabel}
                          {isAppearance && <InfoTooltip content={getAppearanceInfoText()} />}
                          {isBattery && <InfoTooltip content={getBatteryInfoText()} />}
                        </label>
                        <div className="relative">
                          <select
                            value={selectedSpecs[specName] || ''}
                            onChange={(e) => handleSpecChange(specName, e.target.value)}
                            className="w-full pl-4 pr-10 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all text-base appearance-none cursor-pointer"
                          >
                            <option value="">Select {specName}</option>
                            {availableOptions.map(option => {
                              const stock = getVariantStockForOption(specName, option);
                              const inStock = stock !== null && (stock === undefined || stock > 0);
                              return (
                                <option 
                                  key={option} 
                                  value={option}
                                  disabled={!inStock}
                                >
                                  {option} {!inStock && '(Out of Stock)'}
                                </option>
                              );
                            })}
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg
                              className="w-5 h-5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
              </div>
            )}

            {/* Product Details/Specs Display - When no variant selection */}
            {!showVariantSelection && selectedVariant && (() => {
              // Get appearance and battery from direct properties or from specs map
              const variantSpecs = selectedVariant.specs instanceof Map 
                ? Object.fromEntries(selectedVariant.specs) 
                : (selectedVariant.specs || {});
              
              const appearance = selectedVariant.appearance || 
                variantSpecs['Appearance (Phone Condition)'] || 
                variantSpecs['Appearance'] || 
                variantSpecs['appearance'];
              
              const battery = selectedVariant.battery || 
                variantSpecs['Battery Condition'] || 
                variantSpecs['Battery'] || 
                variantSpecs['battery'];
              
              return (
                <div className="p-4 border rounded-lg bg-gray-50">
                  <h4 className="font-semibold mb-3">Product Details:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Appearance Condition */}
                    {appearance && (
                      <div className="flex items-start gap-2">
                        <span className="text-sm font-medium text-gray-700 capitalize min-w-[100px] flex items-center gap-1">
                          Appearance:
                          <InfoTooltip content={getAppearanceInfoText()} />
                        </span>
                        <span className="text-sm text-gray-900 flex-1">
                          {appearance}
                        </span>
                      </div>
                    )}
                    
                    {/* Battery Condition */}
                    {battery && (
                      <div className="flex items-start gap-2">
                        <span className="text-sm font-medium text-gray-700 capitalize min-w-[100px] flex items-center gap-1">
                          Battery Condition:
                          <InfoTooltip content={getBatteryInfoText()} />
                        </span>
                        <span className="text-sm text-gray-900 flex-1">
                          {battery}
                        </span>
                      </div>
                    )}
                    
                    {/* Other specs - exclude appearance and battery from specs display */}
                    {Object.entries(variantSpecs)
                      .filter(([key]) => {
                        const keyLower = key.toLowerCase();
                        return !['Appearance (Phone Condition)', 'Appearance', 'appearance', 'Battery Condition', 'Battery', 'battery'].includes(key);
                      })
                      .slice(0, appearance || battery ? 4 : 6)
                      .map(([key, value]) => (
                        <div key={key} className="flex items-start gap-2">
                          <span className="text-sm font-medium text-gray-700 capitalize min-w-[100px]">
                            {key}:
                          </span>
                          <span className="text-sm text-gray-900 flex-1">
                            {value}
                          </span>
                        </div>
                      ))}
                    {/* Show product specs if variant specs are less than limit */}
                    {Object.keys(variantSpecs).filter(key => {
                      const keyLower = key.toLowerCase();
                      return !['Appearance (Phone Condition)', 'Appearance', 'appearance', 'Battery Condition', 'Battery', 'battery'].includes(key);
                    }).length < (appearance || battery ? 4 : 6) && product.specs && (() => {
                      const productSpecs = product.specs instanceof Map 
                        ? Object.fromEntries(product.specs) 
                        : product.specs;
                      const variantSpecKeys = Object.keys(variantSpecs);
                      const filteredVariantKeys = variantSpecKeys.filter(key => {
                        const keyLower = key.toLowerCase();
                        return !['Appearance (Phone Condition)', 'Appearance', 'appearance', 'Battery Condition', 'Battery', 'battery'].includes(key);
                      });
                      const maxSpecs = (appearance || battery ? 4 : 6) - filteredVariantKeys.length;
                      return Object.entries(productSpecs || {})
                        .filter(([key]) => !variantSpecKeys.includes(key))
                        .slice(0, maxSpecs)
                        .map(([key, value]) => (
                          <div key={key} className="flex items-start gap-2">
                            <span className="text-sm font-medium text-gray-700 capitalize min-w-[100px]">
                              {key}:
                            </span>
                            <span className="text-sm text-gray-900 flex-1">
                              {value}
                            </span>
                          </div>
                        ));
                    })()}
                  </div>
                {selectedVariant && (
                  <div className={`mt-3 p-3 rounded border ${
                    isVariantInStock(selectedVariant) ? 'bg-white' : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Availability:</span>
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        isVariantInStock(selectedVariant)
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {isVariantInStock(selectedVariant)
                          ? selectedVariant.stock !== undefined
                            ? `${selectedVariant.stock} in stock`
                            : "In Stock"
                          : "Out of Stock"}
                      </span>
                    </div>
                  </div>
                )}
                </div>
              );
            })()}

            {/* Product Specs Display - When no variants at all */}
            {!showVariantSelection && !selectedVariant && (() => {
              const productSpecs = product.specs instanceof Map 
                ? Object.fromEntries(product.specs) 
                : product.specs;
              return productSpecs && Object.keys(productSpecs).length > 0;
            })() && (
              <div className="p-4 border rounded-lg bg-gray-50">
                <h4 className="font-semibold mb-3">Product Details:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(
                    product.specs instanceof Map 
                      ? Object.fromEntries(product.specs) 
                      : product.specs
                  ).slice(0, 6).map(([key, value]) => (
                    <div key={key} className="flex items-start gap-2">
                      <span className="text-sm font-medium text-gray-700 capitalize min-w-[100px]">
                        {key}:
                      </span>
                      <span className="text-sm text-gray-900 flex-1">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Single Specs Display */}
            {/* {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-200">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-gray-600 text-sm mb-1 capitalize">{key}</p>
                    <p className="text-gray-900 font-medium">{value}</p>
                  </div>
                ))}
              </div>
            )} */}

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={
                (product.variants && product.variants.length > 0 && !selectedVariant) ||
                (selectedVariant && !isVariantInStock(selectedVariant))
              }
              className={`w-full py-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                (product.variants && product.variants.length > 0 && !selectedVariant) ||
                (selectedVariant && !isVariantInStock(selectedVariant))
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-black text-white hover:bg-gray-900'
              }`}
            >
              <span>
                {product.variants && product.variants.length > 0 && !selectedVariant 
                  ? "SELECT VARIANT"
                  : selectedVariant && !isVariantInStock(selectedVariant)
                  ? "OUT OF STOCK"
                  : "ADD TO CART"
                }
              </span>
              <ShoppingCart size={20} />
            </button>
          </div>
        </div>

        {/* Description & Specifications Section - Side by Side */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Description */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Description</h2>
            
            {product.description && (() => {
              // Function to format description - convert text inside " " to headers
              const formatDescription = (text) => {
                if (!text) return [];
                
                const parts = [];
                let currentIndex = 0;
                const regex = /"([^"]+)"/g;
                let match;
                
                while ((match = regex.exec(text)) !== null) {
                  // Add text before the quoted part
                  if (match.index > currentIndex) {
                    const textBefore = text.substring(currentIndex, match.index).trim();
                    if (textBefore) {
                      parts.push({
                        type: 'text',
                        content: textBefore
                      });
                    }
                  }
                  
                  // Add the quoted part as header
                  parts.push({
                    type: 'header',
                    content: match[1]
                  });
                  
                  currentIndex = regex.lastIndex;
                }
                
                // Add remaining text
                if (currentIndex < text.length) {
                  const textAfter = text.substring(currentIndex).trim();
                  if (textAfter) {
                    parts.push({
                      type: 'text',
                      content: textAfter
                    });
                  }
                }
                
                // If no quotes found, return original text as single text part
                if (parts.length === 0) {
                  parts.push({
                    type: 'text',
                    content: text
                  });
                }
                
                return parts;
              };
              
              const formattedParts = formatDescription(product.description);
              const specsCount = product.specs ? Object.keys(product.specs).length : 0;
              const specsHasScroll = specsCount > 10;
              
              // Helper to render parts
              const renderParts = (partsToRender) => {
                return partsToRender.map((part, idx) => {
                  if (part.type === 'header') {
                    return (
                      <h3 key={idx} className="text-xl font-bold text-gray-900 mt-4 mb-2 first:mt-0">
                        {part.content}
                      </h3>
                    );
                  } else {
                    return (
                      <p key={idx} className="mb-3 whitespace-pre-line">
                        {part.content}
                      </p>
                    );
                  }
                });
              };
              
              // Description max height should match specs max height (400px) when specs > 10
              const shouldApplyMaxHeight = specsHasScroll;
              
              return (
                <div className="text-gray-700 leading-relaxed">
                  <div className={`${shouldApplyMaxHeight ? 'max-h-[400px] overflow-y-auto' : ''}`}>
                    {renderParts(formattedParts)}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Right: Specifications */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h2>
            {product.specs && Object.keys(product.specs).length > 0 ? (
              <div className={`${Object.keys(product.specs).length > 10 ? 'max-h-[400px] overflow-y-auto pr-4' : ''}`}>
                <div className="space-y-3">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-start py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-sm font-medium text-gray-700 capitalize flex-1">
                        {key}
                      </span>
                      <span className="text-sm text-gray-900 text-right flex-1">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No specifications available.</p>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <ReviewSection productId={id} reviews={reviews} setReviews={setReviews} />
      </div>
    </div>
  );
}

// Review Section Component
function ReviewSection({ productId, reviews, setReviews }) {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("accessToken");
  const isAdmin = user?.user?.role === "admin";
  
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  
  // NEW: Edit review state
  const [editingReview, setEditingReview] = useState(null);
  const [editRating, setEditRating] = useState("");
  const [editComment, setEditComment] = useState("");
  const [editImageUrls, setEditImageUrls] = useState([]);
  const [editImageFiles, setEditImageFiles] = useState([]);
  const [editImagePreviews, setEditImagePreviews] = useState([]);
  const [editLoading, setEditLoading] = useState(false);
  
  // NEW: Lightbox state - track images array and current index
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // NEW: Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxImages.length === 0) return;

    const handleKeyDown = (e) => {
      if (lightboxImages.length <= 1) return;
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setLightboxIndex((prev) => (prev > 0 ? prev - 1 : lightboxImages.length - 1));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setLightboxIndex((prev) => (prev < lightboxImages.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setLightboxImages([]);
        setLightboxIndex(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImages.length]);
  
  // NEW: Show more reviews state
  const [showAllReviews, setShowAllReviews] = useState(false);
  
  // NEW: Handle image file selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imageFiles.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }
    
    const newFiles = [...imageFiles, ...files];
    setImageFiles(newFiles);
    
    // Create previews
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(newPreviews);
  };
  
  // NEW: Remove image before upload
  const removeImage = (index) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
    // Revoke object URL
    URL.revokeObjectURL(imagePreviews[index]);
  };
  
  // NEW: Upload images to Cloudinary (no auth required for review images)
  const uploadImages = async (files) => {
    if (!files || files.length === 0) return [];
    
    const formData = new FormData();
    files.forEach(file => formData.append("images", file));
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/upload/upload-guest`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 240000
        }
      );
      
      return response.data.images || [];
    } catch (err) {
      console.error("Error uploading images:", err);
      toast.error("Failed to upload images");
      return [];
    }
  };
  
  // NEW: Handle edit image change
  const handleEditImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + editImageUrls.length + editImageFiles.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }
    
    const newFiles = [...editImageFiles, ...files];
    setEditImageFiles(newFiles);
    
    // Create previews
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setEditImagePreviews(newPreviews);
  };
  
  // NEW: Remove edit image
  const removeEditImage = (index, isExisting = false) => {
    if (isExisting) {
      const newUrls = editImageUrls.filter((_, i) => i !== index);
      setEditImageUrls(newUrls);
    } else {
      const newFiles = editImageFiles.filter((_, i) => i !== index);
      const newPreviews = editImagePreviews.filter((_, i) => i !== index);
      setEditImageFiles(newFiles);
      setEditImagePreviews(newPreviews);
      URL.revokeObjectURL(editImagePreviews[index]);
    }
  };
  
  // NEW: Start editing review
  const startEditReview = (review) => {
    setEditingReview(review._id || review.id);
    setEditRating(review.rating.toString());
    setEditComment(review.comment || "");
    setEditImageUrls(review.images || []);
    setEditImageFiles([]);
    setEditImagePreviews([]);
  };
  
  // NEW: Cancel edit
  const cancelEdit = () => {
    setEditingReview(null);
    setEditRating("");
    setEditComment("");
    setEditImageUrls([]);
    setEditImageFiles([]);
    editImagePreviews.forEach(url => URL.revokeObjectURL(url));
    setEditImagePreviews([]);
  };
  
  // NEW: Save edited review
  const handleSaveEdit = async () => {
    if (!editingReview) return;
    
    setEditLoading(true);
    try {
      // Upload new images
      const newImageUrls = editImageFiles.length > 0 
        ? await uploadImages(editImageFiles)
        : [];
      
      // Combine existing and new images
      const allImageUrls = [...editImageUrls, ...newImageUrls];
      
      // Update review
      await axios.put(
        `${import.meta.env.VITE_API_URL}/products/${productId}/reviews/${editingReview}`,
        {
          rating: parseInt(editRating),
          comment: editComment,
          images: allImageUrls,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Refresh reviews
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/products/${productId}/reviews`);
      setReviews(res.data);
      
      // Cleanup
      editImagePreviews.forEach(url => URL.revokeObjectURL(url));
      cancelEdit();
      
      toast.success("Review updated successfully!");
    } catch (err) {
      console.error("Error updating review:", err);
      toast.error("Failed to update review");
    } finally {
      setEditLoading(false);
    }
  };
  
  // NEW: Delete review
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/products/${productId}/reviews/${reviewId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Refresh reviews
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/products/${productId}/reviews`);
      setReviews(res.data);
      
      toast.success("Review deleted successfully!");
    } catch (err) {
      console.error("Error deleting review:", err);
      toast.error("Failed to delete review");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Upload images if any (no login required)
      let uploadedImageUrls = [];
      if (imageFiles.length > 0) {
        uploadedImageUrls = await uploadImages(imageFiles);
      }
      
      await axios.post(`${import.meta.env.VITE_API_URL}/products/${productId}/reviews`, {
        rating,
        comment,
        name,
        email,
        images: uploadedImageUrls,
      });
      
      // Cleanup
      setRating("");
      setComment("");
      setName("");
      setEmail("");
      setImageFiles([]);
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
      setImagePreviews([]);
      setImageUrls([]);
      
      // Refresh reviews
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/products/${productId}/reviews`);
      setReviews(res.data);
      
      toast.success("Review submitted successfully!");
    } catch (err) {
      console.error("Error submitting review:", err);
      toast.error("Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  // NEW: Sort reviews by rating (highest first)
  const sortedReviews = [...reviews].sort((a, b) => b.rating - a.rating);
  
  // NEW: Show only 3 reviews initially
  const displayedReviews = showAllReviews ? sortedReviews : sortedReviews.slice(0, 3);

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="mt-12 bg-white rounded-lg border border-gray-200 p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Reviews</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={`${
                      i < Math.floor(averageRating) 
                        ? "fill-orange-400 text-orange-400" 
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-semibold text-gray-900">{averageRating}</span>
            </div>
            <span className="text-gray-600">({reviews.length} reviews)</span>
          </div>
        </div>
      </div>

      {/* Review Form */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Write a Review</h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Name Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <User size={20} />
              </div>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all text-base"
                required
              />
            </div>

            {/* Email Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail size={20} />
              </div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all text-base"
              />
            </div>
          </div>

          {/* Rating Select */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Star size={20} />
            </div>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all text-base appearance-none cursor-pointer"
              required
            >
              <option value="">Select Rating</option>
              {[1, 2, 3, 4, 5].map((r) => (
                <option key={r} value={r}>
                  {'⭐'.repeat(r)} {r} Star{r > 1 ? "s" : ""}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* Comment Textarea */}
          <div className="relative">
            <div className="absolute left-4 top-4 text-gray-400">
              <MessageSquare size={20} />
            </div>
            <textarea
              placeholder="Share your experience with this product..."
              rows={5}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all text-base resize-none"
              required
            />
          </div>

          {/* NEW: Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Images (Optional, Max 5)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
              id="review-images"
              disabled={imageFiles.length >= 5}
            />
            <label
              htmlFor="review-images"
              className={`inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors ${
                imageFiles.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <ImageIcon size={20} className="text-gray-600" />
              <span className="text-sm text-gray-700">Choose Images</span>
            </label>
            
            {/* Image Previews */}
            {(imagePreviews.length > 0 || imageUrls.length > 0) && (
              <div className="mt-3 flex flex-wrap gap-3">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-900 transition-colors text-base disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "SUBMITTING..." : "SUBMIT REVIEW"}
          </button>
        </form>
      </div>

      {/* Display Reviews */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Customer Reviews ({reviews.length})</h3>
        
        {displayedReviews.length > 0 ? (
          <>
            <div className="space-y-6">
              {displayedReviews.map((review, index) => {
                const reviewId = review._id || review.id;
                const isEditing = editingReview === reviewId;
                const reviewImages = (review.images || []).filter(url => url && typeof url === 'string' && url.trim() !== '');
                
                // Debug: Log review data to see what we're getting
                if (reviewImages.length > 0) {
                  console.log('Review images:', reviewImages);
                }
                
                return (
                  <div key={reviewId || index} className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
                    {isEditing ? (
                      // Edit Mode
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900">Edit Review</h4>
                          <button
                            onClick={cancelEdit}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <X size={20} />
                          </button>
                        </div>
                        
                        {/* Edit Rating */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                          <select
                            value={editRating}
                            onChange={(e) => setEditRating(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                          >
                            {[1, 2, 3, 4, 5].map((r) => (
                              <option key={r} value={r}>{r} Star{r > 1 ? "s" : ""}</option>
                            ))}
                          </select>
                        </div>
                        
                        {/* Edit Comment */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                          <textarea
                            value={editComment}
                            onChange={(e) => setEditComment(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 resize-none"
                          />
                        </div>
                        
                        {/* Edit Images */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Images (Max 5)
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleEditImageChange}
                            className="hidden"
                            id={`edit-images-${reviewId}`}
                            disabled={editImageUrls.length + editImageFiles.length >= 5}
                          />
                          <label
                            htmlFor={`edit-images-${reviewId}`}
                            className={`inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors ${
                              editImageUrls.length + editImageFiles.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            <ImageIcon size={16} className="text-gray-600" />
                            <span className="text-sm text-gray-700">Add Images</span>
                          </label>
                          
                          {/* Existing Images */}
                          {editImageUrls.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-3">
                              {editImageUrls.map((url, idx) => (
                                <div key={idx} className="relative group">
                                  <img
                                    src={url}
                                    alt={`Review ${idx + 1}`}
                                    className="w-24 h-24 object-cover rounded-lg border border-gray-300 cursor-pointer"
                                    onClick={() => {
                                      setLightboxImages(editImageUrls);
                                      setLightboxIndex(idx);
                                    }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeEditImage(idx, true)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* New Image Previews */}
                          {editImagePreviews.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-3">
                              {editImagePreviews.map((preview, idx) => (
                                <div key={idx} className="relative group">
                                  <img
                                    src={preview}
                                    alt={`Preview ${idx + 1}`}
                                    className="w-24 h-24 object-cover rounded-lg border border-gray-300"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeEditImage(idx, false)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-3">
                          <button
                            onClick={handleSaveEdit}
                            disabled={editLoading}
                            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                          >
                            {editLoading ? "Saving..." : "Save Changes"}
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Display Mode
                      <>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                          <div className="flex items-center gap-3 mb-2 sm:mb-0">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                              <User size={20} className="text-gray-400" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {review.name || "Anonymous"}
                              </p>
                              <p className="text-gray-500 text-sm">
                                {new Date(review.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={16}
                                  className={`${
                                    i < review.rating 
                                      ? "fill-orange-400 text-orange-400" 
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed mb-3">{review.comment}</p>
                        
                        {/* NEW: Display Review Images - Styled exactly like form preview */}
                        {reviewImages && reviewImages.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-3">
                            {reviewImages.map((imageUrl, imgIndex) => {
                              // Skip invalid URLs
                              if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
                                return null;
                              }
                              
                              const validImages = reviewImages.filter(url => url && typeof url === 'string' && url.trim() !== '');
                              
                              return (
                                <div
                                  key={imgIndex}
                                  className="relative group cursor-pointer"
                                  onClick={() => {
                                    setLightboxImages(validImages);
                                    setLightboxIndex(validImages.indexOf(imageUrl));
                                  }}
                                >
                                  <img
                                    src={imageUrl}
                                    alt={`Review image ${imgIndex + 1}`}
                                    className="w-24 h-24 object-cover rounded-lg border border-gray-300"
                                    onError={(e) => {
                                      console.error('Image failed to load:', imageUrl);
                                      e.target.style.display = 'none';
                                    }}
                                    onLoad={() => {
                                      console.log('Image loaded successfully:', imageUrl);
                                    }}
                                    loading="lazy"
                                  />
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* NEW: Show More Button */}
            {!showAllReviews && sortedReviews.length > 3 && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowAllReviews(true)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Show More ({sortedReviews.length - 3} more reviews)
                </button>
              </div>
            )}
            
            {/* NEW: Show Less Button */}
            {showAllReviews && sortedReviews.length > 3 && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowAllReviews(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Show Less
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">No reviews yet</p>
            <p className="text-gray-400 mt-2">Be the first to share your experience!</p>
          </div>
        )}
      </div>
      
      {/* NEW: Lightbox Modal with Navigation */}
      {lightboxImages.length > 0 && lightboxIndex >= 0 && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => {
            setLightboxImages([]);
            setLightboxIndex(0);
          }}
        >
          {/* Close Button */}
          <button
            onClick={() => {
              setLightboxImages([]);
              setLightboxIndex(0);
            }}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <X size={32} />
          </button>

          {/* Previous Button */}
          {lightboxImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev > 0 ? prev - 1 : lightboxImages.length - 1));
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black bg-opacity-50 rounded-full p-2"
            >
              <ChevronLeft size={32} />
            </button>
          )}

          {/* Next Button */}
          {lightboxImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev < lightboxImages.length - 1 ? prev + 1 : 0));
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black bg-opacity-50 rounded-full p-2"
            >
              <ChevronRight size={32} />
            </button>
          )}

          {/* Image */}
          <img
            src={lightboxImages[lightboxIndex]}
            alt={`Review image ${lightboxIndex + 1}`}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Image Counter */}
          {lightboxImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black bg-opacity-50 rounded-full px-4 py-2 text-sm z-10">
              {lightboxIndex + 1} / {lightboxImages.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
}