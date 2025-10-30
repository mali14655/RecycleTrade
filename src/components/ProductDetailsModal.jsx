// import React from "react";

// export default function ProductDetailsModal({ isOpen, onClose, product }) {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//       <div className="bg-white p-6 rounded w-11/12 md:w-2/3 max-h-[90vh] overflow-y-auto">
//         <button
//           onClick={onClose}
//           className="float-right text-red-600 font-bold"
//         >
//           X
//         </button>
//         <h2 className="text-2xl font-semibold mb-4">{product.name}</h2>
//         <div className="flex flex-col md:flex-row gap-4">
//           <img
//             src={product.images[0] || "https://via.placeholder.com/300"}
//             alt={product.name}
//             className="w-full md:w-1/2 object-cover rounded"
//           />
//           <div className="md:w-1/2">
//             <p className="mb-2"><strong>Price:</strong> ${product.price}</p>
//             <p className="mb-2"><strong>Category:</strong> {product.category}</p>
//             <p className="mb-2"><strong>Quantity:</strong> {product.quantity}</p>
//             <p className="mb-2"><strong>Description:</strong> {product.description}</p>
//             <p className="mb-2"><strong>Seller:</strong> {product.sellerId.name}</p>

//             <button className="mt-4 w-full bg-green-600 text-white py-2 rounded">
//               Add to Cart
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function ProductDetailsModal({ isOpen, onClose, product }) {
  const { addToCart } = useContext(CartContext);

  if (!isOpen) return null;

  const handleAddToCart = () => {
    addToCart(product, 1);
    // You can add a toast notification here later
  };

  const safeImageUrl = product.images?.[0] || "https://via.placeholder.com/400x300/4A5568/FFFFFF?text=No+Image+Available";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{product.name}</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row max-h-[calc(90vh-80px)] overflow-hidden">
          {/* Image Section */}
          <div className="lg:w-1/2 p-6 flex items-center justify-center bg-gray-50">
            <img
              src={safeImageUrl}
              alt={product.name}
              className="w-full h-64 lg:h-80 object-cover rounded-xl shadow-lg"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/400x300/4A5568/FFFFFF?text=No+Image+Available";
              }}
            />
          </div>

          {/* Details Section */}
          <div className="lg:w-1/2 p-6 overflow-y-auto">
            {/* Price and Badge */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-3xl font-bold text-green-600">${product.price}</span>
                <span className="text-sm text-gray-500 ml-2">USD</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                product.sellerId?.role === 'admin' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {product.sellerId?.role === 'admin' ? 'Company' : 'Seller'}
              </span>
            </div>

            {/* Product Info Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600 font-medium">Category</p>
                <p className="text-lg font-semibold text-gray-800 capitalize">{product.category || "Not specified"}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600 font-medium">Stock Available</p>
                <p className="text-lg font-semibold text-gray-800">{product.quantity || 0} units</p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">
                {product.description || "No description available for this product."}
              </p>
            </div>

            {/* Seller Info */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Seller Information</h3>
              <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {product.sellerId?.name?.charAt(0)?.toUpperCase() || 'S'}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">{product.sellerId?.name || "Unknown Seller"}</p>
                  <p className="text-sm text-gray-500">{product.sellerId?.email || "No contact information"}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m0 0L17 21" />
                </svg>
                <span>Add to Cart</span>
              </button>
              
              <button
                onClick={onClose}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}