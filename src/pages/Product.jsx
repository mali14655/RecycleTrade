import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/products`).then(res => setProducts(res.data));
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map(p => (
          <div key={p._id} className="border p-4 rounded shadow hover:shadow-lg transition">
            <h3 className="font-bold text-lg">{p.title}</h3>
            <p className="text-gray-700">{p.description}</p>
            <p className="font-semibold mt-1">Price: ${p.price}</p>
            <p className="text-sm text-gray-500">Type: {p.type}</p>
            <Link to={`/products/${p._id}`} className="text-blue-600 mt-2 inline-block">View</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
