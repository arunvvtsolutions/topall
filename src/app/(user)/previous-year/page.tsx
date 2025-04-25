import React, { Suspense } from 'react';
import PreviousYearTests from '@/components/user/previous-year';
import { LucideLoader } from '@/components/common/LucideLoader';

export default function PreviousYearPage() {
  return (
    <Suspense
      fallback={
        <div>
          <LucideLoader className="h-8 w-8 text-primary" />
        </div>
      }
    >
      <PreviousYearTests />
    </Suspense>
  );
}
