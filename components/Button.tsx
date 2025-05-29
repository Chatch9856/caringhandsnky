
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'customBlue';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  disabled?: boolean; // Added disabled prop
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  className = '',
  href,
  type = 'button',
  fullWidth = false,
  disabled = false, // Added disabled prop with default value
}) => {
  const baseStyles = 'font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ease-in-out';
  
  let variantStyles = '';
  switch (variant) {
    case 'primary':
      variantStyles = `bg-brand-purple text-brand-white ${!disabled ? 'hover:bg-brand-purple-dark' : ''} focus:ring-brand-purple`;
      break;
    case 'secondary':
      variantStyles = `bg-brand-lavender text-brand-purple ${!disabled ? 'hover:bg-purple-200' : ''} focus:ring-brand-lavender`;
      break;
    case 'outline':
      variantStyles = `bg-transparent text-brand-purple border-2 border-brand-purple ${!disabled ? 'hover:bg-brand-purple hover:text-brand-white' : ''} focus:ring-brand-purple`;
      break;
    case 'customBlue':
      variantStyles = `bg-brand-blue-dark text-brand-white ${!disabled ? 'hover:bg-opacity-90' : ''} focus:ring-brand-blue-dark`;
      break;
  }

  let sizeStyles = '';
  switch (size) {
    case 'small':
      sizeStyles = 'px-4 py-2 text-sm';
      break;
    case 'medium':
      sizeStyles = 'px-6 py-3 text-base'; // text-base is 1rem
      break;
    case 'large':
      sizeStyles = 'px-8 py-3 text-lg'; // Default text-lg
      break;
  }

  const fullWidthStyles = fullWidth ? 'w-full' : '';
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'transform hover:scale-105'; // Added disabled styles

  const combinedClassName = `${baseStyles} ${variantStyles} ${sizeStyles} ${fullWidthStyles} ${disabledStyles} ${className}`;

  if (href && !disabled) { // Link should not be interactive if disabled
    return (
      <a href={href} className={combinedClassName} onClick={onClick}>
        {children}
      </a>
    );
  }
  
  if (href && disabled) { // Render a non-interactive span or div if it's a link and disabled
     return (
      <span className={combinedClassName}>
        {children}
      </span>
    );
  }


  return (
    <button type={type} className={combinedClassName} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
