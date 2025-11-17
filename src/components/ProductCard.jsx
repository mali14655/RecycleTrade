// components/ProductCard.jsx
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  // Calculate if product is in stock
  const isInStock = product.variants && product.variants.length > 0 
    ? product.variants.some(v => v.enabled && v.quantity > 0)
    : product.quantity > 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isInStock) {
      addToCart(product, 1);
      console.log("Product added to cart:", product.name);
    } else {
      console.log("Product out of stock:", product.name);
    }
  };

  return (
    <div 
      className={`border p-4 rounded shadow hover:shadow-lg transition cursor-pointer ${
        !isInStock ? 'opacity-60' : ''
      }`}
      onClick={() => navigate(`/product/${product._id}`)}
    >
      <img
        src={product.images?.[0] || "https://via.placeholder.com/300x200"}
        alt={product.name}
        className="w-full h-48 object-cover mb-2 rounded"
      />
      
      {/* Stock Status Badge */}
      {!isInStock && (
        <div className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded inline-block mb-2">
          Out of Stock
        </div>
      )}
      
      <h3 className="font-semibold text-lg">{product.name}</h3>
      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
      <p className="text-2xl font-semibold text-blue-600 mb-2">${product.price}</p>
      
      {/* Stock Information */}
      {product.variants && product.variants.length > 0 ? (
        <p className="text-sm text-gray-500 mb-2">
          Variants: {product.variants.filter(v => v.enabled && v.quantity > 0).length} in stock
        </p>
      ) : (
        <p className="text-sm text-gray-500 mb-2">
          Stock: {product.quantity} {product.quantity === 0 && '(Out of Stock)'}
        </p>
      )}
      
      <p className="text-sm text-gray-500 capitalize mb-3">Category: {product.category}</p>

      <button
        onClick={handleAddToCart}
        disabled={!isInStock}
        className={`w-full py-2 rounded transition ${
          isInStock 
            ? 'bg-blue-600 text-white hover:bg-blue-700' 
            : 'bg-gray-400 text-gray-200 cursor-not-allowed'
        }`}
      >
        {isInStock ? 'Add to Cart' : 'Out of Stock'}
      </button>
    </div>
  );
}