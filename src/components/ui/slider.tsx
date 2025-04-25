'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '@/lib/utils';

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    trackClassName?: string;
    rangeClassName?: string;
    thumbClassName?: string;
    showLabel?:boolean
  }
>(({ className, trackClassName, rangeClassName, thumbClassName, showLabel, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn('relative flex w-full touch-none select-none items-center', className)}
    {...props}
  >
    <SliderPrimitive.Track
      className={cn('relative h-2 w-full grow overflow-hidden rounded-full bg-default-200 dark:bg-default-300', trackClassName)}
    >
      <SliderPrimitive.Range className={cn('absolute h-full bg-default', rangeClassName)} />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className={cn(
        'block h-5 w-5 rounded-full border-2 border-default bg-background disabled:pointer-events-none disabled:opacity-50',
        thumbClassName
      )}
    >
      {showLabel && <p className="text-[12px] font-[500] text-[#222222] inline-flex text-nowrap mt-6">{props?.defaultValue?.[0]}%</p>}
    </SliderPrimitive.Thumb>
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
