'use client';
import React from 'react';
import DateRangePicker from '@/components/date-range-picker';
// import { usePathname } from '@/components/navigation'
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

const PageTitle = ({ title, className }: { title?: string; className?: string }) => {
  const pathname = usePathname();
  const name = pathname?.split('/').slice(1).join(' ');

  return (
    <div className={cn('flex flex-wrap items-center justify-between gap-4', className)}>
      <div className="text-2xl font-medium capitalize text-default-800">{title ? title : name ? name : null}</div>
      <DateRangePicker date={{}} setDate={() => {}} />
    </div>
  );
};

export default PageTitle;
