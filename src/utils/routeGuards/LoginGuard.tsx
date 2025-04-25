'use client';
import Loader from '@/components/loader';
import { Roles, SessionStatus } from '@/types/enum';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react';

const LoginGuard = ({ children }: { children: React.ReactElement }) => {
  const { data, status } = useSession();
  const router = useRouter();

  if (status === SessionStatus.LOADING) return <Loader />;

  if (status === SessionStatus.AUTHENTICATED) {
    if (data.user.role === Roles.ADMIN) router.push('/admin/dashboard');
    else if (data.user.role === Roles.STUDENT) {
      if (data.user.onboardStatus) router.push('/dashboard');
      else router.push('/onboard');
    } else if (data.user.role === Roles.MODERATOR) router.back();
    else if (data && data.user.role === Roles.FACULTY) router.push("/admin/exams");
  }

  if (status === SessionStatus.UNAUTHENTICATED) {
    return children;
  }
};

export default LoginGuard;
