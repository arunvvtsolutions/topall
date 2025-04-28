import Logo from '@/components/partials/auth/logo';
import ProductLogo from '@/components/product-logo';
import { Icon } from '@/components/ui/icon';
import { useSelector } from '@/store';
import { getUserProfile } from '@/store/slice/user/userProfileSlice';
import { ALL_INDIA_MOCK_TEST, GENERATE_TEST, PREVIOUS_YEAR_TEST } from '@/types/constants';
import { getRedirectPath } from '@/utils';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { use, useEffect } from 'react';

const ResultHeader = () => {
  const { data } = useSession();
  const searchParams = useSearchParams();
  const testTypeParams = searchParams.get('testTypeId') as string;

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
      <Link
        href={getRedirectPath(Number(testTypeParams))}
        className="flex items-center gap-2 text-lg font-normal text-[#222222] md:text-xl"
      >
        <Icon icon={'heroicons:arrow-left'} className="text-[#222222]" />
        Back
      </Link>

      <div className="flex items-center">
        <ProductLogo className="w-16" />
        <h2 className="text-3xl font-bold text-primary">TopAll</h2>
      </div>
    </div>
  );
};

export default ResultHeader;
