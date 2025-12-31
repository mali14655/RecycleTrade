import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Contact Us</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">
            Get in touch with F&S Smartphones. Reach out through any of the following methods.
          </p>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 md:p-10">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8">Get in Touch</h2>
          
          <div className="space-y-6 sm:space-y-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-black rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Email</h3>
                <a 
                  href="mailto:support@fssmartphones.com" 
                  className="text-sm sm:text-base text-gray-600 hover:text-black transition-colors break-all"
                >
                  support@fssmartphones.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-black rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Phone</h3>
                <a 
                  href="tel:+1234567890" 
                  className="text-sm sm:text-base text-gray-600 hover:text-black transition-colors"
                >
                  +1 (234) 567-890
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-black rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Address</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  123 Commerce Street<br />
                  Business District<br />
                  City, State 12345
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Business Hours</h3>
            <div className="space-y-2 text-sm sm:text-base text-gray-600">
              <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p>Saturday: 10:00 AM - 4:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <Link
            to="/"
            className="text-blue-600 hover:underline font-medium text-sm sm:text-base"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Contact;


