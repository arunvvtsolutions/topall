'use client';
import React, { CSSProperties } from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { type Menu } from '@/lib/menus';
// import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { GripVertical } from 'lucide-react';

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
import { useMediaQuery } from '@/hooks/use-media-query';
import { useMobileMenuConfig } from '@/hooks/use-mobile-menu';
import { useMenuHoverConfig } from '@/hooks/use-menu-hover';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

interface MenuItemProps {
  id: string;
  href: string;
  label: string;
  icon: string;
  filledIcon: string;
  active: boolean;
  collapsed: boolean;
  isNew?: boolean;
}

const MenuItem = ({ href, label, icon, active, id, collapsed, filledIcon, isNew }: MenuItemProps) => {
  const [config] = useConfig();
  const [hoverConfig] = useMenuHoverConfig();
  const { hovered } = hoverConfig;
  const isDesktop = useMediaQuery('(min-width: 1280px)');
  const [mobileMenuConfig, setMobileMenuConfig] = useMobileMenuConfig();
  const { transform, transition, setNodeRef, isDragging, attributes, listeners } = useSortable({
    id: id
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: 'relative'
  };
  // if (config.sidebar === 'draggable' && isDesktop) {
  //   return (
  //     <Button
  //       ref={setNodeRef}
  //       style={style}
  //       variant={active ? 'default' : 'ghost'}
  //       color={active ? 'default' : 'secondary'}
  //       fullWidth
  //       className={cn('', {
  //         'group h-auto justify-start px-3 py-3 text-sm font-medium capitalize md:px-3 hover:md:px-8': !collapsed,
  //         'hover:ring-transparent hover:ring-offset-0': !active
  //       })}
  //       asChild
  //       size={collapsed ? 'icon' : 'default'}
  //     >
  //       <Link
  //         href={href}
  //         onClick={(e) => {
  //           e.stopPropagation();
  //         }}
  //       >
  //         {!collapsed && (
  //           <GripVertical
  //             {...attributes}
  //             {...listeners}
  //             className={cn(
  //               'inset-t-0 invisible absolute me-1 h-5 w-5 opacity-0 transition-all group-hover:visible group-hover:opacity-100 ltr:-translate-x-6 ltr:group-hover:-translate-x-5 rtl:translate-x-6 rtl:group-hover:translate-x-5',
  //               {}
  //             )}
  //           />
  //         )}
  //         <Icon
  //           icon={active ? filledIcon : icon}
  //           className={cn('h-5 w-5', {
  //             'me-2': !collapsed
  //           })}
  //         />
  //         {!collapsed && <p className={cn('max-w-[200px] truncate')}>{label}</p>}
  //       </Link>
  //     </Button>
  //   );
  // }

  // if (config.sidebar === 'compact' && isDesktop) {
  //   return (
  //     <Button
  //       variant={active ? 'default' : 'ghost'}
  //       fullWidth
  //       color={active ? 'default' : 'secondary'}
  //       className="h-auto flex-col px-3.5 py-1.5 font-semibold capitalize"
  //       asChild
  //     >
  //       <Link href={href}>
  //         <Icon icon={icon} className={cn('mb-1 h-6 w-6')} />

  //         <p className={cn('max-w-[200px] truncate text-[11px]')}>{label}</p>
  //       </Link>
  //     </Button>
  //   );
  // }
  return (
    <Button
      onClick={() => setMobileMenuConfig({ ...mobileMenuConfig, isOpen: false })}
      variant={active ? 'soft' : 'default'}
      fullWidth
      color={active ? 'default' : 'primary'}
      className={cn('relative', {
        'h-auto justify-start rounded-lg px-3 py-3 text-base font-normal capitalize md:px-3': !collapsed || hovered,
        'hover:bg-white/10 hover:text-white': !active,
        'bg-white text-primary': active,
        'bg-primary text-white': !active
      })}
      asChild
      size={collapsed && !hovered ? 'icon' : 'default'}
    >
      <Link href={href}>
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
        {(!collapsed || hovered) && <p className={cn('ml-1 max-w-[200px] truncate')}>{label}</p>}
        {!collapsed && isNew && (
          <Badge
            className={cn('absolute right-1 rounded-md py-0.5 ring-1 ring-success', {
              'bg-success/20 text-success': active,
              'bg-success/50 text-default': !active
            })}
          >
            New
          </Badge>
        )}
      </Link>
    </Button>
  );
};

export default MenuItem;
