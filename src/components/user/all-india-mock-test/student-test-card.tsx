'use client';

import { useState, useEffect, useMemo } from 'react';
import { Clock } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { ButtonNames, CardItems, StatusTitles } from '@/types/enum';
import { useMediaQuery } from '@/hooks/use-media-query';
import { formatDateTime } from '@/utils/date-formatter';
import { Exam } from '@/types/user';
import { useRouter } from 'next/navigation'; // Import useRouter from Next.js
import { encryptId } from '@/utils/crypto';
import { useSelector } from '@/store';
import { ExamStatus, OnlineExamination } from '@/types/online-exams';
import Link from 'next/link';
import { saveTestState } from '@/services/indexed-db';

interface TestCardProps {
  onViewSyllabus: (id: number) => void;
  onViewReport: (id: string) => void;
  testData: Exam;
  attemptStatus?: ExamStatus;
}

// Function to get the Action Button Color
export const actionButtonColor = (status: string | null) => {
  switch (status) {
    case ButtonNames.START_TEST:
      return 'bg-[#00A86B] !px-4 text-default hover:bg-[#00915D]';
    case ButtonNames.RESUME:
      return 'bg-transparent !px-4 border border-primary text-primary hover:bg-primary hover:text-default';
    case ButtonNames.RETAKE:
      return 'bg-transparent !px-4 border border-primary text-primary hover:bg-primary hover:text-default';
  }
};

export function StudentExamCard({ testData, onViewSyllabus, onViewReport, attemptStatus }: TestCardProps) {
  const router = useRouter();
  const userId = useSelector((state) => state.userProfile.userId);
  const {
    id,
    name,
    scheduledAt,
    restrictAt,
    totalQuestionCount,
    totalMarks,
    duration,
    showSyllabus,
    allowResume,
    allowRetake,
    attempts,
    testTypeId,
    instantResult
  } = testData;
  const isMobile = useMediaQuery('(min-width: 768px)');
  // const newExamStatus = useSelector((state) => state.onlineExamination.examStatus);
  const currentDate = new Date();
  const startDate = new Date(scheduledAt);
  const endDate = new Date(restrictAt);
  const startDateAndTime = formatDateTime(scheduledAt);
  const endDateAndTime = formatDateTime(restrictAt);
  const longEndDateAndTime = formatDateTime(restrictAt, true);
  const longStartDateAndTime = formatDateTime(scheduledAt, true);

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

  const [timeLeft, setTimeLeft] = useState<string>('');
  const [countdownStarted, setCountdownStarted] = useState<boolean>(false);

  // useEffect for the countdown timer
  useEffect(() => {
    const scheduledTime = new Date(scheduledAt);
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
  }, [scheduledAt]);

  // Handle Start Test
  const handleStartTest = async (testId: string, testTypeId: number, testStatus: string) => {
    const encryptedId = encodeURIComponent(encryptId(testId));
    const saveTestDBPayload = {
      testype_Id: testTypeId,
      is_submited: false,
      offline: [],
      status: testStatus,
      testId: testId,
      onlineCurrentView: OnlineExamination.INSTRUCTION
    };
    await saveTestState(testId, saveTestDBPayload);
    router.push(`/test?id=${encryptedId}`);
  };

  return (
    <Card className="flex w-full flex-col rounded-2xl border-[0.5px] border-[#10101026] shadow-none drop-shadow-none">
      <CardHeader className="border-b px-4 !pb-0 pt-3">
        <div className="mb-4 flex items-center justify-between text-[#6F6F6F]">
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center">
              <Icon icon="solar:calendar-linear" className="mr-2 h-5 w-5" />
              <span className="mt-0.5">{startDateAndTime.formattedDate}</span>
            </div>
            <div className="flex items-center text-sm">
              <Clock className="mx-2 h-5 w-5" />
              <span className="mt-0.5">{startDateAndTime.formattedTime}</span>
            </div>
          </div>
          <Badge className="px-0 text-sm font-normal text-[#6F6F6F]">
            <span
              className={`mr-2 h-3 w-3 rounded-full ${
                examStatus === StatusTitles.UPCOMING
                  ? 'bg-[#F7D300]'
                  : examStatus === StatusTitles.COMPLETED
                    ? 'bg-[#FF4747]'
                    : examStatus === StatusTitles.ONGOING
                      ? 'bg-[#00A86B]'
                      : 'bg-gray-500'
              }`}
            ></span>
            {examStatus}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow px-4 py-4">
        <h3 className="mb-2 text-base font-medium text-[#222222]">{name}</h3>

        <div className="flex items-center gap-1 text-sm font-medium text-[#6F6F6F]">
          <span>
            {totalQuestionCount} {CardItems.QUESTIONS} |
          </span>
          <span>
            {totalMarks} {CardItems.MARKS} |
          </span>
          <span>
            {duration} {CardItems.MINS}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
          {showSyllabus && (
            <Button
              variant="default"
              size={isMobile ? 'md' : 'sm'}
              className="rounded-lg border border-[#00008080] border-[#000080] !px-4 text-sm font-medium text-primary hover:bg-[#0000800A] hover:text-primary"
              onClick={() => onViewSyllabus(Number(testData.id))}
              data-testid="view-syllabus-btn"
            >
              {ButtonNames.VIEW_SYLLABUS}
            </Button>
          )}

          {(examStatus === StatusTitles.COMPLETED || examStatus === StatusTitles.ONGOING) && (
            <>
              {attempts.length > 1 && (
                <Button
                  variant="default"
                  size={isMobile ? 'md' : 'sm'}
                  className="hover: rounded-lg border border-[#00008080] border-[#000080] !px-4 text-sm font-medium text-primary hover:bg-[#0000800A] hover:text-primary"
                  onClick={() => onViewReport(id)}
                  data-testid="view-syllabus-btn"
                >
                  {ButtonNames.VIEW_ATTEMPTS}
                </Button>
              )}

              {attempts.length === 1 && (
                <Link href={`/test/result/${id}/${userId}?testTypeId=${testTypeId}`} passHref>
                  <Button
                    variant="default"
                    size={isMobile ? 'md' : 'sm'}
                    className="hover: rounded-lg border border-[#00008080] border-[#000080] !px-4 text-sm font-medium text-primary hover:bg-[#0000800A] hover:text-primary"
                    // onClick={handleViewReport}
                    data-testid="view-report-btn"
                  >
                    {ButtonNames.VIEW_REPORT}
                  </Button>
                </Link>
              )}
            </>
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
                    onClick={() => handleStartTest(id, testTypeId, OnlineExamination.START_TEST)}
                  >
                    {ButtonNames.START_TEST}
                    <Icon icon={'si:chevron-right-alt-fill'} className="ml-2 text-base" />
                  </Button>
                )}
                {attemptStatus.resume && allowResume && (
                  <Button
                    variant="default"
                    size={isMobile ? 'md' : 'sm'}
                    className={`rounded-lg text-sm ${actionButtonColor(ButtonNames.RESUME)}`}
                    data-testid="resume-test-btn"
                    onClick={() => handleStartTest(id, testTypeId, OnlineExamination.RESUME_TEST)}
                  >
                    {ButtonNames.RESUME}
                    <Icon icon={'si:chevron-right-alt-fill'} className="ml-2 text-base" />
                  </Button>
                )}
                {attemptStatus.retake && allowRetake && (
                  <Button
                    variant="default"
                    size={isMobile ? 'md' : 'sm'}
                    className={`rounded-lg text-sm ${actionButtonColor(ButtonNames.RETAKE)}`}
                    data-testid="retake-test-btn"
                    onClick={() => handleStartTest(id, testTypeId, OnlineExamination.RETAKE_TEST)}
                  >
                    <Icon icon="nrk:refresh" className="mx-1" fontSize={20} />
                    {ButtonNames.RETAKE}
                  </Button>
                )}
              </>
            )
          )}
        </div>
      </CardContent>

      <CardFooter className="mt-auto justify-center border-t !py-2 text-xs font-medium sm:text-sm">
        {countdownStarted ? (
          <span className="text-primary">Upcoming Test</span>
        ) : currentDate < startDate ? (
          <span className="text-primary">
            {ButtonNames.STARTS_ON} {longStartDateAndTime.formattedDate} {startDateAndTime.formattedTime}
          </span>
        ) : currentDate > endDate ? (
          <span className="text-[#E31717]">{CardItems.COMPLETED}</span>
        ) : (
          <span className="text-[#E31717]">
            {CardItems.ENDS_ON} {longEndDateAndTime.formattedDate}, {endDateAndTime.formattedTime}
          </span>
        )}
      </CardFooter>
    </Card>
  );
}

export default StudentExamCard;
