import React, { Suspense } from 'react';
import ReferralCard from '@/components/admin/referral';
import FallbackLoader from '@/components/ui/fallback-loader';

const ReferralPage = () => {
  return (
    <Suspense fallback={<FallbackLoader />}>
      <ReferralCard />
    </Suspense>
  );
};

export default ReferralPage;
