'use client';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackdropLoaderProps {
  isLoading: boolean;
  text?: string;
  fullScreen?: boolean;
  className?: string;
  spinnerClassName?: string;
  textClassName?: string;
}

export function BackdropLoader({
  isLoading,
  text = 'Loading...',
  fullScreen = true,
  className,
  spinnerClassName,
  textClassName
}: BackdropLoaderProps) {
  if (!isLoading) return null;

  return (
    <div
      className={cn(
        'z-50 flex flex-col items-center justify-center bg-black/50',
        fullScreen ? 'fixed inset-0' : 'absolute inset-0',
        className
      )}
    >
      <Loader2 className={cn('h-8 w-8 animate-spin text-white', spinnerClassName)} />
      {text && <p className={cn('mt-2 text-sm font-medium text-white', textClassName)}>{text}</p>}
    </div>
  );
}
