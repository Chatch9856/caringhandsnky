
import React from 'react';

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
}

const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick, icon, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center px-4 py-2 font-medium text-sm rounded-t-lg focus:outline-none transition-all duration-200 ease-in-out
        ${isActive 
          ? 'bg-white text-primary border-b-2 border-primary shadow-sm' 
          : disabled 
            ? 'text-slate-400 bg-slate-100 cursor-not-allowed'
            : 'text-neutral-DEFAULT hover:text-primary hover:bg-slate-100'
        }
        ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
      `}
      aria-disabled={disabled}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </button>
  );
};

export default TabButton;
