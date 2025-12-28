import React, { useState, useEffect, useCallback, useRef } from "react";
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
    sortBy: 'no-filter'
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  
  // NEW: Track when search is set to reset price filter
  const [priceFilterResetKey, setPriceFilterResetKey] = useState(0);
  
  // Track previous filter values to detect actual filter changes
  const prevFiltersRef = useRef({
    search: filters.search,
    category: filters.category,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice
  });

  // NEW: Track if we're updating from URL to prevent circular updates
  const isUpdatingFromURLRef = useRef(false);
  const isUpdatingURLFromFiltersRef = useRef(false);

  // NEW: Helper function to apply sorting to products
  const applySorting = (productsToSort, sortByValue) => {
    if (!productsToSort || productsToSort.length === 0) return productsToSort;
    
    // If "no-filter" is selected, return products as-is (original order)
    if (sortByValue === 'no-filter') {
      return productsToSort;
    }
    
    // Apply sorting based on sortBy value
    return [...productsToSort].sort((a, b) => {
      switch (sortByValue) {
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
  };

  // Fetch function without useCallback to avoid dependency issues
  const fetchProducts = async (currentFilters) => {
    try {
      setLoading(true);
      const params = {};
      
      // NEW: Only send search param if it has a non-empty value
      // If search is empty/whitespace, don't send it - this shows all products
      const searchValue = currentFilters.search?.trim() || '';
      if (searchValue) {
        params.search = searchValue; // Full search query
      }
      // If search is empty, don't include it in params - backend will return all products
      
      // Send category only if search is not present
      if (!searchValue) {
        if (currentFilters.category) params.category = currentFilters.category;
      }
      
      // Price filters can work with search
      if (currentFilters.minPrice) params.minPrice = currentFilters.minPrice;
      if (currentFilters.maxPrice) params.maxPrice = currentFilters.maxPrice;

      console.log("Fetching products with params:", params);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/products`, { params });
      
      // NEW: Always apply sorting after fetching products
      const sortedProducts = applySorting(res.data || [], currentFilters.sortBy || 'no-filter');
      setProducts(sortedProducts);
      
      console.log(`Fetched ${sortedProducts.length} products`);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Update URL when filters change (without triggering fetch)
  // Only update if we're NOT currently updating from URL to prevent infinite loops
  useEffect(() => {
    // Skip if we're updating from URL to prevent circular updates
    if (isUpdatingFromURLRef.current) {
      return;
    }

    const newSearchParams = new URLSearchParams();
    
    // NEW: If search is present and not empty, include it and clear category/price
    const searchValue = filters.search?.trim() || '';
    if (searchValue) {
      newSearchParams.set('search', searchValue);
      // Don't include category and price when search is active
    } else {
      // Search is empty - include category and price if they exist
      if (filters.category) newSearchParams.set('category', filters.category);
      if (filters.minPrice) newSearchParams.set('minPrice', filters.minPrice);
      if (filters.maxPrice) newSearchParams.set('maxPrice', filters.maxPrice);
    }
    
    // Check if URL actually changed before updating
    const currentURL = searchParams.toString();
    const newURL = newSearchParams.toString();
    
    if (currentURL !== newURL) {
      isUpdatingURLFromFiltersRef.current = true;
      setSearchParams(newSearchParams);
      // Reset flag after a short delay
      setTimeout(() => {
        isUpdatingURLFromFiltersRef.current = false;
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search, filters.category, filters.minPrice, filters.maxPrice]); // Only depend on individual filter values

  // Set category from Hero section when component mounts
  useEffect(() => {
    if (heroCategory && heroCategory !== filters.category) {
      setFilters(prev => ({ ...prev, category: heroCategory }));
    }
  }, [heroCategory]);

  // Sync filters with URL params when URL changes (e.g., from Navbar search)
  // Only sync if URL changed from external source (Navbar), not from our own filter updates
  useEffect(() => {
    // Skip if we're updating URL from filters to prevent circular updates
    if (isUpdatingURLFromFiltersRef.current) {
      return;
    }

    // Get full search query from URL (decode to handle special characters)
    const urlSearch = decodeURIComponent(searchParams.get('search') || '');
    const urlCategory = searchParams.get('category') || '';
    const urlMinPrice = searchParams.get('minPrice') || '';
    const urlMaxPrice = searchParams.get('maxPrice') || '';

    // Only update if URL params actually changed (avoid infinite loops)
    if (
      urlSearch !== filters.search ||
      urlCategory !== filters.category ||
      urlMinPrice !== filters.minPrice ||
      urlMaxPrice !== filters.maxPrice
    ) {
      // Set flag to prevent URL update effect from running
      isUpdatingFromURLRef.current = true;
      
      setFilters(prev => {
        const newFilters = {
          ...prev,
          search: urlSearch // Use full search query, not truncated
        };
        
        // NEW: If search is present in URL, clear category and price filters
        if (urlSearch && urlSearch.trim()) {
          newFilters.category = '';
          newFilters.minPrice = '';
          newFilters.maxPrice = '';
          // Trigger price filter reset
          setPriceFilterResetKey(prev => prev + 1);
        } else {
          // Only set category and price if search is not present
          newFilters.category = urlCategory || prev.category; // Preserve hero category if URL doesn't have one
          newFilters.minPrice = urlMinPrice;
          newFilters.maxPrice = urlMaxPrice;
        }
        
        return newFilters;
      });

      // Reset flag after state update
      setTimeout(() => {
        isUpdatingFromURLRef.current = false;
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); // Only depend on searchParams to avoid infinite loops

  // Track if this is the initial mount
  const isInitialMount = useRef(true);

  // Main effect for fetching products and handling page reset
  useEffect(() => {
    const filtersChanged = 
      prevFiltersRef.current.search !== filters.search ||
      prevFiltersRef.current.category !== filters.category ||
      prevFiltersRef.current.minPrice !== filters.minPrice ||
      prevFiltersRef.current.maxPrice !== filters.maxPrice;

    // Reset to page 1 when filters actually change (not on initial mount)
    if (filtersChanged && !isInitialMount.current) {
      setCurrentPage(1);
    }

    // Mark initial mount as complete
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }

    // ALWAYS fetch products when filters change (debounced for performance)
    // Increased debounce for search to match Navbar debounce (400ms)
    const timeoutId = setTimeout(() => {
      console.log("Fetching products due to filter change:", {
        search: filters.search,
        category: filters.category,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        sortBy: filters.sortBy
      });
      fetchProducts(filters);
    }, 300); // 300ms debounce - allows search debounce from Navbar (400ms) to complete first
    
    // Update ref to track current filter values (for next comparison)
    prevFiltersRef.current = {
      search: filters.search,
      category: filters.category,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice
    };
    
    return () => clearTimeout(timeoutId);
  }, [filters.search, filters.category, filters.minPrice, filters.maxPrice]); // Depend on individual values, NOT the entire filters object

  // Handle category change
  // NEW: When category is selected, clear search filter
  const handleCategoryChange = (category) => {
    setFilters(prev => ({ 
      ...prev, 
      category: category,
      search: '' // NEW: Clear search when category is selected
    }));
  };

  // Handle price change - use useCallback to prevent infinite loops
  const handlePriceChange = useCallback((priceRange) => {
    setFilters(prev => {
      const newMinPrice = priceRange.min > 0 ? priceRange.min.toString() : '';
      const newMaxPrice = priceRange.max < 10000 ? priceRange.max.toString() : '';
      
      // Only update if values actually changed to prevent unnecessary re-renders
      if (prev.minPrice === newMinPrice && prev.maxPrice === newMaxPrice) {
        return prev; // Return same object if no change
      }
      
      return {
        ...prev,
        minPrice: newMinPrice,
        maxPrice: newMaxPrice
      };
    });
  }, []); // Empty dependency array - function doesn't depend on any props or state

  // Handle search change
  // NEW: When search is entered, clear category and price filters
  const handleSearchChange = (search) => {
    setFilters(prev => {
      const newFilters = { ...prev, search };
      const prevSearch = prev.search || '';
      const newSearch = search || '';
      
      // NEW: If search is not empty, clear category and price filters
      if (newSearch && newSearch.trim()) {
        newFilters.category = '';
        newFilters.minPrice = '';
        newFilters.maxPrice = '';
        
        // NEW: Trigger price filter reset only when search goes from empty to non-empty
        if (!prevSearch || !prevSearch.trim()) {
          setPriceFilterResetKey(prev => prev + 1);
        }
      }
      
      return newFilters;
    });
  };

  // Handle sort change - use useCallback to prevent infinite loops
  const handleSortChange = useCallback((sortBy) => {
    setFilters(prev => {
      // Only update if sortBy actually changed
      if (prev.sortBy === sortBy) {
        return prev;
      }
      return { ...prev, sortBy };
    });
    
    // NEW: Apply sorting to current products immediately
    // Use functional update to ensure we have latest products
    setProducts(prevProducts => {
      if (prevProducts.length === 0) return prevProducts;
      return applySorting(prevProducts, sortBy);
    });
  }, []); // Empty deps - function doesn't depend on external values

  // NEW: Re-apply sorting whenever sortBy changes (ensures sort is always applied)
  // This ensures that even if products are updated from other sources, sorting is maintained
  useEffect(() => {
    if (products.length > 0 && filters.sortBy) {
      const sortedProducts = applySorting(products, filters.sortBy);
      // Only update if sorting actually changed the order
      const currentSorted = JSON.stringify(products.map(p => p._id));
      const newSorted = JSON.stringify(sortedProducts.map(p => p._id));
      
      if (currentSorted !== newSorted) {
        setProducts(sortedProducts);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.sortBy]); // Only depend on sortBy to avoid infinite loops

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate pagination
  const totalPages = Math.ceil(products.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  // Safety check: Only reset if current page is beyond available pages after products load
  useEffect(() => {
    if (!loading && products.length > 0 && totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [loading, products.length, totalPages, currentPage]);

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
            {/* NEW: Reset PriceFilter when search is set */}
            <PriceFilter 
              onPriceChange={handlePriceChange}
              resetTrigger={priceFilterResetKey}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <ProductHeader 
              totalProducts={products.length}
              onSortChange={handleSortChange}
              sortBy={filters.sortBy}
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;