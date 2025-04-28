'use client';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useSession } from 'next-auth/react';
import { AdminOnlyGroups, Roles } from '@/types/enum';
import { useSelector } from '@/store';

export type BreadCrumbType = {
  title: string;
  link: string;
};

type BreadCrumbPropsType = {
  title?: string;
  items: BreadCrumbType[];
};

export default function BreadCrumb({ items, title }: BreadCrumbPropsType) {
  const user = useSelector((state) => state.userProfile);
  return (
    <Breadcrumb className="mb-[10px] mt-[10px] flex overflow-x-auto pb-[4px] lg:mb-[20px] lg:mt-0 lg:pb-[0px]">
      <BreadcrumbList className="flex flex-nowrap">
        {user?.role.role.includes(Roles.ADMIN) && title && (
          <>
            <BreadcrumbItem className="flex-shrink-0">
              <Link
                className="whitespace-nowrap text-[12px] transition-colors hover:text-foreground lg:text-[14px]"
                href="/admin/dashboard"
              >
                {title}
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="flex-shrink-0" />
          </>
        )}

        {user?.role.role.includes(Roles.STUDENT) && title && (
          <>
            <BreadcrumbItem className="flex-shrink-0">
              <Link
                className="whitespace-nowrap text-[12px] transition-colors hover:text-foreground lg:text-[14px]"
                href="/dashboard"
              >
                {title}
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="flex-shrink-0" />
          </>
        )}

        {items?.map((item: BreadCrumbType, index: number) => (
          <React.Fragment key={item.title}>
            {AdminOnlyGroups.includes(user.role.role as Roles) && index > 0 && <BreadcrumbSeparator className="flex-shrink-0" />}
            <BreadcrumbItem className="flex-shrink-0">
              <Link
                href={item.link}
                className={cn(
                  'whitespace-nowrap text-[12px] font-medium capitalize transition-colors hover:text-foreground lg:text-[14px]',
                  index === items.length - 1 ? 'pointer-events-none text-foreground' : 'text-muted-foreground'
                )}
              >
                {item.title}
              </Link>
            </BreadcrumbItem>
            {/* {index !== items.length - 1 && <BreadcrumbSeparator className="flex-shrink-0" />} */}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
