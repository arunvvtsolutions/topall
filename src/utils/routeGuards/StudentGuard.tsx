'use client';
import Loader from '@/components/loader';
import { Roles, SessionStatus } from '@/types/enum';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react';

const StudentGuard = ({ children }: { children: React.ReactElement }) => {
  const { data, status } = useSession();
  
  const router = useRouter();
  if (status === SessionStatus.LOADING) return <Loader />;

  if(status === SessionStatus.UNAUTHENTICATED) router.push('/auth/login')


  if (status === SessionStatus.AUTHENTICATED) {
    if (data.user.role === Roles.ADMIN) router.push('/admin/dashboard');
    else if (data && data.user.role === Roles.FACULTY) router.push("/admin/exams");
    else if (data.user.role === Roles.MODERATOR) router.back();
    else if(data.user.role === Roles.STUDENT && !data.user.onboardStatus) router.push('/onboard')
  }

  if (status === SessionStatus.AUTHENTICATED && data.user.role === Roles.STUDENT) {
    return children;
  }
};

export default StudentGuard;
