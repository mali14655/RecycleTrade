
import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function SellToCompany() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [submittedForms, setSubmittedForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("accessToken");

  // Redirect if user is not a seller
  useEffect(() => {
    if (user && user.user?.role !== "seller") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const fetchSubmittedForms = async () => {
    try {
      setFetchLoading(true);
      setError("");
      console.log("Fetching forms...");
      
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/seller-company/my-forms`,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          } 
        }
      );
      
      console.log("Forms fetched:", res.data);
      setSubmittedForms(res.data);
    } catch (err) {
      console.error("Error fetching forms:", err);
      setError(err.response?.data?.message || "Failed to load forms");
      setSubmittedForms([]); // Reset to empty array on error
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.user?.role === "seller") {
      fetchSubmittedForms();
    }
  }, [user]);

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      console.log("Submitting form...");
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/seller-company/form`,
        { productName, quantity, price },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      console.log("Form submitted:", res.data);
      toast.success(
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Form Submitted</p>
            <p className="text-sm text-gray-600">Form submitted successfully</p>
          </div>
        </div>
      );
      setProductName("");
      setQuantity("");
      setPrice("");
      fetchSubmittedForms(); // Refresh the list
    } catch (err) {
      console.error("Form submission error:", err);
      const errorMsg = err.response?.data?.message || "Error submitting form";
      setError(errorMsg);
      toast.error(
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Submission Failed</p>
            <p className="text-sm text-gray-600">{errorMsg}</p>
          </div>
        </div>
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div>Loading...</div>;
  
  // Additional role check
  if (user.user?.role !== "seller") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-600 mt-2">You need to be a seller to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-2xl p-8 mb-8">
          <h1 className="text-3xl font-bold mb-2">Sell to Company</h1>
          <p className="text-green-100">
            Submit product forms to sell your items to the company. Admin will review and process your submissions.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Submit Form Section */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Submit New Product Form</h2>
            <form onSubmit={submitForm} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter product name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  placeholder="Enter quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                  min="1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($) *
                </label>
                <input
                  type="number"
                  placeholder="Enter price per unit"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Submit Form"}
              </button>
            </form>
          </div>

          {/* Submitted Forms Section */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">My Submitted Forms</h2>
            
            {fetchLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading your forms...</p>
              </div>
            ) : submittedForms.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>No forms submitted yet</p>
                <p className="text-sm mt-2">Submit your first product form to get started!</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {submittedForms.map((form) => (
                  <div key={form._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-800">{form.productName}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        form.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {form.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><span className="font-medium">Quantity:</span> {form.quantity}</p>
                      <p><span className="font-medium">Price:</span> ${form.price}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Submitted: {new Date(form.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}