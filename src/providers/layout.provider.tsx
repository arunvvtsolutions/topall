'use client';
import { useConfig } from '@/hooks/use-config';
import React from 'react';
import { cn } from '@/lib/utils';

const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [config, setConfig] = useConfig();

  return (
    <div
      className={cn('flex min-h-svh w-full flex-col bg-default-100 dark:bg-background', {
        'bg-transparent': config.skin === 'bordered',
        'xl:px-20': config.layout === 'semi-box',
        'p-6 lg:p-10': config.layout === 'compact'
      })}
    >
      {children}
    </div>
  );
};

export default LayoutProvider;
