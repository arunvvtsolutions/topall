'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { ButtonNames, INDICATORS, INSTRUCTIONS, OEExamItems } from '@/types/enum';
import React from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useRouter } from 'next/navigation';
import { useSelector } from '@/store';

const InstructionsContent = () => {
  const examDetails = useSelector((state) => state.onlineExamination.examDetails);

  return (
    <div className="space-y-6 p-4 !pt-3 md:p-6">
      <h4 className="text-center text-lg font-medium text-[#222222] lg:text-xl">{OEExamItems.GENRL_INSTRUCTIONS}</h4>

      <Separator className="mx-auto !mt-3 max-w-4xl" />

      <p className="mx-auto max-w-4xl font-normal text-[#000080] md:text-base lg:text-lg">{OEExamItems.READ_INSTRUCTIONS}</p>

      <ul className="mx-auto max-w-4xl space-y-4">
        <li className="flex gap-2">
          <span className="mt-1 flex items-start text-[#000080] md:mt-0 md:items-center">
            <Icon icon="mdi:tick-decagram" />
          </span>
          <span className="text-sm font-normal text-[#6F6F6F] md:text-base">{`The total duration of your test is ${examDetails?.duration} minutes`}</span>
        </li>
        <li className="flex gap-2">
          <span className="mt-1 flex items-start text-[#000080] md:mt-0 md:items-center">
            <Icon icon="mdi:tick-decagram" />
          </span>
          <span className="text-sm font-normal text-[#6F6F6F] md:text-base">{`The test contains a total of ${examDetails?.totalQuestions} questions`}</span>
        </li>
        {INSTRUCTIONS.map((instruction, index) => (
          <li className="flex gap-2" key={index}>
            <span className="mt-1 flex items-start text-[#000080] md:mt-0 md:items-center">
              <Icon icon="mdi:tick-decagram" />
            </span>
            <span className="text-sm font-normal text-[#6F6F6F] md:text-base">{instruction}</span>
          </li>
        ))}
      </ul>

      <div className="mx-auto max-w-4xl space-y-3">
        {INDICATORS.map((indicator, index) => (
          <div className="flex items-center gap-3" key={index}>
            <div className="size-3 rounded-sm md:size-4" style={{ backgroundColor: indicator.color }}></div>
            <span className="text-xs font-medium text-[#6F6F6F] md:text-sm">{indicator.title}</span>
          </div>
        ))}
      </div>

      <Card className="opacity-3 mx-auto max-w-4xl rounded-lg border border-dashed border-[#000080] bg-[#00008008] p-5">
        <h3 className="mb-2 text-base font-semibold text-[#000080] sm:text-lg md:text-xl lg:text-2xl">{OEExamItems.NOTE}</h3>
        <p className="text-sm font-normal text-[#6F6F6F] sm:text-base md:text-lg lg:text-xl">
          {OEExamItems.TEST_WILL_AUTOMATICALLY_SUBMITED}
        </p>
      </Card>

      {/* <div className="flex justify-center gap-4 pt-4 md:pt-10 lg:pt-20">
        <Button
          onClick={() => router.push('/all-india-mock-test')}
          variant="outline"
          color="primary"
          size={isMobile ? 'md' : 'default'}
          className="hover:bg-white hover:text-[#000080]"
        >
          {ButtonNames.BACK}
        </Button>
        <Button onClick={onContinue} variant="default" size={isMobile ? 'md' : 'default'} className="!bg-[#000080] !text-white">
          {ButtonNames.CONTINUE}
        </Button>
      </div> */}
    </div>
  );
};

export default InstructionsContent;
