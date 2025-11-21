import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";

export default function ProductCatalog() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/products`);
      setProducts(res.data);
    };
    fetchProducts();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
