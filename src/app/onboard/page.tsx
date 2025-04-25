export const dynamic = 'force-dynamic';
import React from 'react';
import OnBoardDetailsForm from '@/components/partials/onboard/onboard-details-form';

const UserOnBoardPage = () => {
  return (
    <div className="over-flow-hidden flex w-full justify-center rounded-xl lg:basis-3/5 xl:overflow-y-hidden xl:border xl:border-borderad">
      <div className="size-full space-y-7 rounded-3xl lg:p-8">
        <OnBoardDetailsForm />
      </div>
    </div>
  );
};

export default UserOnBoardPage;
