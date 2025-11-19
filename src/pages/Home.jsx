// pages/Home.jsx - UPDATED to use new UI components
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import axios from "axios";

// Import new UI components
import Hero from "../components/Hero";
import FeaturedProducts from "../components/FeaturedProducts";
import WhyChoose from "../components/WhyChoose";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";

export default function Home() {
  const { user } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/products?featured=true&limit=8`);
        setFeaturedProducts(res.data);
      } catch (error) {
        console.error("Error fetching featured products:", error);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div>
      <Hero />
      <FeaturedProducts products={featuredProducts} loading={loading} />
      <WhyChoose />
      <Testimonials />
      <FAQ />
    </div>
  );
}