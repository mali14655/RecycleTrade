import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
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

  // NEW: Stock management - Helper function to check stock for guest cart
  const checkGuestStock = (product, variantId, requestedQuantity, existingQuantity = 0) => {
    if (product.variants && product.variants.length > 0) {
      if (!variantId) {
        return { available: false, message: "Variant selection required" };
      }
      
      const variant = product.variants.find(v => v._id?.toString() === variantId?.toString());
      if (!variant) {
        return { available: false, message: "Variant not found" };
      }
      
      const totalQuantity = existingQuantity + requestedQuantity;
      const availableStock = variant.stock !== undefined ? variant.stock : Infinity;
      
      if (totalQuantity > availableStock) {
        return { 
          available: false, 
          message: `Insufficient stock. Only ${availableStock} available.`,
          availableStock 
        };
      }
      
      return { available: true, availableStock };
    }
    
    // For products without variants, assume unlimited stock (backward compatibility)
    return { available: true };
  };

  const updateQuantity = async (productId, newQuantity, variantId = null) => {
    if (user) {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.put(
          `${import.meta.env.VITE_API_URL}/cart/update`,
          { productId, quantity: newQuantity, variantId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCart(res.data.cart || { items: [] });
      } catch (err) {
        console.error("Error updating quantity:", err);
        const errorMessage = err.response?.data?.message || "Failed to update quantity";
        toast.error(errorMessage);
      }
    } else {
      // NEW: Stock management - Check stock for guest cart
      const item = cart.items.find((item) => {
        const productMatch = item._id === productId;
        if (variantId) {
          return productMatch && item.variantId && item.variantId.toString() === variantId.toString();
        }
        return productMatch && !item.variantId;
      });

      if (!item) {
        toast.error("Item not found in cart");
        return;
      }

      // NEW: Stock management - Check stock availability for the new quantity
      // Only check if we're increasing quantity (decreasing is always allowed)
      const currentQuantity = item.quantity;
      const quantityDifference = newQuantity - currentQuantity;
      
      if (quantityDifference > 0) {
        // We're increasing quantity, check if additional stock is available
        const stockCheck = checkGuestStock(item, variantId || item.variantId, quantityDifference, currentQuantity);
        if (!stockCheck.available) {
          toast.error(stockCheck.message);
          return;
        }
      }

      const updatedItems = cart.items.map((item) => {
        const productMatch = item._id === productId;
        if (variantId) {
          return (productMatch && item.variantId && item.variantId.toString() === variantId.toString())
            ? { ...item, quantity: newQuantity }
            : item;
        }
        return productMatch && !item.variantId
          ? { ...item, quantity: newQuantity }
          : item;
      });
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
    console.log("Adding to cart:", product.name, "quantity:", quantity, "variant:", selectedVariant);

    if (user) {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/cart/add`,
          {
            productId: product._id,
            quantity,
            variantId: selectedVariant?._id,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCart(res.data.cart || { items: [] });
        console.log("Product added to user cart");
        toast.success(`${product.name} added to cart!`);
      } catch (err) {
        console.error("Error adding to cart:", err);
        // NEW: Stock management - Show error message from backend
        const errorMessage = err.response?.data?.message || "Failed to add item to cart";
        toast.error(errorMessage);
      }
    } else {
      // NEW: Stock management - Check stock for guest cart
      const existing = cart.items.find((item) => {
        if (selectedVariant && item.variantId) {
          return (
            item._id === product._id && item.variantId === selectedVariant._id
          );
        }
        return item._id === product._id;
      });

      const existingQuantity = existing ? existing.quantity : 0;
      const requestedQuantity = quantity;

      // Check stock availability
      const stockCheck = checkGuestStock(product, selectedVariant?._id, requestedQuantity, existingQuantity);
      if (!stockCheck.available) {
        toast.error(stockCheck.message);
        return;
      }

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
      toast.success(`${product.name} added to cart!`);
    }
  };

  const removeFromCart = async (productId, variantId = null) => {
    if (user) {
      try {
        const token = localStorage.getItem("accessToken");
        const url = variantId 
          ? `${import.meta.env.VITE_API_URL}/cart/remove/${productId}?variantId=${variantId}`
          : `${import.meta.env.VITE_API_URL}/cart/remove/${productId}`;
        const res = await axios.delete(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCart(res.data.cart || { items: [] });
      } catch (err) {
        console.error("Error removing from cart:", err);
        toast.error("Failed to remove item from cart");
      }
    } else {
      const updatedItems = cart.items.filter((item) => {
        if (variantId && item.variantId) {
          return !(item._id === productId && item.variantId.toString() === variantId.toString());
        }
        return !(item._id === productId && !item.variantId);
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