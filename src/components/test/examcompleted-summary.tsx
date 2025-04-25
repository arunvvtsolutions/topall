'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '../ui/separator';
import { MainDialog } from '../common/MainDialog';
import { memo } from 'react';
import { LucideLoader } from '../common/LucideLoader';

interface StatItem {
  label: string;
  count: number;
  dotColor: string;
}

type ExamSummary = {
  answered: number;
  answeredAndMarkedForReview: number;
  markedForReview: number;
  notVisited: number;
  skipped: number;
};
interface ExamSummaryProps {
  loading: boolean;
  examSummary: ExamSummary;
  handleSubmit: () => void;
  isOpen: boolean;
  closeModal: () => void;
}

const ExamSummary = ({ loading, isOpen, closeModal, examSummary, handleSubmit }: ExamSummaryProps) => {
  const stats: StatItem[] = [
    { label: 'Questions not visited', count: examSummary?.notVisited ?? 0, dotColor: 'bg-[#6F6F6F]' },
    { label: 'Questions skipped', count: examSummary?.skipped ?? 0, dotColor: 'bg-[#FF4747]' },
    { label: 'Questions answered', count: examSummary?.answered ?? 0, dotColor: 'bg-[#00A86B]' },
    {
      label: 'Questions answered and marked for review',
      count: examSummary?.answeredAndMarkedForReview ?? 0,
      dotColor: 'bg-[#FF6800]'
    },
    { label: 'Questions marked for review', count: examSummary?.markedForReview ?? 0, dotColor: 'bg-[#935AFD]' }
  ];

  return (
    <MainDialog isOpen={isOpen} onOpenChange={closeModal} size="default" className="!p-0 !pt-0" showCloseButton>
      {/* <div className="flex max-h-screen items-center justify-center rounded-2xl bg-[#FFFFFF]"> */}
      <Card className="w-full">
        <CardHeader className="space-y-1 pb-2 sm:space-y-2 md:space-y-2 lg:space-y-4">
          <div className="text-center text-sm font-medium text-[#00A86B] sm:text-xl md:text-xl lg:text-xl">COMPLETED</div>
          <div className="h-[1px] w-full border-b border-[#10101026]"></div>
          <h2 className="text-sm font-medium text-[#222222] sm:text-lg md:text-lg lg:text-lg">Exam Summary</h2>
        </CardHeader>

        <CardContent className="space-y-2">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="cursor-pointer rounded-lg border border-[#10101026] bg-[#FFFFFF] shadow-sm transition-colors hover:border-[#10101026] hover:bg-[#FFFFFF]"
            >
              <div className="flex items-center justify-between px-2 py-2">
                <div className="flex basis-11/12 items-center gap-3">
                  <div className={`h-3 w-3 rounded-[3px] ${stat.dotColor}`} />
                  <span className="text-[12px] text-[#6F6F6F] sm:text-[14px]">{stat.label}</span>
                </div>

                <div className="flex min-w-[50px] basis-1/12 justify-center border-l border-[#10101026]">
                  <div className="bg-[#10101026]" />
                  <span className="text-center text-[16px] font-medium text-[#000080]">{stat.count}</span>
                </div>
              </div>
            </div>
          ))}

          <div className="space-y-1 pt-3 text-center md:text-left">
            <p className="text-[16px] font-medium text-[#222222]">Are you sure want to submit test form final marking?</p>
            <p className="text-xs font-normal text-[#6F6F6F] sm:text-sm">No changes will be allowed after submission.</p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-3 sm:flex-row sm:justify-center">
          <Button onClick={closeModal} variant="outline" className="w-full !p-3 text-sm font-normal text-[#6F6F6F] sm:w-auto">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full gap-2 bg-[#FF4747] !p-3 text-sm font-normal text-[#FFFFFF] hover:bg-[#FF4747] sm:w-auto"
          >
            {loading && <LucideLoader />}
            Finish Test
          </Button>
        </CardFooter>
      </Card>
      {/* </div> */}
    </MainDialog>
  );
};

export default memo(ExamSummary);
