// // import React, { useContext, useEffect, useState } from "react";
// // import { AuthContext } from "../context/AuthContext";
// // import axios from "axios";
// // import SellerFormModal from "../components/SellerFormModal";
// // import ProductCatalog from "../components/ProductCatalog";
// // import ProductModal from "../components/ProductModal";

// // export default function Dashboard() {
// //   const { user } = useContext(AuthContext);
// //   const [pendingSellers, setPendingSellers] = useState([]);
// //   const [sellerForms, setSellerForms] = useState([]);
// //   const [sellerOrders, setSellerOrders] = useState([]);
// //   const [companyOrders, setCompanyOrders] = useState([]);
// //   const [sellerCandidateOrders, setSellerCandidateOrders] = useState([]);

// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [productName, setProductName] = useState("");
// //   const [quantity, setQuantity] = useState("");
// //   const [price, setPrice] = useState("");

// //   const [isProductModalOpen, setIsProductModalOpen] = useState(false);
// //   const [myProducts, setMyProducts] = useState([]);
// //   const [allProducts, setAllProducts] = useState([]);
// //   const [editingProduct, setEditingProduct] = useState(null);

// //   if (!user) return <div>Loading...</div>;
// //   const { name, role } = user.user;
// //   const token = localStorage.getItem("accessToken");

// //   const fetchSellerOrders = async () => {
// //     try {
// //       const res = await axios.get(`${import.meta.env.VITE_API_URL}/orders/seller`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //       setSellerOrders(res.data);
// //     } catch (err) {
// //       console.log(err);
// //     }
// //   };

// //   const fetchCompanyOrders = async () => {
// //     try {
// //       const res = await axios.get(`${import.meta.env.VITE_API_URL}/orders/all`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //       setCompanyOrders(res.data);
// //     } catch (err) {
// //       console.log(err);
// //     }
// //   };

// //   const fetchSellerCandidateOrders = async () => {
// //     try {
// //       const res = await axios.get(`${import.meta.env.VITE_API_URL}/orders/admin/seller-candidates`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //       setSellerCandidateOrders(res.data);
// //     } catch (err) {
// //       console.log(err);
// //     }
// //   };

// //   useEffect(() => {
// //     if (role === "seller_candidate") fetchSellerOrders();
// //     if (role === "admin" || role === "company") {
// //       fetchCompanyOrders();
// //       fetchSellerCandidateOrders();
// //     }
// //   }, [role]);

// //   const fetchProducts = async () => {
// //     try {
// //       const res = await axios.get(`${import.meta.env.VITE_API_URL}/products`);
// //       setAllProducts(res.data);
// //       if (
// //         role === "seller_candidate" ||
// //         role === "seller" ||
// //         role === "admin"
// //       ) {
// //         setMyProducts(res.data.filter((p) => p.sellerId._id === user.user._id));
// //       }
// //     } catch (err) {
// //       console.log(err);
// //     }
// //   };

// //   const deleteProduct = async (id) => {
// //     if (window.confirm("Are you sure you want to delete this product?")) {
// //       try {
// //         await axios.delete(`${import.meta.env.VITE_API_URL}/products/${id}`, {
// //           headers: { Authorization: `Bearer ${token}` },
// //         });
// //         fetchProducts();
// //       } catch (err) {
// //         console.log(err);
// //       }
// //     }
// //   };

// //   const fetchSellerForms = async () => {
// //     try {
// //       const res = await axios.get(
// //         `${import.meta.env.VITE_API_URL}/seller-company/admin/forms`,
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       setSellerForms(res.data);
// //     } catch (err) {
// //       console.log(err);
// //     }
// //   };

// //   const processForm = async (id) => {
// //     try {
// //       await axios.post(
// //         `${import.meta.env.VITE_API_URL}/seller-company/admin/forms/${id}/process`,
// //         {},
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       fetchSellerForms();
// //     } catch (err) {
// //       console.log(err);
// //     }
// //   };

// //   const fetchPendingSellers = async () => {
// //     try {
// //       const res = await axios.get(
// //         `${import.meta.env.VITE_API_URL}/admin/seller-requests`,
// //         {
// //           headers: { Authorization: `Bearer ${token}` },
// //         }
// //       );
// //       setPendingSellers(res.data);
// //     } catch (err) {
// //       console.log(err);
// //     }
// //   };

// //   const approveSeller = async (id) => {
// //     try {
// //       await axios.post(
// //         `${import.meta.env.VITE_API_URL}/admin/verify-seller/${id}`,
// //         {},
// //         {
// //           headers: { Authorization: `Bearer ${token}` },
// //         }
// //       );
// //       fetchPendingSellers();
// //     } catch (err) {
// //       console.log(err);
// //     }
// //   };

// //   const rejectSeller = async (id) => {
// //     try {
// //       await axios.post(
// //         `${import.meta.env.VITE_API_URL}/admin/reject-seller/${id}`,
// //         {},
// //         {
// //           headers: { Authorization: `Bearer ${token}` },
// //         }
// //       );
// //       fetchPendingSellers();
// //     } catch (err) {
// //       console.log(err);
// //     }
// //   };

// //   const submitForm = async (e) => {
// //     e.preventDefault();
// //     try {
// //       await axios.post(
// //         `${import.meta.env.VITE_API_URL}/seller-company/form`,
// //         { productName, quantity, price },
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       alert("Form submitted successfully!");
// //       setProductName("");
// //       setQuantity("");
// //       setPrice("");
// //       setIsModalOpen(false);
// //     } catch (err) {
// //       alert(err.response?.data?.message || "Error submitting form");
// //     }
// //   };

// //   const processOrder = async (orderId) => {
// //     try {
// //       await axios.post(
// //         `${import.meta.env.VITE_API_URL}/orders/${orderId}/process`,
// //         {},
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       // Refresh all order data
// //       if (role === "seller_candidate") fetchSellerOrders();
// //       if (role === "admin" || role === "company") {
// //         fetchCompanyOrders();
// //         fetchSellerCandidateOrders();
// //       }
// //       alert("Order processed successfully!");
// //     } catch (err) {
// //       console.log(err);
// //       alert("Error processing order");
// //     }
// //   };

// //   useEffect(() => {
// //     fetchProducts();
// //     if (role === "admin") {
// //       fetchPendingSellers();
// //       fetchSellerForms();
// //     }
// //   }, [role]);

// //   // Helper function to render order details
// //   const renderOrderDetails = (order) => {
// //     const buyerInfo = order.userId
// //       ? `Customer: ${order.userId.name} (${order.userId.email}) - ${order.userId.phone || 'No phone'}`
// //       : `Guest: ${order.guestInfo?.name} (${order.guestInfo?.email}) - ${order.guestInfo?.phone || 'No phone'}`;

// //     const address = order.userId
// //       ? 'Address: Customer address from profile'
// //       : `Address: ${order.guestInfo?.address || 'No address provided'}`;

// //     return (
// //       <div className="text-sm text-gray-600 mt-1">
// //         <div>{buyerInfo}</div>
// //         <div>{address}</div>
// //       </div>
// //     );
// //   };

// //   return (
// //     <div className="p-6 max-w-7xl mx-auto">
// //       <h2 className="text-3xl font-bold mb-6">{name}'s Dashboard</h2>

// //       {/* Admin Panel */}
// //       {role === "admin" && (
// //         <div className="mb-6 p-4 border rounded shadow">
// //           <h3 className="text-xl font-semibold mb-2">Admin Panel</h3>

// //           <button
// //             onClick={() => {
// //               setEditingProduct(null);
// //               setIsProductModalOpen(true);
// //             }}
// //             className="bg-green-600 text-white px-4 py-2 rounded mb-4"
// //           >
// //             Add Product
// //           </button>

// //           <ProductModal
// //             isOpen={isProductModalOpen}
// //             onClose={() => {
// //               setIsProductModalOpen(false);
// //               setEditingProduct(null);
// //             }}
// //             token={token}
// //             fetchProducts={fetchProducts}
// //             product={editingProduct}
// //           />

// //           <h4 className="font-semibold mb-2">Pending Seller Candidates</h4>
// //           <table className="w-full border mb-4">
// //             <thead>
// //               <tr className="border-b">
// //                 <th className="p-2 text-left">Name</th>
// //                 <th className="p-2 text-left">Email</th>
// //                 <th className="p-2 text-left">Action</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {pendingSellers.map((seller) => (
// //                 <tr key={seller._id} className="border-b">
// //                   <td className="p-2">{seller.name}</td>
// //                   <td className="p-2">{seller.email}</td>
// //                   <td className="p-2">
// //                     <button
// //                       onClick={() => approveSeller(seller._id)}
// //                       className="bg-green-600 text-white px-2 py-1 rounded mr-2"
// //                     >
// //                       Approve
// //                     </button>
// //                     <button
// //                       onClick={() => rejectSeller(seller._id)}
// //                       className="bg-red-600 text-white px-2 py-1 rounded"
// //                     >
// //                       Reject
// //                     </button>
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>

// //           <h4 className="font-semibold mb-2">Submitted Seller Forms</h4>
// //           <table className="w-full border">
// //             <thead>
// //               <tr className="border-b">
// //                 <th className="p-2 text-left">Seller</th>
// //                 <th className="p-2 text-left">Product</th>
// //                 <th className="p-2 text-left">Quantity</th>
// //                 <th className="p-2 text-left">Price</th>
// //                 <th className="p-2 text-left">Status</th>
// //                 <th className="p-2 text-left">Action</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {sellerForms.map((form) => (
// //                 <tr key={form._id} className="border-b">
// //                   <td className="p-2">{form.sellerId.name}</td>
// //                   <td className="p-2">{form.productName}</td>
// //                   <td className="p-2">{form.quantity}</td>
// //                   <td className="p-2">{form.price}</td>
// //                   <td className="p-2 capitalize">{form.status}</td>
// //                   <td className="p-2">
// //                     {form.status === "pending" && (
// //                       <button
// //                         onClick={() => processForm(form._id)}
// //                         className="bg-green-600 text-white px-2 py-1 rounded"
// //                       >
// //                         Mark Processed
// //                       </button>
// //                     )}
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>
// //       )}

// //       {/* My Products (Sellers/Admins) */}
// //       {(role === "seller_candidate" ||
// //         role === "seller" ||
// //         role === "admin") && (
// //         <div className="mb-6 p-4 border rounded shadow">
// //           <h3 className="text-xl font-semibold mb-2">My Products</h3>
// //           <button
// //             onClick={() => {
// //               setEditingProduct(null);
// //               setIsProductModalOpen(true);
// //             }}
// //             className="bg-green-600 text-white px-4 py-2 rounded mb-4"
// //           >
// //             Add Product
// //           </button>

// //           <ProductModal
// //             isOpen={isProductModalOpen}
// //             onClose={() => {
// //               setIsProductModalOpen(false);
// //               setEditingProduct(null);
// //             }}
// //             token={token}
// //             fetchProducts={fetchProducts}
// //             product={editingProduct}
// //           />

// //           <table className="w-full border">
// //             <thead>
// //               <tr className="border-b">
// //                 <th className="p-2 text-left">Name</th>
// //                 <th className="p-2 text-left">Price</th>
// //                 <th className="p-2 text-left">Quantity</th>
// //                 <th className="p-2 text-left">Category</th>
// //                 <th className="p-2 text-left">Actions</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {myProducts.map((product) => (
// //                 <tr key={product._id} className="border-b">
// //                   <td className="p-2">{product.name}</td>
// //                   <td className="p-2">${product.price}</td>
// //                   <td className="p-2">{product.quantity}</td>
// //                   <td className="p-2">{product.category}</td>
// //                   <td className="p-2 flex gap-2">
// //                     <button
// //                       onClick={() => {
// //                         setEditingProduct(product);
// //                         setIsProductModalOpen(true);
// //                       }}
// //                       className="bg-yellow-500 text-white px-2 py-1 rounded"
// //                     >
// //                       Edit
// //                     </button>
// //                     <button
// //                       onClick={() => deleteProduct(product._id)}
// //                       className="bg-red-600 text-white px-2 py-1 rounded"
// //                     >
// //                       Delete
// //                     </button>
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>
// //       )}

// //       {/* ------------------- ADMIN ORDERS ------------------- */}
// //       {role === "admin" && (
// //         <div className="space-y-6">
// //           {/* Admin New Orders */}
// //           <div className="p-4 border rounded shadow">
// //             <h3 className="text-xl font-semibold mb-4">New Orders (Admin)</h3>
// //             <table className="w-full border">
// //               <thead>
// //                 <tr className="border-b bg-gray-50">
// //                   <th className="p-2 text-left">Order ID</th>
// //                   <th className="p-2 text-left">Items</th>
// //                   <th className="p-2 text-left">Total</th>
// //                   <th className="p-2 text-left">Status</th>
// //                   <th className="p-2 text-left">Payment</th>
// //                   <th className="p-2 text-left">Customer Details</th>
// //                   <th className="p-2 text-left">Action</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {companyOrders
// //                   .filter((order) => order.orderStatus === "Pending")
// //                   .map((order) => (
// //                     <tr key={order._id} className="border-b">
// //                       <td className="p-2 font-mono text-sm">{order._id}</td>
// //                       <td className="p-2">
// //                         {order.items.map((item, index) => (
// //                           <div key={index} className="text-sm">
// //                             {item.productId?.name} (Qty: {item.quantity}) - ${item.price}
// //                           </div>
// //                         ))}
// //                       </td>
// //                       <td className="p-2">${order.total}</td>
// //                       <td className="p-2">{order.orderStatus}</td>
// //                       <td className="p-2">{order.paymentStatus} ({order.paymentMethod})</td>
// //                       <td className="p-2">
// //                         {renderOrderDetails(order)}
// //                       </td>
// //                       <td className="p-2">
// //                         <button
// //                           onClick={() => processOrder(order._id)}
// //                           className="bg-green-600 text-white px-3 py-1 rounded text-sm"
// //                         >
// //                           Process
// //                         </button>
// //                       </td>
// //                     </tr>
// //                   ))}
// //               </tbody>
// //             </table>
// //           </div>

// //           {/* Admin Processed Orders */}
// //           <div className="p-4 border rounded shadow">
// //             <h3 className="text-xl font-semibold mb-4">Processed Orders (Admin)</h3>
// //             <table className="w-full border">
// //               <thead>
// //                 <tr className="border-b bg-gray-50">
// //                   <th className="p-2 text-left">Order ID</th>
// //                   <th className="p-2 text-left">Items</th>
// //                   <th className="p-2 text-left">Total</th>
// //                   <th className="p-2 text-left">Status</th>
// //                   <th className="p-2 text-left">Payment</th>
// //                   <th className="p-2 text-left">Customer Details</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {companyOrders
// //                   .filter((order) => order.orderStatus === "Processing" || order.orderStatus === "Delivered")
// //                   .map((order) => (
// //                     <tr key={order._id} className="border-b">
// //                       <td className="p-2 font-mono text-sm">{order._id}</td>
// //                       <td className="p-2">
// //                         {order.items.map((item, index) => (
// //                           <div key={index} className="text-sm">
// //                             {item.productId?.name} (Qty: {item.quantity}) - ${item.price}
// //                           </div>
// //                         ))}
// //                       </td>
// //                       <td className="p-2">${order.total}</td>
// //                       <td className="p-2">{order.orderStatus}</td>
// //                       <td className="p-2">{order.paymentStatus} ({order.paymentMethod})</td>
// //                       <td className="p-2">
// //                         {renderOrderDetails(order)}
// //                       </td>
// //                     </tr>
// //                   ))}
// //               </tbody>
// //             </table>
// //           </div>

// //           {/* Seller Candidate New Orders */}
// //           <div className="p-4 border rounded shadow">
// //             <h3 className="text-xl font-semibold mb-4">Seller Candidate - New Orders</h3>
// //             <table className="w-full border">
// //               <thead>
// //                 <tr className="border-b bg-gray-50">
// //                   <th className="p-2 text-left">Order ID</th>
// //                   <th className="p-2 text-left">Seller</th>
// //                   <th className="p-2 text-left">Items</th>
// //                   <th className="p-2 text-left">Total</th>
// //                   <th className="p-2 text-left">Status</th>
// //                   <th className="p-2 text-left">Customer Details</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {sellerCandidateOrders
// //                   .filter((order) => order.orderStatus === "Pending")
// //                   .map((order) => (
// //                     <tr key={order._id} className="border-b">
// //                       <td className="p-2 font-mono text-sm">{order._id}</td>
// //                       <td className="p-2">
// //                         {order.items
// //                           .filter(item => item.sellerId?.role === "seller_candidate")
// //                           .map((item, index) => (
// //                             <div key={index} className="text-sm">
// //                               {item.sellerId?.name} ({item.sellerId?.email})
// //                             </div>
// //                           ))}
// //                       </td>
// //                       <td className="p-2">
// //                         {order.items
// //                           .filter(item => item.sellerId?.role === "seller_candidate")
// //                           .map((item, index) => (
// //                             <div key={index} className="text-sm">
// //                               {item.productId?.name} (Qty: {item.quantity}) - ${item.price}
// //                             </div>
// //                           ))}
// //                       </td>
// //                       <td className="p-2">
// //                         ${order.items
// //                           .filter(item => item.sellerId?.role === "seller_candidate")
// //                           .reduce((sum, item) => sum + (item.price * item.quantity), 0)}
// //                       </td>
// //                       <td className="p-2">{order.orderStatus}</td>
// //                       <td className="p-2">
// //                         {renderOrderDetails(order)}
// //                       </td>
// //                     </tr>
// //                   ))}
// //               </tbody>
// //             </table>
// //           </div>

// //           {/* Seller Candidate Processed Orders */}
// //           <div className="p-4 border rounded shadow">
// //             <h3 className="text-xl font-semibold mb-4">Seller Candidate - Processed Orders</h3>
// //             <table className="w-full border">
// //               <thead>
// //                 <tr className="border-b bg-gray-50">
// //                   <th className="p-2 text-left">Order ID</th>
// //                   <th className="p-2 text-left">Seller</th>
// //                   <th className="p-2 text-left">Items</th>
// //                   <th className="p-2 text-left">Total</th>
// //                   <th className="p-2 text-left">Status</th>
// //                   <th className="p-2 text-left">Customer Details</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {sellerCandidateOrders
// //                   .filter((order) => order.orderStatus === "Processing" || order.orderStatus === "Delivered")
// //                   .map((order) => (
// //                     <tr key={order._id} className="border-b">
// //                       <td className="p-2 font-mono text-sm">{order._id}</td>
// //                       <td className="p-2">
// //                         {order.items
// //                           .filter(item => item.sellerId?.role === "seller_candidate")
// //                           .map((item, index) => (
// //                             <div key={index} className="text-sm">
// //                               {item.sellerId?.name} ({item.sellerId?.email})
// //                             </div>
// //                           ))}
// //                       </td>
// //                       <td className="p-2">
// //                         {order.items
// //                           .filter(item => item.sellerId?.role === "seller_candidate")
// //                           .map((item, index) => (
// //                             <div key={index} className="text-sm">
// //                               {item.productId?.name} (Qty: {item.quantity}) - ${item.price}
// //                             </div>
// //                           ))}
// //                       </td>
// //                       <td className="p-2">
// //                         ${order.items
// //                           .filter(item => item.sellerId?.role === "seller_candidate")
// //                           .reduce((sum, item) => sum + (item.price * item.quantity), 0)}
// //                       </td>
// //                       <td className="p-2">{order.orderStatus}</td>
// //                       <td className="p-2">
// //                         {renderOrderDetails(order)}
// //                       </td>
// //                     </tr>
// //                   ))}
// //               </tbody>
// //             </table>
// //           </div>
// //         </div>
// //       )}

// //       {/* ------------------- SELLER_CANDIDATE ORDERS ------------------- */}
// //       {role === "seller_candidate" && (
// //         <div className="space-y-6">
// //           {/* Unprocessed Orders */}
// //           <div className="p-4 border rounded shadow">
// //             <h3 className="text-xl font-semibold mb-4">My Unprocessed Orders</h3>
// //             <table className="w-full border">
// //               <thead>
// //                 <tr className="border-b bg-gray-50">
// //                   <th className="p-2 text-left">Order ID</th>
// //                   <th className="p-2 text-left">Items</th>
// //                   <th className="p-2 text-left">Quantity</th>
// //                   <th className="p-2 text-left">Price</th>
// //                   <th className="p-2 text-left">Total</th>
// //                   <th className="p-2 text-left">Customer Details</th>
// //                   <th className="p-2 text-left">Action</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {sellerOrders
// //                   .filter((order) => order.orderStatus === "Pending")
// //                   .map((order) => (
// //                     <tr key={order._id} className="border-b">
// //                       <td className="p-2 font-mono text-sm">{order._id}</td>
// //                       <td className="p-2">
// //                         {order.items.map((item, index) => (
// //                           <div key={index} className="text-sm">
// //                             {item.productId?.name}
// //                           </div>
// //                         ))}
// //                       </td>
// //                       <td className="p-2">
// //                         {order.items.map((item, index) => (
// //                           <div key={index} className="text-sm">
// //                             {item.quantity}
// //                           </div>
// //                         ))}
// //                       </td>
// //                       <td className="p-2">
// //                         {order.items.map((item, index) => (
// //                           <div key={index} className="text-sm">
// //                             ${item.price}
// //                           </div>
// //                         ))}
// //                       </td>
// //                       <td className="p-2">${order.total}</td>
// //                       <td className="p-2">
// //                         {renderOrderDetails(order)}
// //                       </td>
// //                       <td className="p-2">
// //                         <button
// //                           onClick={() => processOrder(order._id)}
// //                           className="bg-green-600 text-white px-3 py-1 rounded text-sm"
// //                         >
// //                           Process
// //                         </button>
// //                       </td>
// //                     </tr>
// //                   ))}
// //               </tbody>
// //             </table>
// //           </div>

// //           {/* Processed Orders */}
// //           <div className="p-4 border rounded shadow">
// //             <h3 className="text-xl font-semibold mb-4">My Processed Orders</h3>
// //             <table className="w-full border">
// //               <thead>
// //                 <tr className="border-b bg-gray-50">
// //                   <th className="p-2 text-left">Order ID</th>
// //                   <th className="p-2 text-left">Items</th>
// //                   <th className="p-2 text-left">Quantity</th>
// //                   <th className="p-2 text-left">Price</th>
// //                   <th className="p-2 text-left">Total</th>
// //                   <th className="p-2 text-left">Customer Details</th>
// //                   <th className="p-2 text-left">Status</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {sellerOrders
// //                   .filter((order) => order.orderStatus === "Processing" || order.orderStatus === "Delivered")
// //                   .map((order) => (
// //                     <tr key={order._id} className="border-b">
// //                       <td className="p-2 font-mono text-sm">{order._id}</td>
// //                       <td className="p-2">
// //                         {order.items.map((item, index) => (
// //                           <div key={index} className="text-sm">
// //                             {item.productId?.name}
// //                           </div>
// //                         ))}
// //                       </td>
// //                       <td className="p-2">
// //                         {order.items.map((item, index) => (
// //                           <div key={index} className="text-sm">
// //                             {item.quantity}
// //                           </div>
// //                         ))}
// //                       </td>
// //                       <td className="p-2">
// //                         {order.items.map((item, index) => (
// //                           <div key={index} className="text-sm">
// //                             ${item.price}
// //                           </div>
// //                         ))}
// //                       </td>
// //                       <td className="p-2">${order.total}</td>
// //                       <td className="p-2">
// //                         {renderOrderDetails(order)}
// //                       </td>
// //                       <td className="p-2">{order.orderStatus}</td>
// //                     </tr>
// //                   ))}
// //               </tbody>
// //             </table>
// //           </div>
// //         </div>
// //       )}

// //       {/* Product Catalog for all */}
// //       <div className="mb-6 p-4 border rounded shadow">
// //         <h3 className="text-xl font-semibold mb-2">Product Catalog</h3>
// //         <ProductCatalog products={allProducts} />
// //       </div>

// //       {/* Seller Form Modal */}
// //       <SellerFormModal
// //         isOpen={isModalOpen}
// //         onClose={() => setIsModalOpen(false)}
// //       >
// //         <h3 className="text-lg font-semibold mb-2">Submit Product Form</h3>
// //         <form onSubmit={submitForm}>
// //           <input
// //             type="text"
// //             placeholder="Product Name"
// //             value={productName}
// //             onChange={(e) => setProductName(e.target.value)}
// //             className="w-full mb-2 p-2 border rounded"
// //             required
// //           />
// //           <input
// //             type="number"
// //             placeholder="Quantity"
// //             value={quantity}
// //             onChange={(e) => setQuantity(e.target.value)}
// //             className="w-full mb-2 p-2 border rounded"
// //             required
// //           />
// //           <input
// //             type="number"
// //             placeholder="Price"
// //             value={price}
// //             onChange={(e) => setPrice(e.target.value)}
// //             className="w-full mb-2 p-2 border rounded"
// //             required
// //           />
// //           <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
// //             Submit
// //           </button>
// //         </form>
// //       </SellerFormModal>
// //     </div>
// //   );
// // }

// import React, { useContext, useEffect, useState } from "react";
// import { AuthContext } from "../context/AuthContext";
// import axios from "axios";
// import SellerFormModal from "../components/SellerFormModal";
// import ProductModal from "../components/ProductModal";

// export default function Dashboard() {
//   const { user } = useContext(AuthContext);
//   const [pendingSellers, setPendingSellers] = useState([]);
//   const [sellerForms, setSellerForms] = useState([]);
//   const [sellerOrders, setSellerOrders] = useState([]);
//   const [companyOrders, setCompanyOrders] = useState([]);
//   const [sellerCandidateOrders, setSellerCandidateOrders] = useState([]);

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [productName, setProductName] = useState("");
//   const [quantity, setQuantity] = useState("");
//   const [price, setPrice] = useState("");

//   const [isProductModalOpen, setIsProductModalOpen] = useState(false);
//   const [myProducts, setMyProducts] = useState([]);
//   const [allProducts, setAllProducts] = useState([]);
//   const [editingProduct, setEditingProduct] = useState(null);

//   if (!user) return <div>Loading...</div>;
//   const { name, role } = user.user;
//   const token = localStorage.getItem("accessToken");

//   // Add this function inside your Dashboard component, with the other functions
//   const toggleFeatured = async (productId, currentStatus) => {
//     try {
//       const res = await axios.patch(
//         `${import.meta.env.VITE_API_URL}/products/${productId}/featured`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       // Update local state
//       setAllProducts((prevProducts) =>
//         prevProducts.map((p) =>
//           p._id === productId ? { ...p, featured: !currentStatus } : p
//         )
//       );

//       // Also update myProducts if it exists there
//       setMyProducts((prevMyProducts) =>
//         prevMyProducts.map((p) =>
//           p._id === productId ? { ...p, featured: !currentStatus } : p
//         )
//       );

//       alert(res.data.message);
//     } catch (error) {
//       console.error("Error toggling featured:", error);
//       alert("Error updating featured status");
//     }
//   };
//   const fetchSellerOrders = async () => {
//     try {
//       const res = await axios.get(
//         `${import.meta.env.VITE_API_URL}/orders/seller`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setSellerOrders(res.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const fetchCompanyOrders = async () => {
//     try {
//       const res = await axios.get(
//         `${import.meta.env.VITE_API_URL}/orders/all`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setCompanyOrders(res.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const fetchSellerCandidateOrders = async () => {
//     try {
//       const res = await axios.get(
//         `${import.meta.env.VITE_API_URL}/orders/admin/seller-candidates`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setSellerCandidateOrders(res.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   useEffect(() => {
//     if (role === "seller_candidate") fetchSellerOrders();
//     if (role === "admin" || role === "company") {
//       fetchCompanyOrders();
//       fetchSellerCandidateOrders();
//     }
//   }, [role]);

//   const fetchProducts = async () => {
//     try {
//       const res = await axios.get(`${import.meta.env.VITE_API_URL}/products`);
//       setAllProducts(res.data);
//       if (
//         role === "seller_candidate" ||
//         role === "seller" ||
//         role === "admin"
//       ) {
//         setMyProducts(res.data.filter((p) => p.sellerId._id === user.user._id));
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const deleteProduct = async (id) => {
//     if (window.confirm("Are you sure you want to delete this product?")) {
//       try {
//         await axios.delete(`${import.meta.env.VITE_API_URL}/products/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         fetchProducts();
//       } catch (err) {
//         console.log(err);
//       }
//     }
//   };

//   const fetchSellerForms = async () => {
//     try {
//       const res = await axios.get(
//         `${import.meta.env.VITE_API_URL}/seller-company/admin/forms`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setSellerForms(res.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const processForm = async (id) => {
//     try {
//       await axios.post(
//         `${
//           import.meta.env.VITE_API_URL
//         }/seller-company/admin/forms/${id}/process`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       fetchSellerForms();
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const fetchPendingSellers = async () => {
//     try {
//       const res = await axios.get(
//         `${import.meta.env.VITE_API_URL}/admin/seller-requests`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setPendingSellers(res.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const approveSeller = async (id) => {
//     try {
//       await axios.post(
//         `${import.meta.env.VITE_API_URL}/admin/verify-seller/${id}`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       fetchPendingSellers();
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const rejectSeller = async (id) => {
//     try {
//       await axios.post(
//         `${import.meta.env.VITE_API_URL}/admin/reject-seller/${id}`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       fetchPendingSellers();
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   // In your Dashboard component, update the submitForm function
//   const submitForm = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post(
//         `${import.meta.env.VITE_API_URL}/seller-company/form`,
//         { productName, quantity, price },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       alert("Form submitted successfully!");
//       setProductName("");
//       setQuantity("");
//       setPrice("");
//       setIsModalOpen(false);

//       // Refresh seller forms if admin is viewing them
//       if (role === "admin") {
//         fetchSellerForms();
//       }
//     } catch (err) {
//       console.error("Form submission error:", err);
//       alert(err.response?.data?.message || "Error submitting form");
//     }
//   };

//   const processOrder = async (orderId) => {
//     try {
//       await axios.post(
//         `${import.meta.env.VITE_API_URL}/orders/${orderId}/process`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       // Refresh all order data
//       if (role === "seller_candidate") fetchSellerOrders();
//       if (role === "admin" || role === "company") {
//         fetchCompanyOrders();
//         fetchSellerCandidateOrders();
//       }
//       alert("Order processed successfully!");
//     } catch (err) {
//       console.log(err);
//       alert("Error processing order");
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//     if (role === "admin") {
//       fetchPendingSellers();
//       fetchSellerForms();
//     }
//   }, [role]);

//   // Helper function to render order details
//   const renderOrderDetails = (order) => {
//     const buyerInfo = order.userId
//       ? `Customer: ${order.userId.name} (${order.userId.email}) - ${
//           order.userId.phone || "No phone"
//         }`
//       : `Guest: ${order.guestInfo?.name} (${order.guestInfo?.email}) - ${
//           order.guestInfo?.phone || "No phone"
//         }`;

//     const address = order.userId
//       ? "Address: Customer address from profile"
//       : `Address: ${order.guestInfo?.address || "No address provided"}`;

//     return (
//       <div className="text-sm text-gray-600 mt-1">
//         <div>{buyerInfo}</div>
//         <div>{address}</div>
//       </div>
//     );
//   };

//   return (
//     <div className="space-y-8">
//       {/* Welcome Section */}
//       <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-2xl p-8">
//         <h1 className="text-3xl font-bold mb-2">Welcome back, {name}! 👋</h1>
//         <p className="text-green-100 capitalize">
//           Role: {role.replace("_", " ")}
//         </p>
//       </div>
//       {/* Admin Panel */}
//       {role === "admin" && (
//         <div className="space-y-6">
//           {/* Quick Stats */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//             <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
//               <div className="flex items-center">
//                 <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
//                   <svg
//                     className="w-6 h-6 text-blue-600"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                     />
//                   </svg>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Pending Sellers</p>
//                   <p className="text-2xl font-bold text-gray-800">
//                     {pendingSellers.length}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
//               <div className="flex items-center">
//                 <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
//                   <svg
//                     className="w-6 h-6 text-green-600"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                     />
//                   </svg>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Seller Forms</p>
//                   <p className="text-2xl font-bold text-gray-800">
//                     {sellerForms.length}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
//               <div className="flex items-center">
//                 <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
//                   <svg
//                     className="w-6 h-6 text-purple-600"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
//                     />
//                   </svg>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Total Orders</p>
//                   <p className="text-2xl font-bold text-gray-800">
//                     {companyOrders.length}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
//               <div className="flex items-center">
//                 <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
//                   <svg
//                     className="w-6 h-6 text-orange-600"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
//                     />
//                   </svg>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Seller Candidates</p>
//                   <p className="text-2xl font-bold text-gray-800">
//                     {
//                       sellerCandidateOrders.filter(
//                         (order) => order.orderStatus === "Pending"
//                       ).length
//                     }
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//           {/* Admin Content */}
//           <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
//             <div className="border-b border-gray-200 px-6 py-4">
//               <h3 className="text-xl font-semibold text-gray-800">
//                 Admin Panel
//               </h3>
//             </div>
//             <div className="p-6">
//               <button
//                 onClick={() => {
//                   setEditingProduct(null);
//                   setIsProductModalOpen(true);
//                 }}
//                 className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors mb-6"
//               >
//                 Add Product
//               </button>

//               <ProductModal
//                 isOpen={isProductModalOpen}
//                 onClose={() => {
//                   setIsProductModalOpen(false);
//                   setEditingProduct(null);
//                 }}
//                 token={token}
//                 fetchProducts={fetchProducts}
//                 product={editingProduct}
//               />

//               {/* Pending Seller Candidates */}
//               <div className="mb-8">
//                 <h4 className="font-semibold text-lg mb-4 text-gray-800">
//                   Pending Seller Candidates
//                 </h4>
//                 <div className="overflow-x-auto">
//                   <table className="w-full border-collapse">
//                     <thead>
//                       <tr className="bg-gray-50">
//                         <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                           Name
//                         </th>
//                         <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                           Email
//                         </th>
//                         <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                           Actions
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {pendingSellers.map((seller) => (
//                         <tr
//                           key={seller._id}
//                           className="border-b border-gray-200 hover:bg-gray-50"
//                         >
//                           <td className="p-3 text-gray-700">{seller.name}</td>
//                           <td className="p-3 text-gray-700">{seller.email}</td>
//                           <td className="p-3">
//                             <div className="flex space-x-2">
//                               <button
//                                 onClick={() => approveSeller(seller._id)}
//                                 className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
//                               >
//                                 Approve
//                               </button>
//                               <button
//                                 onClick={() => rejectSeller(seller._id)}
//                                 className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
//                               >
//                                 Reject
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>

//               {/* Seller Forms */}
//               <div>
//                 <h4 className="font-semibold text-lg mb-4 text-gray-800">
//                   Submitted Seller Forms
//                 </h4>
//                 <div className="overflow-x-auto">
//                   <table className="w-full border-collapse">
//                     <thead>
//                       <tr className="bg-gray-50">
//                         <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                           Seller
//                         </th>
//                         <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                           Product
//                         </th>
//                         <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                           Quantity
//                         </th>
//                         <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                           Price
//                         </th>
//                         <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                           Status
//                         </th>
//                         <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                           Action
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {sellerForms.map((form) => (
//                         <tr
//                           key={form._id}
//                           className="border-b border-gray-200 hover:bg-gray-50"
//                         >
//                           <td className="p-3 text-gray-700">
//                             {form.sellerId.name}
//                           </td>
//                           <td className="p-3 text-gray-700">
//                             {form.productName}
//                           </td>
//                           <td className="p-3 text-gray-700">{form.quantity}</td>
//                           <td className="p-3 text-gray-700">${form.price}</td>
//                           <td className="p-3">
//                             <span
//                               className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
//                                 form.status === "pending"
//                                   ? "bg-yellow-100 text-yellow-800"
//                                   : "bg-green-100 text-green-800"
//                               }`}
//                             >
//                               {form.status}
//                             </span>
//                           </td>
//                           <td className="p-3">
//                             {form.status === "pending" && (
//                               <button
//                                 onClick={() => processForm(form._id)}
//                                 className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
//                               >
//                                 Mark Processed
//                               </button>
//                             )}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           </div>
//           {/* ------------------- ADMIN ORDERS - 4 TABLES ------------------- */}
//           <div className="space-y-6">
//             {/* Table 1: Admin New Orders */}
//             <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
//               <div className="border-b border-gray-200 px-6 py-4 bg-green-50">
//                 <h3 className="text-xl font-semibold text-green-800">
//                   🆕 New Orders (Admin)
//                 </h3>
//                 <p className="text-sm text-green-600 mt-1">
//                   Orders that need to be processed
//                 </p>
//               </div>
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead>
//                     <tr className="bg-gray-50">
//                       <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                         Order ID
//                       </th>
//                       <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                         Items
//                       </th>
//                       <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                         Total
//                       </th>
//                       <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                         Status
//                       </th>
//                       <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                         Payment
//                       </th>
//                       <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                         Customer Details
//                       </th>
//                       <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                         Action
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {companyOrders
//                       .filter((order) => order.orderStatus === "Pending")
//                       .map((order) => (
//                         <tr
//                           key={order._id}
//                           className="border-b border-gray-200 hover:bg-gray-50"
//                         >
//                           <td className="p-3 font-mono text-sm text-gray-700">
//                             {order._id.slice(-8)}
//                           </td>
//                           <td className="p-3">
//                             {order.items.map((item, index) => (
//                               <div
//                                 key={index}
//                                 className="text-sm text-gray-600"
//                               >
//                                 {item.productId?.name} (Qty: {item.quantity}) -
//                                 ${item.price}
//                               </div>
//                             ))}
//                           </td>
//                           <td className="p-3 font-semibold text-green-600">
//                             ${order.total}
//                           </td>
//                           <td className="p-3">
//                             <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
//                               {order.orderStatus}
//                             </span>
//                           </td>
//                           <td className="p-3 text-sm text-gray-600">
//                             {order.paymentStatus} ({order.paymentMethod})
//                           </td>
//                           <td className="p-3">{renderOrderDetails(order)}</td>
//                           <td className="p-3">
//                             <button
//                               onClick={() => processOrder(order._id)}
//                               className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
//                             >
//                               Process
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {/* Table 2: Admin Processed Orders */}
//             <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
//               <div className="border-b border-gray-200 px-6 py-4 bg-blue-50">
//                 <h3 className="text-xl font-semibold text-blue-800">
//                   ✅ Processed Orders (Admin)
//                 </h3>
//                 <p className="text-sm text-blue-600 mt-1">
//                   Orders that have been processed
//                 </p>
//               </div>
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead>
//                     <tr className="bg-gray-50">
//                       <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                         Order ID
//                       </th>
//                       <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                         Items
//                       </th>
//                       <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                         Total
//                       </th>
//                       <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                         Status
//                       </th>
//                       <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                         Payment
//                       </th>
//                       <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                         Customer Details
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {companyOrders
//                       .filter(
//                         (order) =>
//                           order.orderStatus === "Processing" ||
//                           order.orderStatus === "Delivered"
//                       )
//                       .map((order) => (
//                         <tr
//                           key={order._id}
//                           className="border-b border-gray-200 hover:bg-gray-50"
//                         >
//                           <td className="p-3 font-mono text-sm text-gray-700">
//                             {order._id.slice(-8)}
//                           </td>
//                           <td className="p-3">
//                             {order.items.map((item, index) => (
//                               <div
//                                 key={index}
//                                 className="text-sm text-gray-600"
//                               >
//                                 {item.productId?.name} (Qty: {item.quantity}) -
//                                 ${item.price}
//                               </div>
//                             ))}
//                           </td>
//                           <td className="p-3 font-semibold text-green-600">
//                             ${order.total}
//                           </td>
//                           <td className="p-3">
//                             <span
//                               className={`px-2 py-1 rounded-full text-xs font-medium ${
//                                 order.orderStatus === "Processing"
//                                   ? "bg-blue-100 text-blue-800"
//                                   : "bg-green-100 text-green-800"
//                               }`}
//                             >
//                               {order.orderStatus}
//                             </span>
//                           </td>
//                           <td className="p-3 text-sm text-gray-600">
//                             {order.paymentStatus} ({order.paymentMethod})
//                           </td>
//                           <td className="p-3">{renderOrderDetails(order)}</td>
//                         </tr>
//                       ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {/* Table 3: Seller Candidate New Orders */}
//             <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
//               <div className="border-b border-gray-200 px-6 py-4 bg-purple-50">
//                 <h3 className="text-xl font-semibold text-purple-800">
//                   👥 Seller Candidate - New Orders
//                 </h3>
//                 <p className="text-sm text-purple-600 mt-1">
//                   New orders from seller candidates
//                 </p>
//               </div>
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead>
//                     <tr className="bg-gray-50">
//                       <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                         Order ID
//                       </th>
//                       <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                         Seller
//                       </th>
//                       <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                         Items
//                       </th>
//                       <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                         Total
//                       </th>
//                       <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                         Status
//                       </th>
//                       <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                         Customer Details
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {sellerCandidateOrders
//                       .filter((order) => order.orderStatus === "Pending")
//                       .map((order) => (
//                         <tr
//                           key={order._id}
//                           className="border-b border-gray-200 hover:bg-gray-50"
//                         >
//                           <td className="p-3 font-mono text-sm text-gray-700">
//                             {order._id.slice(-8)}
//                           </td>
//                           <td className="p-3">
//                             {order.items
//                               .filter(
//                                 (item) =>
//                                   item.sellerId?.role === "seller_candidate"
//                               )
//                               .map((item, index) => (
//                                 <div
//                                   key={index}
//                                   className="text-sm text-gray-600"
//                                 >
//                                   {item.sellerId?.name} ({item.sellerId?.email})
//                                 </div>
//                               ))}
//                           </td>
//                           <td className="p-3">
//                             {order.items
//                               .filter(
//                                 (item) =>
//                                   item.sellerId?.role === "seller_candidate"
//                               )
//                               .map((item, index) => (
//                                 <div
//                                   key={index}
//                                   className="text-sm text-gray-600"
//                                 >
//                                   {item.productId?.name} (Qty: {item.quantity})
//                                   - ${item.price}
//                                 </div>
//                               ))}
//                           </td>
//                           <td className="p-3 font-semibold text-green-600">
//                             $
//                             {order.items
//                               .filter(
//                                 (item) =>
//                                   item.sellerId?.role === "seller_candidate"
//                               )
//                               .reduce(
//                                 (sum, item) => sum + item.price * item.quantity,
//                                 0
//                               )}
//                           </td>
//                           <td className="p-3">
//                             <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
//                               {order.orderStatus}
//                             </span>
//                           </td>
//                           <td className="p-3">{renderOrderDetails(order)}</td>
//                         </tr>
//                       ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {/* Table 4: Seller Candidate Processed Orders */}
//             <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
//               <div className="border-b border-gray-200 px-6 py-4 bg-indigo-50">
//                 <h3 className="text-xl font-semibold text-indigo-800">
//                   ✅ Seller Candidate - Processed Orders
//                 </h3>
//                 <p className="text-sm text-indigo-600 mt-1">
//                   Processed orders from seller candidates
//                 </p>
//               </div>
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead>
//                     <tr className="bg-gray-50">
//                       <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                         Order ID
//                       </th>
//                       <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                         Seller
//                       </th>
//                       <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                         Items
//                       </th>
//                       <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                         Total
//                       </th>
//                       <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                         Status
//                       </th>
//                       <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                         Customer Details
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {sellerCandidateOrders
//                       .filter(
//                         (order) =>
//                           order.orderStatus === "Processing" ||
//                           order.orderStatus === "Delivered"
//                       )
//                       .map((order) => (
//                         <tr
//                           key={order._id}
//                           className="border-b border-gray-200 hover:bg-gray-50"
//                         >
//                           <td className="p-3 font-mono text-sm text-gray-700">
//                             {order._id.slice(-8)}
//                           </td>
//                           <td className="p-3">
//                             {order.items
//                               .filter(
//                                 (item) =>
//                                   item.sellerId?.role === "seller_candidate"
//                               )
//                               .map((item, index) => (
//                                 <div
//                                   key={index}
//                                   className="text-sm text-gray-600"
//                                 >
//                                   {item.sellerId?.name} ({item.sellerId?.email})
//                                 </div>
//                               ))}
//                           </td>
//                           <td className="p-3">
//                             {order.items
//                               .filter(
//                                 (item) =>
//                                   item.sellerId?.role === "seller_candidate"
//                               )
//                               .map((item, index) => (
//                                 <div
//                                   key={index}
//                                   className="text-sm text-gray-600"
//                                 >
//                                   {item.productId?.name} (Qty: {item.quantity})
//                                   - ${item.price}
//                                 </div>
//                               ))}
//                           </td>
//                           <td className="p-3 font-semibold text-green-600">
//                             $
//                             {order.items
//                               .filter(
//                                 (item) =>
//                                   item.sellerId?.role === "seller_candidate"
//                               )
//                               .reduce(
//                                 (sum, item) => sum + item.price * item.quantity,
//                                 0
//                               )}
//                           </td>
//                           <td className="p-3">
//                             <span
//                               className={`px-2 py-1 rounded-full text-xs font-medium ${
//                                 order.orderStatus === "Processing"
//                                   ? "bg-blue-100 text-blue-800"
//                                   : "bg-green-100 text-green-800"
//                               }`}
//                             >
//                               {order.orderStatus}
//                             </span>
//                           </td>
//                           <td className="p-3">{renderOrderDetails(order)}</td>
//                         </tr>
//                       ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//           {/* // In your Dashboard component, add this section in the Admin Panel: */}
//           {/* Featured Products Management - Admin Only */}
//           <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden mt-6">
//             <div className="border-b border-gray-200 px-6 py-4 bg-purple-50">
//               <h3 className="text-xl font-semibold text-purple-800">
//                 ⭐ Featured Products Management
//               </h3>
//               <p className="text-sm text-purple-600 mt-1">
//                 Mark/unmark products as featured for the home page
//               </p>
//             </div>
//             <div className="p-6">
//               <div className="overflow-x-auto">
//                 <table className="w-full border-collapse">
//                   <thead>
//                     <tr className="bg-gray-50">
//                       <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                         Product
//                       </th>
//                       <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                         Seller
//                       </th>
//                       <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                         Price
//                       </th>
//                       <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                         Category
//                       </th>
//                       <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                         Status
//                       </th>
//                       <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {allProducts.map((product) => (
//                       <tr
//                         key={product._id}
//                         className="border-b border-gray-200 hover:bg-gray-50"
//                       >
//                         <td className="p-3">
//                           <div className="flex items-center space-x-3">
//                             {product.images && product.images.length > 0 ? (
//                               <img
//                                 src={product.images[0]}
//                                 alt={product.name}
//                                 className="w-10 h-10 object-cover rounded-lg"
//                               />
//                             ) : (
//                               <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
//                                 <svg
//                                   className="w-5 h-5 text-gray-400"
//                                   fill="none"
//                                   stroke="currentColor"
//                                   viewBox="0 0 24 24"
//                                 >
//                                   <path
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     strokeWidth={2}
//                                     d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
//                                   />
//                                 </svg>
//                               </div>
//                             )}
//                             <div>
//                               <div className="font-medium text-gray-900">
//                                 {product.name}
//                               </div>
//                               <div className="text-sm text-gray-500 line-clamp-1">
//                                 {product.description}
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="p-3 text-sm text-gray-600">
//                           {product.sellerId?.name || "Unknown Seller"}
//                           <div className="text-xs text-gray-400 capitalize">
//                             {product.sellerId?.role?.replace("_", " ") ||
//                               "Unknown"}
//                           </div>
//                         </td>
//                         <td className="p-3 font-semibold text-green-600">
//                           ${product.price}
//                         </td>
//                         <td className="p-3">
//                           <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium capitalize">
//                             {product.category}
//                           </span>
//                         </td>
//                         <td className="p-3">
//                           <span
//                             className={`px-2 py-1 rounded-full text-xs font-medium ${
//                               product.featured
//                                 ? "bg-green-100 text-green-800"
//                                 : "bg-gray-100 text-gray-800"
//                             }`}
//                           >
//                             {product.featured ? "Featured" : "Not Featured"}
//                           </span>
//                         </td>
//                         <td className="p-3">
//                           <button
//                             onClick={() =>
//                               toggleFeatured(product._id, product.featured)
//                             }
//                             className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
//                               product.featured
//                                 ? "bg-red-600 text-white hover:bg-red-700"
//                                 : "bg-green-600 text-white hover:bg-green-700"
//                             }`}
//                           >
//                             {product.featured
//                               ? "Remove Featured"
//                               : "Mark Featured"}
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Featured Products Stats */}
//               <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className="bg-green-50 p-4 rounded-lg border border-green-200">
//                   <div className="flex items-center">
//                     <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
//                       <svg
//                         className="w-5 h-5 text-green-600"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
//                         />
//                       </svg>
//                     </div>
//                     <div>
//                       <p className="text-sm text-green-600">
//                         Featured Products
//                       </p>
//                       <p className="text-2xl font-bold text-green-800">
//                         {allProducts.filter((p) => p.featured).length}
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
//                   <div className="flex items-center">
//                     <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
//                       <svg
//                         className="w-5 h-5 text-blue-600"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
//                         />
//                       </svg>
//                     </div>
//                     <div>
//                       <p className="text-sm text-blue-600">Total Products</p>
//                       <p className="text-2xl font-bold text-blue-800">
//                         {allProducts.length}
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
//                   <div className="flex items-center">
//                     <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
//                       <svg
//                         className="w-5 h-5 text-purple-600"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
//                         />
//                       </svg>
//                     </div>
//                     <div>
//                       <p className="text-sm text-purple-600">
//                         Seller Candidates
//                       </p>
//                       <p className="text-2xl font-bold text-purple-800">
//                         {
//                           allProducts.filter(
//                             (p) => p.sellerId?.role === "seller_candidate"
//                           ).length
//                         }
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//       {/* My Products (Sellers/Admins) */}
//       {/* // In your Dashboard component, replace the "My Products" section: */}
//       {/* My Products (Admins only) & Seller Forms (Sellers only) */}
//       {/* // In your Dashboard component, update the My Products section: */}
//       {(role === "admin" || role === "seller_candidate") && (
//         <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
//           <div className="border-b border-gray-200 px-6 py-4">
//             <h3 className="text-xl font-semibold text-gray-800">
//               {role === "admin" ? "My Products" : "My Products"}
//             </h3>
//           </div>
//           <div className="p-6">
//             {/* Show Add Product button only for admin */}
//             {role === "admin" && (
//               <button
//                 onClick={() => {
//                   setEditingProduct(null);
//                   setIsProductModalOpen(true);
//                 }}
//                 className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors mb-6"
//               >
//                 Add Product
//               </button>
//             )}

//             <ProductModal
//               isOpen={isProductModalOpen}
//               onClose={() => {
//                 setIsProductModalOpen(false);
//                 setEditingProduct(null);
//               }}
//               token={token}
//               fetchProducts={fetchProducts}
//               product={editingProduct}
//             />

//             <div className="overflow-x-auto">
//               {/* Show products table for admin and seller_candidate */}
//               <table className="w-full border-collapse">
//                 <thead>
//                   <tr className="bg-gray-50">
//                     <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                       Name
//                     </th>
//                     <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                       Price
//                     </th>
//                     <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                       Quantity
//                     </th>
//                     <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                       Category
//                     </th>
//                     {role === "admin" && (
//                       <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                         Actions
//                       </th>
//                     )}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {myProducts.map((product) => (
//                     <tr
//                       key={product._id}
//                       className="border-b border-gray-200 hover:bg-gray-50"
//                     >
//                       <td className="p-3 text-gray-700">{product.name}</td>
//                       <td className="p-3 text-gray-700">${product.price}</td>
//                       <td className="p-3 text-gray-700">{product.quantity}</td>
//                       <td className="p-3 text-gray-700">{product.category}</td>
//                       {role === "admin" && (
//                         <td className="p-3">
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={() => {
//                                 setEditingProduct(product);
//                                 setIsProductModalOpen(true);
//                               }}
//                               className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition-colors"
//                             >
//                               Edit
//                             </button>
//                             <button
//                               onClick={() => deleteProduct(product._id)}
//                               className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
//                             >
//                               Delete
//                             </button>
//                           </div>
//                         </td>
//                       )}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}
//       {/* ------------------- SELLER_CANDIDATE ORDERS - 2 TABLES ------------------- */}
//       {/* ------------------- SELLER_CANDIDATE ORDERS - UPDATED TO MATCH ADMIN ------------------- */}
//       {role === "seller_candidate" && (
//         <div className="space-y-6">
//           {/* Table 1: Seller Candidate New Orders */}
//           <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
//             <div className="border-b border-gray-200 px-6 py-4 bg-yellow-50">
//               <h3 className="text-xl font-semibold text-yellow-800">
//                 🆕 My New Orders
//               </h3>
//               <p className="text-sm text-yellow-600 mt-1">
//                 Orders that need to be processed
//               </p>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="bg-gray-50">
//                     <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                       Order ID
//                     </th>
//                     <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                       Items
//                     </th>
//                     <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                       Total
//                     </th>
//                     <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                       Status
//                     </th>
//                     <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                       Payment
//                     </th>
//                     <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                       Customer Details
//                     </th>
//                     <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                       Action
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {sellerOrders
//                     .filter((order) => order.orderStatus === "Pending")
//                     .map((order) => (
//                       <tr
//                         key={order._id}
//                         className="border-b border-gray-200 hover:bg-gray-50"
//                       >
//                         <td className="p-3 font-mono text-sm text-gray-700">
//                           {order._id.slice(-8)}
//                         </td>
//                         <td className="p-3">
//                           {order.items.map((item, index) => (
//                             <div key={index} className="text-sm text-gray-600">
//                               {item.productId?.name} (Qty: {item.quantity}) - $
//                               {item.price}
//                             </div>
//                           ))}
//                         </td>
//                         <td className="p-3 font-semibold text-green-600">
//                           ${order.total}
//                         </td>
//                         <td className="p-3">
//                           <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
//                             {order.orderStatus}
//                           </span>
//                         </td>
//                         <td className="p-3 text-sm text-gray-600">
//                           {order.paymentStatus} ({order.paymentMethod})
//                         </td>
//                         <td className="p-3">{renderOrderDetails(order)}</td>
//                         <td className="p-3">
//                           <button
//                             onClick={() => processOrder(order._id)}
//                             className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
//                           >
//                             Process
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Table 2: Seller Candidate Processed Orders */}
//           <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
//             <div className="border-b border-gray-200 px-6 py-4 bg-green-50">
//               <h3 className="text-xl font-semibold text-green-800">
//                 ✅ My Processed Orders
//               </h3>
//               <p className="text-sm text-green-600 mt-1">
//                 Orders that have been processed
//               </p>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="bg-gray-50">
//                     <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                       Order ID
//                     </th>
//                     <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                       Items
//                     </th>
//                     <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                       Total
//                     </th>
//                     <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                       Status
//                     </th>
//                     <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                       Payment
//                     </th>
//                     <th className="p-3 text-left text-sm font-semibold text-gray-600">
//                       Customer Details
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {sellerOrders
//                     .filter(
//                       (order) =>
//                         order.orderStatus === "Processing" ||
//                         order.orderStatus === "Delivered"
//                     )
//                     .map((order) => (
//                       <tr
//                         key={order._id}
//                         className="border-b border-gray-200 hover:bg-gray-50"
//                       >
//                         <td className="p-3 font-mono text-sm text-gray-700">
//                           {order._id.slice(-8)}
//                         </td>
//                         <td className="p-3">
//                           {order.items.map((item, index) => (
//                             <div key={index} className="text-sm text-gray-600">
//                               {item.productId?.name} (Qty: {item.quantity}) - $
//                               {item.price}
//                             </div>
//                           ))}
//                         </td>
//                         <td className="p-3 font-semibold text-green-600">
//                           ${order.total}
//                         </td>
//                         <td className="p-3">
//                           <span
//                             className={`px-2 py-1 rounded-full text-xs font-medium ${
//                               order.orderStatus === "Processing"
//                                 ? "bg-blue-100 text-blue-800"
//                                 : "bg-green-100 text-green-800"
//                             }`}
//                           >
//                             {order.orderStatus}
//                           </span>
//                         </td>
//                         <td className="p-3 text-sm text-gray-600">
//                           {order.paymentStatus} ({order.paymentMethod})
//                         </td>
//                         <td className="p-3">{renderOrderDetails(order)}</td>
//                       </tr>
//                     ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}
//       {/* Seller Form Modal */}
//       <SellerFormModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//       >
//         <h3 className="text-lg font-semibold mb-4 text-gray-800">
//           Submit Product Form
//         </h3>
//         <form onSubmit={submitForm} className="space-y-4">
//           <input
//             type="text"
//             placeholder="Product Name"
//             value={productName}
//             onChange={(e) => setProductName(e.target.value)}
//             className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//             required
//           />
//           <input
//             type="number"
//             placeholder="Quantity"
//             value={quantity}
//             onChange={(e) => setQuantity(e.target.value)}
//             className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//             required
//           />
//           <input
//             type="number"
//             placeholder="Price"
//             value={price}
//             onChange={(e) => setPrice(e.target.value)}
//             className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//             required
//           />
//           <button className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
//             Submit
//           </button>
//         </form>
//       </SellerFormModal>
//     </div>
//   );
// }


import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import SellerFormModal from "../components/SellerFormModal";
import ProductModal from "../components/ProductModal";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [pendingSellers, setPendingSellers] = useState([]);
  const [sellerForms, setSellerForms] = useState([]);
  const [sellerOrders, setSellerOrders] = useState([]);
  const [companyOrders, setCompanyOrders] = useState([]);
  const [sellerCandidateOrders, setSellerCandidateOrders] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [myProducts, setMyProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  if (!user) return <div>Loading...</div>;
  const { name, role } = user.user;
  const token = localStorage.getItem("accessToken");

  // Add this function inside your Dashboard component, with the other functions
  const toggleFeatured = async (productId, currentStatus) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/products/${productId}/featured`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update local state
      setAllProducts((prevProducts) =>
        prevProducts.map((p) =>
          p._id === productId ? { ...p, featured: !currentStatus } : p
        )
      );

      // Also update myProducts if it exists there
      setMyProducts((prevMyProducts) =>
        prevMyProducts.map((p) =>
          p._id === productId ? { ...p, featured: !currentStatus } : p
        )
      );

      alert(res.data.message);
    } catch (error) {
      console.error("Error toggling featured:", error);
      alert("Error updating featured status");
    }
  };
  const fetchSellerOrders = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/orders/seller`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSellerOrders(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCompanyOrders = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/orders/all`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCompanyOrders(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchSellerCandidateOrders = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/orders/admin/seller-candidates`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSellerCandidateOrders(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (role === "seller_candidate") fetchSellerOrders();
    if (role === "admin" || role === "company") {
      fetchCompanyOrders();
      fetchSellerCandidateOrders();
    }
  }, [role]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/products`);
      setAllProducts(res.data);
      if (
        role === "seller_candidate" ||
        role === "seller" ||
        role === "admin"
      ) {
        setMyProducts(res.data.filter((p) => p.sellerId._id === user.user._id));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchProducts();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const fetchSellerForms = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/seller-company/admin/forms`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSellerForms(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const processForm = async (id) => {
    try {
      await axios.post(
        `${
          import.meta.env.VITE_API_URL
        }/seller-company/admin/forms/${id}/process`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchSellerForms();
    } catch (err) {
      console.log(err);
    }
  };

  const fetchPendingSellers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/seller-requests`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPendingSellers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const approveSeller = async (id) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/verify-seller/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchPendingSellers();
    } catch (err) {
      console.log(err);
    }
  };

  const rejectSeller = async (id) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/reject-seller/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchPendingSellers();
    } catch (err) {
      console.log(err);
    }
  };

  // In your Dashboard component, update the submitForm function
  const submitForm = async (e) => {
    e.preventDefault();
    try {
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
      alert("Form submitted successfully!");
      setProductName("");
      setQuantity("");
      setPrice("");
      setIsModalOpen(false);

      // Refresh seller forms if admin is viewing them
      if (role === "admin") {
        fetchSellerForms();
      }
    } catch (err) {
      console.error("Form submission error:", err);
      alert(err.response?.data?.message || "Error submitting form");
    }
  };

  const processOrder = async (orderId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/orders/${orderId}/process`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh all order data
      if (role === "seller_candidate") fetchSellerOrders();
      if (role === "admin" || role === "company") {
        fetchCompanyOrders();
        fetchSellerCandidateOrders();
      }
      alert("Order processed successfully!");
    } catch (err) {
      console.log(err);
      alert("Error processing order");
    }
  };

  useEffect(() => {
    fetchProducts();
    if (role === "admin") {
      fetchPendingSellers();
      fetchSellerForms();
    }
  }, [role]);

  // Helper function to render order details
  const renderOrderDetails = (order) => {
    const buyerInfo = order.userId
      ? `Customer: ${order.userId.name} (${order.userId.email}) - ${
          order.userId.phone || "No phone"
        }`
      : `Guest: ${order.guestInfo?.name} (${order.guestInfo?.email}) - ${
          order.guestInfo?.phone || "No phone"
        }`;

    const address = order.userId
      ? "Address: Customer address from profile"
      : `Address: ${order.guestInfo?.address || "No address provided"}`;

    return (
      <div className="text-sm text-gray-600 mt-1">
        <div>{buyerInfo}</div>
        <div>{address}</div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {name}! 👋</h1>
        <p className="text-green-100 capitalize">
          Role: {role.replace("_", " ")}
        </p>
      </div>
      {/* Admin Panel */}
      {role === "admin" && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending Sellers</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {pendingSellers.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Seller Forms</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {sellerForms.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {companyOrders.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                  <svg
                    className="w-6 h-6 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Seller Candidates</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {
                      sellerCandidateOrders.filter(
                        (order) => order.orderStatus === "Pending"
                      ).length
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Admin Content */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Admin Panel
              </h3>
            </div>
            <div className="p-6">
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setIsProductModalOpen(true);
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors mb-6"
              >
                Add Product
              </button>

              <ProductModal
                isOpen={isProductModalOpen}
                onClose={() => {
                  setIsProductModalOpen(false);
                  setEditingProduct(null);
                }}
                token={token}
                fetchProducts={fetchProducts}
                product={editingProduct}
              />

              {/* Pending Seller Candidates */}
              <div className="mb-8">
                <h4 className="font-semibold text-lg mb-4 text-gray-800">
                  Pending Seller Candidates
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="p-3 text-left text-sm font-semibold text-gray-600">
                          Name
                        </th>
                        <th className="p-3 text-left text-sm font-semibold text-gray-600">
                          Email
                        </th>
                        <th className="p-3 text-left text-sm font-semibold text-gray-600">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingSellers.map((seller) => (
                        <tr
                          key={seller._id}
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          <td className="p-3 text-gray-700">{seller.name}</td>
                          <td className="p-3 text-gray-700">{seller.email}</td>
                          <td className="p-3">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => approveSeller(seller._id)}
                                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => rejectSeller(seller._id)}
                                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Seller Forms */}
              <div>
                <h4 className="font-semibold text-lg mb-4 text-gray-800">
                  Submitted Seller Forms
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="p-3 text-left text-sm font-semibold text-gray-600">
                          Seller
                        </th>
                        <th className="p-3 text-left text-sm font-semibold text-gray-600">
                          Product
                        </th>
                        <th className="p-3 text-left text-sm font-semibold text-gray-600">
                          Quantity
                        </th>
                        <th className="p-3 text-left text-sm font-semibold text-gray-600">
                          Price
                        </th>
                        <th className="p-3 text-left text-sm font-semibold text-gray-600">
                          Status
                        </th>
                        <th className="p-3 text-left text-sm font-semibold text-gray-600">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sellerForms.map((form) => (
                        <tr
                          key={form._id}
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          <td className="p-3 text-gray-700">
                            {form.sellerId.name}
                          </td>
                          <td className="p-3 text-gray-700">
                            {form.productName}
                          </td>
                          <td className="p-3 text-gray-700">{form.quantity}</td>
                          <td className="p-3 text-gray-700">${form.price}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                                form.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {form.status}
                            </span>
                          </td>
                          <td className="p-3">
                            {form.status === "pending" && (
                              <button
                                onClick={() => processForm(form._id)}
                                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                              >
                                Mark Processed
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          {/* ------------------- ADMIN ORDERS - 4 TABLES ------------------- */}
          <div className="space-y-6">
            {/* Table 1: Admin New Orders */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4 bg-green-50">
                <h3 className="text-xl font-semibold text-green-800">
                  🆕 New Orders (Admin)
                </h3>
                <p className="text-sm text-green-600 mt-1">
                  Orders that need to be processed
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-3 text-left text-sm font-semibold text-gray-600">
                        Order ID
                      </th>
                      <th className="p-3 text-left text-sm font-semibold text-gray-600">
                        Items
                      </th>
                      <th className="p-3 text-left text-sm font-semibold text-gray-600">
                        Total
                      </th>
                      <th className="p-3 text-left text-sm font-semibold text-gray-600">
                        Status
                      </th>
                      <th className="p-3 text-left text-sm font-semibold text-gray-600">
                        Payment
                      </th>
                      <th className="p-3 text-left text-sm font-semibold text-gray-600">
                        Customer Details
                      </th>
                      <th className="p-3 text-left text-sm font-semibold text-gray-600">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {companyOrders
                      .filter((order) => order.orderStatus === "Pending")
                      .map((order) => (
                        <tr
                          key={order._id}
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          <td className="p-3 font-mono text-sm text-gray-700">
                            {order._id.slice(-8)}
                          </td>
                          <td className="p-3">
                            {order.items.map((item, index) => (
                              <div
                                key={index}
                                className="text-sm text-gray-600"
                              >
                                {item.productId?.name} (Qty: {item.quantity}) -
                                ${item.price}
                              </div>
                            ))}
                          </td>
                          <td className="p-3 font-semibold text-green-600">
                            ${order.total}
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                              {order.orderStatus}
                            </span>
                          </td>
                          <td className="p-3 text-sm text-gray-600">
                            {order.paymentStatus} ({order.paymentMethod})
                          </td>
                          <td className="p-3">{renderOrderDetails(order)}</td>
                          <td className="p-3">
                            <button
                              onClick={() => processOrder(order._id)}
                              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                            >
                              Process
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table 2: Admin Processed Orders */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4 bg-blue-50">
                <h3 className="text-xl font-semibold text-blue-800">
                  ✅ Processed Orders (Admin)
                </h3>
                <p className="text-sm text-blue-600 mt-1">
                  Orders that have been processed
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-3 text-left text-sm font-semibold text-gray-600">
                        Order ID
                      </th>
                      <th className="p-3 text-left text-sm font-semibold text-gray-600">
                        Items
                      </th>
                      <th className="p-3 text-left text-sm font-semibold text-gray-600">
                        Total
                      </th>
                      <th className="p-3 text-left text-sm font-semibold text-gray-600">
                        Status
                      </th>
                      <th className="p-3 text-left text-sm font-semibold text-gray-600">
                        Payment
                      </th>
                      <th className="p-3 text-left text-sm font-semibold text-gray-600">
                        Customer Details
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {companyOrders
                      .filter(
                        (order) =>
                          order.orderStatus === "Processing" ||
                          order.orderStatus === "Delivered"
                      )
                      .map((order) => (
                        <tr
                          key={order._id}
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          <td className="p-3 font-mono text-sm text-gray-700">
                            {order._id.slice(-8)}
                          </td>
                          <td className="p-3">
                            {order.items.map((item, index) => (
                              <div
                                key={index}
                                className="text-sm text-gray-600"
                              >
                                {item.productId?.name} (Qty: {item.quantity}) -
                                ${item.price}
                              </div>
                            ))}
                          </td>
                          <td className="p-3 font-semibold text-green-600">
                            ${order.total}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                order.orderStatus === "Processing"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {order.orderStatus}
                            </span>
                          </td>
                          <td className="p-3 text-sm text-gray-600">
                            {order.paymentStatus} ({order.paymentMethod})
                          </td>
                          <td className="p-3">{renderOrderDetails(order)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table 3: Seller Candidate New Orders */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4 bg-purple-50">
                <h3 className="text-xl font-semibold text-purple-800">
                  👥 Seller Candidate - New Orders
                </h3>
                <p className="text-sm text-purple-600 mt-1">
                  New orders from seller candidates
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-3 text-left text-sm font-semibold text-gray-600">
                        Order ID
                      </th>
                      <th className="p-3 text-left text-sm font-semibold text-gray-600">
                        Seller
                      </th>
                      <th className="p-3 text-left text-sm font-semibold text-gray-600">
                        Items
                      </th>
                      <th className="p-3 text-left text-sm font-semibold text-gray-600">
                        Total
                      </th>
                      <th className="p-3 text-left text-sm font-semibold text-gray-600">
                        Status
                      </th>
                      <th className="p-3 text-left text-sm font-semibold text-gray-600">
                        Customer Details
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sellerCandidateOrders
                      .filter((order) => order.orderStatus === "Pending")
                      .map((order) => (
                        <tr
                          key={order._id}
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          <td className="p-3 font-mono text-sm text-gray-700">
                            {order._id.slice(-8)}
                          </td>
                          <td className="p-3">
                            {order.items
                              .filter(
                                (item) =>
                                  item.sellerId?.role === "seller_candidate"
                              )
                              .map((item, index) => (
                                <div
                                  key={index}
                                  className="text-sm text-gray-600"
                                >
                                  {item.sellerId?.name} ({item.sellerId?.email})
                                </div>
                              ))}
                          </td>
                          <td className="p-3">
                            {order.items
                              .filter(
                                (item) =>
                                  item.sellerId?.role === "seller_candidate"
                              )
                              .map((item, index) => (
                                <div
                                  key={index}
                                  className="text-sm text-gray-600"
                                >
                                  {item.productId?.name} (Qty: {item.quantity})
                                  - ${item.price}
                                </div>
                              ))}
                          </td>
                          <td className="p-3 font-semibold text-green-600">
                            $
                            {order.items
                              .filter(
                                (item) =>
                                  item.sellerId?.role === "seller_candidate"
                              )
                              .reduce(
                                (sum, item) => sum + item.price * item.quantity,
                                0
                              )}
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                              {order.orderStatus}
                            </span>
                          </td>
                          <td className="p-3">{renderOrderDetails(order)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table 4: Seller Candidate Processed Orders */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4 bg-indigo-50">
                <h3 className="text-xl font-semibold text-indigo-800">
                  ✅ Seller Candidate - Processed Orders
                </h3>
                <p className="text-sm text-indigo-600 mt-1">
                  Processed orders from seller candidates
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-3 text-left text-sm font-semibold text-gray-600">
                        Order ID
                      </th>
                      <th className="p-3 text-left text-sm font-semibold text-gray-600">
                        Seller
                      </th>
                      <th className="p-3 text-left text-sm font-semibold text-gray-600">
                        Items
                      </th>
                      <th className="p-3 text-left text-sm font-semibold text-gray-600">
                        Total
                      </th>
                      <th className="p-3 text-left text-sm font-semibold text-gray-600">
                        Status
                      </th>
                      <th className="p-3 text-left text-sm font-semibold text-gray-600">
                        Customer Details
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sellerCandidateOrders
                      .filter(
                        (order) =>
                          order.orderStatus === "Processing" ||
                          order.orderStatus === "Delivered"
                      )
                      .map((order) => (
                        <tr
                          key={order._id}
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          <td className="p-3 font-mono text-sm text-gray-700">
                            {order._id.slice(-8)}
                          </td>
                          <td className="p-3">
                            {order.items
                              .filter(
                                (item) =>
                                  item.sellerId?.role === "seller_candidate"
                              )
                              .map((item, index) => (
                                <div
                                  key={index}
                                  className="text-sm text-gray-600"
                                >
                                  {item.sellerId?.name} ({item.sellerId?.email})
                                </div>
                              ))}
                          </td>
                          <td className="p-3">
                            {order.items
                              .filter(
                                (item) =>
                                  item.sellerId?.role === "seller_candidate"
                              )
                              .map((item, index) => (
                                <div
                                  key={index}
                                  className="text-sm text-gray-600"
                                >
                                  {item.productId?.name} (Qty: {item.quantity})
                                  - ${item.price}
                                </div>
                              ))}
                          </td>
                          <td className="p-3 font-semibold text-green-600">
                            $
                            {order.items
                              .filter(
                                (item) =>
                                  item.sellerId?.role === "seller_candidate"
                              )
                              .reduce(
                                (sum, item) => sum + item.price * item.quantity,
                                0
                              )}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                order.orderStatus === "Processing"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {order.orderStatus}
                            </span>
                          </td>
                          <td className="p-3">{renderOrderDetails(order)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* // In your Dashboard component, add this section in the Admin Panel: */}
          {/* Featured Products Management - Admin Only */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden mt-6">
            <div className="border-b border-gray-200 px-6 py-4 bg-purple-50">
              <h3 className="text-xl font-semibold text-purple-800">
                ⭐ Featured Products Management
              </h3>
              <p className="text-sm text-purple-600 mt-1">
                Mark/unmark products as featured for the home page
              </p>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-3 text-left text-sm font-semibold text-gray-600">
                        Product
                      </th>
                      <th className="p-3 text-left text-sm font-semibold text-gray-600">
                        Seller
                      </th>
                      <th className="p-3 text-left text-sm font-semibold text-gray-600">
                        Price
                      </th>
                      <th className="p-3 text-left text-sm font-semibold text-gray-600">
                        Category
                      </th>
                      <th className="p-3 text-left text-sm font-semibold text-gray-600">
                        Status
                      </th>
                      <th className="p-3 text-left text-sm font-semibold text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allProducts.map((product) => (
                      <tr
                        key={product._id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="p-3">
                          <div className="flex items-center space-x-3">
                            {product.images && product.images.length > 0 ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-10 h-10 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                <svg
                                  className="w-5 h-5 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                            )}
                            <div>
                              <div className="font-medium text-gray-900">
                                {product.name}
                              </div>
                              <div className="text-sm text-gray-500 line-clamp-1">
                                {product.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-sm text-gray-600">
                          {product.sellerId?.name || "Unknown Seller"}
                          <div className="text-xs text-gray-400 capitalize">
                            {product.sellerId?.role?.replace("_", " ") ||
                              "Unknown"}
                          </div>
                        </td>
                        <td className="p-3 font-semibold text-green-600">
                          ${product.price}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium capitalize">
                            {product.category}
                          </span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              product.featured
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {product.featured ? "Featured" : "Not Featured"}
                          </span>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() =>
                              toggleFeatured(product._id, product.featured)
                            }
                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                              product.featured
                                ? "bg-red-600 text-white hover:bg-red-700"
                                : "bg-green-600 text-white hover:bg-green-700"
                            }`}
                          >
                            {product.featured
                              ? "Remove Featured"
                              : "Mark Featured"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Featured Products Stats */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-green-600">
                        Featured Products
                      </p>
                      <p className="text-2xl font-bold text-green-800">
                        {allProducts.filter((p) => p.featured).length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-blue-600">Total Products</p>
                      <p className="text-2xl font-bold text-blue-800">
                        {allProducts.length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <svg
                        className="w-5 h-5 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-purple-600">
                        Seller Candidates
                      </p>
                      <p className="text-2xl font-bold text-purple-800">
                        {
                          allProducts.filter(
                            (p) => p.sellerId?.role === "seller_candidate"
                          ).length
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* My Products (Admins and Seller Candidates) - RESTORED FUNCTIONALITY */}
      {(role === "admin" || role === "seller_candidate") && (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-xl font-semibold text-gray-800">
              {role === "admin" ? "My Products" : "My Products"}
            </h3>
          </div>
          <div className="p-6">
            {/* Show Add Product button for both admin and seller_candidate */}
            <button
              onClick={() => {
                setEditingProduct(null);
                setIsProductModalOpen(true);
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors mb-6"
            >
              Add Product
            </button>

            <ProductModal
              isOpen={isProductModalOpen}
              onClose={() => {
                setIsProductModalOpen(false);
                setEditingProduct(null);
              }}
              token={token}
              fetchProducts={fetchProducts}
              product={editingProduct}
            />

            <div className="overflow-x-auto">
              {/* Show products table for admin and seller_candidate with full functionality */}
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Name</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Price</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Quantity</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Category</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {myProducts.map((product) => (
                    <tr key={product._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-3 text-gray-700">{product.name}</td>
                      <td className="p-3 text-gray-700">${product.price}</td>
                      <td className="p-3 text-gray-700">{product.quantity}</td>
                      <td className="p-3 text-gray-700">{product.category}</td>
                      <td className="p-3">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setIsProductModalOpen(true);
                            }}
                            className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteProduct(product._id)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------- SELLER_CANDIDATE ORDERS - 2 TABLES ------------------- */}
      {role === "seller_candidate" && (
        <div className="space-y-6">
          {/* Table 1: Seller Candidate New Orders */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4 bg-yellow-50">
              <h3 className="text-xl font-semibold text-yellow-800">
                🆕 My New Orders
              </h3>
              <p className="text-sm text-yellow-600 mt-1">
                Orders that need to be processed
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">
                      Order ID
                    </th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">
                      Items
                    </th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">
                      Total
                    </th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">
                      Status
                    </th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">
                      Payment
                    </th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">
                      Customer Details
                    </th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sellerOrders
                    .filter((order) => order.orderStatus === "Pending")
                    .map((order) => (
                      <tr
                        key={order._id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="p-3 font-mono text-sm text-gray-700">
                          {order._id.slice(-8)}
                        </td>
                        <td className="p-3">
                          {order.items.map((item, index) => (
                            <div key={index} className="text-sm text-gray-600">
                              {item.productId?.name} (Qty: {item.quantity}) - $
                              {item.price}
                            </div>
                          ))}
                        </td>
                        <td className="p-3 font-semibold text-green-600">
                          ${order.total}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="p-3 text-sm text-gray-600">
                          {order.paymentStatus} ({order.paymentMethod})
                        </td>
                        <td className="p-3">{renderOrderDetails(order)}</td>
                        <td className="p-3">
                          <button
                            onClick={() => processOrder(order._id)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                          >
                            Process
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table 2: Seller Candidate Processed Orders */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4 bg-green-50">
              <h3 className="text-xl font-semibold text-green-800">
                ✅ My Processed Orders
              </h3>
              <p className="text-sm text-green-600 mt-1">
                Orders that have been processed
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">
                      Order ID
                    </th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">
                      Items
                    </th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">
                      Total
                    </th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">
                      Status
                    </th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">
                      Payment
                    </th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">
                      Customer Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sellerOrders
                    .filter(
                      (order) =>
                        order.orderStatus === "Processing" ||
                        order.orderStatus === "Delivered"
                    )
                    .map((order) => (
                      <tr
                        key={order._id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="p-3 font-mono text-sm text-gray-700">
                          {order._id.slice(-8)}
                        </td>
                        <td className="p-3">
                          {order.items.map((item, index) => (
                            <div key={index} className="text-sm text-gray-600">
                              {item.productId?.name} (Qty: {item.quantity}) - $
                              {item.price}
                            </div>
                          ))}
                        </td>
                        <td className="p-3 font-semibold text-green-600">
                          ${order.total}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              order.orderStatus === "Processing"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="p-3 text-sm text-gray-600">
                          {order.paymentStatus} ({order.paymentMethod})
                        </td>
                        <td className="p-3">{renderOrderDetails(order)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {/* Seller Form Modal */}
      <SellerFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Submit Product Form
        </h3>
        <form onSubmit={submitForm} className="space-y-4">
          <input
            type="text"
            placeholder="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
          <button className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
            Submit
          </button>
        </form>
      </SellerFormModal>
    </div>
  );
}