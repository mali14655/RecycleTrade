import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal'; // YEH LINE ADD KAREIN


export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    specs: []
  });
  const [newSpec, setNewSpec] = useState({ name: '', type: 'single', required: false });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
const [confirmModal, setConfirmModal] = useState({
  isOpen: false,
  categoryToDelete: null,
  isLoading: false
});
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/categories`);
      setCategories(res.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error(
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Failed to Load</p>
            <p className="text-sm text-gray-600">Please try again</p>
          </div>
        </div>,
        { icon: null }
      );
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // File validation
      if (file.size > 5 * 1024 * 1024) {
        toast.error(
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">File Too Large</p>
              <p className="text-sm text-gray-600">File size should be less than 5MB</p>
            </div>
          </div>
        );
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error(
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">Invalid File</p>
              <p className="text-sm text-gray-600">Please select an image file</p>
            </div>
          </div>
        );
        return;
      }

      // Preview ke liye blob URL banayein
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setSelectedImageFile(file); // Actual file store karein
      
      // Clear existing image URL
      setFormData(prev => ({ ...prev, image: '' }));
    }
  };

  const uploadImageToCloudinary = async (file) => {
    try {
      const token = localStorage.getItem('accessToken');
      const uploadFormData = new FormData();
      uploadFormData.append('images', file);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/upload/upload`,
        uploadFormData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.images && response.data.images.length > 0) {
        return response.data.images[0]; // Cloudinary URL return karein
      }
      throw new Error('Image upload failed');
    } catch (error) {
      console.error('Image upload error:', error);
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
        </div>,
        { icon: null }
      );
      throw error;
    }
  };

  const addSpec = () => {
    if (!newSpec.name.trim()) {
      toast.error(
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Missing Information</p>
            <p className="text-sm text-gray-600">Please enter a spec name</p>
          </div>
        </div>,
        { icon: null }
      );
      return;
    }

    const spec = {
      name: newSpec.name.trim(),
      type: newSpec.type,
      required: newSpec.required
    };
    
    setFormData(prev => ({
      ...prev,
      specs: [...prev.specs, spec]
    }));
    
    setNewSpec({ name: '', type: 'single', required: false });
  };

  const removeSpec = (index) => {
    setFormData(prev => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== index)
    }));
  };

const submitCategory = async (e) => {
  e.preventDefault();
  if (!formData.name.trim()) {
    toast.error(
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <p className="font-medium text-gray-900">Missing Information</p>
          <p className="text-sm text-gray-600">Please enter category name</p>
        </div>
      </div>
    );
    return;
  }

  setLoading(true);
  try {
    const token = localStorage.getItem('accessToken');
    console.log('Token:', token);
    console.log('Form Data:', formData);
    
    let finalFormData = { ...formData };

    // Agar new image select ki hai toh Cloudinary par upload karein
    if (selectedImageFile) {
      setUploadingImage(true);
      const toastId = toast.loading(
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black/10 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Uploading Image</p>
            <p className="text-sm text-gray-600">Please wait...</p>
          </div>
        </div>,
        { icon: null }
      );
      
      console.log('Uploading image to Cloudinary...');
      const cloudinaryUrl = await uploadImageToCloudinary(selectedImageFile);
      console.log('Cloudinary URL:', cloudinaryUrl);
      finalFormData.image = cloudinaryUrl;
      setUploadingImage(false);
      toast.dismiss(toastId);
    }

    console.log('Final Data to send:', finalFormData);

    const toastId = toast.loading(
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-black/10 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <p className="font-medium text-gray-900">Saving Category</p>
          <p className="text-sm text-gray-600">Please wait...</p>
        </div>
      </div>
    );

    if (editingCategory) {
      console.log('Updating category:', editingCategory._id);
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/categories/${editingCategory._id}`,
        finalFormData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Update response:', response.data);
      
      toast.success(
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Category Updated</p>
            <p className="text-sm text-gray-600">{formData.name} updated successfully</p>
          </div>
        </div>,
        { id: toastId, icon: null }
      );
    } else {
      console.log('Creating new category');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/categories`,
        finalFormData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Create response:', response.data);
      
      toast.success(
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Category Created</p>
            <p className="text-sm text-gray-600">{formData.name} created successfully</p>
          </div>
        </div>,
        { id: toastId, icon: null }
      );
    }
    
    resetForm();
    fetchCategories();
  } catch (error) {
    console.error('Error saving category:', error);
    console.error('Error response:', error.response?.data);
    
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
    setUploadingImage(false);
  }
};

  const editCategory = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      image: category.image || '',
      specs: category.specs || []
    });
    setImagePreview(category.image || '');
    setSelectedImageFile(null); // Reset selected file
    setShowForm(true);
  };

const deleteCategory = async (categoryId) => {
  const categoryToDelete = categories.find(cat => cat._id === categoryId);
  setConfirmModal({
    isOpen: true,
    categoryToDelete,
    isLoading: false
  });
};
const handleConfirmDelete = async () => {
  if (!confirmModal.categoryToDelete) return;

  setConfirmModal(prev => ({ ...prev, isLoading: true }));

  try {
    const token = localStorage.getItem('accessToken');
    const categoryToDelete = confirmModal.categoryToDelete;

    const toastId = toast.loading(
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-black/10 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <p className="font-medium text-gray-900">Deleting Category</p>
          <p className="text-sm text-gray-600">Please wait...</p>
        </div>
      </div>
    );

    await axios.delete(
      `${import.meta.env.VITE_API_URL}/categories/${categoryToDelete._id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    toast.success(
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <p className="font-medium text-gray-900">Category Deleted</p>
          <p className="text-sm text-gray-600">{categoryToDelete?.name} deleted successfully</p>
        </div>
      </div>,
      { id: toastId }
    );
    
    fetchCategories();
  } catch (error) {
    console.error('Error deleting category:', error);
    
    toast.error(
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <p className="font-medium text-gray-900">Failed to Delete</p>
          <p className="text-sm text-gray-600">Please try again</p>
        </div>
      </div>
    );
  } finally {
    setConfirmModal({
      isOpen: false,
      categoryToDelete: null,
      isLoading: false
    });
  }
};

const handleCloseConfirm = () => {
  setConfirmModal({
    isOpen: false,
    categoryToDelete: null,
    isLoading: false
  });
};
  const resetForm = () => {
    setFormData({ name: '', description: '', image: '', specs: [] });
    setEditingCategory(null);
    setShowForm(false);
    setNewSpec({ name: '', type: 'single', required: false });
    setImagePreview('');
    setSelectedImageFile(null);
  };

  const removeImage = () => {
    setImagePreview('');
    setSelectedImageFile(null);
    setFormData(prev => ({ ...prev, image: '' }));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Category Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          Add Category
        </button>
      </div>

      {/* Category Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h3>
            
            <form onSubmit={submitCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2 border rounded"
                  rows="3"
                />
              </div>

              {/* Image Upload - Properly Handled */}
              <div>
                <label className="block text-sm font-medium mb-2">Category Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full p-2 border rounded"
                  disabled={uploadingImage}
                />
                <p className="text-xs text-gray-500 mt-1">Max file size: 5MB</p>
                
                {/* Image Preview */}
                {(imagePreview || formData.image) && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                    <div className="relative inline-block">
                      <img 
                        src={imagePreview || formData.image} 
                        alt="Preview" 
                        className="w-32 h-32 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                    {selectedImageFile && (
                      <p className="text-xs text-gray-500 mt-1">
                        Selected file: {selectedImageFile.name}
                      </p>
                    )}
                  </div>
                )}

                {uploadingImage && (
                  <div className="mt-2 text-blue-600 text-sm">
                    Uploading image...
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Specifications</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Spec Name (e.g., Color, Storage)"
                    value={newSpec.name}
                    onChange={(e) => setNewSpec(prev => ({ ...prev, name: e.target.value }))}
                    className="p-2 border rounded md:col-span-2"
                  />
                  
                  <select
                    value={newSpec.type}
                    onChange={(e) => setNewSpec(prev => ({ ...prev, type: e.target.value }))}
                    className="p-2 border rounded"
                  >
                    <option value="single">Single Value</option>
                    <option value="multiple">Multiple Values</option>
                  </select>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newSpec.required}
                      onChange={(e) => setNewSpec(prev => ({ ...prev, required: e.target.checked }))}
                      className="mr-2"
                    />
                    <label className="text-sm">Required</label>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={addSpec}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  Add Spec
                </button>
              </div>

              {formData.specs.length > 0 && (
                <div className="border rounded p-3">
                  <h5 className="font-medium mb-2">Added Specs:</h5>
                  {formData.specs.map((spec, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded mb-1">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{spec.name}</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            spec.type === 'single' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {spec.type}
                          </span>
                          {spec.required && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                              Required
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSpec(index)}
                        className="text-red-600 hover:text-red-800 ml-2"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border rounded hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || uploadingImage}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : uploadingImage ? 'Uploading Image...' : editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Categories Yet</h3>
            <p className="text-gray-600">Create your first category to get started with the variant system.</p>
          </div>
        ) : (
          categories.map(category => (
            <div key={category._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg text-gray-800">{category.name}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => editCategory(category)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCategory(category._id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              {category.image && (
                <div className="mb-3">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                </div>
              )}
              
              {category.description && (
                <p className="text-gray-600 mb-3 text-sm">{category.description}</p>
              )}
              
              {category.specs.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 text-sm">Specifications:</h4>
                  <div className="space-y-2">
                    {category.specs.map((spec, index) => (
                      <div key={index} className="text-sm">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{spec.name}</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            spec.type === 'single' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {spec.type}
                          </span>
                          {spec.required && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                              Required
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <ConfirmModal
      isOpen={confirmModal.isOpen}
      onClose={handleCloseConfirm}
      onConfirm={handleConfirmDelete}
      title="Delete Category"
      message={`Are you sure you want to delete "${confirmModal.categoryToDelete?.name}"? This action cannot be undone.`}
      confirmText="Delete Category"
      cancelText="Cancel"
      type="danger"
      isLoading={confirmModal.isLoading}
    />
    </div>
  );
}