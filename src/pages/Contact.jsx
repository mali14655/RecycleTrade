import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const Contact = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">{t("contact.title")}</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">
            {t("contact.subtitle")}
          </p>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 md:p-10">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8">{t("contact.getInTouch")}</h2>
          
          <div className="space-y-6 sm:space-y-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-black rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">{t("contact.emailLabel")}</h3>
                <a 
                  href="mailto:F-und-ssmartphones@web.de" 
                  className="text-sm sm:text-base text-gray-600 hover:text-black transition-colors break-all"
                >
                  F-und-ssmartphones@web.de
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-black rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">{t("contact.phoneLabel")}</h3>
                <a 
                  href="tel:+4917680312302" 
                  className="text-sm sm:text-base text-gray-600 hover:text-black transition-colors"
                >
                  +49 176 80312302
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-black rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">{t("contact.addressLabel")}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Q1 5-6<br />
                  68161 Mannheim<br />
                  Germany
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


