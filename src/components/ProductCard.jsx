// import React from "react";
// import { useNavigate } from "react-router-dom";

// export default function ProductCard({ product }) {
//   const navigate = useNavigate();

//   return (
//     <div className="border p-3 rounded shadow hover:shadow-lg transition">
//       <img
//         src={product.images[0] || "https://via.placeholder.com/150"}
//         alt={product.name}
//         className="w-full h-48 object-cover mb-2 rounded"
//       />
//       <h3 className="font-semibold text-lg">{product.name}</h3>
//       <p className="text-gray-600">${product.price}</p>

//       <button
//         onClick={() => navigate(`/product/${product._id}`)}
//         className="mt-2 w-full bg-blue-600 text-white py-1 rounded"
//       >
//         View Details
//       </button>
//     </div>
//   );
// }

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
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      <div className="relative">
        <img
          src={product.images?.[0] || "https://via.placeholder.com/300"}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            product.sellerId?.role === 'admin' 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {product.sellerId?.role === 'admin' ? 'Company' : 'Seller'}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-gray-800">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-green-600">
            ${product.price}
          </span>
          <span className="text-sm text-gray-500">
            Stock: {product.quantity}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            By {product.sellerId?.name || 'Unknown'}
          </span>
          <button
            onClick={handleAddToCart}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}