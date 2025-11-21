// components/ConfirmModal.jsx
import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger", // danger, warning, success, info
  isLoading = false
}) => {
  if (!isOpen) return null;

  const typeConfig = {
    danger: {
      iconColor: 'text-red-500',
      buttonColor: 'bg-red-500 hover:bg-red-600 text-white',
      icon: <AlertTriangle className="w-5 h-5" />
    },
    warning: {
      iconColor: 'text-amber-500',
      buttonColor: 'bg-amber-500 hover:bg-amber-600 text-white',
      icon: <AlertTriangle className="w-5 h-5" />
    },
    success: {
      iconColor: 'text-green-500',
      buttonColor: 'bg-green-500 hover:bg-green-600 text-white',
      icon: <AlertTriangle className="w-5 h-5" />
    },
    info: {
      iconColor: 'text-blue-500',
      buttonColor: 'bg-blue-500 hover:bg-blue-600 text-white',
      icon: <AlertTriangle className="w-5 h-5" />
    }
  };

  const config = typeConfig[type];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-200/50">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className={config.iconColor}>
              {config.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-700 leading-relaxed">{message}</p>
        </div>

        {/* Footer */}
        <div className="flex gap-3 justify-end p-6 border-t border-gray-100">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-5 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 text-white  font-medium bg-black`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4  border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;