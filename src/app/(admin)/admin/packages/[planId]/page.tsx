'use client';

import TestCategories from '@/components/admin/plans/test-categories';
import BreadCrumb, { BreadCrumbType } from '@/components/common/breadcrumb';
import React from 'react';
import { useSearchParams } from 'next/navigation';

const PlanDetailsPage = () => {
  const searchParams = useSearchParams();
  const title = searchParams.get('title');

  const breadcrumbItems: BreadCrumbType[] = [
    { title: 'Package Plans', link: '/admin/packages' },
    { title: title ?? 'Plan Details', link: '' } // fallback if title is missing
  ];

  return (
    <div className="p-5">
      <BreadCrumb items={breadcrumbItems} />
      <TestCategories />
    </div>
  );
};

export default PlanDetailsPage;
