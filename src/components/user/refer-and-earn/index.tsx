'use client';
import React, { useEffect, useState } from 'react';
import Logo from '../test/logo';
import { Separator } from '@/components/ui/separator';
import ReferredFriends from './referred-friends';
import ReferAndEarn from './refer-earn/refer-earn';
import { useDispatch, useSelector } from '@/store';
import { getProfileDetail } from '@/utils/api/user';
import { setStandardSuccess, setStreamSelection, setStreamsSuccess, setUserIdSuccess } from '@/store/slice/user';
import { setStreamSelectionSuccess } from '@/store/slice/user/stream-slice';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { TosterMessages } from '@/types/enum';
import Link from 'next/link';
import { Icon } from '@/components/ui/icon';

const Referral = () => {
  const { data } = useSession();
  const dispatch = useDispatch();

  useEffect(() => {
    const getProfileData = async () => {
      try {
        if (data?.user?.mobileNumber) {
          // Ensure mobileNumber is defined
          const user = await getProfileDetail(data.user.mobileNumber);
          dispatch(setStreamsSuccess(user.currentExams));
          dispatch(setUserIdSuccess(user.userId));
          dispatch(setStandardSuccess(user.standard));
          dispatch(setStreamSelectionSuccess({ stream: user.currentExams[0], standards: user.standard }));
          await setStreamSelection(user.currentExams[0]?.id);
        }
      } catch (error) {
        console.log('error', error);
        toast.error(TosterMessages.ADMIN_COMMON_ERROR);
      }
    };
    if (data?.user?.mobileNumber) {
      getProfileData();
    }
  }, [data?.user?.mobileNumber]);
  return (
    <div className="container h-full min-h-screen w-full max-w-6xl !px-4 sm:px-6">
      <div className="mt-2 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 text-lg font-normal text-[#222222] md:text-xl">
          <Icon icon={'heroicons:arrow-left'} className="text-[#222222]" />
          <span className="hidden md:block">Back</span>
        </Link>
        <Logo />
      </div>

      <Separator className="my-4" />
      <ReferAndEarn />
      <ReferredFriends />
    </div>
  );
};

export default Referral;
