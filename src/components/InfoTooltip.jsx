import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const InfoTooltip = ({ content, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef(null);
  const triggerRef = useRef(null);

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
              {renderContent()}
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
