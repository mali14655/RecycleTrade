import React from "react";

export default function ProductDetailsModal({ isOpen, onClose, product }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded w-11/12 md:w-2/3 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="float-right text-red-600 font-bold"
        >
          X
        </button>
        <h2 className="text-2xl font-semibold mb-4">{product.name}</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <img
            src={product.images[0] || "https://via.placeholder.com/300"}
            alt={product.name}
            className="w-full md:w-1/2 object-cover rounded"
          />
          <div className="md:w-1/2">
            <p className="mb-2"><strong>Price:</strong> ${product.price}</p>
            <p className="mb-2"><strong>Category:</strong> {product.category}</p>
            <p className="mb-2"><strong>Quantity:</strong> {product.quantity}</p>
            <p className="mb-2"><strong>Description:</strong> {product.description}</p>
            <p className="mb-2"><strong>Seller:</strong> {product.sellerId.name}</p>

            <button className="mt-4 w-full bg-green-600 text-white py-2 rounded">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
