// // import React from 'react';
// // import ProductCatalog from '../components/ProductCatalog';
// // export default function Home() {
// //   return (
// //     <div>
// //       <h1 className="text-2xl font-bold">Welcome to RecycleTrade</h1>
// //       <p className="mt-2 text-gray-600">Browse products — company & verified sellers.</p>
// //       <ProductCatalog/>
// //     </div>
// //   );
// // }

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import ProductCard from "../components/ProductCard";
// import { Link } from "react-router-dom";

// export default function Home() {
//   const [featuredProducts, setFeaturedProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchFeaturedProducts = async () => {
//       try {
//         const res = await axios.get(`${import.meta.env.VITE_API_URL}/products`);
//         // Show first 6 products as featured
//         setFeaturedProducts(res.data.slice(0, 6));
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFeaturedProducts();
//   }, []);

//   return (
//     <div className="space-y-12">
//       {/* Hero Section */}
//       <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-2xl p-8 md:p-12">
//         <div className="max-w-4xl mx-auto text-center">
//           <h1 className="text-4xl md:text-6xl font-bold mb-6">
//             Welcome to RecycleTrade
//           </h1>
//           <p className="text-xl md:text-2xl mb-8 opacity-90">
//             Discover quality recycled and refurbished products. Sustainable
//             shopping made easy.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <Link
//               to="/products"
//               className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
//             >
//               Shop Now
//             </Link>
//             <Link
//               to="/register"
//               className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
//             >
//               Start Selling
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* Featured Products */}
//       <section>
//         <div className="flex justify-between items-center mb-8">
//           <h2 className="text-3xl font-bold text-gray-800">
//             Featured Products
//           </h2>
//           <Link
//             to="/products"
//             className="text-green-600 hover:text-green-700 font-semibold"
//           >
//             View All →
//           </Link>
//         </div>

//         {loading ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {[...Array(6)].map((_, i) => (
//               <div key={i} className="animate-pulse">
//                 <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
//                 <div className="bg-gray-200 h-4 rounded mb-2"></div>
//                 <div className="bg-gray-200 h-4 rounded w-2/3"></div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {featuredProducts.map((product) => (
//               <ProductCard key={product._id} product={product} />
//             ))}
//           </div>
//         )}
//       </section>

//       {/* Features Section */}
//       <section className="bg-white rounded-2xl p-8 border border-gray-200">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           <div className="text-center">
//             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <svg
//                 className="w-8 h-8 text-green-600"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
//                 />
//               </svg>
//             </div>
//             <h3 className="text-xl font-semibold mb-2">Quality Assured</h3>
//             <p className="text-gray-600">
//               All products are thoroughly inspected and verified for quality.
//             </p>
//           </div>

//           <div className="text-center">
//             <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <svg
//                 className="w-8 h-8 text-blue-600"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
//                 />
//               </svg>
//             </div>
//             <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
//             <p className="text-gray-600">
//               Your payments are protected with industry-leading security.
//             </p>
//           </div>

//           <div className="text-center">
//             <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <svg
//                 className="w-8 h-8 text-purple-600"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
//                 />
//               </svg>
//             </div>
//             <h3 className="text-xl font-semibold mb-2">Eco-Friendly</h3>
//             <p className="text-gray-600">
//               Join us in reducing waste and promoting sustainability.
//             </p>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }


// pages/Home.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // Fetch ONLY featured products
        const featuredRes = await axios.get(`${import.meta.env.VITE_API_URL}/products?featured=true&limit=8`);
        
        // Fetch all products for categories
        const categoriesRes = await axios.get(`${import.meta.env.VITE_API_URL}/products?limit=100`);
        
        // Get unique categories from all products
        const allProducts = categoriesRes.data;
        const uniqueCategories = [...new Set(allProducts.map(product => product.category).filter(Boolean))].slice(0, 6);
        
        setFeaturedProducts(featuredRes.data);
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching home data:", error);
        setFeaturedProducts([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-2xl p-8 md:p-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to RecycleTrade
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Discover quality recycled and refurbished products. Sustainable shopping made easy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Shop Now
            </Link>
            <Link
              to="/register"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
            >
              Start Selling
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              Shop by Category
            </h2>
            <Link
              to="/products"
              className="text-green-600 hover:text-green-700 font-semibold"
            >
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/products?category=${category.toLowerCase()}`}
                className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:border-green-500 hover:shadow-md transition-all duration-200"
              >
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 text-sm capitalize">{category}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Featured Products
          </h2>
          <div className="flex gap-4">
            <Link
              to="/products"
              className="text-green-600 hover:text-green-700 font-semibold"
            >
              View All →
            </Link>
            {/* Admin can add this link later to manage featured products */}
            {/* <Link
              to="/admin/featured"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Manage Featured
            </Link> */}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {!loading && featuredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No featured products yet</h3>
            <p className="text-gray-600">Check back later for featured products or browse all products.</p>
            <Link
              to="/products"
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors inline-block mt-4"
            >
              Browse All Products
            </Link>
          </div>
        )}
      </section>

      {/* Stats Section */}
      <section className="bg-white rounded-2xl p-8 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">1000+</div>
            <p className="text-gray-600">Products Available</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
            <p className="text-gray-600">Happy Customers</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
            <p className="text-gray-600">Verified Sellers</p>
          </div>
        </div>
      </section>
    </div>
  );
}