// components/Testimonials.jsx - NEW FILE
import React from "react";
import { Star } from "lucide-react";
import janeSmithImg from '../assets/janeSmith.png';
import tomWilliamsImg from '../assets/tomWilliams.png';
import michealBrownImg from '../assets/michealBrown.png';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      text: "I've been using F&S Smartphones for over a year and I'm really impressed with the quality and support. The refurbished phones work perfectly and the customer service is always quick to help with any issues I have. Highly recommend!",
      rating: 5,
      name: "Jane Smith",
      image: janeSmithImg,
    },
    {
      id: 2,
      text: "I've purchased multiple devices from F&S Smartphones and overall it's been great. The quality is good and I haven't had any major issues. The pricing is also very reasonable compared to new devices.",
      rating: 4,
      name: "Tom Williams",
      image: tomWilliamsImg,
    },
    {
      id: 3,
      text: "Excellent service and product quality! My refurbished iPhone looks and works like new. The warranty gives me peace of mind and the environmental aspect makes me feel good about my purchase.",
      rating: 5,
      name: "Michael Brown",
      image: michealBrownImg,
    },
  ];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={20}
        className={
          index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }
      />
    ));
  };

  return (
    <div className="bg-gray-50 py-8 sm:py-12 lg:py-16">
      <div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Testimonials
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Don't just take our word for it - see what actual users of our
              service have to say about their experience.
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white border-[#E0E0E0] border rounded-lg p-6 flex flex-col"
              >
                {/* Testimonial Text */}
                <p className="text-gray-700 text-sm leading-relaxed mb-6 flex-grow">
                  "{testimonial.text}"
                </p>

                {/* Rating */}
                <div className="flex gap-1 mb-6">
                  {renderStars(testimonial.rating)}
                </div>

                {/* User Info */}
                <div className="flex flex-col items-center">
                  {testimonial.image ? (
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full mb-3 object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-300 rounded-full mb-3 flex items-center justify-center">
                      <span className="text-gray-600 font-semibold">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <p className="font-semibold text-gray-900">
                    {testimonial.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;