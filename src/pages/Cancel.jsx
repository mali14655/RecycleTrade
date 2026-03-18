import React from "react";
import { Link } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb"; // Add this import
import { useLanguage } from "../context/LanguageContext";

const Cancel = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-red-50">
      {/* Add Breadcrumb */}
      <Breadcrumb />
      
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">❌</span>
          </div>
          <h1 className="text-3xl font-bold text-red-600 mb-4">{t("cancel.title")}</h1>
          <p className="text-gray-700 mb-2">{t("cancel.subtitle")}</p>
          <p className="text-gray-600 mb-8"></p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/checkout"
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              {t("cancel.tryAgain")}
            </Link>
            <Link
              to="/"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              {t("cancel.goHome")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cancel;