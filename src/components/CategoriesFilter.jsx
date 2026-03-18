import React, { useState, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import axios from "axios";
import { useLanguage } from "../context/LanguageContext";

const CategoriesFilter = ({ onCategoryChange, selectedCategory = "" }) => {
  const { t } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  
  // NEW: Clear category filter
  const handleClearCategory = () => {
    onCategoryChange?.("");
  };

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/categories`);
        setCategories(res.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Fallback categories if API fails
        setCategories([
          { _id: '1', name: 'Mobile Phones' },
          { _id: '2', name: 'Laptops' },
          { _id: '3', name: 'Tablets' },
          { _id: '4', name: 'Accessories' },
          { _id: '5', name: 'Cameras' },
          { _id: '6', name: 'Headphones' },
        ]);
      }
    };

    fetchCategories();
  }, []);

  const handleCategorySelect = (category) => {
    const categoryName = category ? category.name : "";
    onCategoryChange?.(categoryName);
    setIsOpen(false);
  };

  const selectedCategoryObj = categories.find(cat => cat.name === selectedCategory);

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{t("productsPage.categoriesTitle")}</h3>
        {/* NEW: Clear button when category is selected */}
        {selectedCategory && (
          <button
            onClick={handleClearCategory}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title={t("productsPage.clearCategory")}
          >
            <X size={16} className="text-gray-600" />
          </button>
        )}
      </div>

      {/* Dropdown Select */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:border-gray-400 transition-colors"
        >
          <span className="capitalize">
            {selectedCategoryObj ? selectedCategoryObj.name : t("productsPage.allCategories")}
          </span>
          <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
            {/* All Categories Option */}
            <button
              onClick={() => handleCategorySelect(null)}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors border-b border-gray-100"
            >
              {t("productsPage.allCategories")}
            </button>
            
            {/* Category Options */}
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => handleCategorySelect(category)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors capitalize ${
                  selectedCategory === category.name ? 'bg-black text-white hover:bg-gray-800' : 'text-gray-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected category display */}
      {selectedCategory && (
        <div className="mt-3 p-2 bg-gray-50 rounded flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-600">{t("productsPage.selectedCategory")}</p>
            <p className="text-sm font-semibold capitalize">{selectedCategory}</p>
          </div>
          <button
            onClick={handleClearCategory}
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

export default CategoriesFilter;