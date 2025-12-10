import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function FeaturedProductManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/products`);
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = async (productId, currentStatus) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/products/${productId}/featured`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      
      // Update local state
      setProducts(products.map(p => 
        p._id === productId ? { ...p, featured: !currentStatus } : p
      ));

      // Success toast
      toast.success(
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {!currentStatus ? 'Added to Featured' : 'Removed from Featured'}
            </p>
            <p className="text-sm text-gray-600">
              {products.find(p => p._id === productId)?.name}
            </p>
          </div>
        </div>
      );
      
    } catch (error) {
      console.error("Error toggling featured:", error);
      
      // Error toast
      toast.error(
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Failed to Update</p>
            <p className="text-sm text-gray-600">Please try again</p>
          </div>
        </div>
      );
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Featured Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map(product => (
          <div key={product._id} className="border p-4 rounded">
            <h3 className="font-bold">{product.name}</h3>
            <p>Price: €{product.price}</p>
            <p>Category: {product.category}</p>
            <button
              onClick={() => toggleFeatured(product._id, product.featured)}
              className={`mt-2 px-4 py-2 rounded ${
                product.featured 
                  ? 'bg-red-500 text-white' 
                  : 'bg-green-500 text-white'
              }`}
            >
              {product.featured ? 'Remove from Featured' : 'Add to Featured'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}