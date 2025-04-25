'use client';
import { useMediaQuery } from '@/hooks/use-media-query';
import React from 'react';

interface AdminSectionHeaderProps {
  title: string;
  secondaryTitle?: string;
  action: React.ReactNode;
}

const AdminSectionHeader: React.FC<AdminSectionHeaderProps> = ({ title, secondaryTitle, action }) => {
  const isMd = useMediaQuery('(min-width: 489px)');
  return (
    <div className={`flex gap-2 pb-4 ${isMd ? 'flex-row items-center justify-between' : 'flex-col'}`}>
      <div>
        <h1 className="text-lg font-medium text-[#222222] md:text-xl lg:text-2xl">{title}</h1>
        {secondaryTitle && <p>{secondaryTitle}</p>}
      </div>

      {/* Action buttons below title on small screens */}
      <div className="flex flex-wrap gap-2">{action}</div>
    </div>
  );
};

export default AdminSectionHeader;
