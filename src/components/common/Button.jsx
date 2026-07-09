import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({
  children,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon: Icon = null,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-sans font-semibold text-sm rounded-xl py-3 px-5 focus:outline-none transition-all duration-300 gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-luxury-purple-700 hover:bg-luxury-purple-600 text-white shadow-[0_4px_20px_rgba(45,27,78,0.25)] hover:shadow-[0_4px_25px_rgba(45,27,78,0.4)] border border-transparent dark:bg-luxury-purple-500 dark:hover:bg-luxury-purple-400',
    
    secondary: 'bg-luxury-peach text-luxury-purple-950 hover:bg-luxury-peach-dark shadow-[0_4px_15px_rgba(252,209,182,0.2)] hover:shadow-[0_4px_20px_rgba(252,209,182,0.35)] border border-transparent',
    
    outline: 'border border-luxury-cream-300 text-luxury-purple-700 hover:bg-luxury-cream-50 dark:border-luxury-purple-700 dark:text-luxury-purple-200 dark:hover:bg-luxury-purple-900/40',
    
    text: 'text-luxury-purple-600 hover:text-luxury-purple-500 dark:text-luxury-purple-300 dark:hover:text-luxury-purple-100 px-2 py-1',
    
    google: 'border border-luxury-cream-300 hover:bg-luxury-cream-50 text-luxury-purple-900 bg-white shadow-sm dark:border-luxury-purple-800 dark:bg-luxury-purple-900 dark:text-luxury-cream-100 dark:hover:bg-luxury-purple-800/80',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : Icon ? (
        <Icon size={18} className="shrink-0" />
      ) : null}
      <span>{children}</span>
    </motion.button>
  );
};
