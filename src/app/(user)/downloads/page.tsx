import FallbackLoader from '@/components/ui/fallback-loader';
import Downloads from '@/components/user/downloads';
import React, { Suspense } from 'react';

const DownloadsPage = () => {
  return (
    <Suspense fallback={<FallbackLoader />}>
      <Downloads />
    </Suspense>
  );
};

export default DownloadsPage;
