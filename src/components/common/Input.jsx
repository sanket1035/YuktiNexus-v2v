import React from 'react';

export const Input = ({
  label,
  id,
  type = 'text',
  error,
  icon: Icon = null,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full text-left ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold tracking-wider uppercase text-luxury-purple-600/80 dark:text-luxury-purple-300/80 font-sans"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-4 text-luxury-purple-400 dark:text-luxury-purple-500 pointer-events-none">
            <Icon size={18} />
          </div>
        )}
        <input
          id={id}
          type={type}
          className={`w-full font-sans text-sm rounded-xl py-3 px-4 ${
            Icon ? 'pl-11' : 'pl-4'
          } pr-4 bg-luxury-cream-50/70 border text-luxury-purple-950 border-luxury-cream-200 dark:bg-luxury-purple-900/30 dark:border-luxury-purple-800/80 dark:text-luxury-cream-50 placeholder-luxury-purple-400/60 dark:placeholder-luxury-purple-500/50 focus:outline-none focus:border-luxury-purple-400 dark:focus:border-luxury-purple-500 focus:bg-white dark:focus:bg-luxury-purple-900/60 focus:ring-4 focus:ring-luxury-purple-100 dark:focus:ring-luxury-purple-950/50`}
          {...props}
        />
      </div>
      {error && (
        <span className="text-xs font-medium text-red-500 dark:text-red-400 mt-1 pl-1">
          {error}
        </span>
      )}
    </div>
  );
};
