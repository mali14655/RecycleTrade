import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ 
  currentPage = 1, 
  totalPages = 1, 
  onPageChange,
  totalProducts = 0,
  productsPerPage = 12 
}) => {
  const startItem = (currentPage - 1) * productsPerPage + 1;
  const endItem = Math.min(currentPage * productsPerPage, totalProducts);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange?.(page);
    }
  };

  const getVisiblePages = () => {
    const pages = [];
    const showPages = 5; // Number of page buttons to show
    
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    let endPage = Math.min(totalPages, startPage + showPages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < showPages) {
      startPage = Math.max(1, endPage - showPages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-6 mt-6 border-t border-gray-200">
      {/* Results Info */}
      <div className="mb-4 sm:mb-0">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold">{startItem}-{endItem}</span> of{" "}
          <span className="font-semibold">{totalProducts}</span> products
        </p>
      </div>

      {/* Page Navigation */}
      <div className="flex items-center gap-1">
        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
          <span>Previous</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1 mx-2">
          {getVisiblePages().map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                currentPage === page
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-gray-100 border border-gray-300"
              }`}
            >
              {page}
            </button>
          ))}
          
          {/* Ellipsis for more pages */}
          {totalPages > getVisiblePages()[getVisiblePages().length - 1] && (
            <span className="px-2 text-gray-500">...</span>
          )}
        </div>

        {/* Next Button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span>Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;