'use client';
import { MainDialog } from '@/components/common/MainDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
interface Attempt {
  date: string;
  time: string;
  marks: string;
  accuracy: string;
}
interface TestAttemptProps {
  isOpen: boolean;
  onClose: () => void;
}
const attempts: Attempt[] = [
  { date: '11-03-2024', time: '6:01 PM', marks: '100/200', accuracy: '50%' },
  { date: '11-03-2024', time: '6:01 PM', marks: '08/200', accuracy: '4%' },
  { date: '11-03-2024', time: '6:01 PM', marks: '200/200', accuracy: '100%' },
  { date: '11-03-2024', time: '6:01 PM', marks: '100/200', accuracy: '50%' },
  { date: '11-03-2024', time: '6:01 PM', marks: '150/200', accuracy: '75%' },
  { date: '11-03-2024', time: '6:01 PM', marks: '180/200', accuracy: '90%' },
  { date: '11-03-2024', time: '6:01 PM', marks: '180/200', accuracy: '90%' },
  { date: '11-03-2024', time: '6:01 PM', marks: '180/200', accuracy: '90%' }
];
export default function TestAttempt({ isOpen, onClose }: TestAttemptProps) {
  return (
    <MainDialog
      title={
        <h2 className="mx-4 rounded-[8px] text-lg font-medium">
          <span className="mb-0">TEST 01 [{attempts.length} Attempts]</span>
        </h2>
      }
      className="px-0 pb-0"
      isOpen={isOpen}
      onOpenChange={onClose}
      size="lg"
    >
      <CardContent className="mx-4 border-t-2 px-0 pt-4">
        {attempts.length === 0 ? (
          <Card className="flex items-center justify-center text-lg font-medium text-[#6F6F6F]">No attempts found.</Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {attempts.map((attempt, index) => (
              <Card key={index} className="mt-1 rounded-lg border bg-[#FFFFFF] p-3">
                <CardContent className="px-2 py-2">
                  <div className="flex flex-wrap items-center justify-between">
                    <div className="mr-2 flex flex-col">
                      <p className="text-sm font-semibold text-[#222222]">
                        {attempt.date} {attempt.time}
                      </p>
                      <p className="text-xs font-medium text-[#6F6F6F]">
                        {attempt.marks} MARKS | {attempt.accuracy} Accuracy
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="mt-2 h-8 w-full border-primary p-2 px-4 text-xs font-medium text-primary hover:bg-primary hover:text-white sm:w-full md:mt-2 md:w-full lg:w-auto"
                    >
                      View Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </MainDialog>
  );
}
