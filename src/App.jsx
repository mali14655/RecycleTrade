// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";
// import Products from "./pages/Product";
// import SellToCompany from "./pages/SellToCompany";
// import ProtectedRoute from "./components/ProtectedRoute";
// import ProductDetails from "./pages/ProductDetailPage.jsx";
// import Cart from "./pages/Cart.jsx";
// import Checkout from "./pages/Checkout.jsx";
// import Orders from "./pages/Orders.jsx";
// import Success from "./pages/Success";
// import Cancel from "./pages/Cancel";

// function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<Home />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />
//       <Route path="/product/:id" element={<ProductDetails />} />
//       <Route path="/cart" element={<Cart />} />
//       <Route path="/checkout" element={<Checkout />} />
//       <Route path="/success" element={<Success />} />
//       <Route path="/cancel" element={<Cancel />} />

//       <Route
//         path="/dashboard"
//         element={
//           <ProtectedRoute>
//             <Dashboard />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/products"
//         element={
//           <ProtectedRoute>
//             <Products />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/sell-to-company"
//         element={
//           <ProtectedRoute roles={["seller"]}>
//             <SellToCompany />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/orders"
//         element={
//           <ProtectedRoute roles={["buyer", "seller"]}>
//             <Orders />
//           </ProtectedRoute>
//         }
//       />
//     </Routes>
//   );
// }

// export default App;

import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
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
    </Layout>
  );
}

export default App;