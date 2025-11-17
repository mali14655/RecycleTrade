import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    specs: []
  });
  const [newSpec, setNewSpec] = useState({ name: '', type: 'single', required: false });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/categories`);
      setCategories(res.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('Error loading categories');
    }
  };

  const addSpec = () => {
    if (!newSpec.name.trim()) {
      alert('Please enter a spec name');
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
      alert('Please enter category name');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      
      if (editingCategory) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/categories/${editingCategory._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('Category updated successfully!');
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/categories`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('Category created successfully!');
      }
      
      resetForm();
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      alert(error.response?.data?.message || 'Error saving category');
    } finally {
      setLoading(false);
    }
  };

  const editCategory = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      specs: category.specs || []
    });
    setShowForm(true);
  };

  const deleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/categories/${categoryId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Category deleted successfully!');
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert(error.response?.data?.message || 'Error deleting category');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', specs: [] });
    setEditingCategory(null);
    setShowForm(false);
    setNewSpec({ name: '', type: 'single', required: false });
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

              {/* Display added specs */}
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
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
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
    </div>
  );
}