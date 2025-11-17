// context/CartContext.jsx - Fix the addToCart function
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState({ items: [] });

  useEffect(() => {
    if (user) {
      fetchUserCart();
    } else {
      const storedCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      setCart({ items: storedCart });
    }
  }, [user]);

  const updateQuantity = async (productId, newQuantity) => {
    if (user) {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.put(
          `${import.meta.env.VITE_API_URL}/cart/update`,
          { productId, quantity: newQuantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCart(res.data.cart || { items: [] });
      } catch (err) {
        console.error("Error updating quantity:", err);
      }
    } else {
      // Guest user
      const updatedItems = cart.items.map((item) =>
        item._id === productId ? { ...item, quantity: newQuantity } : item
      );
      setCart({ items: updatedItems });
      saveGuestCart(updatedItems);
    }
  };

  const fetchUserCart = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data || { items: [] });
      console.log("Fetched user cart:", res.data);
    } catch (err) {
      console.error("Error fetching user cart:", err);
      setCart({ items: [] });
    }
  };

  const saveGuestCart = (updatedItems) => {
    localStorage.setItem("guestCart", JSON.stringify(updatedItems));
  };

  const addToCart = async (product, quantity = 1, selectedVariant = null) => {
    console.log(
      "Adding to cart:",
      product.name,
      "quantity:",
      quantity,
      "variant:",
      selectedVariant
    );

    // Check stock before adding to cart if variant is provided
    if (selectedVariant) {
      try {
        const checkStock = await axios.post(
          `${import.meta.env.VITE_API_URL}/orders/${product._id}/check-stock`,
          {
            variantId: selectedVariant._id,
            quantity: quantity,
          }
        );

        if (!checkStock.data.available) {
          alert(
            `Only ${checkStock.data.availableQuantity} items available in stock`
          );
          console.log("Stock check failed - not enough stock");
          return;
        }
        console.log("Stock check passed");
      } catch (error) {
        console.error("Error checking stock:", error);
        alert("Error checking product availability");
        return;
      }
    }

    if (user) {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/cart/add`,
          {
            productId: product._id,
            quantity,
            variantId: selectedVariant?._id, // Include variant ID if available
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCart(res.data.cart || { items: [] });
        console.log("Product added to user cart");
      } catch (err) {
        console.error("Error adding to cart:", err);
      }
    } else {
      const existing = cart.items.find((item) => {
        // For variants, check both product ID and variant ID
        if (selectedVariant && item.variantId) {
          return (
            item._id === product._id && item.variantId === selectedVariant._id
          );
        }
        return item._id === product._id;
      });

      let updatedItems;
      if (existing) {
        updatedItems = cart.items.map((item) =>
          (selectedVariant && item.variantId === selectedVariant._id) ||
          (!selectedVariant && item._id === product._id)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const cartItem = {
          ...product,
          quantity,
          variantId: selectedVariant?._id,
          variantSpecs: selectedVariant?.specs,
        };
        updatedItems = [...cart.items, cartItem];
      }
      setCart({ items: updatedItems });
      saveGuestCart(updatedItems);
      console.log("Product added to guest cart");
    }
  };

  const removeFromCart = async (productId, variantId = null) => {
    if (user) {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.delete(
          `${import.meta.env.VITE_API_URL}/cart/remove/${productId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCart(res.data.cart || { items: [] });
      } catch (err) {
        console.error("Error removing from cart:", err);
      }
    } else {
      const updatedItems = cart.items.filter((item) => {
        if (variantId && item.variantId) {
          return !(item._id === productId && item.variantId === variantId);
        }
        return item._id !== productId;
      });
      setCart({ items: updatedItems });
      saveGuestCart(updatedItems);
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        const token = localStorage.getItem("accessToken");
        await axios.delete(`${import.meta.env.VITE_API_URL}/cart/clear`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error("Error clearing cart:", err);
      }
    }
    setCart({ items: [] });
    localStorage.removeItem("guestCart");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        fetchUserCart,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
