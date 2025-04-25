'use client';
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ProductLogo from '@/components/product-logo';
import { Group, Submenu } from '@/lib/menus';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
// import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { useConfig } from '@/hooks/use-config';
import Link from 'next/link';

interface IconNavProps {
  menuList: Group[];
}
const IconNav = ({ menuList }: IconNavProps) => {
  const [config, setConfig] = useConfig();

  return (
    <div className="h-full w-[72px] border-r border-dashed border-default-200 bg-sidebar dark:border-secondary">
      <div className="py-5 text-center">
        <ProductLogo className="mx-auto h-8 w-8 text-default-900 [&>path:nth-child(2)]:text-background [&>path:nth-child(3)]:text-background" />
      </div>
      <ScrollArea className="h-full [&>div>div[style]]:!block">
        <nav className="mt-8 h-full w-full">
          <ul className="flex h-full min-h-[calc(100vh-48px-36px-16px-32px)] flex-col items-start space-y-2 lg:min-h-[calc(100vh-32px-40px-32px)]">
            {menuList?.map(({ groupLabel, menus }, index) => (
              <li key={index} className="block w-full">
                {menus?.map(({ href, label, icon, active, id, submenus }, menuIndex) => (
                  <TooltipProvider disableHoverableContent key={menuIndex}>
                    <Tooltip delayDuration={100}>
                      <TooltipTrigger asChild>
                        {submenus.length === 0 ? (
                          <Button
                            onClick={() =>
                              setConfig((prevConfig) => ({
                                ...prevConfig,
                                hasSubMenu: false,
                                subMenu: true
                              }))
                            }
                            asChild
                            size="icon"
                            color="secondary"
                            variant={active ? 'default' : 'ghost'}
                            className={cn(
                              'mx-auto mb-2 h-12 w-12 hover:bg-default-100 hover:ring-1 hover:ring-default-200 hover:ring-offset-0 dark:hover:bg-secondary dark:hover:ring-menu-arrow-active',
                              {
                                'bg-default-100 ring-1 ring-default-200 hover:bg-default-200/80 dark:bg-secondary dark:ring-menu-arrow-active dark:hover:bg-menu-arrow-active':
                                  active
                              }
                            )}
                          >
                            <Link href={href}>
                              <Icon icon={icon} className="h-6 w-6 text-default-500 dark:text-secondary-foreground" />
                            </Link>
                          </Button>
                        ) : (
                          <Button
                            onClick={() =>
                              setConfig((prevConfig) => ({
                                ...prevConfig,
                                hasSubMenu: true,
                                subMenu: false
                              }))
                            }
                            asChild
                            size="icon"
                            color="secondary"
                            variant={active ? 'default' : 'ghost'}
                            className={cn(
                              'mx-auto mb-2 h-12 w-12 hover:bg-default-100 hover:ring-1 hover:ring-default-200 hover:ring-offset-0 dark:hover:bg-secondary dark:hover:ring-menu-arrow-active',
                              {
                                'bg-default-100 ring-1 ring-default-200 hover:bg-default-200/80 dark:bg-secondary dark:ring-menu-arrow-active dark:hover:bg-menu-arrow-active':
                                  active
                              }
                            )}
                          >
                            <Link href={href}>
                              <Icon icon={icon} className="h-6 w-6 text-default-500 dark:text-secondary-foreground" />
                            </Link>
                          </Button>
                        )}
                      </TooltipTrigger>

                      <TooltipContent side="right">{label}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </li>
            ))}
          </ul>
        </nav>
      </ScrollArea>
    </div>
  );
};

export default IconNav;
