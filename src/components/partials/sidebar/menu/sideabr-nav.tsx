'use client';
import React, { useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Submenu, Group } from '@/lib/menus';
import { useParams, usePathname } from 'next/navigation';
// import { Link } from "@/components/navigation"
import { useConfig } from '@/hooks/use-config';
import { Button } from '@/components/ui/button';
import MenuLabel from '../common/menu-label';
import MenuItem from '../common/menu-item';
import { Icon } from '@/components/ui/icon';
import { CollapseMenuButton2 } from '../common/collapse-menu-button2';
import TeamSwitcher from '../common/team-switcher';
import SearchBar from '../common/search-bar';
import { getLangDir } from 'rtl-detect';
import Link from 'next/link';
import { RootState, useSelector } from '@/store';
import PreviousChatHistory from './ai/PreviousChatHistory';

const SidebarNav = ({ menuList }: { menuList: Group[] }) => {
  const [config, setConfig] = useConfig();
  const pathname = usePathname();
  const params = useParams<{ locale: string }>();
  const direction = getLangDir(params?.locale ?? '');
  const activeKey = pathname?.split('/')?.[2];
  const data = menuList.find((item) => item.id === activeKey);
  
  
  // Render null if config.subMenu is true
  if (config.subMenu || !config.hasSubMenu) {
    return null;
  }

  return (
    <div className="relative z-20 h-full w-[228px] bg-sidebar shadow-base">
      {config.sidebarBgImage !== undefined && (
        <div
          className="absolute left-0 top-0 z-10 h-full w-full bg-cover bg-center opacity-[0.07]"
          style={{ backgroundImage: `url(${config.sidebarBgImage})` }}
        ></div>
      )}

      <ScrollArea className="h-full [&>div>div[style]]:!block" dir={direction}>
        <div className="mt-6 space-y-3 px-4">
          <TeamSwitcher />
          <SearchBar />
        </div>
        <div className="sticky top-0 z-20 bg-sidebar px-4 pt-6">
          {data?.groupLabel && (
            <MenuLabel label={data?.groupLabel} className="py-0 text-xl font-semibold capitalize text-default" />
          )}
        </div>
        
        <nav className="mt-6 h-full w-full">
          <ul className="flex h-full flex-col items-start space-y-1.5 px-4 pb-8">
            {data?.menus.map(({ submenus }, index) =>
              submenus?.map(({ href, label, active, icon, children: subChildren }, i) => (
                <li key={`double-menu-index-${i}`} className="w-full">
                  {subChildren?.length === 0 ? (
                    <Button
                      asChild
                      color={active ? 'default' : 'secondary'}
                      variant={active ? 'default' : 'ghost'}
                      fullWidth
                      className="h-10 justify-start px-3 capitalize md:px-3"
                    >
                      <Link href={href}>
                        {icon && <Icon icon={icon} className="me-2 h-5 w-5" />}

                        <p>{label}</p>
                      </Link>
                    </Button>
                  ) : (
                    subChildren && <CollapseMenuButton2 icon={icon} label={label} active={active} submenus={subChildren} />
                  )}
                </li>
              ))
            )}
          </ul>
        </nav>
      </ScrollArea>
    </div>
  );
};

export default SidebarNav;
