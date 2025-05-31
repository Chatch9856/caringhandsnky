
import React from 'react';

export interface SegmentedControlOption<T extends string> {
  label: string;
  value: T;
  icon?: React.ReactNode;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedControlOption<T>[];
  selectedValue: T;
  onChange: (value: T) => void;
  name?: string; // For accessibility
  size?: 'sm' | 'md';
}

const SegmentedControl = <T extends string>({ 
  options, 
  selectedValue, 
  onChange, 
  name = "segmented-control",
  size = 'md'
}: SegmentedControlProps<T>) => {
  const sizeClasses = {
    sm: {
      container: 'p-0.5',
      button: 'px-3 py-1 text-xs',
      icon: 'w-4 h-4 mr-1.5'
    },
    md: {
      container: 'p-1',
      button: 'px-4 py-2 text-sm',
      icon: 'w-5 h-5 mr-2'
    }
  };
  const currentSize = sizeClasses[size];

  return (
    <div className={`inline-flex items-center bg-slate-100 rounded-lg shadow-sm ${currentSize.container} transition-all duration-150 ease-in-out`} role="tablist" aria-label={name}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          role="tab"
          aria-selected={selectedValue === option.value}
          className={`flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-all duration-200 ease-in-out transform hover:scale-105
            ${currentSize.button}
            ${
              selectedValue === option.value
                ? 'bg-white text-primary shadow-md scale-105'
                : 'text-neutral-600 hover:text-primary'
            }
          `}
        >
          {option.icon && <span className={currentSize.icon}>{option.icon}</span>}
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default SegmentedControl;
