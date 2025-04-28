import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '@/lib/utils';

interface FixedProgressProps {
  current: number;
  total: number;
}

const ProgressBar: React.FC<FixedProgressProps> = ({ current, total }) => {
  const progressPercentage = Math.min((current / total) * 100, 100);

  return (
    <div className="relative w-full">
      <span className="absolute right-0 top-[-1rem] text-[10px] font-medium">
        <span>{current}</span>
        <span style={{ color: '#00A86B' }}>/{total}</span>
      </span>
      <ProgressPrimitive.Root className={cn('relative h-4 overflow-hidden rounded-[4px] bg-[rgba(0,168,107,0.4)]')}>
        <ProgressPrimitive.Indicator
          className={cn('h-full bg-[rgba(0,168,107,1)] transition-all')}
          style={{ transform: `translateX(-${100 - progressPercentage}%)` }}
        />
      </ProgressPrimitive.Root>
    </div>
  );
};


export default ProgressBar;
