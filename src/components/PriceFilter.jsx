import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const PriceFilter = ({ onPriceChange, resetTrigger }) => {
  const { t } = useLanguage();
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  
  // NEW: Reset filter when resetTrigger changes (when search is set)
  useEffect(() => {
    if (resetTrigger !== undefined && resetTrigger !== null && resetTrigger > 0) {
      setMinPrice("");
      setMaxPrice("");
      // Reset price filter in parent (all prices)
      onPriceChange?.({ min: 0, max: 10000 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetTrigger]); // Only depend on resetTrigger, not onPriceChange to avoid infinite loops
  
  // NEW: Check if price filter is active
  const isPriceFilterActive = (minPrice && parseInt(minPrice) > 0) || 
                              (maxPrice && parseInt(maxPrice) < 10000);
  
  // NEW: Clear price filter
  const handleClearPrice = () => {
    setMinPrice("");
    setMaxPrice("");
    onPriceChange?.({ min: 0, max: 10000 });
  };

  // Handle manual input changes with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Call onPriceChange directly to avoid stale closure issues
      if (minPrice || maxPrice) {
        onPriceChange?.({
          min: minPrice ? parseInt(minPrice) : 0,
          max: maxPrice ? parseInt(maxPrice) : 10000
        });
      } else {
        // If both empty, reset to all prices
        onPriceChange?.({ min: 0, max: 10000 });
      }
    }, 500); // 500ms debounce
    
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minPrice, maxPrice]); // Don't include onPriceChange to avoid infinite loops

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{t("productsPage.priceRangeTitle")}</h3>
        {/* NEW: Clear button when price filter is active */}
        {isPriceFilterActive && (
          <button
            onClick={handleClearPrice}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title={t("productsPage.clearPrice")}
          >
            <X size={16} className="text-gray-600" />
          </button>
        )}
      </div>

      {/* Manual Input Fields */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-1">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder={t("productsPage.min")}
            className="w-full p-2 border border-gray-300 rounded text-sm"
          />
        </div>
        <span className="text-gray-400">-</span>
        <div className="flex-1">
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder={t("productsPage.max")}
            className="w-full p-2 border border-gray-300 rounded text-sm"
          />
        </div>
      </div>

      {/* Selected Range Display - Show when price filter is active */}
      {isPriceFilterActive && (
        <div className="mt-3 p-2 bg-gray-50 rounded flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-600">{t("productsPage.selectedRange")}</p>
            <p className="text-sm font-semibold">
              €{minPrice || "0"} - €{maxPrice || "10000"}
            </p>
          </div>
          <button
            onClick={handleClearPrice}
            className="p-1 hover:bg-gray-200 rounded transition-colors ml-2"
            title={t("productsPage.clear")}
          >
            <X size={14} className="text-gray-600" />
          </button>
        </div>
      )}
    </div>
  );
};

export default PriceFilter;