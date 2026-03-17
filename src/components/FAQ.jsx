// components/FAQ.jsx - NEW FILE
import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const faqs = [
    {
      id: 0,
      question: "What is your return policy?",
      answer: "We offer a 30-day money-back guarantee on all our products. If you're not satisfied with your purchase, you can return it within 30 days for a full refund.",
    },
    {
      id: 1,
      question: "How long is the warranty period?",
      answer: "All F&s Smartphones products come with a minimum 12-month warranty. Some products may have extended warranty periods depending on the manufacturer and product type.",
      points: [
        "12-month comprehensive warranty on all devices",
        "Extended warranty options available",
        "Coverage for manufacturing defects",
        "Quick and easy warranty claims process",
      ],
    },
    {
      id: 2,
      question: "Are the devices really refurbished?",
      answer: "Yes, all our devices are professionally refurbished. They undergo a rigorous 40-point inspection process to ensure they meet our quality standards before being listed for sale.",
    },
    {
      id: 3,
      question: "Do you offer shipping internationally?",
      answer: "Currently, we only ship within Germany. We're working on expanding our shipping options to other countries in the near future.",
    },
    {
      id: 4,
      question: "How can I track my order?",
      answer: "Once your order ships, you'll receive a tracking number via email. You can also track your order by visiting the 'Track Order' page on our website and entering your order ID.",
    },
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white py-8 sm:py-12 lg:py-16">
      <div className="max-w-[90%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 lg:mb-10">
          Frequently Asked Questions
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