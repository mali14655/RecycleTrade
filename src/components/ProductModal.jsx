import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ProductModal({ isOpen, onClose, token, fetchProducts, product }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);

  // Update state when product changes
  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setDescription(product.description || "");
      setPrice(product.price || "");
      setQuantity(product.quantity || "");
      setCategory(product.category || "");
      setImages(product.images || []);
    } else {
      // Reset for new product
      setName("");
      setDescription("");
      setPrice("");
      setQuantity("");
      setCategory("");
      setImages([]);
    }
  }, [product]);

  if (!isOpen) return null;

  const submitProduct = async (e) => {
    e.preventDefault();
    try {
      if (product) {
        // Update
        await axios.put(
          `${import.meta.env.VITE_API_URL}/products/${product._id}`,
          { name, description, price, quantity, category, images },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Create
        await axios.post(
          `${import.meta.env.VITE_API_URL}/products`,
          { name, description, price, quantity, category, images },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      fetchProducts();
      onClose();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded w-11/12 md:w-2/3 max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="float-right text-red-600 font-bold">X</button>
        <h2 className="text-xl font-semibold mb-4">{product ? "Edit Product" : "Add Product"}</h2>
        <form onSubmit={submitProduct} className="flex flex-col gap-2">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Product Name" className="border p-2 rounded" required />
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="border p-2 rounded" required />
          <input value={price} onChange={e => setPrice(e.target.value)} type="number" placeholder="Price" className="border p-2 rounded" required />
          <input value={quantity} onChange={e => setQuantity(e.target.value)} type="number" placeholder="Quantity" className="border p-2 rounded" required />
          <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Category" className="border p-2 rounded" required />
          <input value={images.join(",")} onChange={e => setImages(e.target.value.split(","))} placeholder="Image URLs comma separated" className="border p-2 rounded" />
          <button type="submit" className="bg-blue-600 text-white py-2 rounded">{product ? "Update" : "Add"}</button>
        </form>
      </div>
    </div>
  );
}
