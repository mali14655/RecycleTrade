import React from "react";
import { Link } from "react-router-dom";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 md:p-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Privacy Policy</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">1. Introduction</h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                F&S Smartphones is committed to protecting your privacy. This Privacy Policy explains 
                how information is collected, used, disclosed, and safeguarded when you visit this website and use the services.
              </p>
            </section>

            <section className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">2. Information Collected</h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">Information that you provide directly includes:</p>
              <ul className="list-disc pl-5 sm:pl-6 text-sm sm:text-base text-gray-700 space-y-2 mb-3 sm:mb-4">
                <li>Name, email address, phone number, and shipping address</li>
                <li>Payment information (processed securely through third-party payment processors)</li>
                <li>Account credentials and preferences</li>
                <li>Order history and transaction details</li>
                <li>Communications with our customer service team</li>
              </ul>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                Certain information is also automatically collected when you visit this website, such as IP address, 
                browser type, device information, and usage patterns.
              </p>
            </section>

            <section className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">3. How Information is Used</h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">The information collected is used to:</p>
              <ul className="list-disc pl-5 sm:pl-6 text-sm sm:text-base text-gray-700 space-y-2 mb-3 sm:mb-4">
                <li>Process and fulfill your orders</li>
                <li>Send you order confirmations and shipping updates</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Send you marketing communications (with your consent)</li>
                <li>Improve our website and services</li>
                <li>Detect and prevent fraud</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">4. Information Sharing</h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                Personal information is not sold. Information may be shared with:
              </p>
              <ul className="list-disc pl-5 sm:pl-6 text-sm sm:text-base text-gray-700 space-y-2 mb-3 sm:mb-4">
                <li>Service providers who assist us in operating our website and conducting our business</li>
                <li>Payment processors to handle transactions</li>
                <li>Shipping companies to deliver your orders</li>
                <li>Legal authorities when required by law</li>
              </ul>
            </section>

            <section className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">5. Data Security</h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                Appropriate technical and organizational security measures are implemented to protect personal information 
                against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over 
                the Internet is 100% secure.
              </p>
            </section>

            <section className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">6. Cookies and Tracking</h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                Cookies and similar tracking technologies are used to track activity on this website and store certain information. 
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. For more 
                information, please see the{" "}
                <Link to="/cookies" className="text-blue-600 hover:underline">
                  Cookie Policy
                </Link>
                .
              </p>
            </section>

            <section className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">7. Your Rights</h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">You have the right to:</p>
              <ul className="list-disc pl-5 sm:pl-6 text-sm sm:text-base text-gray-700 space-y-2 mb-3 sm:mb-4">
                <li>Access and receive a copy of your personal data</li>
                <li>Rectify inaccurate or incomplete data</li>
                <li>Request deletion of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Request restriction of processing</li>
                <li>Data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <section className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">8. Children's Privacy</h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                These services are not intended for individuals under the age of 18. Personal 
                information is not knowingly collected from children. If you are a parent or guardian and believe your child has provided 
                personal information, please contact through the contact page.
              </p>
            </section>

            <section className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">9. Changes to This Policy</h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                This Privacy Policy may be updated from time to time. Changes will be notified by posting the 
                new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">10. Contact</h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                If you have any questions about this Privacy Policy, please contact through the{" "}
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

export default Privacy;


