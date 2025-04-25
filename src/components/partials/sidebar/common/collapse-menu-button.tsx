'use client';
import React, { CSSProperties } from 'react';
// import { Link, usePathname } from "@/components/navigation";
import { useState } from 'react';
import { ChevronDown, Dot, LucideIcon } from 'lucide-react';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DropdownMenuArrow } from '@radix-ui/react-dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent
} from '@/components/ui/dropdown-menu';
import { Icon } from '@/components/ui/icon';
import { Submenu } from '@/lib/menus';

// for dnd

import {
  useSortable,
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  horizontalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useConfig } from '@/hooks/use-config';
import { MultiCollapseMenuButton } from './classic-multi-collapse-button';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useMobileMenuConfig } from '@/hooks/use-mobile-menu';
import { useMenuHoverConfig } from '@/hooks/use-menu-hover';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface CollapseMenuButtonProps {
  icon: string;
  filledIcon: string;
  label: string;
  active: boolean;
  submenus: Submenu[];
  collapsed: boolean | undefined;
  id: string;
}

export function CollapseMenuButton({ icon, filledIcon, label, active, submenus, collapsed, id }: CollapseMenuButtonProps) {
  // console.log('submenusss', submenus);
  const pathname = usePathname();
  const isSubmenuActive = submenus.some((submenu) => submenu.active || pathname.startsWith(submenu.href));
  const [isCollapsed, setIsCollapsed] = useState<boolean>(isSubmenuActive);
  const [mobileMenuConfig, setMobileMenuConfig] = useMobileMenuConfig();
  const [config] = useConfig();
  const [hoverConfig] = useMenuHoverConfig();
  const { hovered } = hoverConfig;
  const sidebarTheme = config.sidebarTheme !== 'light' ? `dark theme-${config.sidebarTheme}` : `theme-${config.sidebarTheme}`;
  const isDesktop = useMediaQuery('(min-width: 1280px)');
  const { transform, transition, setNodeRef, isDragging, attributes, listeners } = useSortable({
    id: id
  });

  React.useEffect(() => {
    setIsCollapsed(isSubmenuActive);
  }, [isSubmenuActive, pathname]);

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: 'relative'
  };

  if (config.sidebar === 'compact' && isDesktop) {
    return (
      <Collapsible open={isCollapsed} onOpenChange={setIsCollapsed}>
        <CollapsibleTrigger asChild>
          <Button
            variant={active ? 'default' : 'ghost'}
            fullWidth
            color={active ? 'default' : 'secondary'}
            className={cn('h-auto flex-col px-3.5 py-1.5 font-semibold capitalize ring-offset-sidebar', {
              'data-[state=open]:bg-secondary': !active
            })}
          >
            <Icon icon={icon} className={cn('mb-1 h-6 w-6')} />

            <p className={cn('max-w-[200px] truncate text-[11px]')}>{label}</p>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden">
          {submenus.map(({ href, label, active }, index) => (
            <Button
              key={index}
              color={active ? 'default' : 'secondary'}
              variant="ghost"
              fullWidth
              size="sm"
              className={cn(
                'mb-2 h-auto w-full justify-center p-0 text-center text-xs font-normal capitalize first:mt-4 last:mb-0 hover:bg-transparent hover:text-default',
                {
                  'font-semibold': active
                }
              )}
              asChild
            >
              <Link href={href}>{label}</Link>
            </Button>
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  }
  return !collapsed || hovered ? (
    <Collapsible open={isCollapsed} onOpenChange={setIsCollapsed}>
      <CollapsibleTrigger className="" asChild>
        <div className="group peer flex items-center [&[data-state=open]>button>div>div>svg]:rotate-180">
          <Button
            style={style}
            ref={setNodeRef}
            // variant={active ? 'default' : 'ghost'}
            // color="secondary"
            color={active ? 'default' : 'primary'}
            className={cn(
              'group h-auto justify-start px-3 py-3 text-base font-normal capitalize ring-offset-sidebar group-data-[state=open]:bg-secondary group-data-[state=open]:text-primary md:px-3'
            )}
            fullWidth
          >
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center">
                {config.sidebar === 'draggable' && isDesktop && (
                  <GripVertical
                    {...attributes}
                    {...listeners}
                    className={cn(
                      'inset-t-0 invisible absolute me-1 h-5 w-5 opacity-0 transition-all group-hover:visible group-hover:opacity-100 ltr:-translate-x-6 ltr:group-hover:-translate-x-5 rtl:translate-x-6 rtl:group-hover:translate-x-5',
                      {}
                    )}
                  />
                )}
                <div className="relative mr-3 h-5 w-5">
                  <Image src={active ? filledIcon : icon} alt={label} fill className="object-contain" />
                  {/* <Image
                          src={icon || '/placeholder.svg'}
                          alt={label}
                          className={cn('object-contain transition-opacity duration-200', {
                            'me-2': !collapsed || hovered,
                            'opacity-100': true,
                            // // This ensures the icon doesn't turn white on hover
                            'hover:opacity-100': !active
                          })}
                          fill
                        />
                        <Image
                          src={filledIcon || '/placeholder.svg'}
                          alt={label}
                          className={cn('absolute object-contain transition-opacity duration-200', {
                            'me-2': !collapsed || hovered,
                            'opacity-0': !active,
                            'hover:opacity-100': active
                            // This ensures the filled icon is shown on hover
                          })}
                          fill
                        /> */}
                </div>
                <p
                  className={cn(
                    'max-w-[150px] truncate',
                    !collapsed || hovered ? 'translate-x-0 opacity-100' : '-translate-x-96 opacity-0'
                  )}
                >
                  {label}
                </p>
              </div>
              <div
                className={cn(
                  'inline-flex h-5 w-5 items-center justify-center whitespace-nowrap rounded-full bg-menu-arrow text-menu-menu-foreground transition-all duration-300 group-hover:bg-menu-arrow-active',
                  !collapsed || hovered ? 'translate-x-0 opacity-100' : '-translate-x-96 opacity-0',
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
        {submenus.map(({ href, label, active, children: subChildren }, index) => {
          return subChildren?.length === 0 ? (
            <Button
              onClick={() => setMobileMenuConfig({ ...mobileMenuConfig, isOpen: false })}
              key={index}
              // color="secondary"
              size="default"
              variant={active ? 'soft' : 'default'}
              color={active ? 'default' : 'primary'}
              className={cn('mb-2 w-full justify-start px-5 text-base font-normal capitalize first:mt-3 last:mb-0 md:px-5', {
                'font-medium': active,
                'dark:opacity-80': !active
              })}
              asChild
            >
              <Link href={href}>
                <span
                  className={cn('me-3 h-1.5 w-1.5 rounded-full ring-1 ring-default-600 transition-all duration-150', {
                    'bg-default ring-4 ring-primary ring-opacity-30': active
                    // 'bg-primary text-white': !active
                  })}
                ></span>
                <p
                  className={cn(
                    'max-w-[170px] truncate',
                    !collapsed || hovered ? 'translate-x-0 opacity-100' : '-translate-x-96 opacity-0'
                  )}
                >
                  {label}
                </p>
              </Link>
            </Button>
          ) : (
            <React.Fragment key={index}>
              <MultiCollapseMenuButton label={label} active={active} submenus={subChildren as any} />
            </React.Fragment>
          );
        })}
      </CollapsibleContent>
    </Collapsible>
  ) : (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant={active ? 'default' : 'ghost'} color="secondary" className="w-full justify-center" size="icon">
                <Icon icon={icon} className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="right" align="start" alignOffset={2}>
            {label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent side="right" sideOffset={20} align="start" className={`space-y-1.5 border-sidebar ${sidebarTheme}`}>
        <DropdownMenuLabel className="max-w-[190px] truncate">{label}</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-default-300" />
        <DropdownMenuGroup>
          {submenus.map(({ href, label, icon, active, children }, index) =>
            children?.length === 0 ? (
              <DropdownMenuItem
                key={index}
                asChild
                className={cn('focus:bg-secondary', {
                  'bg-secondary text-secondary-foreground': active
                })}
              >
                <Link className="flex-flex cursor-pointer gap-3" href={href}>
                  {icon && <Icon icon={icon} className="h-4 w-4" />}
                  <p className="max-w-[180px] truncate">{label} </p>
                </Link>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuSub key={index}>
                <DropdownMenuSubTrigger>
                  <span>{label}</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <ScrollArea className="h-[200px]">
                      {children?.map(({ href, label, active }, index) => (
                        <DropdownMenuItem key={`nested-index-${index}`}>
                          <Link href={href}>{label}</Link>
                        </DropdownMenuItem>
                      ))}
                    </ScrollArea>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            )
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
