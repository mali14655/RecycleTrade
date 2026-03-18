import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const Breadcrumb = ({ currentPage }) => {
  const { t } = useLanguage();
  const location = useLocation();
  const { id } = useParams();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Function to format the breadcrumb name
  const formatBreadcrumbName = (name, index, isLast) => {
    // If currentPage prop is provided for the last item, use it
    if (isLast && currentPage) {
      return currentPage;
    }
    
    // For product IDs, show a generic name
    if (name.length === 24 && /^[0-9a-fA-F]{24}$/.test(name)) {
      return "Product Details";
    }
    
    // Default formatting
    return name.replace(/-/g, " ");
  };

  return (
    <nav className="bg-gray-50 border-b border-gray-200 py-4">
      <div className="max-w-[90%] mx-auto px-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          {/* Home Link */}
          <Link
            to="/"
            className="flex items-center gap-1 hover:text-gray-900 transition-colors"
          >
            <Home size={16} />
            <span>{t("breadcrumb.home")}</span>
          </Link>

          {/* Breadcrumb Items */}
          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;
            const formattedName = formatBreadcrumbName(name, index, isLast);

            return (
              <div key={name} className="flex items-center gap-2">
                <ChevronRight size={16} className="text-gray-400" />
                {isLast ? (
                  <span className="text-gray-900 font-medium capitalize">
                    {formattedName}
                  </span>
                ) : (
                  <Link
                    to={routeTo}
                    className="hover:text-gray-900 transition-colors capitalize"
                  >
                    {formattedName}
                  </Link>
                )}
              </div>
            );
          })}

          {/* Fallback for products page */}
          {pathnames.length === 0 && (
            <>
              <ChevronRight size={16} className="text-gray-400" />
              <span className="text-gray-900 font-medium">Products</span>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Breadcrumb;