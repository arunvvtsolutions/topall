'use client';
// import { Link } from '@/i18n/routing';
import { MenuIcon, PanelsTopLeft } from 'lucide-react';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Menu } from '@/components/partials/sidebar/menu';
import { Sheet, SheetHeader, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { MenuClassic } from './menu-classic';
import ProductLogo from '@/components/product-logo';
import { useMobileMenuConfig } from '@/hooks/use-mobile-menu';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useConfig } from '@/hooks/use-config';
import Link from 'next/link';
import Image from 'next/image';

export function SheetMenu() {
  const [mobileMenuConfig, setMobileMenuConfig] = useMobileMenuConfig();
  const [config, setConfig] = useConfig();
  const { isOpen } = mobileMenuConfig;

  const isDesktop = useMediaQuery('(min-width: 1280px)');
  if (isDesktop) return null;
  return (
    <Sheet open={isOpen} onOpenChange={() => setMobileMenuConfig({ isOpen: !isOpen })}>
      <SheetTrigger className="xl:hidden" asChild>
        <Button
          className="h-8"
          variant="ghost"
          size="icon"
          color="primary"
          onClick={() =>
            setConfig({
              ...config,
              collapsed: false
            })
          }
        >
          <Icon icon="eva:menu-2-outline" className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex h-full w-72 flex-col bg-primary px-3" side="left">
        <SheetHeader>
          <SheetTitle>
            <Link href="/dashboard" className="flex items-center gap-2">
              {/* <ProductLogo className="h-8 w-8 text-default-900 [&>path:nth-child(2)]:text-background [&>path:nth-child(3)]:text-background" />
            <h1 className="text-xl font-semibold text-default-900">DashCode</h1> */}
              <Image src={'/images/logo/topall_logo.webp'} className="ml-5" alt="topall" width={100} height={100} />
            </Link>
          </SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <MenuClassic />
      </SheetContent>
    </Sheet>
  );
}
