import { cn } from '@/lib/utils';
import React from 'react';

type SectionHeaderProps = {
  title: string;
  action?: React.ReactNode;
  noBorder?: boolean;
  className?: string;
};

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, action, noBorder, className }) => {
  return (
    <div
      className={cn(
        `flex h-16 w-full flex-col items-center justify-between pb-2 pt-2 md:flex-row md:pb-4 md:pt-1 ${
          noBorder ? '' : 'border-b border-borderad'
        }`,
        className
      )}
    >
      <h1 className="w-full text-base font-medium text-B2CAgrayn md:text-2xl md:leading-[29px]">{title}</h1>
      <div className="flex flex-wrap items-center justify-between py-3 sm:flex-row">{action}</div>
    </div>
  );
};

export default SectionHeader;
