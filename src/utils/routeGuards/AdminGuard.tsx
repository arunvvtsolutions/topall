'use client';
import Loader from '@/components/loader';
import { Roles, SessionStatus } from '@/types/enum';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { haveRouteAccess } from '..';

const AdminGuard = ({ children }: { children: React.ReactElement }) => {
  const { data, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  if (status === SessionStatus.LOADING) return <Loader />;

  if (status === SessionStatus.UNAUTHENTICATED) router.push('/auth/login');

  if (status === SessionStatus.AUTHENTICATED) {
    if (data && data.user.role === Roles.STUDENT) router.push('/dashboard');
    if (data && data.user.role === Roles.FACULTY && !haveRouteAccess(data.user.role, pathname)) router.push('/admin/exams');
    else if (data && data.user.role === Roles.MODERATOR) router.back();
  }

  if (data && (data.user.role === Roles.ADMIN || data.user.role === Roles.FACULTY)) {
    return children;
  }
};

export default AdminGuard;
