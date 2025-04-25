'use client';
import React from 'react';
import Logo from '@/components/partials/auth/logo';
import OtpVerifyForm from '@/components/partials/auth/otp-form';
import { Icon } from '@/components/ui/icon';
import Link from 'next/link';

const OtpPage = () => {
  return (
    <div className="relative flex rounded-xl lg:basis-3/5 xl:border xl:border-borderad">
      <div className="mt-6 w-full max-w-[430px] space-y-4 rounded-3xl lg:m-auto lg:space-y-7 lg:p-10">
        <div className="text-center">
          <div className="flex justify-center">
            <Logo />
          </div>
          <h1 className="text-3xl font-bold text-primary lg:text-[2.60rem] lg:leading-[2.70rem]">TopAll</h1>
        </div>
        <h1 className="text-center text-xl font-medium lg:text-3xl">Verification Code</h1>
        <h2 className="text-center text-sm font-normal text-B2Cgray lg:text-base">
          We have sent the verification code to your registered mobile number
        </h2>
        <OtpVerifyForm />
      </div>
      {/* <div className="absolute left-4 top-4">
        <Link href="/auth/login" className="flex items-center gap-2 text-B2Cgray">
          <Icon icon={'heroicons:arrow-left'} />
          Back
        </Link>
      </div> */}
    </div>
  );
};

export default OtpPage;
