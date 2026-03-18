// components/WhyChoose.jsx - NEW FILE
import React from "react";
import { CheckCircle } from "lucide-react";
import whyChooseImg from "../assets/whychooseImg.jpeg";
import { useLanguage } from "../context/LanguageContext";


const WhyChoose = () => {
  const { t } = useLanguage();
  const features = [
    {
      title: t("whyChoose.f1Title"),
      description: t("whyChoose.f1Desc"),
    },
    {
      title: t("whyChoose.f2Title"),
      description: t("whyChoose.f2Desc"),
    },
    {
      title: t("whyChoose.f3Title"),
      description: t("whyChoose.f3Desc"),
    },
    {
      title: t("whyChoose.f4Title"),
      description: t("whyChoose.f4Desc"),
    },
  ];

  return (
    <div className="bg-white py-8 sm:py-12 lg:py-16">
      <div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-4 sm:p-6 md:p-8 lg:p-12">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                {t("whyChoose.title")}
              </h2>

              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                {t("whyChoose.subtitle")}
              </p>

              {/* Features List */}
              <div className="space-y-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="shrink-0 mt-1">
                      <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                        <CheckCircle size={16} className="text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Image */}
            <div className="flex justify-center items-center rounded">
              <img
                src={whyChooseImg}
                alt="Colorful iPhones"
                className="w-full max-w-md object-contain rounded"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChoose;