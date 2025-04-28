'use client';
import React from 'react';
import { Loader2 } from 'lucide-react';
import ProductLogo from './product-logo';
import { useMounted } from '@/hooks/use-mounted';

const Loader = () => {
  const mounted = useMounted();
  return mounted ? null : (
    <div className="flex h-screen flex-col items-center justify-center space-y-2">
      <div className="flex items-center gap-2">
        {/* <ProductLogo className="h-8 w-8 text-default-900 [&>path:nth-child(2)]:text-background [&>path:nth-child(3)]:text-background" /> */}
        <h1 className="text-xl font-semibold text-default-900">TopAll</h1>
      </div>
      <span className="inline-flex items-center gap-1">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </span>
    </div>
  );
};

export default Loader;
