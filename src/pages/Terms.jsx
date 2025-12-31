import React from "react";
import { Link } from "react-router-dom";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 md:p-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Terms of Service</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">1. Acceptance of Terms</h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                By accessing and using F&S Smartphones, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">2. Use License</h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                Permission is granted to temporarily access the materials on F&S Smartphones' website for personal, non-commercial 
                transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-5 sm:pl-6 text-sm sm:text-base text-gray-700 space-y-2 mb-3 sm:mb-4">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to reverse engineer any software contained on F&S Smartphones' website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">3. User Accounts</h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                When you create an account, you must provide information that is accurate, complete, and current at all times. 
                You are responsible for safeguarding the password and for all activities that occur under your account.
              </p>
            </section>

            <section className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">4. Products and Services</h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                All products sold through F&S Smartphones are refurbished and come with a quality guarantee. Every effort is made to provide 
                accurate product descriptions, but product descriptions or other content may not always be accurate, 
                complete, reliable, current, or error-free.
              </p>
            </section>

            <section className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">5. Pricing and Payment</h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                All prices are in the currency displayed and are subject to change without notice. Payment must be received 
                before orders are processed. Various payment methods are accepted as displayed during checkout.
              </p>
            </section>

            <section className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">6. Returns and Refunds</h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                A 30-day return policy is offered on all products. Items must be returned in their original condition. 
                Refunds will be processed within 5-10 business days after the returned item is received.
              </p>
            </section>

            <section className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">7. Limitation of Liability</h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                In no event shall F&S Smartphones, nor its directors, employees, partners, agents, suppliers, or affiliates, 
                be liable for any indirect, incidental, special, consequential, or punitive damages, including without 
                limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>
            </section>

            <section className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">8. Changes to Terms</h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                The right is reserved to modify or replace these Terms at any time. If a revision 
                is material, at least 30 days notice will be provided prior to any new terms taking effect.
              </p>
            </section>

            <section className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">9. Contact Information</h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                If you have any questions about these Terms of Service, please contact through the{" "}
                <Link to="/contact" className="text-blue-600 hover:underline">
                  contact page
                </Link>
                .
              </p>
            </section>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <Link
              to="/"
              className="text-blue-600 hover:underline font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;


