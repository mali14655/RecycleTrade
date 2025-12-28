import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const ProductHeader = ({ 
  totalProducts = 0, 
  onSortChange,
  sortBy = "featured"
}) => {
  const [showSortOptions, setShowSortOptions] = useState(false);

  const sortOptions = [
    { value: "no-filter", label: "No Filter" },
    { value: "newest", label: "Newest First" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
  ];

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

      {/* Sort Options */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Sort by:</span>
        <div className="relative">
          <button
            onClick={() => setShowSortOptions(!showSortOptions)}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:border-gray-400 transition-colors"
          >
            {sortOptions.find(opt => opt.value === sortBy)?.label || "No Filter"}
            <ChevronDown size={16} className={`transition-transform ${showSortOptions ? 'rotate-180' : ''}`} />
          </button>

          {showSortOptions && (
            <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[180px]">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                    sortBy === option.value ? 'bg-gray-50 font-medium' : ''
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductHeader;