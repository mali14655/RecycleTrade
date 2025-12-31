import React from "react";
import { Link } from "react-router-dom";
import { Shield, Recycle, Users, Award, Heart, TrendingUp } from "lucide-react";
import logo from "../assets/logo.jpeg";

const About = () => {
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
                alt="F&S Smartphones" 
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl object-cover shadow-lg shrink-0"
              />
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-center">
                F<span className="text-white/80 font-normal">&</span>S Smartphones
              </h1>
            </div>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mt-4 sm:mt-6 px-4">
              Your trusted marketplace for refurbished phones and electronics. 
              We're committed to making quality technology accessible while reducing electronic waste.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Our Mission</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              To provide high-quality refurbished electronics at affordable prices while 
              promoting sustainability and reducing electronic waste in our environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <Recycle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sustainability</h3>
              <p className="text-gray-600">
                We give new life to electronics, reducing waste and helping protect our planet.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Guaranteed</h3>
              <p className="text-gray-600">
                Every device is thoroughly tested and refurbished to meet our high standards.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer First</h3>
              <p className="text-gray-600">
                Your satisfaction is our priority. We're here to help you find the perfect device.
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
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  F&S Smartphones was founded with a simple yet powerful vision: to make quality technology 
                  accessible to everyone while making a positive impact on the environment. We recognized 
                  that millions of perfectly functional devices were being discarded each year, contributing 
                  to the growing problem of electronic waste.
                </p>
                <p>
                  Our team of experts carefully refurbishes each device, ensuring it meets our strict 
                  quality standards. We test every component, replace worn parts, and restore devices 
                  to like-new condition. This process not only extends the life of electronics but also 
                  makes premium technology affordable for more people.
                </p>
                <p>
                  Today, F&S Smartphones has become a trusted name in the refurbished electronics market, 
                  serving thousands of satisfied customers who appreciate both the quality of our products 
                  and our commitment to sustainability.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Why Choose F&S Smartphones?</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Award className="w-6 h-6 text-black flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Certified Refurbished</h4>
                    <p className="text-gray-600 text-sm">All devices are professionally tested and certified</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-black flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Warranty Included</h4>
                    <p className="text-gray-600 text-sm">Every purchase comes with our quality guarantee</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <TrendingUp className="w-6 h-6 text-black flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Best Prices</h4>
                    <p className="text-gray-600 text-sm">Save up to 50% compared to new devices</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Recycle className="w-6 h-6 text-black flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Eco-Friendly</h4>
                    <p className="text-gray-600 text-sm">Help reduce electronic waste with every purchase</p>
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
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Our Values</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <Users className="w-12 h-12 text-black mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer Focus</h3>
              <p className="text-gray-600 text-sm">
                We put our customers first in every decision we make
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <Shield className="w-12 h-12 text-black mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality</h3>
              <p className="text-gray-600 text-sm">
                We never compromise on the quality of our products
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <Recycle className="w-12 h-12 text-black mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sustainability</h3>
              <p className="text-gray-600 text-sm">
                We're committed to protecting our environment
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <Award className="w-12 h-12 text-black mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Excellence</h3>
              <p className="text-gray-600 text-sm">
                We strive for excellence in everything we do
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-4">Join the F&S Smartphones Community</h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Whether you're looking to buy quality refurbished devices, 
            we're here to help you every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Shop Now
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


