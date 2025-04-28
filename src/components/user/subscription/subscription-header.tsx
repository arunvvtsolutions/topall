'use client';

import ProductLogo from '@/components/product-logo';
import { Icon } from '@/components/ui/icon';
import { getUserProfile } from '@/store/slice/user/userProfileSlice';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useEffect } from 'react';

const SubscriptionHeader = () => {
  const { data } = useSession();

  useEffect(() => {
    const getProfile = async () => {
      if (data?.user.mobileNumber) {
        await getUserProfile(data?.user.mobileNumber);
      }
    };
    getProfile();
  }, [data?.user.mobileNumber]);

  return (
    <div className="flex items-center justify-between py-3">
      <Link href={`/dashboard`} className="flex items-center gap-2 text-sm text-B2CAgrayn lg:text-xl">
        <Icon icon={'heroicons:arrow-left'} />
        Back
      </Link>
      <div className="mr-14 flex items-center">
        <div className="w-8 lg:w-16">
          <ProductLogo className="size-full object-contain" />
        </div>
        <h2 className="text-xl font-bold text-primary lg:text-3xl">TopAll</h2>
      </div>
      <div></div>
    </div>
  );
};

export default SubscriptionHeader;
