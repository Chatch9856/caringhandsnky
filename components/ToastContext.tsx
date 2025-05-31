
import React, { createContext, useState, useCallback, useContext, ReactNode } from 'react';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon } from '../constants'; // Assuming these icons are in constants

type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now() + Math.random(); // Add random to avoid collision if called rapidly
    setToasts(prevToasts => [...prevToasts, { id, message, type }]);
    setTimeout(() => {
      setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, 5000); // Auto-dismiss after 5 seconds
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] space-y-2 w-full max-w-md sm:max-w-sm">
        {toasts.map(toast => (
          <ToastItem key={toast.id} message={toast.message} type={toast.type} onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

interface ToastItemProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ message, type, onClose }) => {
  const baseClasses = "w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden";
  
  const typeStyles = {
    success: {
      border: "border-green-500",
      iconColor: "text-green-500",
      textColor: "text-green-800",
      closeHoverColor: "hover:text-green-700",
      closeRingColor: "focus:ring-green-600",
    },
    error: {
      border: "border-red-500",
      iconColor: "text-red-500",
      textColor: "text-red-800",
      closeHoverColor: "hover:text-red-700",
      closeRingColor: "focus:ring-red-600",
    },
    info: {
      border: "border-blue-500",
      iconColor: "text-blue-500",
      textColor: "text-blue-800",
      closeHoverColor: "hover:text-blue-700",
      closeRingColor: "focus:ring-blue-600",
    },
  };

  const currentStyle = typeStyles[type];

  return (
    <div className={`${baseClasses}`}>
      <div className={`p-4 border-l-4 ${currentStyle.border}`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {type === 'success' && <CheckCircleIcon className={`h-6 w-6 ${currentStyle.iconColor}`} aria-hidden="true" />}
            {type === 'error' && <XCircleIcon className={`h-6 w-6 ${currentStyle.iconColor}`} aria-hidden="true" />}
            {type === 'info' && <InformationCircleIcon className={`h-6 w-6 ${currentStyle.iconColor}`} aria-hidden="true" />}
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className={`text-sm font-medium ${currentStyle.textColor}`}>{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={onClose}
              className={`inline-flex rounded-md p-1 focus:outline-none focus:ring-2 ${currentStyle.iconColor} ${currentStyle.closeHoverColor} ${currentStyle.closeRingColor}`}
              title="Close notification"
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};