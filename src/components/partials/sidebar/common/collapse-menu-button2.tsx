'use client';
import React, { CSSProperties } from 'react';
// import { Link, usePathname } from "@/components/navigation";
import { useState } from 'react';
import { ChevronDown, Dot, LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DropdownMenuArrow } from '@radix-ui/react-dropdown-menu';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

import { Icon } from '@/components/ui/icon';
import { SubChildren } from '@/lib/menus';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface CollapseMenuButtonProps {
  icon: string;
  label: string;
  active: boolean;
  submenus: SubChildren[];
}

export function CollapseMenuButton2({ icon, label, active, submenus }: CollapseMenuButtonProps) {
  const pathname = usePathname();
  const isSubmenuActive = submenus.some(
    (submenu) => submenu.active || pathname.startsWith(submenu.href)
  );
  const [isCollapsed, setIsCollapsed] = useState<boolean>(isSubmenuActive);

  return (
    <Collapsible open={isCollapsed} onOpenChange={setIsCollapsed} className="w-full">
      <CollapsibleTrigger className="mb-1" asChild>
        <div className="group flex items-center [&[data-state=open]>button>div>div>svg]:rotate-180">
          <Button
            variant={active ? 'default' : 'ghost'}
            color={active ? 'default' : 'secondary'}
            className={cn('h-10 justify-start px-3 capitalize md:px-3', {
              'group-data-[state=open]:bg-secondary': !active
            })}
            fullWidth
          >
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center">
                {icon && (
                  <span className="me-4">
                    <Icon icon={icon} className="h-5 w-5" />
                  </span>
                )}
                <p className={cn('max-w-[150px] truncate')}>{label}</p>
              </div>
              <div className={cn('whitespace-nowrap')}>
                <ChevronDown size={18} className="transition-transform duration-200" />
              </div>
            </div>
          </Button>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden">
        {submenus.map(({ href, label, active }, index) => (
          <Button
            key={index}
            color="secondary"
            variant="ghost"
            className={cn(
              'mb-3 h-auto w-full justify-start px-3 first:mt-2 hover:bg-transparent md:px-3',
              {
                'opacity-100': active,
                'dark:opacity-75': !active
              }
            )}
            asChild
          >
            <Link href={href}>
              <span
                className={cn(
                  'me-3 h-1.5 w-1.5 rounded-full bg-default-300 ring-0 ring-default-300 transition-all duration-150 dark:bg-default dark:ring-menu-arrow-active',
                  {
                    'bg-default ring-4 ring-default ring-opacity-30': active
                  }
                )}
              ></span>
              <p className={cn('max-w-[170px] truncate')}>{label}</p>
            </Link>
          </Button>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
