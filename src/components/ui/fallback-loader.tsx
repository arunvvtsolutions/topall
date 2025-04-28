import React from 'react';
import { LucideLoader } from '../common/LucideLoader';

const FallbackLoader = () => {
  return (
    <div className="flex items-center justify-center">
      <LucideLoader className="h-8 w-8 text-primary" />
    </div>
  );
};

export default FallbackLoader;
