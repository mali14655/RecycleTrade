import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const ProductHeader = ({ 
  totalProducts = 0, 
  onSortChange,
  sortBy = "featured"
}) => {
  const { t } = useLanguage();
  const [showSortOptions, setShowSortOptions] = useState(false);

  const sortOptions = [
    { value: "no-filter", label: t("productsPage.sortOptions.noFilter") },
    { value: "newest", label: t("productsPage.sortOptions.newest") },
    { value: "price-low", label: t("productsPage.sortOptions.priceLow") },
    { value: "price-high", label: t("productsPage.sortOptions.priceHigh") },
    { value: "rating", label: t("productsPage.sortOptions.rating") },
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
          {t("productsPage.showingProducts", { count: totalProducts })}
        </p>
      </div>

      {/* Sort Options */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">{t("productsPage.sortBy")}:</span>
        <div className="relative">
          <button
            onClick={() => setShowSortOptions(!showSortOptions)}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:border-gray-400 transition-colors"
          >
            {sortOptions.find(opt => opt.value === sortBy)?.label || t("productsPage.sortOptions.noFilter")}
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