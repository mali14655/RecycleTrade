// components/FeaturedProductManager.jsx (Optional - for admin panel)
import React, { useState, useEffect } from "react";
import axios from "axios";

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
    } catch (error) {
      console.error("Error toggling featured:", error);
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
            <p>Price: ${product.price}</p>
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