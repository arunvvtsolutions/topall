'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { Icon } from '@iconify/react';
import Button from '@/components/common/Button';
import { PaginationWithLinks } from '@/components/common/pagination-with-links';
import { PreviousTest } from '@/types';
import { separateDateTime } from '@/lib/utils';
import { LucideLoader } from '@/components/common/LucideLoader';
import { ButtonNames, FormFields, StatusTitles } from '@/types/enum';
import { useSelector } from '@/store';
import { actionButtonColor } from '../all-india-mock-test/student-test-card';
import { encryptId } from '@/utils/crypto';
import { useRouter } from 'next/navigation';
import { PREVIOUS_YEAR_TEST } from '@/types/constants';
import Link from 'next/link';
import { saveTestState } from '@/services/indexed-db';
import { OnlineExamination } from '@/types/online-exams';
import ViewCard from './card';

interface TestListingPageProps {
  tests: PreviousTest[];
  onViewReport: (id: string) => void;
  onSyllabusView: (id: number) => void;
  isLoading: boolean; // Add loading state prop
}

export default function TestListingPage({ tests, onViewReport, onSyllabusView, isLoading }: TestListingPageProps) {
  const router = useRouter();
  const userId = useSelector((state) => state.userProfile.userId);
  const newExamStatus = useSelector((state) => state.onlineExamination.examStatus);

  // Handle Start Test
  const handleStartTest = async (testId: string, testTypeId: number, testStatus: string) => {
    const encryptedId = encodeURIComponent(encryptId(testId));
    const saveTestDBPayload = {
      testype_Id: testTypeId,
      is_submited: false,
      status: testStatus,
      testId: testId,
      onlineCurrentView: OnlineExamination.INSTRUCTION
    };
    await saveTestState(testId, saveTestDBPayload);
    router.push(`/test?id=${encryptedId}`);
  };
  return (
    <div className="flex min-h-screen flex-col">
      <div className="xs:px-0 px-0 py-5">
        {isLoading ? (
          <div className="flex h-[35rem] w-full items-center justify-center">
            <LucideLoader className="h-8 w-8 text-primary" />
          </div>
        ) : !isLoading && tests.length === 0 ? (
          <div className="flex h-[35rem] w-full items-center justify-center text-2xl font-medium text-B2Cgray">
            {FormFields.NO_DATA_MSG}
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 2xl:grid-cols-3">
              {tests.length > 0 &&
                newExamStatus.length > 0 &&
                tests.map((test) => {
                  const attemptStatus = newExamStatus.find((status) => status.testId === test.id);
                  return (
                    <ViewCard
                      key={test.id}
                      test={test}
                      attemptStatus={attemptStatus}
                      onViewReport={onViewReport}
                      onViewSyllabus={onSyllabusView}
                      onStartTest={handleStartTest}
                      isPaidUser={true}
                    />
                  );
                })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
