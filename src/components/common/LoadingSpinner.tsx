import React from 'react';

interface LoadingSpinnerProps {
  size?: string;
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'w-8 h-8', color = 'border-t-primary' }) => {
  return <div className={`animate-spin rounded-full border-4 border-gray-300 ${size} ${color}`}></div>;
};

export default LoadingSpinner;
