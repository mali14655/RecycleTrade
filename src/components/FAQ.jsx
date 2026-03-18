// components/FAQ.jsx - NEW FILE
import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const FAQ = () => {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState(null);
  const faqs = [
    {
      id: 0,
      question: t("faq.q1"),
      answer: t("faq.a1"),
    },
    {
      id: 1,
      question: t("faq.q2"),
      answer: t("faq.a2"),
      points: t("faq.q2Points"),
    },
    {
      id: 2,
      question: t("faq.q3"),
      answer: t("faq.a3"),
    },
    {
      id: 3,
      question: t("faq.q4"),
      answer: t("faq.a4"),
    },
    {
      id: 4,
      question: t("faq.q5"),
      answer: t("faq.a5"),
    },
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white py-8 sm:py-12 lg:py-16">
      <div className="max-w-[90%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 lg:mb-10">
          {t("faq.title")}
        </h2>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className={`border border-gray-200 rounded-lg overflow-hidden transition-all ${
                openIndex === faq.id ? "bg-black text-white" : "bg-white"
              }`}
            >
              {/* Question */}
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between text-left hover:bg-opacity-90 transition-colors"
              >
                <span className="font-medium text-sm sm:text-base lg:text-lg pr-4">
                  {faq.question}
                </span>
                {openIndex === faq.id ? (
                  <Minus size={20} className="shrink-0 sm:w-6 sm:h-6" />
                ) : (
                  <Plus size={20} className="shrink-0 sm:w-6 sm:h-6" />
                )}
              </button>

              {/* Answer */}
              {openIndex === faq.id && faq.answer && (
                <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                  <p className="text-white leading-relaxed mb-4">
                    {faq.answer}
                  </p>

                  {faq.points && (
                    <ul className="space-y-2">
                      {faq.points.map((point, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-white mt-1">•</span>
                          <span className="text-white">{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;