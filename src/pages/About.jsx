import React from "react";
import { Link } from "react-router-dom";
import { Shield, Recycle, Users, Award, Heart, TrendingUp, Mail, Phone, MapPin } from "lucide-react";
import logo from "../assets/logo.jpeg";
import { useLanguage } from "../context/LanguageContext";

const About = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-900 to-black text-white py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Logo and Name - Responsive like Login/Register pages */}
            <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 mb-6">
              <img 
                src={logo} 
                alt="F&s Smartphones" 
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl object-cover shadow-lg shrink-0"
              />
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-center">
                F<span className="text-white/80 font-normal">&</span>s Smartphones
              </h1>
            </div>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mt-4 sm:mt-6 px-4">
              {t("about.subtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">{t("about.missionTitle")}</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              {t("about.missionSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <Recycle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t("about.sustainability")}</h3>
              <p className="text-gray-600">
                {t("about.sustainabilityDesc")}
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t("about.qualityGuaranteed")}</h3>
              <p className="text-gray-600">
                {t("about.qualityDesc")}
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t("about.customerFirst")}</h3>
              <p className="text-gray-600">
                {t("about.customerDesc")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">{t("about.storyTitle")}</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  {t("about.storyP1")}
                </p>
                <p>
                  {t("about.storyP2")}
                </p>
                <p>
                  {t("about.storyP3")}
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">{t("about.whyChoose")}</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Award className="w-6 h-6 text-black flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">{t("about.whyChooseItems.certifiedTitle")}</h4>
                    <p className="text-gray-600 text-sm">{t("about.whyChooseItems.certifiedDesc")}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-black flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">{t("about.whyChooseItems.warrantyTitle")}</h4>
                    <p className="text-gray-600 text-sm">{t("about.whyChooseItems.warrantyDesc")}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <TrendingUp className="w-6 h-6 text-black flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">{t("about.whyChooseItems.pricesTitle")}</h4>
                    <p className="text-gray-600 text-sm">{t("about.whyChooseItems.pricesDesc")}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Recycle className="w-6 h-6 text-black flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">{t("about.whyChooseItems.ecoTitle")}</h4>
                    <p className="text-gray-600 text-sm">{t("about.whyChooseItems.ecoDesc")}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">{t("about.valuesTitle")}</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">
              {t("about.valuesSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <Users className="w-12 h-12 text-black mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("about.values.customerFocusTitle")}</h3>
              <p className="text-gray-600 text-sm">
                {t("about.values.customerFocusDesc")}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <Shield className="w-12 h-12 text-black mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("about.values.qualityTitle")}</h3>
              <p className="text-gray-600 text-sm">
                {t("about.values.qualityDesc")}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <Recycle className="w-12 h-12 text-black mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("about.values.sustainabilityTitle")}</h3>
              <p className="text-gray-600 text-sm">
                {t("about.values.sustainabilityDesc")}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <Award className="w-12 h-12 text-black mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("about.values.excellenceTitle")}</h3>
              <p className="text-gray-600 text-sm">
                {t("about.values.excellenceDesc")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">{t("about.contactTitle")}</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              {t("about.contactSubtitle")}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 md:p-10 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-black rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{t("contact.emailLabel")}</h3>
                <a 
                  href="mailto:F-und-ssmartphones@web.de" 
                  className="text-sm sm:text-base text-gray-600 hover:text-black transition-colors break-all"
                >
                  F-und-ssmartphones@web.de
                </a>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-black rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{t("contact.phoneLabel")}</h3>
                <a 
                  href="tel:+4917680312302" 
                  className="text-sm sm:text-base text-gray-600 hover:text-black transition-colors"
                >
                  +49 176 80312302
                </a>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-black rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{t("contact.addressLabel")}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Q1 5-6<br />
                  68161 Mannheim<br />
                  {t("general.germany")}
                </p>
              </div>
            </div>

            <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 text-center">{t("about.businessHoursTitle")}</h3>
              <div className="space-y-2 text-sm sm:text-base text-gray-600 text-center">
                <p>{t("about.hoursMonFri")}</p>
                <p>{t("about.hoursSat")}</p>
                <p>{t("about.hoursSun")}</p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link
                to="/contact"
                className="inline-block bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                {t("about.visitContactPage")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-4">{t("about.joinCommunity")}</h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            {t("about.joinDesc")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              {t("about.shopNow")}
            </Link>
            {/* COMMENTED OUT: Selling feature not available
            <Link
              to="/sell-to-company"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-black transition-colors"
            >
              Sell Your Device
            </Link>
            */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;


