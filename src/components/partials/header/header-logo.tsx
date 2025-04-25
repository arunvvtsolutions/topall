'use client';
import React from 'react';
// import { Link } from '@/components/navigation'
import ProductLogo from '@/components/product-logo';
import { useConfig } from '@/hooks/use-config';
import { useMediaQuery } from '@/hooks/use-media-query';
import Link from 'next/link';

const HeaderLogo = () => {
  const [config] = useConfig();

  const isDesktop = useMediaQuery('(min-width: 1280px)');

  return config.layout === 'horizontal' ? (
    <Link href="/dashboard/analytics" className="flex items-center gap-2">
      {/* <ProductLogo className="h-8 w-8 text-default-900 [&>path:nth-child(2)]:text-background [&>path:nth-child(3)]:text-background" /> */}
      {/* <h1 className="hidden text-xl font-semibold text-default-900 lg:block">DashCode</h1> */}
    </Link>
  ) : (
    !isDesktop && (
      <Link href="/dashboard/analytics" className="flex items-center gap-2">
        {/* <ProductLogo className="h-8 w-8 text-default-900 [&>path:nth-child(2)]:text-background [&>path:nth-child(3)]:text-background" /> */}
        {/* <h1 className="hidden text-xl font-semibold text-default-900 lg:block">DashCode</h1> */}
      </Link>
    )
  );
};

export default HeaderLogo;
