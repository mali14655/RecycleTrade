import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";
import CartItem from "../components/CartItem";
import CartSummary from "../components/CartSummary";

export default function Cart() {
  const { user } = useContext(AuthContext);
  const { cart, removeFromCart, updateQuantity, clearCart, fetchUserCart } =
    useContext(CartContext);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  // Fetch only for logged-in user
  useEffect(() => {
    if (user) fetchUserCart();
  }, [user]);

  // Calculate total
  useEffect(() => {
    if (cart && cart.items) {
      const sum = cart.items.reduce((acc, item) => {
        const product = item.productId || item;
        // Get variant price if variant exists
        let itemPrice = item.price || product.price || 0;
        if (item.variantId && product.variants) {
          const variant = product.variants.find(
            v => v._id?.toString() === item.variantId?.toString()
          );
          if (variant) {
            itemPrice = variant.price;
          }
        }
        return acc + itemPrice * item.quantity;
      }, 0);
      setTotal(sum);
    }
  }, [cart]);

  if (!cart || !cart.items || cart.items.length === 0)
    return (
      <div className="min-h-screen bg-gray-50">
        <Breadcrumb />
        <div className="max-w-[90%] mx-auto px-4 py-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m0 0L17 21" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">Start shopping to add items to your cart</p>
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-900 transition-colors"
              >
                <ArrowLeft size={20} />
                <span>RETURN TO SHOP</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumb />
      <div className="max-w-[90%] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Shopping Card
              </h1>
              {/* Table Header - Desktop Only */}
              <div className="hidden sm:grid sm:grid-cols-12 sm:gap-4 pb-4 border-b border-gray-200 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                <div className="col-span-1 text-center">PRODUCTS</div>
                <div className="col-span-4"></div>
                <div className="col-span-2 text-center">PRICE</div>
                <div className="col-span-3 text-center">QUANTITY</div>
                <div className="col-span-2 text-right">SUB-TOTAL</div>
              </div>
              {/* Cart Items */}
              <div className="divide-y divide-gray-200">
                {cart.items.map((item) => {
                  const product = item.productId || item; // guest vs user format
                  return (
                    <CartItem
                      key={`${product._id}-${item.variantId || 'no-variant'}`}
                      item={item}
                      product={product}
                      onRemove={removeFromCart}
                      onUpdateQuantity={updateQuantity}
                    />
                  );
                })}
              </div>
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-6 pt-6 border-t border-gray-200">
                <Link
                  to="/products"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-900 transition-colors"
                >
                  <ArrowLeft size={20} />
                  <span>RETURN TO SHOP</span>
                </Link>
              </div>
            </div>
          </div>
          {/* Cart Summary Section */}
          <div className="lg:col-span-1">
            <CartSummary 
              total={total} 
              onCheckout={() => navigate("/checkout")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}