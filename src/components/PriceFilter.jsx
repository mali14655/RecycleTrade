import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const PriceFilter = ({ onPriceChange, resetTrigger }) => {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedRadio, setSelectedRadio] = useState("all");
  
  // NEW: Reset filter when resetTrigger changes (when search is set)
  useEffect(() => {
    if (resetTrigger !== undefined && resetTrigger !== null && resetTrigger > 0) {
      setMinPrice("");
      setMaxPrice("");
      setSelectedRadio("all");
      // Reset price filter in parent (all prices)
      onPriceChange?.({ min: 0, max: 10000 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetTrigger]); // Only depend on resetTrigger, not onPriceChange to avoid infinite loops
  
  // NEW: Check if price filter is active
  const isPriceFilterActive = selectedRadio !== "all" || 
                              (minPrice && parseInt(minPrice) > 0) || 
                              (maxPrice && parseInt(maxPrice) < 10000);
  
  // NEW: Clear price filter
  const handleClearPrice = () => {
    setMinPrice("");
    setMaxPrice("");
    setSelectedRadio("all");
    onPriceChange?.({ min: 0, max: 10000 });
  };

  const priceOptions = [
    { label: "All Price", value: "all" },
    { label: "Under $20", value: "0-20" },
    { label: "$25 to $100", value: "25-100" },
    { label: "$100 to $300", value: "100-300" },
    { label: "$300 to $500", value: "300-500" },
    { label: "$500 to $1,000", value: "500-1000" },
    { label: "$1,000 to $10,000", value: "1000-10000" },
  ];

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

  // Radio button change handler
  const handleRadioChange = (value) => {
    setSelectedRadio(value);
    
    if (value === "all") {
      setMinPrice("");
      setMaxPrice("");
      onPriceChange?.({ min: 0, max: 10000 });
    } else {
      const [min, max] = value.split("-").map(Number);
      setMinPrice(min.toString());
      setMaxPrice(max.toString());
      onPriceChange?.({ min, max });
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">PRICE RANGE</h3>
        {/* NEW: Clear button when price filter is active */}
        {isPriceFilterActive && (
          <button
            onClick={handleClearPrice}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Clear price filter"
          >
            <X size={16} className="text-gray-600" />
          </button>
        )}
      </div>

      {/* Manual Input Fields */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => {
              setMinPrice(e.target.value);
              setSelectedRadio(""); // Clear radio when manual input
            }}
            placeholder="Min"
            className="w-full p-2 border border-gray-300 rounded text-sm"
          />
        </div>
        <span className="text-gray-400">-</span>
        <div className="flex-1">
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(e.target.value);
              setSelectedRadio(""); // Clear radio when manual input
            }}
            placeholder="Max"
            className="w-full p-2 border border-gray-300 rounded text-sm"
          />
        </div>
      </div>

      {/* Price Radio Buttons */}
      <div className="space-y-2">
        {priceOptions.map((option) => (
          <label key={option.value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="price"
              value={option.value}
              checked={selectedRadio === option.value}
              onChange={(e) => handleRadioChange(e.target.value)}
              className="w-4 h-4 accent-black"
            />
            <span className="text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>

      {/* Current Range Display - Show when price filter is active */}
      {isPriceFilterActive && (
        <div className="mt-3 p-2 bg-gray-50 rounded flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-600">Selected Range:</p>
            <p className="text-sm font-semibold">
              ${minPrice || "0"} - ${maxPrice || "10000"}
            </p>
          </div>
          <button
            onClick={handleClearPrice}
            className="p-1 hover:bg-gray-200 rounded transition-colors ml-2"
            title="Clear"
          >
            <X size={14} className="text-gray-600" />
          </button>
        </div>
      )}
    </div>
  );
};

export default PriceFilter;