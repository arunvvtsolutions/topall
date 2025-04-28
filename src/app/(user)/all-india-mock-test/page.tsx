import React, { Suspense } from 'react';
import AllIndiaMockTest from '@/components/user/all-india-mock-test';
import FallbackLoader from '@/components/ui/fallback-loader';

const AllIndiaMockTests = () => {
  return (
    <Suspense fallback={<FallbackLoader />}>
      <AllIndiaMockTest />
    </Suspense>
  );
};

export default AllIndiaMockTests;
