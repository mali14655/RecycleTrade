// components/ProductCard.jsx
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div 
      className="border p-4 rounded shadow hover:shadow-lg transition cursor-pointer"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      <img
        src={product.images?.[0] || "https://via.placeholder.com/300x200"}
        alt={product.name}
        className="w-full h-48 object-cover mb-2 rounded"
      />
      <h3 className="font-semibold text-lg">{product.name}</h3>
      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
      <p className="text-2xl font-semibold text-blue-600 mb-2">${product.price}</p>
      <p className="text-sm text-gray-500 mb-2">Stock: {product.quantity}</p>
      <p className="text-sm text-gray-500 capitalize mb-3">Category: {product.category}</p>

      <button
        onClick={handleAddToCart}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Add to Cart
      </button>
    </div>
  );
}