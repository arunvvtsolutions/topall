'use client';

import type * as React from 'react';
import { cn } from '@/lib/utils';

interface RadialProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  color: 'success' | 'warning' | 'destructive' | 'primary';
}

export function RadialProgress({ value, size = 'md', color = 'success', className, ...props }: RadialProgressProps) {
  // Ensure value is between 0 and 100
  const progress = Math.min(100, Math.max(0, value));

  // Calculate the stroke dash offset based on progress
  const circumference = 2 * Math.PI * 45; // radius is 45
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Size variants
  const progressVariants = {
    sizes: { sm: 'h-24 w-24', md: 'h-32 w-32', lg: 'h-40 w-40' },
    colors: {
      success: 'stroke-success text-success-900',
      warning: 'stroke-warning text-warning-900',
      destructive: 'stroke-destructive text-red-900',
      primary: 'stroke-primary text-blue-900'
    }
  };

  // console.log('color', color);
  return (
    <div className={cn('relative inline-flex items-center justify-center', progressVariants.sizes[size], className)} {...props}>
      {/* Background circle */}
      <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 100 100">
        <circle className="stroke-muted" cx="50" cy="50" r="45" fill="none" strokeWidth="10" />
        {/* Progress circle */}
        <circle
          className={cn('transition-all duration-300 ease-in-out', progressVariants.colors[color])}
          cx="50"
          cy="50"
          r="45"
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset
          }}
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-semibold">{progress}%</span>
      </div>
    </div>
  );
}
