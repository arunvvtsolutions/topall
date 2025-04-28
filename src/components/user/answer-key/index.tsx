'use client';
import { useEffect, useState, useCallback } from 'react';
import { Separator } from '@/components/ui/separator';
import QuestionAccordian from './question-accordian';
import Link from 'next/link';
import { Icon } from '@/components/ui/icon';
import ProductLogo from '@/components/product-logo';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import SelectDropdown from '@/components/common/Select';
import type { GenericType } from '@/types';
import { getAnswerKey } from '@/utils/api/user/result';
import QuestionWithoutAccordion from './question-without-accordion';
import type { AnswerKey } from '@/types/exams';
import ReportModal from '@/components/test/report-model';
import { Accordion } from '@/components/ui/accordion';
import { useSelector, useDispatch } from '@/store';
import { useSession } from 'next-auth/react';
import { setUserProfileSuccess } from '@/store/slice/user/userProfileSlice';
import { setStreamSelection } from '@/store/slice/user';
import { getProfileDetail } from '@/utils/api/user';
import { setStreamSelectionSuccess } from '@/store/slice/user/stream-slice';
import { Roles, TosterMessages } from '@/types/enum';
import BookmarkForm from '@/components/test/bookmark-model';
import { getSingleTest } from '@/utils/api/examination';
import { deleteBookmark, getBookmarks, getBookmarkTypes } from '@/utils/api/user/bookmark';
import BookmarkRemoveDialog from '@/components/test/remove-bookmark';
import { HttpStatus } from '@/types/constants';
import { toast } from 'sonner';
import { getMockDataByTestType, shouldUseMockData } from './test-helper';
import { LucideLoader } from '@/components/common/LucideLoader';

const ANSWER_TYPES = [
  { id: 0, name: 'All' },
  { id: 1, name: 'Correct' },
  { id: 2, name: 'Wrong' },
  { id: 3, name: 'Left' }
];

const QuestionsAndAnswerKey = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const { studentId, testId } = useParams();
  const searchParams = useSearchParams();
  const attemptId = searchParams.get('attemptId') as string;
  const dispatch = useDispatch();
  const userProfileData = useSelector((state) => state.userProfile);

  const [answerKey, setAnswerKey] = useState<AnswerKey[]>([]);
  const [answerKeyData, setAnswerKeyData] = useState<AnswerKey[]>([]);
  const [allQuestions, setAllQuestions] = useState<any[]>([]);
  const [allQuestionsData, setAllQuestionsData] = useState<any[]>([]);
  const [bookmarkTypes, setBookmarkTypes] = useState<GenericType[]>([]);
  const [selectedBookmarkType, setSelectedBookmarkType] = useState<number>(0);

  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<GenericType[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<GenericType>({ id: 0, name: 'All Subjects' });
  const [selectedAnswerType, setSelectedAnswerType] = useState<GenericType>({ id: 0, name: 'All' });
  const [testData, setTestData] = useState({
    streamId: 0,
    testTypeId: 0,
    standardId: 0
  });

  const [questionId, setQuestionId] = useState<number>(0);
  const [reportModal, setReportModal] = useState<boolean>(false);
  const [bookmarkModal, setBookmarkModal] = useState<boolean>(false);
  const [removeBookmark, setRemoveBookmark] = useState<boolean>(false);

  // Use a single loading state to simplify the logic
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch Answer Key
  const fetchAnswerKey = async (
    studentId: number,
    testTypeId: number,
    testId: number,
    streamId: number,
    standardId: number,
    attemptId: string
  ) => {
    try {
      let answerKeys: any[] = [];

      // Fetch the answer keys from API
      answerKeys = await getAnswerKey(studentId, testTypeId, testId, streamId, standardId, attemptId);

      // Extract unique subjects
      const uniqueSubjects: GenericType[] = [];
      const idSets = new Set<number>();

      answerKeys.forEach((sec: AnswerKey) => {
        const sub = sec.subjectDetails;
        if (sub && !idSets.has(sub.id)) {
          idSets.add(sub.id);
          uniqueSubjects.push(sub);
        }
      });

      // Extract all questions for flat view
      const allQuestions = answerKeys.flatMap((sec: AnswerKey) => sec.questions);

      // Update all state at once to prevent multiple re-renders
      setAnswerKeyData(answerKeys);
      setAnswerKey(answerKeys);
      setSubjects(uniqueSubjects);
      setAllQuestionsData(allQuestions);
      setAllQuestions(allQuestions);
    } catch (error) {
      console.error('Error fetching answer key:', error);
      toast.error(TosterMessages.ADMIN_COMMON_ERROR);
    } finally {
      // Always set loading to false when done, regardless of success or failure
      setIsLoading(false);
    }
  };

  // Fetch User Profile
  const fetchUserProfile = useCallback(async () => {
    if (!sessionData?.user?.mobileNumber) return;

    try {
      const profileResponse = await getProfileDetail(sessionData.user.mobileNumber);

      if (!profileResponse) {
        toast.error('Failed to fetch profile data');
        return;
      }

      dispatch(setUserProfileSuccess(profileResponse));
      dispatch(setStreamSelectionSuccess({ stream: profileResponse.currentExams[0], standards: profileResponse.standard }));
      await setStreamSelection(profileResponse.currentExams[0]?.id);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error(TosterMessages.ADMIN_COMMON_ERROR);
    }
  }, [dispatch, sessionData?.user?.mobileNumber]);

  // Main data loading function
  const loadAllData = useCallback(
    async (shouldLoadTest: boolean = true) => {
      if (!testId) {
        setIsLoading(false);
        return;
      }

      try {
        let testResponse;
        // Load everything in parallel where possible
        const [bookmarks, bookmarkTypes] = await Promise.all([
          getBookmarks({ studentId: Number(studentId), bookmarkType: 0 }),
          getBookmarkTypes()
        ]);

        if (shouldLoadTest) {
          testResponse = await getSingleTest(Number(testId));
        }

        setBookmarks(bookmarks);
        setBookmarkTypes(bookmarkTypes);

        // Set test data
        if (testResponse) {
          setTestData({
            standardId: testResponse.standardId,
            streamId: testResponse.streamId,
            testTypeId: testResponse.testTypeId
          });
        }

        // Don't set isLoading to false here - we'll do that after fetchAnswerKey completes
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error(TosterMessages.ADMIN_COMMON_ERROR);
        setIsLoading(false); // Set loading to false on error
      }
    },
    [testId, studentId]
  );

  useEffect(() => {
    if (sessionData?.user?.role === Roles.STUDENT && sessionData?.user?.mobileNumber) {
      fetchUserProfile();
    }
  }, [fetchUserProfile, sessionData?.user?.mobileNumber, sessionData?.user?.role]);

  useEffect(() => {
    const getAnswerKey = async () => {
      if (studentId && testData.streamId > 0 && testData.testTypeId > 0) {
        await fetchAnswerKey(
          Number(studentId),
          testData.testTypeId,
          Number(testId),
          testData.streamId,
          testData.standardId,
          attemptId
        );
      }
    };

    if (studentId && testData.streamId > 0 && testData.testTypeId > 0) {
      getAnswerKey();
    }
  }, [studentId, testData, testId, attemptId]);

  // Initial data loading
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Subject Filter Handler
  const subjectFilterHandler = (subject: GenericType) => {
    setSelectedSubject(subject);

    if (subject.id === 0) {
      setAnswerKey(answerKeyData);
      setAllQuestions(allQuestionsData);
    } else {
      const filteredAnswer = answerKeyData.filter((sec) => sec.subjectDetails.id === subject.id);
      setAnswerKey(filteredAnswer);

      // Also update allQuestions for the selected subject
      const filteredQuestions = answerKeyData
        .filter((sec) => sec.subjectDetails.id === subject.id)
        .flatMap((sec) => sec.questions);
      setAllQuestions(filteredQuestions);
    }

    // Reset answer type filter when subject changes
    setSelectedAnswerType({ id: 0, name: 'All' });
  };

  // Answer Type Filter Handler
  const answerFilterHandler = (answerType: GenericType) => {
    setSelectedAnswerType(answerType);

    if (selectedSubject.id === 0) {
      // Case: "All Subjects" selected → Filter allQuestionsData directly
      let filteredAnswers = [...allQuestionsData];

      if (answerType.id !== 0) {
        filteredAnswers = allQuestionsData.filter((question) => {
          switch (answerType.name.toLowerCase()) {
            case 'correct':
              return question.selectedOption === question.correctOption;
            case 'wrong':
              return question.selectedOption && question.selectedOption !== question.correctOption;
            case 'left':
              return !question.selectedOption;
            default:
              return true;
          }
        });
      }

      setAllQuestions(filteredAnswers);
    } else {
      // Case: Specific Subject Selected → Filter sections and questions within them
      let filteredSections = answerKeyData.filter((sec) => sec.subjectDetails.id === selectedSubject.id);
      let filteredQuestions = filteredSections.flatMap((sec) => sec.questions);

      if (answerType.id !== 0) {
        // Filter questions based on answer type
        filteredQuestions = filteredQuestions.filter((question) => {
          switch (answerType.name.toLowerCase()) {
            case 'correct':
              return question.selectedOption === question.correctOption;
            case 'wrong':
              return question.selectedOption && question.selectedOption !== question.correctOption;
            case 'left':
              return !question.selectedOption;
            default:
              return true;
          }
        });

        // Reconstruct sections with filtered questions
        filteredSections = filteredSections
          .map((sec) => ({
            ...sec,
            questions: sec.questions.filter((question) => {
              switch (answerType.name.toLowerCase()) {
                case 'correct':
                  return question.selectedOption === question.correctOption;
                case 'wrong':
                  return question.selectedOption && question.selectedOption !== question.correctOption;
                case 'left':
                  return !question.selectedOption;
                default:
                  return true;
              }
            })
          }))
          .filter((sec) => sec.questions.length > 0); // Remove empty sections
      }

      // Update both the section view and flat question view
      setAnswerKey(filteredSections);
      setAllQuestions(filteredQuestions);
    }
  };

  // Bookmark Handler
  const handleBookmark = (questionId: number) => {
    setQuestionId(questionId);
    const bookmarked = bookmarks.some((bookmark) => bookmark.questionId === questionId);

    if (bookmarked) {
      setRemoveBookmark(true);
    } else {
      setBookmarkModal(true);
    }
  };

  // Report Handler
  const handleReport = (questionId: number) => {
    setQuestionId(questionId);
    setReportModal(true);
  };

  const removeBookmarkHandler = async () => {
    const payload = {
      questionId,
      studentId: Number(studentId),
      bookmarkType: selectedBookmarkType
    };
    try {
      const response = await deleteBookmark(payload);
      if (response.status === HttpStatus.CREATED) {
        toast.success(TosterMessages.BOOKMARK_REMOVE_SUCCESS);
        loadAllData(false);
      } else {
        toast.error(TosterMessages.BOOKMARK_REMOVE_ERROR);
      }
    } catch (error) {
      toast.error(TosterMessages.BOOKMARK_REMOVE_ERROR);
    } finally {
      setRemoveBookmark(false);
    }
  };

  // Determine if we should use the non-accordion view for a specific subject
  const shouldUseNonAccordionForSpecificSubject = testData.testTypeId === 3 && selectedSubject.id !== 0;

  return (
    <div className="space-y-4 pb-10">
      <div className="flex items-center justify-between py-2">
        <div onClick={() => router.back()} className="flex items-center gap-2 text-sm text-B2CAgrayn lg:text-xl">
          <Icon icon={'heroicons:arrow-left'} />
          Back
        </div>
        <h2 className="text-base font-medium lg:text-2xl">Answer Key</h2>
        <div className="flex items-center">
          <div className="w-8 lg:w-16">
            <ProductLogo className="size-full object-contain" />
          </div>
          <h2 className="text-xl font-bold text-primary lg:text-3xl">TopAll</h2>
        </div>
      </div>

      <Separator className="bg-borderad" />

      {/* Filter controls */}
      {!isLoading && (
        <div className="flex flex-nowrap justify-end gap-4 overflow-x-auto">
          {testData.testTypeId !== 4 && testData.testTypeId !== 5 && (
            <div>
              <SelectDropdown
                name="subject"
                onChange={subjectFilterHandler}
                value={selectedSubject}
                data={[{ id: 0, name: 'All Subjects' }, ...subjects]}
                text="text-B2Cgray p-4 text-sm lg:text-base font-normal rounded-sm border border-borderad w-full"
              />
            </div>
          )}

          <div>
            <SelectDropdown
              name="answerType"
              onChange={answerFilterHandler}
              value={selectedAnswerType}
              data={ANSWER_TYPES}
              text="text-B2Cgray p-4 text-sm lg:text-base font-normal rounded-sm border border-borderad w-full"
            />
          </div>
        </div>
      )}

      {/* Content area with 45rem height */}
      <div className="relative h-[calc(100vh-14rem)] pt-4">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <LucideLoader className="h-8 w-8 text-primary" />
          </div>
        ) : (
          <>
            {selectedSubject.id === 0 ? (
              allQuestions.length > 0 ? (
                <QuestionWithoutAccordion
                  bookmarks={bookmarks}
                  qData={allQuestions}
                  onReport={handleReport}
                  onBookmark={handleBookmark}
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-center text-gray-500">No questions found</p>
                </div>
              )
            ) : shouldUseNonAccordionForSpecificSubject ? (
              answerKey.flatMap((section) => section.questions).length > 0 ? (
                <QuestionWithoutAccordion
                  bookmarks={bookmarks}
                  qData={answerKey.flatMap((section) => section.questions)}
                  onReport={handleReport}
                  onBookmark={handleBookmark}
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-center text-gray-500">No questions found for the selected filters</p>
                </div>
              )
            ) : answerKey.length > 0 ? (
              <Accordion type="single" collapsible className="w-full" defaultValue="section-0">
                {answerKey.map((qData, index) => (
                  <QuestionAccordian
                    key={qData.sectionId}
                    qData={qData}
                    onReport={handleReport}
                    onBookmark={handleBookmark}
                    value={`section-${index}`}
                    bookmarks={bookmarks}
                  />
                ))}
              </Accordion>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-center text-gray-500">No questions found for the selected filters</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {reportModal && (
        <ReportModal
          userId={userProfileData.userId}
          roleId={userProfileData.role.id}
          questionId={questionId}
          isOpen={reportModal}
          onClose={() => setReportModal(false)}
        />
      )}

      {bookmarkModal && (
        <BookmarkForm
          questionId={questionId}
          studentId={userProfileData.userId!}
          testType={testData.testTypeId}
          isOpen={bookmarkModal}
          onClose={() => {
            loadAllData(false);
            setBookmarkModal(false);
          }}
          bookmarkTypes={bookmarkTypes}
          selectedBookmarkType={selectedBookmarkType}
          changeBookmarkType={(id: number) => setSelectedBookmarkType(id)}
        />
      )}

      {removeBookmark && (
        <BookmarkRemoveDialog onSubmit={removeBookmarkHandler} isOpen={removeBookmark} onClose={() => setRemoveBookmark(false)} />
      )}
    </div>
  );
};

export default QuestionsAndAnswerKey;
