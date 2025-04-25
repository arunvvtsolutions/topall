'use client';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import React, { useEffect, useState } from 'react';
import Syllabus from './syllabus';
import Report from './report';
import Paginate from '@/components/common/pagination';
import GenerateLanding from './generate-landing';
import RetakeIcon from './retake-icon';
import { getGeneratedTests } from '@/utils/api/generate-test';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import { convertTime } from '@/utils';
import { useDispatch, useSelector } from '@/store';
import { GENERATE_TEST_SHORT_NAME } from '@/types/constants';
import { LucideLoader } from '@/components/common/LucideLoader';
import { getExamStatus } from '@/store/slice/onlineExamSlice';
import { toast } from 'sonner';
import { ButtonNames, TosterMessages } from '@/types/enum';
import { actionButtonColor } from '../all-india-mock-test/student-test-card';
import { encryptId } from '@/utils/crypto';
import { useRouter } from 'next/navigation';
import { IExamAttempts } from '@/types/user';
import Link from 'next/link';
import TestAttempt from '../view-attempts';
import { OnlineExamination } from '@/types/online-exams';
import { clearDB, saveTestState } from '@/services/indexed-db';
import { useMediaQuery } from '@/hooks/use-media-query';
import SyllabusDialog from '../view-syllabus';

interface IExamList {
  id: string;
  name: string;
  created_at: string;
  totalMarks: number;
  totalQuestions: number;
  totalTime: number;
  testType: number;
  attempts: IExamAttempts[];
}
interface IGeneratedTestProsp {
  totalPages: number;
  prevCursor: string;
  nextCursor: string;
  nextPageResult: boolean;
  prevPageResult: boolean;
  totalExamCount: number;
  examList: IExamList[];
}

const TestCard = ({ isModalOpen }: { isModalOpen: boolean }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.userProfile.userId);
  const selectedStreamId = useSelector((state) => state.stream.stream);
  const newExamStatus = useSelector((state) => state.onlineExamination.examStatus);
  const testTypes = useSelector((state) => state.testTypes.testTypes);

  const [matchedTestTypeId, setMatchedTestTypeId] = useState<number>(0);
  const [syllables, setSyllables] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTestId, setSelectedTestId] = useState(0);
  const [generatedList, setGeneratedList] = useState<IGeneratedTestProsp>({
    examList: [],
    nextCursor: '',
    nextPageResult: false,
    prevCursor: '',
    prevPageResult: false,
    totalExamCount: 0,
    totalPages: 0
  });
  const [examId, setExamId] = useState(0);
  const [attemptsList, setAttemptsList] = useState<IExamAttempts[]>([]);
  const [showAttempts, setShowAttempts] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery('(min-width: 768px)');
  const LIMIT = 10;

  const handleSyllabus = (testId: number) => {
    setSelectedTestId(testId);
    setSyllables(true);
  };
  // const handleReport = () => {
  //   setReport(true);
  // };

  // Handle view attempts
  const handleViewAttempts = (id: string) => {
    const attempts = generatedList.examList.find((exam) => exam.id === id)?.attempts || [];
    setAttemptsList(attempts);
    setExamId(Number(id));
    setShowAttempts(true);
  };

  const handlePageChange = (page: number) => {
    setLoading(true);
    setCurrentPage(page);
    generateTestData(page);
  };

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

  const generateTestData = async (page = 1) => {
    const requestPayload = {
      limit: LIMIT,
      page,
      streamId: selectedStreamId?.id || 0,
      studentId: userId || 0,
      testTypeId: matchedTestTypeId
    };

    try {
      const result = await getGeneratedTests(requestPayload);
      if (result && result.examList) {
        const statusPayload = {
          studentId: userId?.toString() || '',
          streamId: selectedStreamId?.id,
          testType: matchedTestTypeId,
          testIds: result.examList.map((exam: any) => exam.id)
        };

        dispatch(getExamStatus(statusPayload));
      }
      setGeneratedList(result);
      await clearDB();
    } catch (error) {
      toast.error(TosterMessages.USER_FETCH_EXAM_FAIL);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    userId && selectedStreamId?.id && !isModalOpen && matchedTestTypeId && generateTestData();
  }, [userId, selectedStreamId?.id, isModalOpen, matchedTestTypeId]);

  useEffect(() => {
    if (testTypes) {
      const matchedTestType = testTypes.find((item: any) => item.test_type_list?.short_name === GENERATE_TEST_SHORT_NAME);
      if (matchedTestType) setMatchedTestTypeId(matchedTestType?.id);
    }
  }, [testTypes]);

  return (
    <div className="py:2 relative flex min-h-screen flex-col md:py-6">
      {loading ? (
        <div className="flex h-full w-full items-center justify-center">
          <LucideLoader className="h-8 w-8 text-primary" />
        </div>
      ) : generatedList?.examList?.length === 0 ? (
        <GenerateLanding />
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {newExamStatus.length > 0 &&
            generatedList?.examList.map((item) => {
              const attemptStatus = newExamStatus.find((status) => status.testId === item.id);
              return (
                <div
                  key={item.id}
                  className="!border-[rgba(16, 16, 16, 0.15)] mx-auto w-full rounded-[16px] border-[0.5px] bg-white"
                >
                  <div className="!border-[rgba(16, 16, 16, 0.15)] border-b p-[16px]">
                    <div className="flex items-center space-x-2 font-semibold text-[#6F6F6F]">
                      <Icon icon="cuida:calendar-outline" className="h-5 w-5 font-semibold text-[#6F6F6F]" />
                      <span className="!text-xs font-semibold text-[#6F6F6F]">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                      <Icon icon="tabler:clock" className="h-5 w-5 font-semibold text-[#6F6F6F]" />
                      <span className="!text-xs font-semibold text-[#6F6F6F]">{convertTime(new Date(item.created_at))}</span>
                    </div>
                  </div>
                  <div className="p-[16px]">
                    <div className="flex items-center justify-between">
                      <Button variant="default" size="sm" className="!px-0 text-[16px] font-semibold text-B2CAgrayn">
                        {item.name}
                      </Button>
                    </div>
                    <div className="mt-1.5 flex items-center justify-between">
                      <div className="flex h-5 space-x-2">
                        <div className="text-xs font-semibold text-[#6F6F6F] lg:text-sm">{`${item.totalQuestions} Questions`}</div>
                        <Separator orientation="vertical" className="bg-[#6F6F6F] font-semibold" />
                        <div className="text-xs font-semibold text-[#6F6F6F] lg:text-sm">{`${item.totalMarks} Marks`}</div>
                        <Separator orientation="vertical" className="bg-[#6F6F6F] font-semibold" />
                        <div className="text-xs font-semibold text-[#6F6F6F] lg:text-sm">{`${item.totalTime} Mins`}</div>
                      </div>
                    </div>
                    {/* Buttons */}
                    <div>
                      <div className="mt-[16px] flex flex-wrap justify-end gap-[8px]">
                        <Button
                          variant="default"
                          size={isMobile ? 'md' : 'sm'}
                          className="rounded-lg border border-primary text-sm font-medium text-primary hover:bg-primary hover:text-white"
                          onClick={() => handleSyllabus(Number(item.id))}
                          data-testid="view-syllabus-btn"
                        >
                          {isMobile ? ButtonNames.VIEW_SYLLABUS : ButtonNames.SYLLABUS}
                        </Button>

                        {item.attempts.length > 1 && (
                          <Button
                            variant="default"
                            size={isMobile ? 'md' : 'sm'}
                            className="rounded-lg border border-primary text-sm font-medium text-primary hover:bg-primary hover:text-white"
                            onClick={() => handleViewAttempts(item.id)}
                            data-testid="view-attempts-btn"
                          >
                            {isMobile ? ButtonNames.VIEW_ATTEMPTS : ButtonNames.ATTEMPTS}
                          </Button>
                        )}

                        {item.attempts.length === 1 && (
                          <Link href={`/test/result/${item.id}/${userId}?testTypeId=${matchedTestTypeId}`} passHref>
                            <Button
                              variant="default"
                              size={isMobile ? 'md' : 'sm'}
                              className="rounded-lg border border-primary text-sm font-medium text-primary hover:bg-primary hover:text-white"
                              data-testid="view-report-btn"
                            >
                              {isMobile ? ButtonNames.VIEW_REPORT : ButtonNames.REPORT}
                            </Button>
                          </Link>
                        )}

                        {newExamStatus.length > 0 && (
                          <>
                            {!attemptStatus?.resume && !attemptStatus?.retake && (
                              <Button
                                variant="default"
                                size={isMobile ? 'md' : 'sm'}
                                className={`rounded-lg text-sm ${actionButtonColor(ButtonNames.START_TEST)}`}
                                data-testid="start-test-btn"
                                onClick={() => handleStartTest(item.id, matchedTestTypeId, OnlineExamination.START_TEST)}
                              >
                                {ButtonNames.START_TEST}
                                <Icon icon={'si:chevron-right-alt-fill'} className="ml-2 text-base" />
                              </Button>
                            )}
                            {attemptStatus?.resume && (
                              <Button
                                variant="default"
                                size={isMobile ? 'md' : 'sm'}
                                className={`rounded-lg text-sm ${actionButtonColor(ButtonNames.RESUME)}`}
                                data-testid="resume-test-btn"
                                onClick={() => handleStartTest(item.id, matchedTestTypeId, OnlineExamination.RESUME_TEST)}
                              >
                                {ButtonNames.RESUME}
                                <Icon icon={'si:chevron-right-alt-fill'} className="ml-2 text-base" />
                              </Button>
                            )}
                            {attemptStatus?.retake && (
                              <Button
                                variant="default"
                                size={isMobile ? 'md' : 'sm'}
                                className={`rounded-lg text-sm ${actionButtonColor(ButtonNames.RETAKE)}`}
                                data-testid="retake-test-btn"
                                onClick={() => handleStartTest(item.id, matchedTestTypeId, OnlineExamination.RETAKE_TEST)}
                              >
                                <Icon icon="nrk:refresh" className="mx-1" fontSize={20} />
                                {ButtonNames.RETAKE}
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
      {/* Pagination at the bottom */}
      <div className="mt-auto pt-8">
        <Paginate currentPage={currentPage} totalPages={generatedList.totalPages} onPageChange={handlePageChange} />
      </div>

      {/* Modal Components */}
      {syllables && <SyllabusDialog examId={selectedTestId} open={syllables} onOpenChange={() => setSyllables(false)} />}

      {/* view attempts */}
      {showAttempts && userId && examId && (
        <TestAttempt
          examId={examId}
          userId={userId}
          testTypeId={matchedTestTypeId}
          data={attemptsList}
          isOpen={showAttempts}
          onClose={() => setShowAttempts(false)}
        />
      )}
    </div>
  );
};

export default TestCard;
