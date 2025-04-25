'use client';
import { LucideLoader } from '@/components/common/LucideLoader';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Exam, examDates, IExamAttempts, TestListProps } from '@/types/user';
import React, { useCallback, useEffect, useState } from 'react';
import { StudentExamCard } from './student-test-card';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from '@/hooks/use-debounce';
import { getAllIndiaMockTestList, getAllTestDates } from '@/utils/api/user/all-india-mock-test';
import toast from 'react-hot-toast';
import { CardItems, FormFields, TosterMessages } from '@/types/enum';
import TestHeader from './test-header';
import { PaginationWithLinks } from '@/components/common/pagination-with-links';
import { Separator } from '@/components/ui/separator';
import SyllabusDialog from '../view-syllabus';
import TestAttempt from '../view-attempts';
import { useSession } from 'next-auth/react';
import { useDispatch, useSelector } from '@/store';
import { getExamStatus, setExamDetails, setExamStatus } from '@/store/slice/onlineExamSlice';
import { ALL_INDIA_MOCK_TEST_SHORT_NAME } from '@/types/constants';
import { clearDB } from '@/services/indexed-db';

const AllIndiaMockTest = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery('(min-width: 850px)');
  const { data } = useSession();
  const userId = useSelector((state) => state.userProfile.userId);
  const selectedStream = useSelector((state) => state.stream.stream);
  const selectedStandard = useSelector((state) => state.stream.standard);
  const newExamStatus = useSelector((state) => state.onlineExamination.examStatus);
  const testTypes = useSelector((state) => state.testTypes.testTypes);
  // const [examStatus, setExamStatus] = useState<IExamAttempts[]>([]);
  const [testList, setTestList] = useState<TestListProps>({
    examList: [],
    nextCursor: '',
    nextPageResult: false,
    prevCursor: '',
    prevPageResult: false,
    totalExamCount: 0,
    totalPages: 1
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [showSyllabus, setShowSyllabus] = useState<boolean>(false);
  const [showAttempts, setShowAttempts] = useState<boolean>(false);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedDateObject, setSelectedDateObject] = useState<Date | undefined>(undefined);
  const [testDates, setTestDates] = useState<{ startDate: string }[]>([]);
  const [examId, setExamId] = useState<number>(0);
  const [matchedTestTypeId, setMatchedTestTypeId] = useState<number | null>(null);

  const [page, setPage] = useState(Number(searchParams.get('page') || '1'));
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const debouncedSearch = useDebounce(search);
  const [attemptsList, setAttemptsList] = useState<IExamAttempts[]>([]);

  const LIMIT = 12;

  // Fetch exam list
  const getTestList = async () => {
    setLoading(true);
    if (!selectedStream || !userId || !selectedStandard || !matchedTestTypeId) return;

    const payload = {
      limit: LIMIT,
      page,
      search: debouncedSearch,
      testTypeId: matchedTestTypeId,
      streamId: selectedStream.id,
      scheduleDate: selectedDate,
      standardId: selectedStandard.id,
      studentId: userId?.toString() || ''
    };

    try {
      const response = await getAllIndiaMockTestList(payload);
      if (response) {
        const statusPayload = {
          studentId: userId?.toString() || '',
          streamId: selectedStream.id,
          testType: matchedTestTypeId,
          testIds: response.examList.map((exam: Exam) => exam.id)
        };

        dispatch(getExamStatus(statusPayload));
        setTestList(response);
      }
      await clearDB();
    } catch (error) {
      toast.error(TosterMessages.USER_FETCH_EXAM_FAIL);
    } finally {
      setLoading(false);
    }
  };

  // Fetch exam dates
  const getExamDates = useCallback(async () => {
    if (!selectedStream || !matchedTestTypeId) return;
    try {
      const response = await getAllTestDates({ testTypeId: matchedTestTypeId, streamId: selectedStream?.id });
      const filtered = response.map((exam: examDates) => ({
        startDate: exam.scheduledAt
      }));
      setTestDates(filtered);
    } catch (error) {
      console.error('Failed to fetch exam dates:', error);
      toast.error(TosterMessages.ADMIN_COMMON_ERROR);
    }
  }, [selectedStream?.id, matchedTestTypeId]);

  // Update query parameters in the URL
  const updateQueryParams = (params: Record<string, string>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newSearchParams.set(key, value);
      } else {
        newSearchParams.delete(key);
      }
    });
    router.push(`?${newSearchParams.toString()}`);
  };

  // Refresh Handler
  const refreshHandler = () => {
    setSearch('');
    setSelectedDate('');
    setShowCalendar(false);
    setPage(1);

    const newUrl = `${window.location.origin}${window.location.pathname}`;
    window.history.replaceState(null, '', newUrl);

    window.location.reload();
  };

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    setLoading(true);
    setSearch('');
    setShowCalendar(false);
    if (date) {
      const year = date.getFullYear(); // Get full year (e.g., 2025)
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Get month in two digits
      const day = date.getDate().toString().padStart(2, '0'); // Get day in two digits

      const formattedDate = `${year}-${month}-${day}`;
      // Only update if the date has changed
      if (formattedDate !== selectedDate) {
        setPage(1);
        setSelectedDate(formattedDate);
        setSelectedDateObject(date);
        updateQueryParams({ page: '1', scheduleDate: formattedDate });
      }
    } else {
      setSelectedDate('');
      setSelectedDateObject(undefined);
      updateQueryParams({ scheduleDate: '' });
    }
  };

  // Handle search input changes
  const handleSearchChange = (value: string) => {
    setSelectedDate('');
    setShowCalendar(false);
    setLoading(true);
    const newValue = value.trimStart();
    setSearch(newValue);
    setPage(1);
    updateQueryParams({ search: newValue, page: '1' });
  };

  // Handle page changes
  const handlePageChange = (newPage: number) => {
    if (newPage === page) return;
    setLoading(true);
    setShowCalendar(false);
    setPage(newPage);
    updateQueryParams({ page: newPage.toString() });
  };

  const handleShowSyllabus = (id: number) => {
    setExamId(id);
    setShowSyllabus(true);
  };

  // Handle view attempts
  const handleViewAttempts = (id: string) => {
    const attempts = testList.examList.find((exam) => exam.id === id)?.attempts || [];
    setAttemptsList(attempts);
    setExamId(Number(id));
    setShowAttempts(true);
  };

  useEffect(() => {
    getExamDates();
  }, [selectedStream, matchedTestTypeId]);

  useEffect(() => {
    getTestList();
  }, [debouncedSearch, page, selectedDate, selectedStream, selectedStandard, matchedTestTypeId]);

  useEffect(() => {
    dispatch(setExamStatus([]));
    dispatch(setExamDetails(null));
  }, []);

  useEffect(() => {
    if (testTypes) {
      const matchedTestType = testTypes.find((item: any) => item.test_type_list?.short_name === ALL_INDIA_MOCK_TEST_SHORT_NAME);
      if (matchedTestType) setMatchedTestTypeId(matchedTestType.id);
    }
  }, [testTypes]);

  // console.log('testList', testList);
  return (
    <div className="flex h-full flex-col px-2 sm:px-0">
      <div className="mb-5">
        <TestHeader
          onRefresh={refreshHandler}
          searchValue={search}
          onSearchChange={handleSearchChange}
          startDates={testDates}
          showCalendar={showCalendar}
          setShowCalendar={() => setShowCalendar((prev) => !prev)}
          selectedDate={selectedDateObject}
          onDateSelect={handleDateSelect}
        />
      </div>
      <Separator className="mb-5" />
      <div className="flex-grow overflow-y-auto pb-16">
        {loading ? (
          <div className="flex h-full w-full items-center justify-center">
            <LucideLoader className="h-8 w-8 text-primary" />
          </div>
        ) : testList.examList.length === 0 ? (
          <div className="flex h-full w-full items-center justify-center text-2xl font-medium text-B2Cgray">
            {FormFields.NO_DATA_MSG}
          </div>
        ) : (
          <>
            <div className={`grid gap-4 ${isMobile && 'grid-cols-2'} 2xl:grid-cols-3`}>
              {testList.examList.length > 0 &&
                newExamStatus.length > 0 &&
                testList.examList.map((exam: Exam) => {
                  const attemptStatus = newExamStatus.find((status) => status.testId === exam.id);
                  return (
                    <StudentExamCard
                      key={exam.id}
                      testData={exam}
                      attemptStatus={attemptStatus}
                      onViewSyllabus={handleShowSyllabus}
                      onViewReport={handleViewAttempts}
                    />
                  );
                })}
            </div>
          </>
        )}
      </div>

      {/* Pagination component */}
      {testList.totalExamCount > 0 && (
        <div className="mt-auto">
          <PaginationWithLinks
            page={page}
            pageSize={LIMIT}
            totalCount={testList.totalExamCount}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {showSyllabus && <SyllabusDialog open={showSyllabus} onOpenChange={() => setShowSyllabus(false)} examId={examId} />}
      {showAttempts && userId && examId && matchedTestTypeId && (
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

export default AllIndiaMockTest;
