'use client';
import { useSelector } from '@/store';
import React from 'react';

const Header = () => {
  const profileData = useSelector((state) => state.user.profile);
  return (
    <div className="pt-4">
      <h1 className="text-lg font-medium lg:text-2xl">
        Hello, <span className='capitalize'>{profileData?.name || ''}</span>
      </h1>
    </div>
  );
};

export default Header;
