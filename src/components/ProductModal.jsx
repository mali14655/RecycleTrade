import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ProductModal({ isOpen, onClose, token, fetchProducts, product }) {
  // Basic Product Info
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
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
  
  // NEW: Common product images (for product.images - shown on cards)
  const [commonImageFiles, setCommonImageFiles] = useState([]);
  const [commonImagePreviews, setCommonImagePreviews] = useState([]);
  const [commonImageUrls, setCommonImageUrls] = useState([]); // Uploaded URLs
  
  // NEW: Color-specific images (mapped by color value, e.g., "Red" => [url1, url2])
  const [colorImageFiles, setColorImageFiles] = useState({}); // { "Red": [File], "Blue": [File] }
  const [colorImagePreviews, setColorImagePreviews] = useState({}); // { "Red": [blob:url], "Blue": [blob:url] }
  const [colorImageUrls, setColorImageUrls] = useState({}); // { "Red": [url], "Blue": [url] } - Uploaded URLs
  
  // Track variant image files separately (not uploaded immediately) - for Step 3 manual uploads
  const [variantImageFiles, setVariantImageFiles] = useState({});

  // Fetch categories when modal opens
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log("Fetching categories...");
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/categories`);
        setCategories(res.data);
        console.log("Categories fetched:", res.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  // Initialize form when product and categories are available
  useEffect(() => {
    if (product && categories.length > 0 && isOpen) {
      console.log("Initializing product for editing:", product);
      setName(product.name || "");
      setDescription(product.description || "");
      setPrice(product.price || ""); // Keep for backward compatibility but won't be shown
      
      // NEW: Initialize common images from product.images
      if (product.images && product.images.length > 0) {
        setCommonImageUrls(product.images);
        setCommonImagePreviews(product.images); // Show existing images as previews
      } else {
        setCommonImageUrls([]);
        setCommonImagePreviews([]);
      }
      
      // NEW: Handle categoryRef - could be ObjectId string or populated object
      const categoryRefId = product.categoryRef?._id || product.categoryRef;
      
      if (categoryRefId) {
        // Find and set the category
        const category = categories.find(cat => 
          cat._id === categoryRefId || cat._id?.toString() === categoryRefId?.toString()
        );
        
        if (category) {
          console.log("Setting category for editing:", category);
          setSelectedCategory(category);
          
          // Initialize specs - single specs from product
          const initialSingleSpecs = {};
          if (product.specs) {
            // Handle both Map and object formats
            const specsObj = product.specs instanceof Map 
              ? Object.fromEntries(product.specs)
              : product.specs;
            Object.assign(initialSingleSpecs, specsObj);
          }
          
          // Ensure all single specs from category are included
          if (category.specs) {
            category.specs.forEach(spec => {
              if (spec.type === 'single' && !initialSingleSpecs[spec.name]) {
                initialSingleSpecs[spec.name] = '';
              }
            });
          }
          setSingleSpecs(initialSingleSpecs);
          
          // Initialize multiple specs from variants
          const initialMultipleSpecs = {};
          if (product.variants && product.variants.length > 0) {
            // Get all unique spec keys from variants
            const allSpecKeys = new Set();
            product.variants.forEach(v => {
              if (v.specs) {
                const specsObj = v.specs instanceof Map 
                  ? Object.fromEntries(v.specs)
                  : v.specs;
                Object.keys(specsObj).forEach(key => allSpecKeys.add(key));
              }
            });
            
            // Populate multiple specs with comma-separated values
            allSpecKeys.forEach(key => {
              const uniqueValues = [...new Set(
                product.variants.map(v => {
                  const specsObj = v.specs instanceof Map 
                    ? Object.fromEntries(v.specs)
                    : v.specs;
                  return specsObj[key];
                }).filter(Boolean)
              )];
              if (uniqueValues.length > 0) {
                initialMultipleSpecs[key] = uniqueValues.join(', ');
              }
            });
            
            // Ensure all multiple specs from category are included
            if (category.specs) {
              category.specs.forEach(spec => {
                if (spec.type === 'multiple' && !initialMultipleSpecs[spec.name]) {
                  initialMultipleSpecs[spec.name] = '';
                }
              });
            }
          } else if (category.specs) {
            // No variants yet, but initialize empty multiple specs
            category.specs.forEach(spec => {
              if (spec.type === 'multiple') {
                initialMultipleSpecs[spec.name] = '';
              }
            });
          }
          setMultipleSpecs(initialMultipleSpecs);
          
          // NEW: Extract color images from existing variants (for editing)
          const extractedColorImages = {};
          if (product.variants && product.variants.length > 0) {
            // Check if Color is a multiple spec
            const colorSpec = category.specs?.find(spec => 
              spec.type === 'multiple' && 
              (spec.name.toLowerCase() === 'color' || spec.name.toLowerCase() === 'colour')
            );
            
            if (colorSpec) {
              // NEW: Helper function to normalize color values (case-insensitive, whitespace-insensitive)
              const normalizeColorValue = (value) => {
                if (typeof value !== 'string') return value;
                return value.trim().toLowerCase();
              };

              // Group variant images by color value (normalized for consistent matching)
              product.variants.forEach(variant => {
                const specsObj = variant.specs instanceof Map 
                  ? Object.fromEntries(variant.specs)
                  : (variant.specs || {});
                
                const colorKey = Object.keys(specsObj).find(key => 
                  key.toLowerCase() === 'color' || key.toLowerCase() === 'colour'
                );
                
                if (colorKey && specsObj[colorKey] && variant.images && variant.images.length > 0) {
                  const colorValue = specsObj[colorKey];
                  // NEW: Normalize color value for consistent key matching
                  const normalizedColorValue = normalizeColorValue(colorValue);
                  
                  // Collect unique images for this color (avoid duplicates)
                  // Use normalized value as key, but store original value for display
                  if (!extractedColorImages[normalizedColorValue]) {
                    extractedColorImages[normalizedColorValue] = [];
                  }
                  variant.images.forEach(img => {
                    if (!extractedColorImages[normalizedColorValue].includes(img)) {
                      extractedColorImages[normalizedColorValue].push(img);
                    }
                  });
                }
              });
              
              // Set color image URLs and previews
              if (Object.keys(extractedColorImages).length > 0) {
                setColorImageUrls(extractedColorImages);
                setColorImagePreviews(extractedColorImages); // Show as previews
              }
            }
          }
          
          // Initialize variants with stock field
          const variantsWithStock = (product.variants || []).map(v => {
            // Handle Map format for specs
            const specsObj = v.specs instanceof Map 
              ? Object.fromEntries(v.specs)
              : (v.specs || {});
            
            return {
              ...v,
              specs: specsObj,
              stock: v.stock !== undefined ? v.stock : 0
            };
          });
          setGeneratedVariants(variantsWithStock);
          setSelectedVariants(variantsWithStock.filter(v => v.enabled !== false) || []);
        } else {
          console.warn("Category not found for categoryRef:", categoryRefId);
        }
      }
    } else if (!product && isOpen) {
      resetForm();
    }
  }, [product, categories, isOpen]);

  const resetForm = () => {
    console.log("Resetting form");
    setName("");
    setDescription("");
    setPrice("");
    setCommonImageFiles([]);
    setCommonImagePreviews([]);
    setCommonImageUrls([]);
    setColorImageFiles({});
    setColorImagePreviews({});
    setColorImageUrls({});
    setSelectedCategory(null);
    setSingleSpecs({});
    setMultipleSpecs({});
    setGeneratedVariants([]);
    setSelectedVariants([]);
    setVariantImageFiles({});
    setStep(1);
  };

  // NEW: Handle common image selection
  const handleCommonImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    console.log("Common images selected:", files.length);
    const previewUrls = files.map(file => URL.createObjectURL(file));
    setCommonImageFiles(prev => [...prev, ...files]);
    setCommonImagePreviews(prev => [...prev, ...previewUrls]);
  };

  // NEW: Remove common image
  const removeCommonImage = (index) => {
    console.log("Removing common image at index:", index);
    const preview = commonImagePreviews[index];
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    setCommonImageFiles(prev => prev.filter((_, i) => i !== index));
    setCommonImagePreviews(prev => prev.filter((_, i) => i !== index));
    // If it's an uploaded URL (not a blob), also remove from URLs
    if (commonImageUrls[index] && !commonImageUrls[index].startsWith('blob:')) {
      setCommonImageUrls(prev => prev.filter((_, i) => i !== index));
    }
  };

  // NEW: Handle color image selection
  const handleColorImageSelect = (colorValue, e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // NEW: Normalize color value for consistent storage (case-insensitive, whitespace-insensitive)
    const normalizeColorValue = (value) => {
      if (typeof value !== 'string') return value;
      return value.trim().toLowerCase();
    };
    const normalizedColorValue = normalizeColorValue(colorValue);

    console.log(`Color images selected for ${colorValue} (normalized: ${normalizedColorValue}):`, files.length);
    const previewUrls = files.map(file => URL.createObjectURL(file));
    
    // NEW: Store using normalized key, but also check original for backward compatibility
    setColorImageFiles(prev => ({
      ...prev,
      [normalizedColorValue]: [...(prev[normalizedColorValue] || prev[colorValue] || []), ...files]
    }));
    
    setColorImagePreviews(prev => ({
      ...prev,
      [normalizedColorValue]: [...(prev[normalizedColorValue] || prev[colorValue] || []), ...previewUrls]
    }));
  };

  // NEW: Remove color image
  const removeColorImage = (colorValue, index) => {
    // NEW: Normalize color value for consistent lookup
    const normalizeColorValue = (value) => {
      if (typeof value !== 'string') return value;
      return value.trim().toLowerCase();
    };
    const normalizedColorValue = normalizeColorValue(colorValue);
    
    console.log(`Removing color image for ${colorValue} (normalized: ${normalizedColorValue}) at index:`, index);
    // Try both normalized and original value for backward compatibility
    const previews = colorImagePreviews[normalizedColorValue] || colorImagePreviews[colorValue] || [];
    const preview = previews[index];
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    
    // Use normalized value for storage, but check both for backward compatibility
    setColorImageFiles(prev => ({
      ...prev,
      [normalizedColorValue]: (prev[normalizedColorValue] || prev[colorValue] || []).filter((_, i) => i !== index)
    }));
    
    setColorImagePreviews(prev => ({
      ...prev,
      [normalizedColorValue]: (prev[normalizedColorValue] || prev[colorValue] || []).filter((_, i) => i !== index)
    }));
    
    // If it's an uploaded URL, also remove from URLs (try both normalized and original)
    const urls = colorImageUrls[normalizedColorValue] || colorImageUrls[colorValue] || [];
    if (urls[index] && !urls[index].startsWith('blob:')) {
      setColorImageUrls(prev => ({
        ...prev,
        [normalizedColorValue]: (prev[normalizedColorValue] || prev[colorValue] || []).filter((_, i) => i !== index)
      }));
    }
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
          timeout: 240000 // 4 minutes timeout to match backend
        }
      );
      
      // Log response for debugging
      console.log("Upload response:", {
        status: response.status,
        data: response.data,
        images: response.data.images,
        uploaded: response.data.uploaded,
        failed: response.data.failed
      });
      
      // Always return images array, even if empty
      const imageUrls = response.data.images || [];
      
      // Handle partial success (207 status) or when some files failed
      if (response.status === 207 || (response.data.failed && response.data.failed > 0)) {
        const uploaded = response.data.uploaded || imageUrls.length || 0;
        const failed = response.data.failed || 0;
        
        if (uploaded > 0 && failed > 0) {
          // Partial success - some uploaded, some failed
          toast.warning(
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Partial Upload</p>
                <p className="text-sm text-gray-600">{uploaded} uploaded, {failed} failed. {failed > 0 ? 'Please try uploading failed images again.' : ''}</p>
              </div>
            </div>,
            { icon: null }
          );
        } else if (uploaded === 0 && failed > 0) {
          // All failed - this should be caught by error handler, but handle it here too
          throw new Error(response.data.message || 'All uploads failed');
        }
        
        return imageUrls;
      }
      
      // Full success
      if (imageUrls.length > 0) {
        console.log("Images uploaded successfully:", imageUrls);
      }
      return imageUrls;
    } catch (error) {
      console.error('Error uploading images:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      // Check if response has data (might be 500 with images array)
      if (error.response?.data?.images !== undefined) {
        // Backend returned error but with images array (partial failure)
        const imageUrls = error.response.data.images || [];
        if (imageUrls.length > 0) {
          // Some images uploaded despite error
          toast.warning(
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Partial Upload</p>
                <p className="text-sm text-gray-600">{error.response.data.message || 'Some images failed to upload'}</p>
              </div>
            </div>,
            { icon: null }
          );
          return imageUrls;
        }
      }
      
      // Check if it's a network/connection error
      const isNetworkError = error.code === 'ECONNRESET' || 
                            error.code === 'ETIMEDOUT' ||
                            error.code === 'ECONNABORTED' ||
                            error.message?.includes('timeout') ||
                            error.message?.includes('Network Error');
      
      // Check if it's a file size error
      const isFileSizeError = error.response?.status === 413 || 
                             error.message?.includes('too large');
      
      let errorMessage = 'Upload failed. Please try again.';
      if (isNetworkError) {
        errorMessage = 'Network connection error. Please check your internet connection and try again.';
      } else if (isFileSizeError) {
        errorMessage = 'File too large. Maximum size is 5MB per file.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
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
            <p className="text-sm text-gray-600">{errorMessage}</p>
          </div>
        </div>,
        { icon: null }
      );
      
      throw new Error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    console.log("Category changed to:", categoryId);
    const category = categories.find(cat => cat._id === categoryId);
    setSelectedCategory(category);
    
    // NEW: Only clear specs/variants if not editing or category changed
    if (!product || product.categoryRef !== categoryId) {
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
    } else if (product && product.categoryRef === categoryId) {
      // NEW: When editing and category is same, restore specs from product
      setSingleSpecs(product.specs || {});
      
      // Restore multipleSpecs from variants
      const existingMultipleSpecs = {};
      if (product.variants && product.variants.length > 0) {
        const firstVariant = product.variants[0];
        Object.keys(firstVariant.specs || {}).forEach(key => {
          const uniqueValues = [...new Set(product.variants.map(v => v.specs[key]))];
          existingMultipleSpecs[key] = uniqueValues.join(', ');
        });
      }
      setMultipleSpecs(existingMultipleSpecs);
      
      // Restore variants
      const variantsWithStock = (product.variants || []).map(v => ({
        ...v,
        stock: v.stock !== undefined ? v.stock : 0
      }));
      setGeneratedVariants(variantsWithStock);
      setSelectedVariants(variantsWithStock.filter(v => v.enabled) || []);
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
    console.log("Generating variants with specs:", { multipleSpecs, singleSpecs });
    
    // NEW: Only parse multiple specs for variant generation
    // Parse comma-separated values into arrays for multiple specs
    const parsedMultipleSpecs = {};
    let hasMultipleSpecs = false;
    
    for (const [key, value] of Object.entries(multipleSpecs)) {
      if (typeof value === 'string' && value.trim()) {
        const valuesArray = value.split(',')
          .map(v => v.trim())
          .filter(v => v.length > 0);
        
        if (valuesArray.length > 0) {
          parsedMultipleSpecs[key] = valuesArray;
          hasMultipleSpecs = true;
        }
      }
    }

    // NEW: Only require multiple specs for variant generation
    // Single specs will be stored in product.specs, not in variant.specs
    if (!hasMultipleSpecs) {
      toast.error(
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Missing Multiple Specifications</p>
            <p className="text-sm text-gray-600">Please enter values for at least one multiple specification to generate variants</p>
          </div>
        </div>,
        { icon: null }
      );
      return;
    }

    // NEW: Generate combinations only from multiple specs
    // Single specs are NOT included in variant.specs - they go to product.specs only
    const combinations = generateCombinations(parsedMultipleSpecs);
    
    console.log("Generated combinations (multiple specs only):", combinations);
    
    // NEW: Variants only contain multiple specs, not single specs
    // NEW: Auto-assign color images to variants based on their color spec value
    // NEW: Helper function to normalize color values (case-insensitive, whitespace-insensitive)
    const normalizeColorValue = (value) => {
      if (typeof value !== 'string') return value;
      return value.trim().toLowerCase();
    };

    const variants = combinations.map((combo, index) => {
      // Check if this variant has a "Color" spec and if we have images for that color
      let variantImages = [];
      
      // Check for "Color" spec (case-insensitive, also check "Colour")
      const colorKey = Object.keys(combo).find(key => 
        key.toLowerCase() === 'color' || key.toLowerCase() === 'colour'
      );
      
      if (colorKey && combo[colorKey]) {
        const colorValue = combo[colorKey];
        // NEW: Normalize color value for consistent lookup
        const normalizedColorValue = normalizeColorValue(colorValue);
        
        // Use uploaded URLs if available, otherwise use previews (will be uploaded later)
        // Try both normalized and original value for backward compatibility
        const colorUrls = colorImageUrls[normalizedColorValue] || colorImageUrls[colorValue] || [];
        const colorPreviews = colorImagePreviews[normalizedColorValue] || colorImagePreviews[colorValue] || [];
        
        if (colorUrls.length > 0) {
          variantImages = [...colorUrls];
        } else if (colorPreviews.length > 0) {
          // Use previews temporarily (will be uploaded in submitProduct)
          variantImages = [...colorPreviews];
        }
      }
      
      // If no color images, use common images as fallback
      if (variantImages.length === 0) {
        const commonUrls = commonImageUrls || [];
        const commonPreviews = commonImagePreviews || [];
        if (commonUrls.length > 0) {
          variantImages = [...commonUrls];
        } else if (commonPreviews.length > 0) {
          variantImages = [...commonPreviews];
        }
      }
      
      return {
        specs: combo, // Only multiple specs here
        // NEW: Base price is optional; variants start at 0 and must be set in Step 3
        price: Number.isFinite(parseFloat(price)) ? parseFloat(price) : 0,
        sku: `${name.replace(/\s+/g, '').toUpperCase().slice(0, 10)}-${index + 1}`,
        enabled: true,
        images: variantImages, // Auto-assigned color images or common images
        stock: 0 // NEW: Stock management - Initialize stock to 0
      };
    });

    setGeneratedVariants(variants);
    setSelectedVariants(variants);
    setStep(3);
    console.log("Variants generated:", variants.length);
    console.log("Variants with auto-assigned images:", variants);
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
    
    // NEW: When new images are selected, mark that old images should be replaced
    // Store the variant index in a set to track which variants have new images
    const variant = selectedVariants[variantIndex];
    const existingImages = variant?.images?.filter(img => !img.startsWith('blob:')) || [];
    
    // Create preview URLs
    const previewUrls = files.map(file => URL.createObjectURL(file));
    
    // Store files for later upload - replace old files if any exist
    setVariantImageFiles(prev => ({
      ...prev,
      [variantIndex]: files.map((file, idx) => ({
        file,
        preview: previewUrls[idx],
        isNew: true // Mark as new to indicate old images should be replaced
      }))
    }));

    // NEW: Replace all images with new ones (old ones will be deleted if new ones are uploaded)
    setSelectedVariants(prev => 
      prev.map((v, i) => 
        i === variantIndex ? { 
          ...v, 
          images: previewUrls, // Replace with new preview URLs
          hasNewImages: true // Flag to track that images were changed
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
      // NEW: Step 1 - Upload common images (for product.images - shown on cards)
      let finalCommonImageUrls = [...commonImageUrls]; // Keep existing uploaded URLs
      if (commonImageFiles.length > 0) {
        const uploadedCommonUrls = await uploadImages(commonImageFiles);
        finalCommonImageUrls = [...finalCommonImageUrls, ...uploadedCommonUrls];
      }

      // NEW: Step 2 - Upload color images and store them
      const uploadedColorImageUrls = { ...colorImageUrls }; // Keep existing uploaded URLs
      for (const [colorValue, files] of Object.entries(colorImageFiles)) {
        if (files && files.length > 0) {
          const uploadedUrls = await uploadImages(files);
          uploadedColorImageUrls[colorValue] = [
            ...(uploadedColorImageUrls[colorValue] || []),
            ...uploadedUrls
          ];
        }
      }

      // NEW: Step 3 - Upload variant-specific images (from Step 3 manual uploads)
      const uploadedVariantImages = {};
      for (const [variantIndex, files] of Object.entries(variantImageFiles)) {
        if (files && files.length > 0) {
          const fileObjects = files.map(f => f.file);
          const uploadedUrls = await uploadImages(fileObjects);
          uploadedVariantImages[variantIndex] = uploadedUrls;
        }
      }

      // NEW: Prepare final variants with proper image assignment
      let finalVariants = [];
      
      if (selectedVariants.length > 0) {
        // Use selected variants with their images
        finalVariants = selectedVariants.map((variant, index) => {
          // Priority 1: Manual variant-specific images from Step 3
          const uploadedVariantImgs = uploadedVariantImages[index] || [];
          
          // Priority 2: Color-specific images (if variant has Color spec)
          let colorBasedImages = [];
          const colorKey = Object.keys(variant.specs || {}).find(key => 
            key.toLowerCase() === 'color' || key.toLowerCase() === 'colour'
          );
          if (colorKey && variant.specs[colorKey]) {
            const colorValue = variant.specs[colorKey];
            // NEW: Normalize color value for consistent lookup (case-insensitive, whitespace-insensitive)
            const normalizeColorValue = (value) => {
              if (typeof value !== 'string') return value;
              return value.trim().toLowerCase();
            };
            const normalizedColorValue = normalizeColorValue(colorValue);
            // Try both normalized and original value for backward compatibility
            colorBasedImages = uploadedColorImageUrls[normalizedColorValue] || uploadedColorImageUrls[colorValue] || [];
          }
          
          // Priority 3: Common images as fallback
          const fallbackImages = finalCommonImageUrls || [];
          
          // Determine final images for this variant
          let variantImages = [];
          if (uploadedVariantImgs.length > 0) {
            // Manual uploads take priority
            variantImages = uploadedVariantImgs;
          } else if (colorBasedImages.length > 0) {
            // Use color-specific images
            variantImages = colorBasedImages;
          } else {
            // Use existing images (filter out blob URLs) or fallback to common
            const existingVariantImgs = variant.images?.filter(img => !img.startsWith('blob:')) || [];
            variantImages = existingVariantImgs.length > 0 ? existingVariantImgs : fallbackImages;
          }
          
          return {
            ...variant,
            images: variantImages,
            stock: variant.stock !== undefined ? variant.stock : 0
          };
        });
      } else {
        // Create default variant (should not happen if variants are required)
        const firstVariant = product?.variants?.[0];
        finalVariants = [{
          specs: {},
          price: firstVariant?.price || parseFloat(price) || 0,
          sku: `${name.replace(/\s+/g, '').toUpperCase().slice(0, 10)}-1`,
          enabled: true,
          images: firstVariant?.images || finalCommonImageUrls,
          stock: firstVariant?.stock || 0
        }];
      }

      // NEW: Use common images for product.images (shown on cards)
      const productImages = finalCommonImageUrls.length > 0 
        ? finalCommonImageUrls 
        : (product?.images || []);

      const parsedBasePrice = price === "" ? undefined : parseFloat(price);
      const payload = {
        name,
        description,
        // NEW: Make base price optional while adding product (variant prices can drive product price)
        ...(Number.isFinite(parsedBasePrice) ? { price: parsedBasePrice } : {}),
        category: selectedCategory ? selectedCategory.name : name,
        images: productImages // NEW: Use common images, not first variant images
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
          { id: toastId, icon: null }
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
          { id: toastId, icon: null }
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
        </div>,
        { icon: null }
      );
    } finally {
      setLoading(false);
    }
  };

  // NEW: Populate specs when navigating to Step 2 while editing (ensure they persist)
  useEffect(() => {
    if (step === 2 && product && selectedCategory && isOpen) {
      console.log("Navigating to Step 2 - ensuring specs are populated");
      
      const categoryRefId = product.categoryRef?._id || product.categoryRef;
      if (categoryRefId === selectedCategory._id || categoryRefId === selectedCategory._id?.toString()) {
        // Ensure single specs are populated from product
        if (product.specs) {
          const specsObj = product.specs instanceof Map 
            ? Object.fromEntries(product.specs)
            : product.specs;
          
          // Merge with existing to preserve any edits
          setSingleSpecs(prev => {
            const merged = { ...prev };
            Object.keys(specsObj).forEach(key => {
              if (!merged[key]) {
                merged[key] = specsObj[key];
              }
            });
            // Ensure all category specs are included
            if (selectedCategory.specs) {
              selectedCategory.specs.forEach(spec => {
                if (spec.type === 'single' && !merged[spec.name]) {
                  merged[spec.name] = specsObj[spec.name] || '';
                }
              });
            }
            return merged;
          });
        }
        
        // Ensure multiple specs are populated from variants
        if (product.variants && product.variants.length > 0) {
          const existingMultipleSpecs = {};
          
          product.variants.forEach(v => {
            const specsObj = v.specs instanceof Map 
              ? Object.fromEntries(v.specs)
              : (v.specs || {});
            
            Object.keys(specsObj).forEach(key => {
              if (!existingMultipleSpecs[key]) {
                const uniqueValues = [...new Set(
                  product.variants.map(v2 => {
                    const v2Specs = v2.specs instanceof Map 
                      ? Object.fromEntries(v2.specs)
                      : (v2.specs || {});
                    return v2Specs[key];
                  }).filter(Boolean)
                )];
                if (uniqueValues.length > 0) {
                  existingMultipleSpecs[key] = uniqueValues.join(', ');
                }
              }
            });
          });
          
          // Fill in any missing multiple specs from category
          if (selectedCategory.specs) {
            selectedCategory.specs.forEach(spec => {
              if (spec.type === 'multiple' && !existingMultipleSpecs[spec.name]) {
                existingMultipleSpecs[spec.name] = '';
              }
            });
          }
          
          // Merge with existing to preserve any edits
          setMultipleSpecs(prev => {
            const merged = { ...prev };
            Object.keys(existingMultipleSpecs).forEach(key => {
              if (!merged[key] || merged[key] === '') {
                merged[key] = existingMultipleSpecs[key];
              }
            });
            return merged;
          });
        }
      }
    }
  }, [step, product, selectedCategory, isOpen]);

  // NEW: Populate variants when navigating to Step 3 while editing (ensure they persist)
  useEffect(() => {
    if (step === 3 && product && product.variants && product.variants.length > 0 && isOpen) {
      console.log("Navigating to Step 3 - ensuring variants are populated");
      
      const variantsWithStock = product.variants.map(v => {
        // Handle Map format for specs
        const specsObj = v.specs instanceof Map 
          ? Object.fromEntries(v.specs)
          : (v.specs || {});
        
        return {
          ...v,
          specs: specsObj,
          stock: v.stock !== undefined ? v.stock : 0
        };
      });
      
      // Only update if variants haven't been set yet or if we're editing
      if (generatedVariants.length === 0 || generatedVariants.length !== variantsWithStock.length) {
        setGeneratedVariants(variantsWithStock);
      }
      if (selectedVariants.length === 0 || selectedVariants.length !== variantsWithStock.filter(v => v.enabled !== false).length) {
        setSelectedVariants(variantsWithStock.filter(v => v.enabled !== false) || []);
      }
    }
  }, [step, product, isOpen]);

  // Clean up image previews
  useEffect(() => {
    return () => {
      console.log("Cleaning up image previews");
      
      // Clean up common image previews
      commonImagePreviews.forEach(preview => {
        if (preview && preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview);
        }
      });
      
      // Clean up color image previews
      Object.values(colorImagePreviews).forEach(previews => {
        previews.forEach(preview => {
          if (preview && preview.startsWith('blob:')) {
            URL.revokeObjectURL(preview);
          }
        });
      });
      
      // Clean up variant image previews
      Object.values(variantImageFiles).forEach(files => {
        files.forEach(fileObj => {
          if (fileObj.preview && fileObj.preview.startsWith('blob:')) {
            URL.revokeObjectURL(fileObj.preview);
          }
        });
      });
    };
  }, [commonImagePreviews, colorImagePreviews, variantImageFiles]);

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
                  value={(() => {
                    // Handle both string and object categoryRef
                    if (selectedCategory) {
                      return selectedCategory._id || '';
                    }
                    if (product?.categoryRef) {
                      return product.categoryRef._id || product.categoryRef || '';
                    }
                    return '';
                  })()}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  disabled={!!product} // NEW: Disable category selection when editing
                  className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    product ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  required
                >
                  <option value="">Select a Category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name} {cat.specs?.length > 0 ? `(${cat.specs.length} specs)` : ''}
                    </option>
                  ))}
                </select>
                {product && (
                  <p className="text-xs text-gray-500 mt-1">
                    Category cannot be changed when editing a product
                  </p>
                )}
                
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

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!name || !description || !selectedCategory}
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
                    {product && generatedVariants.length > 0 && (
                      <p className="text-xs text-blue-700 mt-2 font-medium">
                        💡 Tip: Adding new values to multiple specs will create new variants while preserving existing ones. Click "Update Variants" to regenerate.
                      </p>
                    )}
                  </div>

                  {/* NEW: Common Product Images Section */}
                  <div className="mb-6 p-4 border rounded bg-white">
                    <label className="block text-sm font-medium mb-2">
                      Common Product Images *
                      <span className="ml-2 text-xs font-normal text-gray-500">
                        (Shown on product cards)
                      </span>
                    </label>
                    <p className="text-xs text-gray-600 mb-3">
                      Upload images that represent this product. These will be shown on product cards and used as fallback for variants without color-specific images.
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleCommonImageSelect}
                      className="w-full p-2 border rounded mb-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={uploading || loading}
                    />
                    {commonImagePreviews.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-2">
                          {commonImagePreviews.length} image(s) selected
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {commonImagePreviews.map((image, index) => (
                            <div key={index} className="relative">
                              <img
                                src={image}
                                alt={`Common ${index + 1}`}
                                className="w-full h-20 object-cover rounded border"
                              />
                              <button
                                type="button"
                                onClick={() => removeCommonImage(index)}
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

                  {/* NEW: Color-Specific Images Section (if Color is a multiple spec) */}
                  {(() => {
                    const colorSpec = selectedCategory.specs?.find(spec => 
                      spec.type === 'multiple' && 
                      (spec.name.toLowerCase() === 'color' || spec.name.toLowerCase() === 'colour')
                    );
                    
                    if (!colorSpec) return null;
                    
                    // Get color values from multipleSpecs
                    const colorValues = multipleSpecs[colorSpec.name] 
                      ? multipleSpecs[colorSpec.name].split(',').map(v => v.trim()).filter(v => v)
                      : [];
                    
                    if (colorValues.length === 0) {
                      return (
                        <div className="mb-6 p-4 border rounded bg-yellow-50">
                          <p className="text-sm text-yellow-800">
                            💡 Enter color values above to upload color-specific images. Each color will get its own images that will be automatically assigned to all variants of that color.
                          </p>
                        </div>
                      );
                    }
                    
                    return (
                      <div className="mb-6 p-4 border rounded bg-white">
                        <label className="block text-sm font-medium mb-2">
                          Color-Specific Images
                          <span className="ml-2 text-xs font-normal text-gray-500">
                            (Auto-assigned to variants by color)
                          </span>
                        </label>
                        <p className="text-xs text-gray-600 mb-3">
                          Upload images for each color. These images will be automatically assigned to all variants with that color (e.g., all "Red 64GB", "Red 128GB" variants will use Red images).
                        </p>
                        <div className="space-y-4">
                          {colorValues.map(colorValue => {
                            // NEW: Normalize color value for lookup while keeping original for display
                            const normalizeColorValue = (value) => {
                              if (typeof value !== 'string') return value;
                              return value.trim().toLowerCase();
                            };
                            const normalizedColorValue = normalizeColorValue(colorValue);
                            // Try both normalized and original value for backward compatibility
                            const previews = colorImagePreviews[normalizedColorValue] || colorImagePreviews[colorValue] || [];
                            
                            return (
                            <div key={colorValue} className="border rounded p-3 bg-gray-50">
                              <label className="block text-sm font-medium mb-2 text-gray-700">
                                {colorValue} Images
                              </label>
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => handleColorImageSelect(colorValue, e)}
                                className="w-full p-2 border rounded mb-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled={uploading || loading}
                              />
                              {previews.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-xs text-gray-600 mb-2">
                                    {previews.length} image(s) for {colorValue}
                                  </p>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {previews.map((image, index) => (
                                      <div key={index} className="relative">
                                        <img
                                          src={image}
                                          alt={`${colorValue} ${index + 1}`}
                                          className="w-full h-20 object-cover rounded border"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => removeColorImage(colorValue, index)}
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
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

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
                              disabled={!!product} // NEW: Disable multiple specs when editing
                              className={`w-full p-2 border rounded mb-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                product ? 'bg-gray-100 cursor-not-allowed' : ''
                              }`}
                              required={spec.required}
                            />
                            {multipleSpecs[spec.name] && (
                              <div className="text-sm text-green-600 mb-2">
                                Values: {multipleSpecs[spec.name]}
                              </div>
                            )}
                            {product && (
                              <p className="text-xs text-orange-600 mb-2">
                                ⚠️ Multiple specs cannot be changed when editing. Variants are already created.
                              </p>
                            )}
                            {!product && (
                              <p className="text-xs text-gray-500">
                                Separate values with commas. These will create product variants.
                              </p>
                            )}
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
                  {product && generatedVariants.length > 0 ? (
                    // When editing and variants exist, go directly to Step 3
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors"
                    >
                      Go to Variants →
                    </button>
                  ) : (
                    // When creating new product, generate variants
                    <button
                      type="button"
                      onClick={generateVariants}
                      disabled={
                        !Object.keys(multipleSpecs).some(key => multipleSpecs[key] && multipleSpecs[key].trim())
                      }
                      className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Generate Variants →
                    </button>
                  )}
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

              {/* Variant Selection Controls - Only show when creating new product */}
              {!product && (
                <>
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
                        
                        // NEW: Filter variant specs to only show multiple specs
                        // Get multiple spec names from category
                        const multipleSpecNames = selectedCategory?.specs
                          ?.filter(spec => spec.type === 'multiple')
                          .map(spec => spec.name) || [];
                        
                        // Filter variant specs to only include multiple specs
                        const variantSpecsObj = variant.specs instanceof Map 
                          ? Object.fromEntries(variant.specs) 
                          : (variant.specs || {});
                        
                        // Only show specs that are marked as 'multiple' in category
                        const displaySpecs = selectedCategory && multipleSpecNames.length > 0
                          ? Object.entries(variantSpecsObj).filter(([key]) => multipleSpecNames.includes(key))
                          : Object.entries(variantSpecsObj); // Fallback: show all (should be only multiple specs anyway)
                        
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
                                  {displaySpecs.map(([key, value]) => (
                                    <span key={key} className="mr-2">
                                      {key}: <strong>{value}</strong>
                                    </span>
                                  ))}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  SKU: {variant.sku}
                                </div>
                                <div className="text-xs text-green-600 mt-1">
                                  Price: €{variant.price}
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
                </>
              )}

              {/* When editing, show simple header */}
              {product && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-blue-800">
                    Editing {selectedVariants.length} variant(s) - You can edit images and quantities only
                  </span>
                </div>
              )}

              {/* Variants Configuration */}
              {selectedVariants.length > 0 && (
                <div className="border rounded p-4 bg-white">
                  <h4 className="font-semibold mb-3">
                    {product ? `Edit Variants (${selectedVariants.length})` : `Configure Selected Variants (${selectedVariants.length})`}
                  </h4>
                  {product && (
                    <p className="text-sm text-gray-600 mb-4">
                      You can edit prices, images, and quantities.
                    </p>
                  )}
                  <div className="space-y-6">
                    {(() => {
                      // NEW: Hide redundant variants that only differ by battery condition (for all products)
                      const seenSpecCombos = new Set();

                      return selectedVariants.map((variant, index) => {
                      // NEW: Filter variant specs to only show multiple specs
                      // Get multiple spec names from category
                      const multipleSpecNames = selectedCategory?.specs
                        ?.filter(spec => spec.type === 'multiple')
                        .map(spec => spec.name) || [];
                      
                      // Filter variant specs to only include multiple specs
                      const variantSpecsObj = variant.specs instanceof Map 
                        ? Object.fromEntries(variant.specs) 
                        : (variant.specs || {});

                      // Build a key that ignores battery-related specs to detect duplicates
                      const specsWithoutBattery = {};
                      Object.entries(variantSpecsObj || {}).forEach(([key, value]) => {
                        const normalized = String(key || '').toLowerCase();
                        if (normalized === 'battery condition' || normalized === 'battery') return;
                        specsWithoutBattery[key] = value;
                      });
                      const comboKey = JSON.stringify(specsWithoutBattery);
                      if (seenSpecCombos.has(comboKey)) {
                        // Skip rendering this variant row as it's redundant
                        return null;
                      }
                      seenSpecCombos.add(comboKey);
                      
                      // Only show specs that are marked as 'multiple' in category
                      const displaySpecs = selectedCategory && multipleSpecNames.length > 0
                        ? Object.entries(variantSpecsObj).filter(([key]) => multipleSpecNames.includes(key))
                        : Object.entries(variantSpecsObj); // Fallback: show all (should be only multiple specs anyway)
                      
                      // Get appearance and battery from direct properties or from specs map (same as ProductDetailPage)
                      const appearance = variant.appearance || 
                        variantSpecsObj['Appearance (Phone Condition)'] || 
                        variantSpecsObj['Appearance'] || 
                        variantSpecsObj['appearance'];
                      
                      const battery = variant.battery || 
                        variantSpecsObj['Battery Condition'] || 
                        variantSpecsObj['Battery'] || 
                        variantSpecsObj['battery'];
                      
                      // Filter out appearance and battery from displaySpecs since we'll show them separately
                      const filteredDisplaySpecs = displaySpecs.filter(([key]) => {
                        const keyLower = key.toLowerCase();
                        return !['Appearance (Phone Condition)', 'Appearance', 'appearance', 'Battery Condition', 'Battery', 'battery'].includes(key);
                      });
                      
                      return (
                      <div key={index} className="border rounded p-4 bg-gray-50">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h5 className="font-semibold text-lg">Variant {index + 1}</h5>
                            <div className="text-sm text-gray-600">
                              {/* Show Appearance if available */}
                              {appearance && (
                                <span className="mr-3">
                                  Appearance: <strong>{appearance}</strong>
                                </span>
                              )}
                              {/* Battery Condition is intentionally not shown in admin variant summary */}
                              {/* Show other multiple specs */}
                              {filteredDisplaySpecs.map(([key, value]) => (
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
                            <label className="block text-sm font-medium mb-1">Price (€) *</label>
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
                          {product && (
                            <p className="text-xs text-gray-600 mb-2">
                              Upload new images to replace existing ones. Old images will be deleted from Cloudinary.
                            </p>
                          )}
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
                      );
                    });
                    })()}
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