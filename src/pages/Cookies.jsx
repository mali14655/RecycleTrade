import React from "react";
import { Link } from "react-router-dom";

const Cookies = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 md:p-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Cookie Policy</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">1. What Are Cookies</h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
                They are widely used to make websites work more efficiently and provide information to the website owners.
              </p>
            </section>

            <section className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">2. How Cookies Are Used</h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">Cookies are used for the following purposes:</p>
              <ul className="list-disc pl-5 sm:pl-6 text-sm sm:text-base text-gray-700 space-y-2 mb-3 sm:mb-4">
                <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
                <li><strong>Authentication:</strong> To keep you logged in and maintain your session</li>
                <li><strong>Preferences:</strong> To remember your settings and preferences</li>
                <li><strong>Analytics:</strong> To understand how visitors interact with our website</li>
                <li><strong>Shopping Cart:</strong> To remember items in your cart</li>
              </ul>
            </section>

            <section className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">3. Types of Cookies Used</h2>
              
              <div className="mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">Essential Cookies</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                  These cookies are necessary for the website to function and cannot be switched off. They are usually 
                  set in response to actions made by you, such as setting privacy preferences or logging in.
                </p>
              </div>

              <div className="mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">Performance Cookies</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                  These cookies allow counting visits and traffic sources to measure and improve the performance 
                  of the site. They help identify which pages are most popular and see how visitors move around the site.
                </p>
              </div>

              <div className="mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">Functionality Cookies</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                  These cookies enable the website to provide enhanced functionality and personalization. They may be set 
                  by the website or by third-party providers whose services have been added to the pages.
                </p>
              </div>

              <div className="mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">Targeting Cookies</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                  These cookies may be set through this site by advertising partners. They may be used to build a 
                  profile of your interests and show you relevant content on other sites.
                </p>
              </div>
            </section>

            <section className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">4. Managing Cookies</h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                You can control and manage cookies in various ways. Please keep in mind that removing or blocking cookies 
                can impact your user experience and parts of this website may no longer be fully accessible.
              </p>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                Most browsers automatically accept cookies, but you can usually modify your browser settings to decline 
                cookies if you prefer. You can also delete cookies that have already been set.
              </p>
            </section>

            <section className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">5. Third-Party Cookies</h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                In addition to the website's own cookies, various third-party cookies may also be used to report usage statistics 
                and refine marketing efforts. These third-party cookies are governed by the respective 
                privacy policies of those third parties.
              </p>
            </section>

            <section className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">6. Updates to This Policy</h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                This Cookie Policy may be updated from time to time to reflect changes in technology, legislation, or 
                operations. Material changes will be notified by posting the new Cookie Policy on this page.
              </p>
            </section>

            <section className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">7. Contact</h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                If you have any questions about the use of cookies, please contact through the{" "}
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

export default Cookies;


