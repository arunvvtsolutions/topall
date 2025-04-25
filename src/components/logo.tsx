'use client';
import React from 'react';
import ProductLogo from './product-logo';
// import { Link } from '@/i18n/routing';
import { useConfig } from '@/hooks/use-config';
import { useMenuHoverConfig } from '@/hooks/use-menu-hover';
import { useMediaQuery } from '@/hooks/use-media-query';
import Link from 'next/link';
import Image from 'next/image';
interface LogoProps {
  collapsed?: boolean;
}

const Logo = ({ collapsed }: LogoProps) => {
  const [config] = useConfig();
  const [hoverConfig] = useMenuHoverConfig();
  const { hovered } = hoverConfig;
  const isDesktop = useMediaQuery('(min-width: 1280px)');

  if (config.sidebar === 'compact') {
    return (
      <Link href="/dashboard" className="flex items-center justify-center gap-2">
        {/* <ProductLogo className="h-8 w-8 text-default-900 [&>path:nth-child(2)]:text-background [&>path:nth-child(3)]:text-background" /> */}
      </Link>
    );
  }
  if (config.sidebar === 'two-column' || !isDesktop) return null;

  return (
    <Link href="/dashboard" className={`relative flex ${collapsed ? 'h-[60px]' : 'h-[220px]'} w-full items-center gap-2`}>
      {/* <ProductLogo className="h-8 w-8 text-default-900 [&>path:nth-child(2)]:text-background [&>path:nth-child(3)]:text-background" />
      {(!config?.collapsed || hovered) && <h1 className="text-xl font-semibold text-default-900">DashCode</h1>} */}
      <Image
        src={collapsed ? '/images/logo/sidebar-logo-2.svg' : '/images/logo/sidebar-logo.svg'}
        className="h-full w-full object-contain"
        alt="topall"
        layout="fill"
      />
    </Link>
  );
};

export default Logo;
