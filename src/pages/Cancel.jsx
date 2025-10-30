import React from "react";

const Cancel = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-50">
      <h1 className="text-3xl font-bold text-red-600 mb-4">❌ Payment Cancelled</h1>
      <p className="text-gray-700">Your payment was cancelled. You can try again anytime.</p>
      <a href="/checkout" className="mt-6 px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700">
        Back to Checkout
      </a>
    </div>
  );
};

export default Cancel;
