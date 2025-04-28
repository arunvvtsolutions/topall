'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { ExamResult } from './overall-marks/index';

interface TimeCardProps {
  data: ExamResult | null;
}
export default function TimeCard({ data }: TimeCardProps) {
  return (
    <Card className="size-full rounded-2xl border border-[#10101026] shadow-none">
      <CardContent className="space-y-1 p-4 px-3 sm:p-6">
        <div className="flex items-center gap-3 border-b border-[#10101026] pb-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#000080] bg-[#0D068E1A]">
            <Icon icon={'iconoir:timer'} color="#000080" className="h-5 w-5" />
          </div>
          <span className="text-[16px] font-medium text-[#222222] sm:text-[18px] md:text-[18px] lg:text-[18px]">Time Taken</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between border-b border-[#10101026] py-3">
            <span className="text-[14px] font-medium text-[#222222] sm:text-[16px] md:text-[16px] lg:text-[16px]">
              Total Test Time
            </span>
            <span className="text-[14px] font-semibold text-[#6F6F6F] sm:text-[16px] md:text-[16px] lg:text-[16px]">
              {data?.totalTime ?? 0} Mins
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-[#10101026] py-3">
            <span className="text-[14px] font-medium text-[#222222] sm:text-[16px] md:text-[16px] lg:text-[16px]">
              Total Time Taken
            </span>
            <span className="text-[14px] font-semibold text-[#6F6F6F] sm:text-[16px] md:text-[16px] lg:text-[16px]">
              {data?.timeTaken ?? 0}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[14px] font-medium text-[#222222] sm:text-[16px] md:text-[16px] lg:text-[16px]">
              Avg Time Per Ques
            </span>
            <span className="text-[14px] font-semibold text-[#6F6F6F] sm:text-[16px] md:text-[16px] lg:text-[16px]">
              {data?.avgTimePerQuestion ?? 0} Sec
            </span>{' '}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
