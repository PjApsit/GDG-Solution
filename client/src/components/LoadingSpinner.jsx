/**
 * LoadingSpinner — Global loading indicator
 * WHY (Q34): Every AI interaction needs a clear, text-based loader.
 * Reusable across scanner, data loading, and task operations.
 */

import React from 'react';

const LoadingSpinner = ({ message = 'Loading...', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div
        className={`${sizeClasses[size]} border-primary/20 border-t-primary rounded-full animate-spin`}
        style={{ borderWidth: size === 'sm' ? '2px' : size === 'lg' ? '4px' : '3px' }}
      />
      <p className="text-body-base text-on-surface-variant animate-pulse">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
