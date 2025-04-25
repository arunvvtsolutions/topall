import Subscription from '@/components/admin/subscription';
import FallbackLoader from '@/components/ui/fallback-loader';
import React, { Suspense } from 'react';

const SubscriptionPage = () => {
  return (
    <Suspense fallback={<FallbackLoader />}>
      <Subscription />
    </Suspense>
  );
};

export default SubscriptionPage;
