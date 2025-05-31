
import React from 'react';

interface SkeletonLoaderProps {
  type?: 'line' | 'card' | 'avatar';
  className?: string;
  lines?: number; // For 'line' type, number of lines
  height?: string; // e.g., 'h-8'
  width?: string; // e.g., 'w-full'
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  type = 'line', 
  className = '', 
  lines = 3,
  height,
  width
}) => {
  const baseClasses = "bg-slate-200 rounded animate-pulse";

  if (type === 'card') {
    return (
      <div className={`p-4 bg-white rounded-2xl shadow-lg border border-slate-200 ${className}`}>
        <div className={`${baseClasses} h-24 mb-4 ${width || 'w-full'}`}></div>
        {[...Array(lines)].map((_, i) => (
          <div key={i} className={`${baseClasses} h-4 mb-2 ${ i === lines - 1 ? (width || 'w-3/4') : (width || 'w-full')}`}></div>
        ))}
      </div>
    );
  }

  if (type === 'avatar') {
    return (
      <div className="flex items-center space-x-4">
        <div className={`${baseClasses} rounded-full ${height || 'h-12'} ${width || 'w-12'} ${className}`}></div>
        <div className="flex-1 space-y-2">
          <div className={`${baseClasses} h-4 ${width || 'w-3/4'}`}></div>
          <div className={`${baseClasses} h-4 ${width || 'w-1/2'}`}></div>
        </div>
      </div>
    );
  }

  // Default: 'line' type
  return (
    <div className={`space-y-2.5 ${className}`}>
      {[...Array(lines)].map((_, i) => (
        <div 
          key={i} 
          className={`${baseClasses} ${height || 'h-4'} ${ i === lines - 1 ? (width || 'w-3/4') : (width || 'w-full')}`}
        ></div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
