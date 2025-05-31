
import React from 'react';
import { Plus } from 'lucide-react'; // Default icon

interface FloatingActionButtonProps {
  onClick: () => void;
  icon?: React.ReactNode;
  label: string; // For accessibility and tooltip
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick, icon, label }) => {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="fixed bottom-8 right-8 z-50 flex items-center justify-center w-14 h-14 bg-accent hover:bg-accent-dark text-white rounded-full shadow-xl focus:outline-none focus:ring-2 focus:ring-accent-dark focus:ring-offset-2 transition-all duration-150 ease-in-out transform hover:scale-110 focus:scale-110"
    >
      {icon || <Plus size={28} />}
    </button>
  );
};

export default FloatingActionButton;
