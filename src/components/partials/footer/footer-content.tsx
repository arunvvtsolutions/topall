'use client';

import React from 'react';
import { useConfig } from '@/hooks/use-config';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';

const FooterContent = ({ children }: { children: React.ReactNode }) => {
  const [config] = useConfig();
  const isMobile = useMediaQuery('(min-width: 768px)');
  if (!isMobile) {
    return (
      <footer className="fixed bottom-0 left-0 z-50 w-full bg-card bg-no-repeat px-4 py-[12px] shadow-md backdrop-blur-[40px] backdrop-filter dark:bg-default-300">
        {children}
      </footer>
    );
  }

  if (config.sidebar === 'two-column') {
    return (
      <footer
        className={cn('relative bottom-0 z-50 flex-none bg-card px-6 py-4 xl:ms-[300px]', config.footer, {
          'xl:ms-[72px]': config.subMenu || !config.hasSubMenu,
          'xl:ms-0': config.layout === 'horizontal',
          'border-b': config.skin === 'bordered',
          border: config.skin === 'bordered',
          'shadow-base': config.skin === 'default'
        })}
      >
        {children}
      </footer>
    );
  }

  return (
    <footer
      className={cn('relative bottom-0 z-50 flex-none bg-card px-6 py-4 xl:ms-[285px]', config.footer, {
        'xl:ms-[72px]': config.collapsed && config.sidebar !== 'compact',
        'xl:ms-0': config.menuHidden || config.layout === 'horizontal',
        'border-b': config.skin === 'bordered' && config.layout !== 'semi-box',
        border: config.skin === 'bordered' && config.layout === 'semi-box',
        'shadow-base': config.skin === 'default',
        'mb-6 rounded-md': config.layout === 'semi-box',
        'xl:ms-28': config.sidebar === 'compact' && config.layout !== 'horizontal',
        'xl:ms-24': config.sidebar === 'compact' && config.layout === 'semi-box',
        'has-sticky-footer bottom-10': config.layout === 'compact'
      })}
    >
      {children}
    </footer>
  );
};

export default FooterContent;
