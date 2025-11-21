// pages/Home.jsx - Add search functionality to FeaturedProducts
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { useSearch } from "../context/SearchContext"; // Add this
import axios from "axios";

// Import components
import Hero from "../components/Hero";
import FeaturedProducts from "../components/FeaturedProducts";
import WhyChoose from "../components/WhyChoose";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";

export default function Home() {
  const { user } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const { searchQuery } = useSearch(); // Get search query from context
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        let url = `${import.meta.env.VITE_API_URL}/products?featured=true&limit=8`;
        
        // If there's a search query, include it in the API call
        if (searchQuery.trim()) {
          url += `&search=${encodeURIComponent(searchQuery)}`;
        }

        const res = await axios.get(url);
        setFeaturedProducts(res.data);
        setFilteredProducts(res.data);
      } catch (error) {
        console.error("Error fetching featured products:", error);
        setFeaturedProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, [searchQuery]); // Refetch when search query changes

  // Filter products locally if we already have them (optional)
  useEffect(() => {
    if (searchQuery.trim() && featuredProducts.length > 0) {
      const query = searchQuery.toLowerCase();
      const filtered = featuredProducts.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(featuredProducts);
    }
  }, [searchQuery, featuredProducts]);

  return (
    <div>
      <Hero />
      <FeaturedProducts 
        products={filteredProducts} 
        loading={loading} 
        searchQuery={searchQuery}
      />
      <WhyChoose />
      <Testimonials />
      <FAQ />
    </div>
  );
}