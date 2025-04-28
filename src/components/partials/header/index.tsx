'use client';

import React from 'react';
import HeaderContent from './header-content';
import ProfileInfo from './profile-info';
import { SidebarToggle } from '@/components/partials/sidebar/sidebar-toggle';
import { SheetMenu } from '@/components/partials/sidebar/menu/sheet-menu';
import HorizontalMenu from './horizontal-menu';
import HeaderLogo from './header-logo';
import ReferalIcon from './referal-icon';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Roles } from '@/types/enum';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const Header = () => {
  const router = useRouter();
  const { data } = useSession();
  const handleReferal = () => {
    router.push('/refer-and-earn/1');
  };
  return (
    <>
      <HeaderContent>
        <div className="flex items-center gap-3">
          <HeaderLogo />
          <SidebarToggle />
          {/* <HeaderSearch /> */}
        </div>
        <div className="nav-tools flex flex-grow items-center justify-between gap-3 md:gap-4">
          {/* <div className="nav-tools flex items-center gap-3 md:gap-2"> */}
          {/* <LocalSwitcher />
          <ThemeSwitcher />
          <Cart />
          <Messages />
          <Notifications /> */}
          <div>
            <SheetMenu />
          </div>
          <div className="flex items-center gap-2 text-end">
            <Link href="/subscription">
              <Button variant="soft" color="primary" rounded="full">
                Upgrade
              </Button>
            </Link>
            {data?.user?.role === Roles.STUDENT && (
              <button onClick={handleReferal}>
                <ReferalIcon />
              </button>
            )}
            <ProfileInfo />
          </div>
        </div>
      </HeaderContent>
      <HorizontalMenu />
    </>
  );
};

export default Header;
