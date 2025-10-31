// components/ProductModal.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ProductModal({ isOpen, onClose, token, fetchProducts, product }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]); // Store files, not URLs
  const [imagePreviews, setImagePreviews] = useState([]); // For preview only
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setDescription(product.description || "");
      setPrice(product.price || "");
      setQuantity(product.quantity || "");
      setCategory(product.category || "");
      setImagePreviews(product.images || []);
    } else {
      setName("");
      setDescription("");
      setPrice("");
      setQuantity("");
      setCategory("");
      setSelectedFiles([]);
      setImagePreviews([]);
    }
  }, [product, isOpen]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Create preview URLs
    const previewUrls = files.map(file => URL.createObjectURL(file));
    
    setSelectedFiles(prev => [...prev, ...files]);
    setImagePreviews(prev => [...prev, ...previewUrls]);
  };

  const removeImage = (index) => {
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(imagePreviews[index]);
    
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
    if (selectedFiles.length === 0) return [];

    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append("images", file);
    });

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/upload/upload`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.images || [];
  };

  const submitProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploading(true);

    try {
      // Upload images only when form is submitted
      let imageUrls = [];
      if (selectedFiles.length > 0) {
        imageUrls = await uploadImages();
      }

      // Combine existing images (for edits) with new uploaded images
      const allImages = product 
        ? [...product.images, ...imageUrls] 
        : imageUrls;

      const payload = {
        name,
        description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        category,
        images: allImages
      };

      if (product) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/products/${product._id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/products`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      fetchProducts();
      onClose();
      alert(`Product ${product ? "updated" : "added"} successfully!`);
    } catch (err) {
      console.error("Error saving product:", err);
      alert(err.response?.data?.message || "Error saving product");
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => {
        if (preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [imagePreviews]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded w-11/12 md:w-2/3 max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="float-right text-red-600 font-bold">X</button>
        <h2 className="text-xl font-semibold mb-4">{product ? "Edit Product" : "Add Product"}</h2>
        
        <form onSubmit={submitProduct} className="flex flex-col gap-4">
          <input 
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder="Product Name" 
            className="border p-2 rounded" 
            required 
          />
          
          <textarea 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            placeholder="Description" 
            className="border p-2 rounded" 
            required 
          />
          
          <input 
            value={price} 
            onChange={e => setPrice(e.target.value)} 
            type="number" 
            placeholder="Price" 
            className="border p-2 rounded" 
            required 
          />
          
          <input 
            value={quantity} 
            onChange={e => setQuantity(e.target.value)} 
            type="number" 
            placeholder="Quantity" 
            className="border p-2 rounded" 
            required 
          />
          
          <input 
            value={category} 
            onChange={e => setCategory(e.target.value)} 
            placeholder="Category" 
            className="border p-2 rounded" 
            required 
          />

          {/* Image Upload Section */}
          <div className="border p-4 rounded">
            <label className="block mb-2 font-medium">Product Images</label>
            
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="w-full p-2 border rounded mb-2"
              disabled={uploading || loading}
            />
            
            {(uploading || loading) && <p className="text-blue-600">Uploading images...</p>}
            
            {/* Image Preview */}
            {imagePreviews.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">
                  {imagePreviews.length} image(s) ready to upload
                  {selectedFiles.length > 0 && ` (${selectedFiles.length} new)`}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-20 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                        disabled={uploading || loading}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading || uploading}
            className="bg-blue-600 text-white py-2 rounded disabled:opacity-50"
          >
            {loading ? "Saving..." : uploading ? "Uploading..." : product ? "Update" : "Add"}
          </button>
        </form>
      </div>
    </div>
  );
}