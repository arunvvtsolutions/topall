'use client';
import React, { memo, useEffect } from 'react';
import InstructiosHeader from '../header';
import InstructionsContent from './instructions-content';
import { Separator } from '@/components/ui/separator';
import { useSelector } from '@/store';
import { Button } from '@/components/ui/button';
import { ButtonNames } from '@/types/enum';
import { LucideLoader } from '@/components/common/LucideLoader';
import { useRouter } from 'next/navigation';
import { useMediaQuery } from '@/hooks/use-media-query';
import parse from 'html-react-parser';
import { OnlineExamination } from '@/types/online-exams';
import { ALL_INDIA_MOCK_TEST, GENERATE_TEST, PREVIOUS_YEAR_TEST } from '@/types/constants';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Icon } from '@/components/ui/icon';
import { getRedirectPath } from '@/utils';

interface TestInstructionsProps {
  onContinue: (type: OnlineExamination.INSTRUCTION | OnlineExamination.EXAM | false) => void;
}

const TestInstructions: React.FC<TestInstructionsProps> = ({ onContinue }) => {
  const examDetails = useSelector((state) => state.onlineExamination.examDetails);
  const examStatus = useSelector((state) => state.onlineExamination.examStatus);

  const name = examDetails?.name || '';
  return (
    <div className="relative w-full bg-[#F9FAFC] sm:h-full md:h-screen">
      <div className="relative flex h-full w-full flex-col overflow-hidden">
        <InstructiosHeader startExamTime={0} showButton={false} examName={name} />
        <Separator className="container" />
        <div className="flex flex-grow justify-center overflow-y-auto">
          {examDetails?.onlineInstrcutions ? parse(examDetails?.onlineInstrcutions || '') : <InstructionsContent />}
        </div>
        <div className="flex justify-center gap-4 pt-4 md:pt-10 lg:pt-20">
          <Link href={getRedirectPath(Number(examDetails?.testTypeId))}>
            <Button
              // onClick={() => router.push('/all-india-mock-test')}
              variant="outline"
              color="primary"
              // size={isMobile ? 'md' : 'default'}
              className="hover:bg-white hover:text-[#000080]"
            >
              <Icon icon={'heroicons:chevron-left-20-solid'} className="ml-2 text-base font-medium" />
              {ButtonNames.BACK}
            </Button>
          </Link>
          <Button
            onClick={() => onContinue(OnlineExamination.EXAM)}
            variant="default"
            // size={isMobile ? 'md' : 'default'}
            disabled={!examDetails && examStatus.length > 0}
            className="!bg-[#000080] text-base font-medium !text-white"
          >
            {ButtonNames.CONTINUE}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default memo(TestInstructions);
