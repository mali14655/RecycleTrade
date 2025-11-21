import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { SearchProvider } from "./context/SearchContext"; // Add this

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <SearchProvider>
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </SearchProvider>
    </BrowserRouter>
  </React.StrictMode>
);
