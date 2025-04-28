'use client';
import { MainDialog } from '@/components/common/MainDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { separateDateTime } from '@/lib/utils';
import { IExamAttempts } from '@/types/user';
import Link from 'next/link';

interface TestAttemptProps {
  examId: number;
  userId: number;
  testTypeId: number;
  data: IExamAttempts[];
  isOpen: boolean;
  onClose: () => void;
}

export default function TestAttempt({ examId, userId, testTypeId, data, isOpen, onClose }: TestAttemptProps) {
  return (
    <MainDialog
      title={
        <h2 className="mx-4 rounded-[8px] text-lg font-medium">
          <span className="mb-0">TEST 01 [{data.length} Attempts]</span>
        </h2>
      }
      className="px-0 pb-0"
      isOpen={isOpen}
      onOpenChange={onClose}
      size="lg0"
    >
      <CardContent className="mx-4 border-t-2 px-0 pt-4">
        {data.length === 0 ? (
          <Card className="flex items-center justify-center text-lg font-medium text-[#6F6F6F]">No attempts found.</Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {data.map((attempt, index) => {
              const { date, time } = separateDateTime(attempt.time);
              return (
                <Card key={index} className="mt-1 rounded-lg border bg-[#FFFFFF] p-3">
                  <CardContent className="px-2 py-2">
                    <div className="flex flex-wrap items-center justify-between">
                      <div className="mr-2 flex flex-col">
                        <p className="text-sm font-semibold text-[#222222]">
                          {date} {time}
                        </p>
                        <p className="text-xs font-medium text-[#6F6F6F]">
                          {attempt.securedMarks} MARKS | {attempt.accuracy} Accuracy
                        </p>
                      </div>
                      <Link
                        href={`/test/result/${examId}/${userId}?testTypeId=${testTypeId}&attemptId=${attempt.attemptId}`}
                        passHref
                      >
                        <Button
                          variant="outline"
                          className="mt-2 h-8 w-full border-primary p-2 px-4 text-xs font-medium text-primary hover:bg-primary hover:text-white sm:w-full md:mt-2 md:w-full lg:w-auto"
                          // onClick={() => handleViewReport(attempt.attemptId)}
                        >
                          View Report
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </MainDialog>
  );
}
