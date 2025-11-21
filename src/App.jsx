// app.jsx - UPDATED (keep your existing structure)
import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home"; // This will use new UI
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Product";
import SellToCompany from "./pages/SellToCompany";
import ProtectedRoute from "./components/ProtectedRoute";
import ProductDetails from "./pages/ProductDetailPage.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Orders from "./pages/Orders.jsx";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import TrackOrder from "./pages/TrackOrder.jsx";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
        <Route path="/products" element={<Products />} />
        <Route path="/track-order" element={<TrackOrder />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sell-to-company"
          element={
            <ProtectedRoute roles={["seller"]}>
              <SellToCompany />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute roles={["buyer", "seller", "seller_candidate"]}>
              <Orders />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#ffffff",
            color: "#1f2937",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            padding: "16px",
            fontSize: "14px",
            fontWeight: "500",
            maxWidth: "380px",
          },
          success: {
            duration: 3000,
            style: {
              background: "#ffffff",
              border: "1px solid #e5e7eb",
            },
          },
          error: {
            duration: 4000,
            style: {
              background: "#ffffff",
              border: "1px solid #e5e7eb",
            },
          },
          loading: {
            duration: 2000,
            style: {
              background: "#ffffff",
              border: "1px solid #e5e7eb",
            },
          },
        }}
      />
    </Layout>
  );
}

export default App;
