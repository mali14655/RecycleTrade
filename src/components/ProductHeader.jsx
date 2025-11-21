import React, { useState, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";

const ProductHeader = ({ 
  totalProducts = 0, 
  onSortChange,
  onSearchChange,
  sortBy = "featured",
  initialSearch = ""
}) => {
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "newest", label: "Newest First" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
  ];

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearchChange?.(searchQuery);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery, onSearchChange]);

  const handleSortChange = (value) => {
    onSortChange?.(value);
    setShowSortOptions(false);
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 p-4 bg-white rounded-lg border border-gray-200 gap-4">
      {/* Results Count */}
      <div className="flex-1">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{totalProducts}</span> products
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
      </div>

    </div>
  );
};

export default ProductHeader;