import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ProductModal({ isOpen, onClose, token, fetchProducts, product }) {
  // Basic Product Info
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  // Category & Variant System
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [singleSpecs, setSingleSpecs] = useState({});
  const [multipleSpecs, setMultipleSpecs] = useState({});
  const [generatedVariants, setGeneratedVariants] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [step, setStep] = useState(1);
  const [variantImages, setVariantImages] = useState({});

  useEffect(() => {
    if (product) {
      console.log("Editing product:", product);
      setName(product.name || "");
      setDescription(product.description || "");
      setPrice(product.price || "");
      setImagePreviews(product.images || []);
      
      if (product.categoryRef) {
        setSingleSpecs(product.specs || {});
        setGeneratedVariants(product.variants || []);
        setSelectedVariants(product.variants?.filter(v => v.enabled) || []);
        
        // Initialize multipleSpecs from existing variants
        const existingMultipleSpecs = {};
        if (product.variants && product.variants.length > 0) {
          const firstVariant = product.variants[0];
          Object.keys(firstVariant.specs || {}).forEach(key => {
            const uniqueValues = [...new Set(product.variants.map(v => v.specs[key]))];
            existingMultipleSpecs[key] = uniqueValues.join(', ');
          });
        }
        setMultipleSpecs(existingMultipleSpecs);
      }
    } else {
      resetForm();
    }
  }, [product, isOpen]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log("Fetching categories...");
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/categories`);
        setCategories(res.data);
        console.log("Categories fetched:", res.data.length);
        
        if (product && product.categoryRef) {
          const category = res.data.find(cat => cat._id === product.categoryRef);
          setSelectedCategory(category);
          console.log("Selected category for editing:", category);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    if (isOpen) {
      fetchCategories();
    }
  }, [product, isOpen]);

  const resetForm = () => {
    console.log("Resetting form");
    setName("");
    setDescription("");
    setPrice("");
    setSelectedFiles([]);
    setImagePreviews([]);
    setSelectedCategory(null);
    setSingleSpecs({});
    setMultipleSpecs({});
    setGeneratedVariants([]);
    setSelectedVariants([]);
    setVariantImages({});
    setStep(1);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    console.log("Files selected:", files.length);
    const previewUrls = files.map(file => URL.createObjectURL(file));
    setSelectedFiles(prev => [...prev, ...files]);
    setImagePreviews(prev => [...prev, ...previewUrls]);
  };

  const removeImage = (index) => {
    console.log("Removing image at index:", index);
    URL.revokeObjectURL(imagePreviews[index]);
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (files = null) => {
    const filesToUpload = files || selectedFiles;
    if (filesToUpload.length === 0) return [];

    console.log("Uploading images:", filesToUpload.length);
    const formData = new FormData();
    filesToUpload.forEach(file => formData.append("images", file));

    try {
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
      console.log("Images uploaded successfully:", response.data.images);
      return response.data.images || [];
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    }
  };

  const handleCategoryChange = (categoryId) => {
    console.log("Category changed to:", categoryId);
    const category = categories.find(cat => cat._id === categoryId);
    setSelectedCategory(category);
    setSingleSpecs({});
    setMultipleSpecs({});
    setGeneratedVariants([]);
    setSelectedVariants([]);
    setVariantImages({});
  };

  const handleSpecChange = (specName, value, isMultiple = false) => {
    console.log("Spec changed:", specName, value, isMultiple);
    if (isMultiple) {
      setMultipleSpecs(prev => ({
        ...prev,
        [specName]: value
      }));
    } else {
      setSingleSpecs(prev => ({
        ...prev,
        [specName]: value
      }));
    }
  };

  const generateVariants = () => {
    console.log("Generating variants with specs:", multipleSpecs);
    if (Object.keys(multipleSpecs).length === 0) {
      alert('Please enter values for multiple specs first');
      return;
    }

    // Parse comma-separated values into arrays
    const parsedMultipleSpecs = {};
    let hasValidSpecs = false;
    
    for (const [key, value] of Object.entries(multipleSpecs)) {
      if (typeof value === 'string' && value.trim()) {
        const valuesArray = value.split(',')
          .map(v => v.trim())
          .filter(v => v.length > 0);
        
        if (valuesArray.length > 0) {
          parsedMultipleSpecs[key] = valuesArray;
          hasValidSpecs = true;
        }
      }
    }

    if (!hasValidSpecs) {
      alert('Please enter valid values for at least one multiple specification');
      return;
    }

    const combinations = generateCombinations(parsedMultipleSpecs);
    console.log("Generated combinations:", combinations);
    
    const variants = combinations.map((combo, index) => ({
      specs: combo,
      price: parseFloat(price) || 0,
      sku: `${name.replace(/\s+/g, '').toUpperCase().slice(0, 10)}-${index + 1}`,
      enabled: true,
      images: []
    }));

    setGeneratedVariants(variants);
    setSelectedVariants(variants);
    setStep(3);
    console.log("Variants generated:", variants.length);
  };

  const generateCombinations = (specs) => {
    const keys = Object.keys(specs);
    if (keys.length === 0) return [{}];
    
    const firstKey = keys[0];
    const restKeys = keys.slice(1);
    const restCombinations = generateCombinations(
      restKeys.reduce((obj, key) => {
        obj[key] = specs[key];
        return obj;
      }, {})
    );
    
    const result = [];
    for (const value of specs[firstKey]) {
      for (const combination of restCombinations) {
        result.push({ [firstKey]: value, ...combination });
      }
    }
    return result;
  };

  const toggleVariantSelection = (index) => {
    console.log("Toggling variant selection:", index);
    setSelectedVariants(prev => {
      const isSelected = prev.some(v => 
        JSON.stringify(v.specs) === JSON.stringify(generatedVariants[index].specs)
      );
      
      if (isSelected) {
        const newSelected = prev.filter(v => 
          JSON.stringify(v.specs) !== JSON.stringify(generatedVariants[index].specs)
        );
        console.log("Variant deselected, remaining:", newSelected.length);
        return newSelected;
      } else {
        const newSelected = [...prev, { ...generatedVariants[index], enabled: true }];
        console.log("Variant selected, total:", newSelected.length);
        return newSelected;
      }
    });
  };

  const selectAllVariants = () => {
    console.log("Selecting all variants");
    setSelectedVariants([...generatedVariants]);
  };

  const deselectAllVariants = () => {
    console.log("Deselecting all variants");
    setSelectedVariants([]);
  };

  const updateVariantPrice = (index, price) => {
    console.log("Updating variant price:", index, price);
    setSelectedVariants(prev => 
      prev.map((v, i) => 
        i === index ? { ...v, price: parseFloat(price) || 0 } : v
      )
    );
  };

  const handleVariantImageUpload = async (index, files) => {
    if (files.length === 0) return;

    console.log("Uploading variant images for variant:", index, "files:", files.length);
    try {
      setUploading(true);
      const uploadedImages = await uploadImages(files);
      if (uploadedImages.length > 0) {
        setSelectedVariants(prev => 
          prev.map((v, i) => 
            i === index ? { 
              ...v, 
              images: [...(v.images || []), ...uploadedImages] 
            } : v
          )
        );
        console.log("Variant images uploaded successfully");
      }
    } catch (error) {
      console.error('Error uploading variant images:', error);
      alert('Error uploading variant images');
    } finally {
      setUploading(false);
    }
  };

  const removeVariantImage = (variantIndex, imageIndex) => {
    console.log("Removing variant image:", variantIndex, imageIndex);
    setSelectedVariants(prev => 
      prev.map((v, i) => 
        i === variantIndex ? { 
          ...v, 
          images: v.images.filter((_, imgIndex) => imgIndex !== imageIndex) 
        } : v
      )
    );
  };

  const submitProduct = async (e) => {
    e.preventDefault();
    console.log("Submitting product...");
    
    if (selectedVariants.length === 0) {
      alert('Please select at least one variant to sell');
      return;
    }

    setLoading(true);
    setUploading(true);

    try {
      let imageUrls = [];
      if (selectedFiles.length > 0) {
        console.log("Uploading product images...");
        imageUrls = await uploadImages();
      }

      const allImages = product 
        ? [...product.images, ...imageUrls] 
        : imageUrls;

      const payload = {
        name,
        description,
        price: parseFloat(price) || 0,
        category: selectedCategory ? selectedCategory.name : name,
        images: allImages
      };

      if (selectedCategory) {
        payload.categoryRef = selectedCategory._id;
        payload.basePrice = parseFloat(price) || 0;
        payload.specs = singleSpecs;
        payload.variants = selectedVariants;
      }

      console.log("Submitting payload:", payload);

      if (product) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/products/${product._id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Product updated successfully");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/products`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Product created successfully");
      }

      fetchProducts();
      onClose();
      resetForm();
      alert(`Product ${product ? "updated" : "added"} successfully!`);
    } catch (err) {
      console.error("Error saving product:", err);
      alert(err.response?.data?.message || "Error saving product");
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  useEffect(() => {
    return () => {
      console.log("Cleaning up image previews");
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
      <div className="bg-white p-6 rounded w-11/12 md:w-3/4 max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose} 
          className="float-right text-red-600 font-bold text-lg hover:text-red-800"
          type="button"
        >
          ×
        </button>
        <h2 className="text-xl font-semibold mb-4">{product ? "Edit Product" : "Add Product"}</h2>
        
        {/* Progress Steps */}
        <div className="flex mb-6">
          <div className={`flex-1 text-center p-2 ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            Step 1: Basic Info
          </div>
          <div className={`flex-1 text-center p-2 ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            Step 2: Specifications
          </div>
          <div className={`flex-1 text-center p-2 ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            Step 3: Variants
          </div>
        </div>

        <form onSubmit={submitProduct}>
          {/* STEP 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Basic Product Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Product Name *</label>
                  <input 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    placeholder="Product Name" 
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    required 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Base Price *</label>
                  <input 
                    value={price} 
                    onChange={e => setPrice(e.target.value)} 
                    type="number" 
                    min="0"
                    step="0.01"
                    placeholder="0.00" 
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    required 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <textarea 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  placeholder="Product description..." 
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  rows="3"
                  required 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <select
                  value={selectedCategory?._id || ''}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Common Images Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">Common Product Images</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="w-full p-2 border rounded mb-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={uploading || loading}
                />
                
                {imagePreviews.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">
                      {imagePreviews.length} image(s) ready to upload
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-sm flex items-center justify-center hover:bg-red-600"
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

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!name || !description || !price || !selectedCategory}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next: Specifications →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Specifications */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Product Specifications</h3>
              <p className="text-sm text-gray-600 mb-4">
                Fill in the specifications for {selectedCategory?.name}
              </p>

              {selectedCategory?.specs?.map(spec => (
                <div key={spec.name} className="mb-4 p-4 border rounded bg-gray-50">
                  <label className="block text-sm font-medium mb-2">
                    {spec.name} {spec.required && '*'}
                  </label>
                  {spec.type === 'single' ? (
                    <input
                      type="text"
                      value={singleSpecs[spec.name] || ''}
                      onChange={(e) => handleSpecChange(spec.name, e.target.value, false)}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required={spec.required}
                      placeholder={`Enter ${spec.name}`}
                    />
                  ) : (
                    <div>
                      <input
                        type="text"
                        placeholder={`Enter ${spec.name} values separated by commas (e.g., Black, White, Blue)`}
                        value={multipleSpecs[spec.name] || ''}
                        onChange={(e) => handleSpecChange(spec.name, e.target.value, true)}
                        className="w-full p-2 border rounded mb-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required={spec.required}
                      />
                      {multipleSpecs[spec.name] && (
                        <div className="text-sm text-green-600 mb-2">
                          Type values separated by commas and press "Generate Variants"
                        </div>
                      )}
                      <p className="text-xs text-gray-500">
                        Separate values with commas. These will create product variants.
                      </p>
                    </div>
                  )}
                </div>
              ))}

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={generateVariants}
                  disabled={Object.keys(multipleSpecs).length === 0}
                  className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Generate Variants →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Variants Management */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Manage Product Variants</h3>
              <p className="text-sm text-gray-600 mb-4">
                Select which variants to sell and set their prices. 
                <strong className="text-red-600"> Only selected variants will be available for sale.</strong>
              </p>

              {/* Variant Selection Controls */}
              <div className="flex items-center justify-between mb-4 p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-blue-800">
                  {selectedVariants.length} of {generatedVariants.length} variants selected
                </span>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={selectAllVariants}
                    className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={deselectAllVariants}
                    className="text-sm bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 transition-colors"
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              <div className="border rounded p-4 mb-4 bg-gray-50">
                <h4 className="font-semibold mb-3">Available Variants ({generatedVariants.length})</h4>
                
                {/* Warning if no variants selected */}
                {selectedVariants.length === 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
                    <p className="text-yellow-800 text-sm">
                      ⚠️ No variants selected. You must select at least one variant to sell.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {generatedVariants.map((variant, index) => {
                    const isSelected = selectedVariants.some(v => 
                      JSON.stringify(v.specs) === JSON.stringify(variant.specs)
                    );
                    
                    return (
                      <div key={index} className={`border rounded p-3 transition-all ${
                        isSelected 
                          ? 'bg-green-50 border-green-300 shadow-sm' 
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}>
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleVariantSelection(index)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-sm">
                              {Object.entries(variant.specs).map(([key, value]) => (
                                <span key={key} className="mr-2">
                                  {key}: <strong>{value}</strong>
                                </span>
                              ))}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              SKU: {variant.sku}
                            </div>
                            <div className="text-xs text-green-600 mt-1">
                              Price: ${variant.price}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Selected Variants Configuration */}
              {selectedVariants.length > 0 && (
                <div className="border rounded p-4 bg-white">
                  <h4 className="font-semibold mb-3">Configure Selected Variants ({selectedVariants.length})</h4>
                  <div className="space-y-6">
                    {selectedVariants.map((variant, index) => (
                      <div key={index} className="border rounded p-4 bg-gray-50">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h5 className="font-semibold text-lg">Variant {index + 1}</h5>
                            <div className="text-sm text-gray-600">
                              {Object.entries(variant.specs).map(([key, value]) => (
                                <span key={key} className="mr-3">
                                  {key}: <strong>{value}</strong>
                                </span>
                              ))}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              SKU: {variant.sku}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium mb-1">Price ($) *</label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={variant.price || ''}
                            onChange={(e) => updateVariantPrice(index, e.target.value)}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>

                        {/* Variant-specific Images */}
                        <div>
                          <label className="block text-sm font-medium mb-2">Variant-specific Images</label>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => handleVariantImageUpload(index, Array.from(e.target.files))}
                            className="w-full p-2 border rounded mb-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={uploading}
                          />
                          
                          {variant.images && variant.images.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm text-gray-600 mb-2">
                                {variant.images.length} variant image(s)
                              </p>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {variant.images.map((image, imgIndex) => (
                                  <div key={imgIndex} className="relative">
                                    <img
                                      src={image}
                                      alt={`Variant ${index + 1} Image ${imgIndex + 1}`}
                                      className="w-full h-20 object-cover rounded border"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removeVariantImage(index, imgIndex)}
                                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors"
                >
                  ← Back to Specs
                </button>
                <button
                  type="submit"
                  disabled={loading || uploading || selectedVariants.length === 0}
                  className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "Saving..." : uploading ? "Uploading..." : "Save Product"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}