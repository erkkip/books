import React, { useEffect, useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose, duration = 4000 }) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      setIsExiting(false);
      
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          setShouldRender(false);
          onClose();
        }, 300); // Match animation duration
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!shouldRender) return null;

  return (
    <div 
      className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 px-4 w-full max-w-[500px] ${
        isExiting ? 'animate-toast-slide-down' : 'animate-toast-slide-up'
      }`}
    >
      <div className="bg-white border-4 border-neo-black shadow-neo-lg px-4 md:px-6 py-4 flex items-center gap-3 md:gap-4 w-full">
        <AlertCircle size={20} className="md:w-6 md:h-6 text-red-600 flex-shrink-0" strokeWidth={2.5} />
        <p className="text-sm md:text-base text-neo-black font-display font-bold flex-grow">{message}</p>
        <button
          onClick={() => {
            setIsExiting(true);
            setTimeout(() => {
              setShouldRender(false);
              onClose();
            }, 300);
          }}
          className="text-neo-black hover:text-neo-pink transition-colors flex-shrink-0"
          aria-label="Close"
        >
          <X size={18} className="md:w-5 md:h-5" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};

export default Toast;

