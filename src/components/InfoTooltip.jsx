import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

// Appearance condition images (two per condition)
import premiumImg1 from '../assets/premium/WhatsApp Image 2026-03-11 at 12.59.52 PM.jpeg';
import premiumImg2 from '../assets/premium/WhatsApp Image 2026-03-11 at 12.59.52 PM (1).jpeg';
import excellentImg1 from '../assets/Excellent/WhatsApp Image 2026-03-11 at 1.01.17 PM.jpeg';
import excellentImg2 from '../assets/Excellent/WhatsApp Image 2026-03-11 at 1.01.17 PM (1).jpeg';
import verygoodImg1 from '../assets/verygood/WhatsApp Image 2026-03-11 at 1.02.44 PM.jpeg';
import verygoodImg2 from '../assets/verygood/WhatsApp Image 2026-03-11 at 1.02.44 PM (1).jpeg';
import goodImg1 from '../assets/good/WhatsApp Image 2026-03-11 at 1.03.51 PM.jpeg';
import goodImg2 from '../assets/good/WhatsApp Image 2026-03-11 at 1.03.51 PM (1).jpeg';

const InfoTooltip = ({ content, className = '', type = 'generic' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef(null);
  const triggerRef = useRef(null);

  // NEW: Appearance modal state (tabs + image slider)
  const APPEARANCE_CONDITIONS = {
    Premium: {
      title: 'Premium',
      description: 'Like-new device with no visible signs of use.',
      details: [
        'Screen: identical to new',
        'Body: identical to new'
      ],
      images: [premiumImg1, premiumImg2]
    },
    Excellent: {
      title: 'Excellent',
      description: 'Device looks almost like new with minimal signs of use.',
      details: [
        'Screen: like new',
        'Body: no visible scratches from a close distance'
      ],
      images: [excellentImg1, excellentImg2]
    },
    'Very good': {
      title: 'Very good',
      description: 'Light signs of use, not noticeable during normal use.',
      details: [
        'Screen: no visible scratches when turned on',
        'Body: minimal signs of use — visible from 30cm'
      ],
      images: [verygoodImg1, verygoodImg2]
    },
    Good: {
      title: 'Good',
      description: 'Clearly used device with more visible signs of wear.',
      details: [
        'Screen: no visible scratches when turned on',
        'Body: small scratches or dents'
      ],
      images: [goodImg1, goodImg2]
    }
  };

  const [selectedAppearance, setSelectedAppearance] = useState('Premium');
  const [appearanceImageIndex, setAppearanceImageIndex] = useState(0);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close when clicking outside tooltip and trigger (backdrop click is handled by the backdrop div)
      if (
        tooltipRef.current && 
        !tooltipRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  // Format content - handle newlines, preserve empty lines for spacing
  const formatContent = (text) => {
    if (!text) return [];
    return text.split('\n');
  };

  const lines = formatContent(content);

  const renderContent = () => {
    return (
      <div className="text-gray-700 leading-relaxed">
        {lines.map((line, index) => {
          const trimmedLine = line.trim();
          if (!trimmedLine) {
            return <br key={index} />;
          }
          
          // Check if line is a category/type name (Premium, Excellent, Optimal, New, etc.)
          const isHeader = ['Premium', 'Excellent', 'Very good', 'Good', 'Optimal', 'New'].includes(trimmedLine);
          const isSubHeader = trimmedLine.startsWith('Screen:') || trimmedLine.startsWith('Body:') || 
                            trimmedLine.startsWith('Optimal battery') || trimmedLine.startsWith('No additional') ||
                            trimmedLine.startsWith('Seller inputs') || trimmedLine.startsWith('Adds environmental');
          
          if (isHeader) {
            return (
              <p key={index} className="font-semibold text-gray-900 mt-3 mb-1 first:mt-0">
                {trimmedLine}
              </p>
            );
          } else if (isSubHeader) {
            return (
              <p key={index} className="mb-1 ml-2">
                {trimmedLine}
              </p>
            );
          } else {
            return (
              <p key={index} className="mb-2 last:mb-0">
                {trimmedLine}
              </p>
            );
          }
        })}
      </div>
    );
  };

  const renderAppearanceContent = () => {
    const condition = APPEARANCE_CONDITIONS[selectedAppearance];
    if (!condition) return null;

    const images = condition.images || [];
    const currentImage = images[appearanceImageIndex % images.length];

    const goPrev = () => {
      if (!images.length) return;
      setAppearanceImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const goNext = () => {
      if (!images.length) return;
      setAppearanceImageIndex((prev) => (prev + 1) % images.length);
    };

    return (
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {Object.keys(APPEARANCE_CONDITIONS).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setSelectedAppearance(key);
                setAppearanceImageIndex(0);
              }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                selectedAppearance === key
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {key}
            </button>
          ))}
        </div>

        {/* Image slider */}
        {images.length > 0 && (
          <div className="relative w-full h-52 sm:h-64 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200">
            {currentImage && (
              <img
                src={currentImage}
                alt={`${condition.title} condition`}
                className="max-h-full max-w-full object-contain"
              />
            )}

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {images.map((_, idx) => (
                    <span
                      key={idx}
                      className={`w-2 h-2 rounded-full ${
                        idx === appearanceImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Text description */}
        <div>
          <h4 className="text-base font-semibold text-gray-900 mb-1">{condition.title}</h4>
          <p className="text-sm text-gray-700 mb-3">{condition.description}</p>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            {condition.details.map((d, idx) => (
              <li key={idx}>{d}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Modal - Portal to body for both mobile and desktop */}
      {isOpen && content && typeof window !== 'undefined' && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div 
            ref={tooltipRef}
            className="w-full max-w-lg bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-200/50 max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Information</h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1">
              {type === 'appearance' ? renderAppearanceContent() : renderContent()}
            </div>
          </div>
        </div>,
        document.body
      )}
      
      <div className={`relative inline-block ${className}`}>
        <span
          ref={triggerRef}
          className="text-blue-600 font-medium cursor-pointer hover:text-blue-700 underline"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
        >
          (info)
        </span>
      </div>
    </>
  );
};

export default InfoTooltip;
