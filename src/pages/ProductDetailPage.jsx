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
        
        if (res.data.variants && res.data.variants.length > 0) {
          const firstEnabledVariant = res.data.variants.find(v => v.enabled) || res.data.variants[0];
          setSelectedVariant(firstEnabledVariant);
          
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

  const handleSpecChange = (specName, value) => {
    console.log("Spec changed:", specName, value);
    const newSelectedSpecs = {
      ...selectedSpecs,
      [specName]: value
    };
    
    setSelectedSpecs(newSelectedSpecs);
    
    const matchingVariant = product.variants.find(variant => 
      variant.enabled &&
      Object.keys(newSelectedSpecs).every(key => 
        variant.specs[key] === newSelectedSpecs[key]
      )
    );
    
    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
      console.log("Variant selected:", matchingVariant);
    } else {
      setSelectedVariant(null);
      console.log("No variant found for specs:", newSelectedSpecs);
    }
  };

  const getDisplayImages = () => {
    if (selectedVariant?.images && selectedVariant.images.length > 0) {
      return selectedVariant.images;
    }
    return product?.images || [];
  };

  const handleAddToCart = async () => {
    // For products without variants
    if (!product.variants || product.variants.length === 0) {
      addToCart(product, 1);
      console.log("Simple product added to cart:", product);
      return;
    }

    // For products with variants
    if (!selectedVariant) {
      alert("Please select an available variant");
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
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  if (!product) return <p className="text-center mt-10 text-red-500">Product not found</p>;

  const displayImages = getDisplayImages();
  const multipleSpecs = product.variants ? 
    Object.keys(product.variants[0]?.specs || {}) : [];
  const showVariantSelection = multipleSpecs.length > 0;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <div className="mb-4">
            <img
              src={displayImages[activeImage] || "https://via.placeholder.com/600"}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
          
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

          {/* Price */}
          <div className="mb-6">
            <p className="text-3xl font-bold text-green-600 mb-2">
              ${selectedVariant ? selectedVariant.price : product.price}
            </p>
            
            {selectedVariant && (
              <div>
                <p className="text-sm text-gray-500">
                  Selected: {Object.entries(selectedVariant.specs).map(([key, value]) => (
                    <span key={key} className="mr-2">
                      {key}: <strong>{value}</strong>
                    </span>
                  ))}
                </p>
              </div>
            )}
            
            <p className="text-gray-600">
              <strong>Seller:</strong> {product.sellerId?.name || "Unknown"}
            </p>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.variants && product.variants.length > 0 && !selectedVariant}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200 text-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {product.variants && product.variants.length > 0 && !selectedVariant ? "Select Variant" : "Add to Cart"}
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