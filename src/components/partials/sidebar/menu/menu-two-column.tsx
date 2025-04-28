'use client';

import React from 'react';
import { getMenuList, type Group, type Menu, type Submenu } from '@/lib/menus';
import IconNav from './icon-nav';
import SidebarNav from './sideabr-nav';
import { usePathname } from 'next/navigation';

export function MenuTwoColumn() {
  // translate
  //   const t = useTranslations('Menu');
  const pathname = usePathname();
  const menuList = getMenuList(pathname, 'Menu');

  return (
    <>
      <IconNav menuList={menuList} />
      <SidebarNav menuList={menuList} />
    </>
  );
}
