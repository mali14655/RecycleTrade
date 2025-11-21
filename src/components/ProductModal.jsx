import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

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
  
  // Track variant image files separately (not uploaded immediately)
  const [variantImageFiles, setVariantImageFiles] = useState({});

  // Fetch categories when modal opens
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log("Fetching categories...");
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/categories`);
        setCategories(res.data);
        console.log("Categories fetched:", res.data);
        
        // If editing product, set the selected category
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

  // Initialize form when product changes
  useEffect(() => {
    if (product) {
      console.log("Editing product:", product);
      setName(product.name || "");
      setDescription(product.description || "");
      setPrice(product.price || "");
      setImagePreviews(product.images || []);
      
      if (product.categoryRef) {
        setSingleSpecs(product.specs || {});
        // NEW: Stock management - Initialize variants with stock field
        const variantsWithStock = (product.variants || []).map(v => ({
          ...v,
          stock: v.stock !== undefined ? v.stock : 0 // Ensure stock field exists
        }));
        setGeneratedVariants(variantsWithStock);
        setSelectedVariants(variantsWithStock.filter(v => v.enabled) || []);
        
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
    setVariantImageFiles({});
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

  // Upload images only when saving product
  const uploadImages = async (files) => {
    if (!files || files.length === 0) return [];

    console.log("Uploading images:", files.length);
    const formData = new FormData();
    files.forEach(file => formData.append("images", file));

    try {
      setUploading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/upload/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          timeout: 120000
        }
      );
      console.log("Images uploaded successfully:", response.data.images);
      return response.data.images || [];
    } catch (error) {
      console.error('Error uploading images:', error);
      
      // Error toast for image upload
      toast.error(
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Upload Failed</p>
            <p className="text-sm text-gray-600">Please try again</p>
          </div>
        </div>
      );
      
      if (error.code === 'ECONNRESET' || error.response?.status === 413) {
        throw new Error('Upload failed: File too large or network issue. Please try smaller files.');
      }
      throw new Error('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
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
    setVariantImageFiles({});
    
    // If category has specs, initialize them
    if (category?.specs) {
      const initialSingleSpecs = {};
      const initialMultipleSpecs = {};
      
      category.specs.forEach(spec => {
        if (spec.type === 'single') {
          initialSingleSpecs[spec.name] = '';
        } else {
          initialMultipleSpecs[spec.name] = '';
        }
      });
      
      setSingleSpecs(initialSingleSpecs);
      setMultipleSpecs(initialMultipleSpecs);
    }
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
      toast.error(
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Missing Information</p>
            <p className="text-sm text-gray-600">Please enter values for multiple specs first</p>
          </div>
        </div>
      );
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
      toast.error(
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Invalid Input</p>
            <p className="text-sm text-gray-600">Please enter valid values for at least one multiple specification</p>
          </div>
        </div>
      );
      return;
    }

    const combinations = generateCombinations(parsedMultipleSpecs);
    console.log("Generated combinations:", combinations);
    
    const variants = combinations.map((combo, index) => ({
      specs: combo,
      price: parseFloat(price) || 0,
      sku: `${name.replace(/\s+/g, '').toUpperCase().slice(0, 10)}-${index + 1}`,
      enabled: true,
      images: [],
      stock: 0 // NEW: Stock management - Initialize stock to 0
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
        // NEW: Stock management - Preserve stock when selecting variant
        const variantToAdd = {
          ...generatedVariants[index],
          enabled: true,
          stock: generatedVariants[index].stock !== undefined ? generatedVariants[index].stock : 0
        };
        const newSelected = [...prev, variantToAdd];
        console.log("Variant selected, total:", newSelected.length);
        return newSelected;
      }
    });
  };

  const selectAllVariants = () => {
    console.log("Selecting all variants");
    // NEW: Stock management - Ensure stock field is included when selecting all
    const variantsWithStock = generatedVariants.map(v => ({
      ...v,
      stock: v.stock !== undefined ? v.stock : 0
    }));
    setSelectedVariants(variantsWithStock);
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

  // NEW: Stock management - Update variant stock
  const updateVariantStock = (index, stock) => {
    console.log("Updating variant stock:", index, stock);
    const stockValue = Math.max(0, parseInt(stock) || 0); // Ensure non-negative integer
    setSelectedVariants(prev => 
      prev.map((v, i) => 
        i === index ? { ...v, stock: stockValue } : v
      )
    );
  };

  // Handle variant image selection (not upload)
  const handleVariantImageSelect = (variantIndex, files) => {
    if (files.length === 0) return;

    console.log("Variant images selected for variant:", variantIndex, "files:", files.length);
    
    // Create preview URLs
    const previewUrls = files.map(file => URL.createObjectURL(file));
    
    // Store files for later upload
    setVariantImageFiles(prev => ({
      ...prev,
      [variantIndex]: [...(prev[variantIndex] || []), ...files.map((file, idx) => ({
        file,
        preview: previewUrls[idx]
      }))]
    }));

    // Update variant with preview URLs (these will be replaced with actual URLs when saved)
    setSelectedVariants(prev => 
      prev.map((v, i) => 
        i === variantIndex ? { 
          ...v, 
          images: [...(v.images || []), ...previewUrls] 
        } : v
      )
    );
  };

  const removeVariantImage = (variantIndex, imageIndex) => {
    console.log("Removing variant image:", variantIndex, imageIndex);
    
    // Clean up the preview URL
    const variant = selectedVariants[variantIndex];
    if (variant && variant.images[imageIndex]?.startsWith('blob:')) {
      URL.revokeObjectURL(variant.images[imageIndex]);
    }
    
    // Remove from variant images
    setSelectedVariants(prev => 
      prev.map((v, i) => 
        i === variantIndex ? { 
          ...v, 
          images: v.images.filter((_, imgIndex) => imgIndex !== imageIndex) 
        } : v
      )
    );
    
    // Remove from files storage
    setVariantImageFiles(prev => ({
      ...prev,
      [variantIndex]: (prev[variantIndex] || []).filter((_, idx) => idx !== imageIndex)
    }));
  };

  const submitProduct = async (e) => {
    e.preventDefault();
    console.log("Submitting product...");
    
    setLoading(true);

    try {
      let uploadedMainImages = [];
      
      // Upload main product images
      if (selectedFiles.length > 0) {
        console.log("Uploading main product images...");
        const toastId = toast.loading(
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black/10 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">Uploading Images</p>
              <p className="text-sm text-gray-600">Please wait...</p>
            </div>
          </div>
        );
        
        uploadedMainImages = await uploadImages(selectedFiles);
        toast.dismiss(toastId);
      }

      // Upload variant images
      const uploadedVariantImages = {};
      for (const [variantIndex, files] of Object.entries(variantImageFiles)) {
        if (files && files.length > 0) {
          const fileObjects = files.map(f => f.file);
          const uploadedUrls = await uploadImages(fileObjects);
          uploadedVariantImages[variantIndex] = uploadedUrls;
        }
      }

      const allImages = product 
        ? [...product.images, ...uploadedMainImages] 
        : uploadedMainImages;

      // Prepare final variants
      let finalVariants = [];
      
      if (selectedVariants.length > 0) {
        // Use selected variants with their images
        finalVariants = selectedVariants.map((variant, index) => {
          const uploadedVariantImgs = uploadedVariantImages[index] || [];
          const existingVariantImgs = variant.images.filter(img => !img.startsWith('blob:'));
          const variantImages = [...existingVariantImgs, ...uploadedVariantImgs];
          
          return {
            ...variant,
            images: variantImages.length > 0 ? variantImages : allImages,
            stock: variant.stock !== undefined ? variant.stock : 0 // NEW: Stock management - Ensure stock is included
          };
        });
      } else {
        // Create default variant with common images
        finalVariants = [{
          specs: {},
          price: parseFloat(price) || 0,
          sku: `${name.replace(/\s+/g, '').toUpperCase().slice(0, 10)}-1`,
          enabled: true,
          images: allImages,
          stock: 0 // NEW: Stock management - Default stock for non-variant products
        }];
      }

      const payload = {
        name,
        description,
        price: parseFloat(price) || 0,
        category: selectedCategory ? selectedCategory.name : name,
        images: allImages
      };

      if (selectedCategory) {
        payload.categoryRef = selectedCategory._id;
        // NEW: Set product price to first variant price if variants exist
        if (finalVariants.length > 0 && finalVariants[0].price !== undefined) {
          payload.price = finalVariants[0].price;
        }
        payload.specs = singleSpecs;
        payload.variants = finalVariants;
      }

      console.log("Submitting payload:", payload);

      const toastId = toast.loading(
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black/10 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Saving Product</p>
            <p className="text-sm text-gray-600">Please wait...</p>
          </div>
        </div>
      );

      if (product) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/products/${product._id}`,
          payload,
          { 
            headers: { Authorization: `Bearer ${token}` },
            timeout: 30000
          }
        );
        console.log("Product updated successfully");
        
        toast.success(
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">Product Updated</p>
              <p className="text-sm text-gray-600">{name} updated successfully</p>
            </div>
          </div>,
          { id: toastId }
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/products`,
          payload,
          { 
            headers: { Authorization: `Bearer ${token}` },
            timeout: 30000
          }
        );
        console.log("Product created successfully");
        
        toast.success(
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">Product Created</p>
              <p className="text-sm text-gray-600">{name} created successfully</p>
            </div>
          </div>,
          { id: toastId }
        );
      }

      fetchProducts();
      onClose();
      resetForm();
    } catch (err) {
      console.error("Error saving product:", err);
      
      toast.error(
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Failed to Save</p>
            <p className="text-sm text-gray-600">Please try again</p>
          </div>
        </div>
      );
    } finally {
      setLoading(false);
    }
  };

  // Clean up image previews
  useEffect(() => {
    return () => {
      console.log("Cleaning up image previews");
      imagePreviews.forEach(preview => {
        if (preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview);
        }
      });
      
      // Clean up variant image previews
      Object.values(variantImageFiles).forEach(files => {
        files.forEach(fileObj => {
          if (fileObj.preview.startsWith('blob:')) {
            URL.revokeObjectURL(fileObj.preview);
          }
        });
      });
    };
  }, [imagePreviews, variantImageFiles]);

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
              
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <select
                  value={selectedCategory?._id || ''}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a Category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name} {cat.specs?.length > 0 ? `(${cat.specs.length} specs)` : ''}
                    </option>
                  ))}
                </select>
                
                {/* Show category details when selected */}
                {selectedCategory && (
                  <div className="mt-2 p-3 bg-blue-50 rounded border border-blue-200">
                    <h4 className="font-semibold text-blue-800">{selectedCategory.name}</h4>
                    {selectedCategory.description && (
                      <p className="text-sm text-blue-700 mt-1">{selectedCategory.description}</p>
                    )}
                    {selectedCategory.specs && selectedCategory.specs.length > 0 ? (
                      <div className="mt-2">
                        <p className="text-xs text-blue-600 font-medium">Specifications:</p>
                        <ul className="text-xs text-blue-600 mt-1 list-disc list-inside">
                          {selectedCategory.specs.map((spec, index) => (
                            <li key={index}>
                              {spec.name} ({spec.type}) {spec.required && '*'}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-xs text-blue-600 mt-1">No specifications defined for this category</p>
                    )}
                  </div>
                )}
              </div>

              {/* Common Images Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Common Product Images ({imagePreviews.length}/5 selected)
                </label>
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
                      {imagePreviews.length} image(s) ready to upload when you save the product
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
                          <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                            New
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <p className="text-xs text-gray-500 mt-1">
                  Images will be uploaded to Cloudinary only when you click "Save Product"
                </p>
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
              
              {selectedCategory ? (
                <>
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <h4 className="font-semibold text-blue-800">{selectedCategory.name}</h4>
                    <p className="text-sm text-blue-600">
                      Fill in the specifications below. Multiple-value specs will create variants.
                    </p>
                  </div>

                  {selectedCategory.specs?.length > 0 ? (
                    selectedCategory.specs.map(spec => (
                      <div key={spec.name} className="mb-4 p-4 border rounded bg-gray-50">
                        <label className="block text-sm font-medium mb-2">
                          {spec.name} {spec.required && '*'}
                          <span className="ml-2 text-xs font-normal text-gray-500">
                            ({spec.type} {spec.type === 'multiple' ? '- creates variants' : ''})
                          </span>
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
                                Values: {multipleSpecs[spec.name]}
                              </div>
                            )}
                            <p className="text-xs text-gray-500">
                              Separate values with commas. These will create product variants.
                            </p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No specifications defined for this category.</p>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        Continue without Specifications
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Please select a category first.</p>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    ← Back to Basic Info
                  </button>
                </div>
              )}

              {selectedCategory?.specs?.length > 0 && (
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
              )}
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
                      ⚠️ No variants selected. A default variant will be created with common images.
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
                            <div className="text-xs text-blue-600 mt-1">
                              Stock: {variant.stock !== undefined ? variant.stock : 0}
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
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
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
                          <div>
                            <label className="block text-sm font-medium mb-1">Stock *</label>
                            <input
                              type="number"
                              min="0"
                              step="1"
                              value={variant.stock !== undefined ? variant.stock : ''}
                              onChange={(e) => updateVariantStock(index, e.target.value)}
                              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              required
                              placeholder="0"
                            />
                            <p className="text-xs text-gray-500 mt-1">Available quantity for this variant</p>
                          </div>
                        </div>

                        {/* Variant-specific Images */}
                        <div>
                          <label className="block text-sm font-medium mb-2">Variant-specific Images</label>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => handleVariantImageSelect(index, Array.from(e.target.files))}
                            className="w-full p-2 border rounded mb-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={uploading || loading}
                          />
                          
                          {variant.images && variant.images.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm text-gray-600 mb-2">
                                {variant.images.length} variant image(s) - will be uploaded when you save
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
                                    {image.startsWith('blob:') && (
                                      <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                                        New
                                      </div>
                                    )}
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
                  disabled={loading || uploading}
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