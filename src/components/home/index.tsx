'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Roles, SessionStatus } from '@/types/enum';
import Loader from '../loader';

const HomeComponent = () => {
  const { data, status } = useSession();
  const router = useRouter();

  if (status === SessionStatus.LOADING) return <Loader />;

  if (status === SessionStatus.UNAUTHENTICATED) router.push('/auth/login');

  if (status === SessionStatus.AUTHENTICATED) {
    if (data && data.user.role === Roles.STUDENT) router.push('/dashboard');
    else if (data && (data.user.role === Roles.ADMIN || data.user.role === Roles.FACULTY)) router.push('/admin/dashboard');
    else if (data && data.user.role === Roles.MODERATOR) router.back();
  }

  return <></>;
};

export default HomeComponent;
