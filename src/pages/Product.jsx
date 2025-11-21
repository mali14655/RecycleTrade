import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import axios from "axios";
import Breadcrumb from "../components/Breadcrumb";
import PriceFilter from "../components/PriceFilter";
import CategoriesFilter from "../components/CategoriesFilter";
import ProductHeader from "../components/ProductHeader";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  // Get category from URL or location state (from Hero section)
  const urlCategory = searchParams.get('category') || '';
  const heroCategory = location.state?.category || '';

  // Filters state
  const [filters, setFilters] = useState({
    category: heroCategory || urlCategory || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    search: searchParams.get('search') || '',
    sortBy: 'featured'
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Debounced fetch function
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;

      console.log("Fetching with params:", params);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/products`, { params });
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters.search, filters.category, filters.minPrice, filters.maxPrice]);

  // Update URL when filters change (without triggering fetch)
  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    
    if (filters.category) newSearchParams.set('category', filters.category);
    if (filters.minPrice) newSearchParams.set('minPrice', filters.minPrice);
    if (filters.maxPrice) newSearchParams.set('maxPrice', filters.maxPrice);
    if (filters.search) newSearchParams.set('search', filters.search);
    
    setSearchParams(newSearchParams);
  }, [filters, setSearchParams]);

  // Set category from Hero section when component mounts
  useEffect(() => {
    if (heroCategory && heroCategory !== filters.category) {
      setFilters(prev => ({ ...prev, category: heroCategory }));
    }
  }, [heroCategory]);

  // Debounced fetch effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 300); // 300ms debounce to prevent continuous fetching
    
    return () => clearTimeout(timeoutId);
  }, [fetchProducts]);

  // Handle category change
  const handleCategoryChange = (category) => {
    setFilters(prev => ({ 
      ...prev, 
      category: category 
    }));
    setCurrentPage(1);
  };

  // Handle price change
  const handlePriceChange = (priceRange) => {
    setFilters(prev => ({
      ...prev,
      minPrice: priceRange.min > 0 ? priceRange.min.toString() : '',
      maxPrice: priceRange.max < 10000 ? priceRange.max.toString() : ''
    }));
    setCurrentPage(1);
  };

  // Handle search change
  const handleSearchChange = (search) => {
    setFilters(prev => ({ ...prev, search }));
    setCurrentPage(1);
  };

  // Handle sort change
  const handleSortChange = (sortBy) => {
    setFilters(prev => ({ ...prev, sortBy }));
    // Sort locally instead of fetching again
    const sortedProducts = [...products].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'rating':
          const ratingA = a.reviews?.reduce((sum, review) => sum + review.rating, 0) / (a.reviews?.length || 1);
          const ratingB = b.reviews?.reduce((sum, review) => sum + review.rating, 0) / (b.reviews?.length || 1);
          return ratingB - ratingA;
        default:
          return 0;
      }
    });
    setProducts(sortedProducts);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumb />

      <div className="max-w-[90%] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 space-y-4">
            <CategoriesFilter 
              onCategoryChange={handleCategoryChange} 
              selectedCategory={filters.category}
            />
            <PriceFilter onPriceChange={handlePriceChange} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <ProductHeader 
              totalProducts={products.length}
              onSortChange={handleSortChange}
              onSearchChange={handleSearchChange}
              sortBy={filters.sortBy}
              initialSearch={filters.search}
            />

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                    <div className="bg-gray-200 h-4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                    <div className="bg-gray-200 h-6 rounded w-1/2 mt-2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {currentProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {products.length > 0 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    totalProducts={products.length}
                    productsPerPage={productsPerPage}
                  />
                )}
              </>
            )}

            {!loading && products.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms.</p>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Products;