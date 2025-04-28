'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { previousYearTest } from '@/utils/api/exams';
import TestListingPage from './previousyearpage';
import { PreviousTest } from '@/types';
import toast from 'react-hot-toast';
import { TosterMessages } from '@/types/enum';
import { PaginationWithLinks } from '@/components/common/pagination-with-links';
import TestAttempt from '../view-attempts';
import SyllabusDialog from '../view-syllabus';
import SectionHeader from '@/components/common/section-heading';
import { useDispatch, useSelector } from '@/store';
import { getExamStatus, setExamStatus } from '@/store/slice/onlineExamSlice';
import { PREVIOUS_YEAR_TEST, PREVIOUS_YEAR_TEST_SHORT_NAME } from '@/types/constants';
import { IExamAttempts } from '@/types/user';
import { clearDB } from '@/services/indexed-db';

export default function PreviousYearTests() {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.userProfile.userId);
  const selectedStream = useSelector((state) => state.stream.stream);
  const selectedStandard = useSelector((state) => state.stream.standard);
  const testTypes = useSelector((state) => state.testTypes.testTypes);
  const [selectedYear, setSelectedYear] = useState('All');
  const [page, setPage] = useState(Number(searchParams.get('page') || '1'));
  const [tests, setTests] = useState<PreviousTest[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [years, setYears] = useState<string[]>(['All']);
  const [openViewReportModal, setOpenViewReportModal] = useState(false);
  const [openViewSyllabusModal, setOpenViewSyllabusModal] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [examId, setExamId] = useState<number>(0);
  const [attemptsList, setAttemptsList] = useState<IExamAttempts[]>([]);
  const [matchedTestTypeId, setMatchedTestTypeId] = useState<number | null>(null);

  const limit = 6;
  useEffect(() => {
    if (!selectedStream || !selectedStandard || !userId || !matchedTestTypeId) return;
    const fetchData = async () => {
      setIsLoading(true);
      const payload = {
        limit: limit,
        page: page,
        streamId: selectedStream.id,
        standardId: selectedStandard.id,
        testTypeId: matchedTestTypeId,
        year: selectedYear === 'All' ? '' : selectedYear,
        studentId: userId?.toString() || ''
      };

      try {
        const response = await previousYearTest(payload);
        const statusPayload = {
          studentId: userId?.toString() || '',
          streamId: selectedStream.id,
          testType: matchedTestTypeId,
          testIds: response?.examList?.map((exam: any) => exam.id)
        };

        dispatch(getExamStatus(statusPayload));
        setTests(response.examList);
        setTotalPages(response.totalPages);
        await clearDB();
      } catch (error) {
        toast.error(TosterMessages.USER_PRRVIOUS_ERROR);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [page, selectedYear, selectedStream, selectedStandard, userId, matchedTestTypeId]);

  useEffect(() => {
    const uniqueYears = Array.from(new Set(tests.map((test) => new Date(test.scheduledAt).getFullYear())))
      .sort((a, b) => b - a)
      .map(String);
    setYears(['All', ...uniqueYears]);
  }, [tests]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  //handle open view report modal
  const handleOpenViewReportModal = () => {
    setOpenViewReportModal(true);
  };

  const handleShowSyllabus = (id: number) => {
    setExamId(id);
    setOpenViewSyllabusModal(true);
  };

  // Handle view attempts
  const handleViewAttempts = (id: string) => {
    const attempts = tests.find((exam) => exam.id === id)?.attempts || [];
    setAttemptsList(attempts);
    setExamId(Number(id));
    setOpenViewReportModal(true);
  };

  useEffect(() => {
    dispatch(setExamStatus([]));
  }, []);

  useEffect(() => {
    if (testTypes) {
      const matchedTestType = testTypes.find((item: any) => item.test_type_list?.short_name === PREVIOUS_YEAR_TEST_SHORT_NAME);
      if (matchedTestType) setMatchedTestTypeId(matchedTestType?.id);
    }
  }, [testTypes]);

  return (
    <div className="xs:px-2 w-full px-5 md:!px-[0px]">
      <SectionHeader
        title="Previous Year Tests"
        action={
          <Select defaultValue="All" onValueChange={(value: string) => setSelectedYear(value)}>
            <SelectTrigger className="h-7 w-24 border-0 border-borderad bg-[#FFFFFF] px-2 text-xs text-B2CAgrayn focus:outline-none focus:ring-0 sm:h-8 sm:w-32 sm:text-sm md:w-36 md:text-base">
              <SelectValue className="text-[#0D068E] focus:text-[#0D068E]" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {years.map((year) => (
                  <SelectItem
                    key={year}
                    value={year}
                    className="text-xs text-B2CAgrayn hover:text-[#0D068E] focus:text-[#0D068E] sm:text-sm md:text-base"
                  >
                    {year}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        }
      />

      <TestListingPage
        tests={tests}
        onViewReport={handleViewAttempts}
        onSyllabusView={handleShowSyllabus}
        isLoading={isLoading}
      />
      {tests && totalPages > 0 && (
        <div className="mb-2 flex items-center justify-center">
          <PaginationWithLinks page={page} pageSize={limit} totalCount={totalPages * limit} onPageChange={handlePageChange} />
        </div>
      )}
      {openViewReportModal && userId && examId && matchedTestTypeId && (
        <TestAttempt
          examId={examId}
          userId={userId}
          testTypeId={matchedTestTypeId}
          data={attemptsList}
          isOpen={openViewReportModal}
          onClose={() => setOpenViewReportModal(false)}
        />
      )}
      {openViewSyllabusModal && (
        <SyllabusDialog open={openViewSyllabusModal} onOpenChange={() => setOpenViewSyllabusModal(false)} examId={examId} />
      )}
    </div>
  );
}
