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
import { useMobileMenuConfig } from '@/hooks/use-mobile-menu';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface CollapseMenuButtonProps {
  icon?: string;
  label: string;
  active: boolean;
  submenus: SubChildren[];
}

export function MultiCollapseMenuButton({ icon, label, active, submenus }: CollapseMenuButtonProps) {
  const pathname = usePathname();
  console.log('submenu', submenus);
  const isSubmenuActive = submenus.some((submenu) => submenu.active || pathname.startsWith(submenu.href));
  const [isCollapsed, setIsCollapsed] = useState<boolean>(isSubmenuActive);
  const [mobileMenuConfig, setMobileMenuConfig] = useMobileMenuConfig();
  return (
    <Collapsible open={isCollapsed} onOpenChange={setIsCollapsed} className="mb-2 w-full last:mb-0">
      <CollapsibleTrigger asChild>
        <div className="group flex items-center first:mt-3 [&[data-state=open]>button>div>div>svg]:rotate-180">
          <Button
            color="secondary"
            variant="ghost"
            className="h-auto w-full justify-start px-5 text-sm font-normal capitalize hover:bg-transparent hover:ring-offset-0 md:px-5"
            fullWidth
          >
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center">
                <span
                  className={cn('me-3 h-1.5 w-1.5 rounded-full ring-1 ring-default-600 transition-all duration-150', {
                    'bg-default ring-4 ring-default ring-opacity-30': active
                  })}
                ></span>
                <p className={cn('max-w-[150px] truncate')}>{label}</p>
              </div>
              <div
                className={cn(
                  'inline-flex h-5 w-5 items-center justify-center whitespace-nowrap rounded-full bg-menu-arrow text-menu-menu-foreground transition-all duration-300 group-hover:bg-menu-arrow-active',
                  {
                    'bg-menu-arrow-active': active
                  }
                )}
              >
                <ChevronDown size={16} className="transition-transform duration-200" />
              </div>
            </div>
          </Button>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden">
        {submenus.map(({ href, label, active }, index) => (
          <Button
            key={index}
            onClick={() => setMobileMenuConfig({ ...mobileMenuConfig, isOpen: false })}
            color="secondary"
            variant="ghost"
            className="mb-1.5 h-auto w-full justify-start text-[13px] font-normal first:mt-3 hover:bg-transparent"
            asChild
          >
            <Link href={href}>
              <span
                className={cn(
                  'me-3 h-1 w-1 rounded-full bg-default-300 ring-0 ring-default-300 transition-all duration-150 dark:bg-secondary dark:ring-menu-arrow-active',
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
