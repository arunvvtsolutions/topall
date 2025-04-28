'use client';
import React, { useEffect, useState } from 'react';
import Logo from '@/components/partials/auth/logo';
import LoginForm from '@/components/partials/auth/login-form';
import { useSearchParams } from 'next/navigation';

const LoginPage = () => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const referralCode = searchParams.get('ref'); // Extract "ref" from URL query params
    if (referralCode) {
      localStorage.setItem('referralCode', referralCode);
    }
  }, [searchParams]);

  return (
    <div className="flex w-full justify-center rounded-xl lg:basis-3/5 xl:border xl:border-borderad">
      <div className="mt-6 w-full max-w-[430px] space-y-7 rounded-3xl lg:m-auto lg:p-10">
        <div className="text-center">
          <div className="flex justify-center">
            <Logo />
          </div>
          <h1 className="text-3xl font-bold text-primary lg:text-[2.60rem] lg:leading-[2.70rem]">TopAll</h1>
        </div>
        <h3 className="text-center text-xl font-medium lg:text-3xl">Sign in / Create Account</h3>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
