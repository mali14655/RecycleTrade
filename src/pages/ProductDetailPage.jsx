// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import ReviewSection from "../components/ReviewSection";
// import { CartContext } from "../context/CartContext";
// import { useContext } from "react";

// export default function ProductDetails() {
//   const { id } = useParams();
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const { addToCart } = useContext(CartContext);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const res = await axios.get(
//           `${import.meta.env.VITE_API_URL}/products/${id}`
//         );
//         setProduct(res.data);
//       } catch (err) {
//         console.error("Error fetching product:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProduct();
//   }, [id]);

//   if (loading)
//     return <p className="text-center mt-10 text-gray-500">Loading...</p>;

//   if (!product)
//     return <p className="text-center mt-10 text-red-500">Product not found</p>;

//   return (
//     <div className="max-w-5xl mx-auto p-6">
//       <div className="flex flex-col md:flex-row gap-8">
//         {/* Product Image */}
//         {/* <img
//           src={product.images?.[0] || "https://via.placeholder.com/400"}
//           alt={product.name}
//           className="w-full md:w-1/2 rounded-lg shadow-lg object-cover"
//         /> */}
//         <img
//           src={product.images?.[0] || "https://via.placeholder.com/400"}
//           alt={product.name}
//           className="w-full md:w-1/2 rounded-lg shadow-lg object-cover"
//           onError={(e) => {
//             e.target.src = "https://via.placeholder.com/400";
//           }}
//         />

//         {/* Product Info */}
//         <div className="flex-1">
//           <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
//           <p className="text-gray-500 mb-2 capitalize">{product.category}</p>
//           <p className="text-gray-700 mb-4 leading-relaxed">
//             {product.description}
//           </p>
//           <p className="text-2xl font-semibold mb-4 text-blue-600">
//             ${product.price}
//           </p>

//           <button
//             onClick={() => addToCart(product)}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-all duration-200"
//           >
//             Add to Cart
//           </button>
//         </div>
//       </div>

//       {/* Reviews */}
//       <div className="mt-10 border-t pt-6">
//         <h3 className="text-2xl font-semibold mb-4">Customer Reviews</h3>
//         <ReviewSection productId={id} />
//       </div>
//     </div>
//   );
// }

// pages/ProductDetailPage.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReviewSection from "../components/ReviewSection";
import { CartContext } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  if (!product)
    return <p className="text-center mt-10 text-red-500">Product not found</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          {/* Main Image */}
          <div className="mb-4">
            <img
              src={product.images?.[activeImage] || "https://via.placeholder.com/600"}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
          
          {/* Thumbnail Gallery */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`border-2 rounded-lg overflow-hidden ${
                    activeImage === index ? "border-blue-500" : "border-gray-200"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
          <p className="text-gray-500 mb-2 capitalize">{product.category}</p>
          <p className="text-gray-700 mb-4 leading-relaxed">
            {product.description}
          </p>
          <p className="text-2xl font-semibold mb-4 text-blue-600">
            ${product.price}
          </p>

          <div className="mb-6">
            <p className="text-gray-600 mb-2">
              <strong>Stock:</strong> {product.quantity} available
            </p>
            <p className="text-gray-600">
              <strong>Seller:</strong> {product.sellerId?.name || "Unknown"}
            </p>
          </div>

          <button
            onClick={() => addToCart(product)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200 text-lg font-semibold"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-12 border-t pt-6">
        <h3 className="text-2xl font-semibold mb-4">Customer Reviews</h3>
        <ReviewSection productId={id} />
      </div>
    </div>
  );
}