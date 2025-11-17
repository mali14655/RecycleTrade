import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReviewSection from "../components/ReviewSection";
import { CartContext } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSpecs, setSelectedSpecs] = useState({});
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log("Fetching product:", id);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/products/${id}`);
        setProduct(res.data);
        console.log("Product fetched:", res.data);
        
        // Set default selected variant (first enabled variant that is in stock)
        if (res.data.variants && res.data.variants.length > 0) {
          const firstEnabledVariant = res.data.variants.find(v => v.enabled && v.quantity > 0) || res.data.variants[0];
          setSelectedVariant(firstEnabledVariant);
          
          // Initialize selected specs
          if (firstEnabledVariant.specs) {
            setSelectedSpecs(firstEnabledVariant.specs);
          }
          console.log("Default variant set:", firstEnabledVariant);
        } else {
          setSelectedVariant(null);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Get available options for each multiple spec (only in-stock variants)
  const getAvailableOptions = (specName) => {
    if (!product?.variants) return [];
    
    const options = new Set();
    product.variants.forEach(variant => {
      if (variant.enabled && variant.quantity > 0 && variant.specs[specName]) {
        options.add(variant.specs[specName]);
      }
    });
    
    return Array.from(options);
  };

  // Handle spec selection change
  const handleSpecChange = (specName, value) => {
    console.log("Spec changed:", specName, value);
    const newSelectedSpecs = {
      ...selectedSpecs,
      [specName]: value
    };
    
    setSelectedSpecs(newSelectedSpecs);
    
    // Find matching variant that is in stock
    const matchingVariant = product.variants.find(variant => 
      variant.enabled && 
      variant.quantity > 0 &&
      Object.keys(newSelectedSpecs).every(key => 
        variant.specs[key] === newSelectedSpecs[key]
      )
    );
    
    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
      console.log("Variant selected:", matchingVariant);
    } else {
      setSelectedVariant(null);
      console.log("No in-stock variant found for specs:", newSelectedSpecs);
    }
  };

  // Get current display images
  const getDisplayImages = () => {
    if (selectedVariant?.images && selectedVariant.images.length > 0) {
      return selectedVariant.images;
    }
    return product?.images || [];
  };

  // Get stock status text and color
  const getStockStatus = () => {
    if (!product) return { text: "", color: "" };
    
    if (product.variants && product.variants.length > 0) {
      if (!selectedVariant) {
        return { text: "Select variant", color: "text-gray-600" };
      }
      if (selectedVariant.quantity === 0) {
        return { text: "Out of Stock", color: "text-red-600 font-semibold" };
      }
      if (selectedVariant.quantity === 1) {
        return { text: "Only 1 left", color: "text-orange-600 font-semibold" };
      }
      if (selectedVariant.quantity <= 2) {
        return { text: `Only ${selectedVariant.quantity} left`, color: "text-orange-600" };
      }
      return { text: "In Stock", color: "text-green-600" };
    } else {
      if (product.quantity === 0) {
        return { text: "Out of Stock", color: "text-red-600 font-semibold" };
      }
      if (product.quantity === 1) {
        return { text: "Only 1 left", color: "text-orange-600 font-semibold" };
      }
      if (product.quantity <= 2) {
        return { text: `Only ${product.quantity} left`, color: "text-orange-600" };
      }
      return { text: "In Stock", color: "text-green-600" };
    }
  };

  const handleAddToCart = async () => {
    // For products without variants
    if (!product.variants || product.variants.length === 0) {
      // Check stock for simple product
      try {
        const checkStock = await axios.post(
          `${import.meta.env.VITE_API_URL}/orders/${product._id}/check-stock`,
          { 
            quantity: 1 
          }
        );

        if (!checkStock.data.available) {
          alert(`Only ${checkStock.data.availableQuantity} items available in stock`);
          return;
        }

        addToCart(product, 1);
        console.log("Simple product added to cart:", product);
        return;
      } catch (error) {
        console.error("Error checking stock:", error);
        alert("Error checking product availability");
        return;
      }
    }

    // For products with variants
    if (!selectedVariant) {
      alert("Please select an available variant");
      return;
    }

    // Check stock before adding to cart
    try {
      const checkStock = await axios.post(
        `${import.meta.env.VITE_API_URL}/orders/${product._id}/check-stock`,
        { 
          variantId: selectedVariant._id, 
          quantity: 1 
        }
      );

      if (!checkStock.data.available) {
        alert(`Only ${checkStock.data.availableQuantity} items available in stock`);
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
      console.log("Variant product added to cart:", productToAdd);
    } catch (error) {
      console.error("Error checking stock:", error);
      alert("Error checking product availability");
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  if (!product) return <p className="text-center mt-10 text-red-500">Product not found</p>;

  const displayImages = getDisplayImages();
  const multipleSpecs = product.variants ? 
    Object.keys(product.variants[0]?.specs || {}) : [];
  const stockStatus = getStockStatus();

  // Check if product is in stock
  const isProductInStock = product.variants && product.variants.length > 0 
    ? product.variants.some(v => v.enabled && v.quantity > 0)
    : product.quantity > 0;

  // Determine if we should show variant selection
  const showVariantSelection = multipleSpecs.length > 0 && isProductInStock;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          {/* Main Image */}
          <div className="mb-4">
            <img
              src={displayImages[activeImage] || "https://via.placeholder.com/600"}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
          
          {/* Thumbnail Gallery */}
          {displayImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {displayImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`border-2 rounded-lg overflow-hidden ${
                    activeImage === index ? "border-blue-500" : "border-gray-200"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
          <p className="text-gray-500 mb-2 capitalize">{product.category}</p>
          <p className="text-gray-700 mb-4 leading-relaxed">
            {product.description}
          </p>

          {/* Stock Status */}
          <div className="mb-4">
            <p className={`text-lg font-semibold ${stockStatus.color}`}>
              {stockStatus.text}
            </p>
          </div>

          {/* Single Specs Display */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold mb-2">Specifications:</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="text-sm">
                    <span className="font-medium capitalize">{key}:</span> {value}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Variant Selection */}
          {showVariantSelection && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h4 className="font-semibold mb-3">Select Variant:</h4>
              {multipleSpecs.map(specName => (
                <div key={specName} className="mb-3">
                  <label className="block text-sm font-medium mb-2 capitalize">
                    {specName}:
                  </label>
                  <select
                    value={selectedSpecs[specName] || ''}
                    onChange={(e) => handleSpecChange(specName, e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select {specName}</option>
                    {getAvailableOptions(specName).map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}

          {/* Price and Stock */}
          <div className="mb-6">
            <p className="text-3xl font-bold text-green-600 mb-2">
              ${selectedVariant ? selectedVariant.price : product.price}
            </p>
            
            {selectedVariant ? (
              <div>
                <p className={`text-gray-600 mb-2 ${
                  selectedVariant.quantity === 0 ? 'text-red-600 font-semibold' : ''
                }`}>
                  <strong>Stock:</strong> {selectedVariant.quantity} available
                </p>
                <p className="text-sm text-gray-500">
                  Selected: {Object.entries(selectedVariant.specs).map(([key, value]) => (
                    <span key={key} className="mr-2">
                      {key}: <strong>{value}</strong>
                    </span>
                  ))}
                </p>
              </div>
            ) : (
              <p className={`text-gray-600 mb-2 ${
                product.quantity === 0 ? 'text-red-600 font-semibold' : ''
              }`}>
                <strong>Stock:</strong> {product.quantity} available
              </p>
            )}
            
            <p className="text-gray-600">
              <strong>Seller:</strong> {product.sellerId?.name || "Unknown"}
            </p>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!isProductInStock || (product.variants && product.variants.length > 0 && !selectedVariant)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200 text-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {!isProductInStock ? "Out of Stock" : 
             (product.variants && product.variants.length > 0 && !selectedVariant) ? "Select Variant" : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-12 border-t pt-6">
        <h3 className="text-2xl font-semibold mb-4">Customer Reviews</h3>
        <ReviewSection productId={id} />
      </div>
    </div>
  );
}