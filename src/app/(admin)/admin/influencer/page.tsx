import React, { Suspense } from 'react';
import Influencer from '@/components/admin/influencer';
import FallbackLoader from '@/components/ui/fallback-loader';

const InfluencerPage = () => {
  return (
    <Suspense fallback={<FallbackLoader />}>
      <Influencer />
    </Suspense>
  );
};

export default InfluencerPage;
