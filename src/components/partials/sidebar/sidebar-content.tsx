'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { useConfig } from '@/hooks/use-config';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useMenuHoverConfig } from '@/hooks/use-menu-hover';

const SidebarContent = ({ children }: { children: React.ReactNode }) => {
  const isDesktop = useMediaQuery('(min-width: 1280px)');
  const [config] = useConfig();
  const [hoverConfig, setHoverConfig] = useMenuHoverConfig();
  const sidebarTheme = config.sidebarTheme !== 'light' ? `dark theme-${config.sidebarTheme}` : `theme-${config.sidebarTheme}`;

  if (config.menuHidden || config.layout === 'horizontal') return null;

  if (config.sidebar === 'two-column') {
    return (
      <aside className={cn('fixed z-50 hidden h-full xl:flex', sidebarTheme, {})}>
        <div className="relative flex h-full">{children}</div>
      </aside>
    );
  }

  return (
    <aside
      className={cn('fixed z-50 hidden w-[260px] bg-sidebar shadow-base xl:block', sidebarTheme, {
        'w-[72px]': config.collapsed && config.sidebar !== 'compact',
        'border-b': config.skin === 'bordered',
        'shadow-base': config.skin === 'default',
        'start-0 h-full': config.layout !== 'semi-box' && config.layout !== 'compact',
        'bottom-0 start-0 top-0 m-6 rounded-md': config.layout === 'semi-box',
        'bottom-0 start-0 top-0 m-10': config.layout === 'compact',
        'w-28': config.sidebar === 'compact'
        // 'w-[260px]': hoverConfig.hovered
      })}
    >
      <div className="relative flex h-full flex-col">
        {config.sidebarBgImage !== undefined && (
          <div
            className="absolute left-0 top-0 z-[-1] h-full w-full bg-cover bg-center opacity-[0.07]"
            style={{ backgroundImage: `url(${config.sidebarBgImage})` }}
          ></div>
        )}
        {children}
      </div>
    </aside>
  );
};

export default SidebarContent;
