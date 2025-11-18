

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: "",
    maxPrice: "",
    condition: "",
    search: ""
  });

  // Fetch products when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 500); // Debounce API calls
    
    return () => clearTimeout(timeoutId);
  }, [filters]);

  useEffect(() => {
    // Update filters when URL params change
    const category = searchParams.get('category');
    if (category !== filters.category) {
      setFilters(prev => ({ ...prev, category: category || '' }));
    }
  }, [searchParams]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Build query parameters properly
      const params = {};
      
      // Only add filters that have values
      if (filters.category) params.category = filters.category;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.condition) params.condition = filters.condition;
      if (filters.search) params.search = filters.search;

      console.log("Fetching with params:", params); // Debug log

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/products`, {
        params: params
      });
      
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    
    // Update URL for category filter
    if (key === 'category') {
      const newSearchParams = new URLSearchParams();
      if (value) {
        newSearchParams.set('category', value);
      }
      setSearchParams(newSearchParams);
    }
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      minPrice: "",
      maxPrice: "",
      condition: "",
      search: ""
    });
    setSearchParams({});
  };

  // Test if filters are working by logging
  useEffect(() => {
    console.log("Current filters:", filters);
  }, [filters]);

  const categories = [
    "electronics", "furniture", "clothing", "books", 
    "sports", "home", "other"
  ];

  const conditions = [
    { value: "new", label: "Brand New" },
    { value: "like_new", label: "Like New" },
    { value: "good", label: "Good" },
    { value: "fair", label: "Fair" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Products</h1>
          <p className="text-gray-600">Discover quality recycled and refurbished items</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  Clear All
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Products
                </label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Search by name..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Category */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Condition */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition
                </label>
                <select
                  value={filters.condition}
                  onChange={(e) => handleFilterChange('condition', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Any Condition</option>
                  {conditions.map(cond => (
                    <option key={cond.value} value={cond.value}>
                      {cond.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range ($)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      min="0"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Active Filters Display */}
              {(filters.category || filters.condition || filters.minPrice || filters.maxPrice || filters.search) && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-800 mb-2">Active Filters:</p>
                  <div className="flex flex-wrap gap-2">
                    {filters.search && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Search: "{filters.search}"
                      </span>
                    )}
                    {filters.category && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Category: {filters.category}
                      </span>
                    )}
                    {filters.condition && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Condition: {conditions.find(c => c.value === filters.condition)?.label}
                      </span>
                    )}
                    {(filters.minPrice || filters.maxPrice) && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Price: ${filters.minPrice || "0"}-${filters.maxPrice || "∞"}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                    <div className="bg-gray-200 h-4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <p className="text-gray-600">
                    Showing {products.length} product{products.length !== 1 ? 's' : ''}
                    {filters.category && ` in ${filters.category}`}
                  </p>
                  
                  {/* Results count with active filters */}
                  {(filters.search || filters.condition || filters.minPrice || filters.maxPrice) && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-green-600 hover:text-green-700 font-medium"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>

                {products.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
                    <p className="text-gray-600 mb-4">Try adjusting your filters or search terms.</p>
                    <button
                      onClick={clearFilters}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}