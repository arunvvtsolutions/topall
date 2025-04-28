import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { useMediaQuery } from '@/hooks/use-media-query';
import { separateDateTime } from '@/lib/utils';
import { useSelector } from '@/store';
import { PreviousTest } from '@/types';
import { ButtonNames, StatusTitles } from '@/types/enum';
import { ExamStatus, OnlineExamination } from '@/types/online-exams';
import { Clock } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { actionButtonColor } from '../all-india-mock-test/student-test-card';

interface ViewCardProps {
  test: PreviousTest;
  attemptStatus: ExamStatus | undefined;
  isPaidUser: boolean;
  onViewReport: (id: string) => void;
  onViewSyllabus: (id: number) => void;
  onStartTest: (id: string, testTypeId: number, status: string) => void;
}

const ViewCard = ({ test, attemptStatus, isPaidUser, onStartTest, onViewReport, onViewSyllabus }: ViewCardProps) => {
  const { date, time } = separateDateTime(test.scheduledAt || '');
  const isMobile = useMediaQuery('(min-width: 768px)');
  const userId = useSelector((state) => state.userProfile.userId);
  const currentDate = new Date();
  const startDate = new Date(test.scheduledAt || '');
  const endDate = new Date(test.restrictAt || '');
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [countdownStarted, setCountdownStarted] = useState<boolean>(false);

  // useEffect for the countdown timer
  useEffect(() => {
    const scheduledTime = new Date(test.scheduledAt);
    const currentTime = new Date();
    const timeDifference = scheduledTime.getTime() - currentTime.getTime();
    const threeHoursInMilliseconds = 3 * 60 * 60 * 1000;

    if (timeDifference <= threeHoursInMilliseconds && timeDifference > 0) {
      setCountdownStarted(true);

      const interval = setInterval(() => {
        const now = new Date();
        const remainingTime = scheduledTime.getTime() - now.getTime();

        if (remainingTime <= 0) {
          clearInterval(interval);
          setTimeLeft('00h:00m:00s');
          setCountdownStarted(false);
        } else {
          const hours = Math.floor(remainingTime / (1000 * 60 * 60));
          const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
          if (hours == 0 && minutes == 0) {
            setTimeLeft(` ${seconds}s`);
          } else if (hours == 0 && minutes != 0) {
            setTimeLeft(`${minutes}m: ${seconds}s`);
          } else {
            setTimeLeft(`${hours}h: ${minutes}m: ${seconds}s`);
          }
        }
      }, 1000);

      return () => clearInterval(interval);
    } else if (timeDifference > threeHoursInMilliseconds) {
      setCountdownStarted(false);
    } else {
      setCountdownStarted(false);
      setTimeLeft('00h:00m:00s');
    }
  }, [test.scheduledAt]);

  // Function to get the Exam Status
  const getExamStatus = () => {
    if (currentDate.getTime() < startDate.getTime()) {
      return StatusTitles.UPCOMING;
    } else if (currentDate.getTime() > endDate.getTime()) {
      return StatusTitles.COMPLETED;
    } else if (currentDate.getTime() >= startDate.getTime() && currentDate.getTime() <= endDate.getTime()) {
      return StatusTitles.ONGOING;
    }
    return null;
  };

  const examStatus = getExamStatus();

  return (
    <Card key={test.id} className="w-full rounded-[16px]">
      <CardHeader className="border-b px-3 py-2 sm:px-4 sm:py-3">
        <div className="flex flex-wrap items-center justify-between text-[#6F6F6F]">
          <div className="flex items-center gap-1 text-xs sm:gap-2 sm:text-sm">
            <Icon icon="solar:calendar-linear" className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>{date}</span>
            <Clock className="ml-1 h-3 w-3 sm:ml-2 sm:h-4 sm:w-4" />
            <span>{time}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-3 py-2 sm:px-4 sm:py-3">
        <h3 className="xs:text-sm mb-2 font-semibold text-[#222222] sm:text-base">{test.name}</h3>

        <div className="flex flex-wrap items-center gap-1 text-xs font-semibold text-[#6F6F6F] sm:gap-2 sm:text-sm">
          <span>{test.totalQuestionCount} Questions |</span>
          <span>{test.totalMarks} Marks |</span>
          <span>{test.duration} Mins</span>
        </div>

        <div className="mt-4 flex flex-wrap justify-end gap-2 py-1 sm:mt-6">
          {!isPaidUser ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 rounded-lg border-primary text-xs font-medium text-primary hover:bg-primary/5 sm:text-sm"
                data-testid="syllabus-test-btn"
              >
                {ButtonNames.VIEW_SYLLABUS}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="xs:p-2 shrink-0 rounded-lg border-primary text-xs font-medium text-primary hover:bg-primary/5 sm:text-sm"
                data-testid="syllabus-test-btn"
              >
                Unlock
              </Button>
            </>
          ) : (
            <>
              {test.showSyllabus && (
                <Button
                  variant="outline"
                  size={isMobile ? 'md' : 'sm'}
                  className="rounded-lg border border-[#00008080] border-[#000080] !px-4 text-sm font-medium text-primary hover:bg-[#0000800A] hover:text-primary"
                  data-testid="syllabus-test-btn"
                  onClick={() => onViewSyllabus(Number(test.id))}
                >
                  {ButtonNames.VIEW_SYLLABUS}
                </Button>
              )}

              {test.attempts.length > 1 && (
                <Button
                  variant="outline"
                  size={isMobile ? 'md' : 'sm'}
                  className="hover: rounded-lg border border-[#00008080] border-[#000080] !px-4 text-sm font-medium text-primary hover:bg-[#0000800A] hover:text-primary"
                  data-testid="attempts-test-btn"
                  onClick={() => onViewReport(test.id)}
                >
                  {ButtonNames.VIEW_ATTEMPTS}
                </Button>
              )}

              {test.attempts.length === 1 && (
                <Link href={`/test/result/${test.id}/${userId}?testTypeId=${test.testTypeId}`} passHref>
                  <Button
                    variant="outline"
                    size={isMobile ? 'md' : 'sm'}
                    className="hover: rounded-lg border border-[#00008080] border-[#000080] !px-4 text-sm font-medium text-primary hover:bg-[#0000800A] hover:text-primary"
                    data-testid="report-test-btn"
                  >
                    {ButtonNames.VIEW_REPORT}
                  </Button>
                </Link>
              )}

              {countdownStarted ? (
                <Button
                  variant="default"
                  size={isMobile ? 'md' : 'sm'}
                  className="rounded-lg bg-emerald-500 !px-4 text-sm text-white hover:bg-[#00915D]"
                  data-testid="starts-in-btn"
                >
                  <Clock className="mr-2 h-4 w-4" />
                  {ButtonNames.STARTS_IN} {timeLeft}
                </Button>
              ) : (
                examStatus === StatusTitles.ONGOING &&
                attemptStatus && (
                  <>
                    {attemptStatus.start && !attemptStatus.resume && !attemptStatus.retake && (
                      <Button
                        variant="default"
                        size={isMobile ? 'md' : 'sm'}
                        className={`rounded-lg text-sm ${actionButtonColor(ButtonNames.START_TEST)}`}
                        data-testid="start-test-btn"
                        onClick={() => onStartTest(test.id, test.testTypeId, OnlineExamination.START_TEST)}
                      >
                        {ButtonNames.START_TEST}
                        <Icon icon={'si:chevron-right-alt-fill'} className="ml-2 text-base" />
                      </Button>
                    )}
                    {attemptStatus.resume && test.allowResume && (
                      <Button
                        variant="default"
                        size={isMobile ? 'md' : 'sm'}
                        className={`rounded-lg text-sm ${actionButtonColor(ButtonNames.RESUME)}`}
                        data-testid="resume-test-btn"
                        onClick={() => onStartTest(test.id, test.testTypeId, OnlineExamination.RESUME_TEST)}
                      >
                        {ButtonNames.RESUME}
                        <Icon icon={'si:chevron-right-alt-fill'} className="ml-2 text-base" />
                      </Button>
                    )}
                    {attemptStatus.retake && test.allowRetake && (
                      <Button
                        variant="default"
                        size={isMobile ? 'md' : 'sm'}
                        className={`rounded-lg text-sm ${actionButtonColor(ButtonNames.RETAKE)}`}
                        data-testid="retake-test-btn"
                        onClick={() => onStartTest(test.id, test.testTypeId, OnlineExamination.RETAKE_TEST)}
                      >
                        <Icon icon="nrk:refresh" className="mx-1" fontSize={20} />
                        {ButtonNames.RETAKE}
                      </Button>
                    )}
                  </>
                )
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ViewCard;
