'use client';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';
import OEMobileHeader from './oe-exam-mobile-header';
import { Separator } from '@/components/ui/separator';
import OEExamWebHeader from '../header';
import OEMobileFooter from './oe-exam-mobile-footer';
import OEWbFooter from './oe-exam-web-footer';
import OESections from './oe-exam-section';
import FeedbackForm from '@/components/test/report-model';
import BookmarkForm from '@/components/test/bookmark-model';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import LeaveTestModal from '@/components/test/leavetest-model';
import { useDispatch, useSelector } from '@/store';
import { OnlineExamination } from '@/types/online-exams';
import {
  markCalculate,
  oeResumeExam,
  oeRetakeExam,
  oeStartExam,
  overallAnalysisCalculate,
  submitTest,
  updateExamQuestion,
  updateTestEachSecond
} from '@/utils/api/online-exams';
import { toast } from 'sonner';
import useSubjects from './use-subject';
import OEQuestion from './oe-exam-questions-section';
import OESubjectDropdown from './oe-exam-subject-dropdown';
import { HttpStatus } from '@/types/constants';
import { clearDB, getTestState, saveAnswers, saveSectionsList, saveTestState } from '@/services/indexed-db';
import {
  setAttemptedQuestions,
  setCurrentQuestion,
  setCurrentSection,
  setExamDetails,
  setExamStatus,
  setSectionsList,
  setSelectedSubjects
} from '@/store/slice/onlineExamSlice';
import ExamSummary from '@/components/test/examcompleted-summary';
import { useRouter } from 'next/navigation';
import { getBookmarks, getBookmarkTypes } from '@/store/slice/user/bookmarks';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import MaliciousModal from '@/components/test/malicious-activities';
import BookmarkRemoveDialog from '@/components/test/remove-bookmark';
import { LucideLoader } from '@/components/common/LucideLoader';
import { BackdropLoader } from '@/components/backdrop-loader';

const OnlineExaminationComponent = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const isMd = useMediaQuery('(max-width: 1232px)');
  const { userId, role } = useSelector((state) => state.userProfile);
  const selectedStreamId = useSelector((state) => state.stream.stream);
  const selectedStandardId = useSelector((state) => state.stream.standard);
  const sectionsData = useSelector((state) => state.onlineExamination.sectionsData);
  const selectedSubject = useSelector((state) => state.onlineExamination.selectedSubject);
  const currentSection = useSelector((state) => state.onlineExamination.currentSection);
  const currentQuestion = useSelector((state) => state.onlineExamination.currentQuestion);
  const examDetails = useSelector((state) => state.onlineExamination.examDetails);
  const attemptedQuestions = useSelector((state) => state.onlineExamination.attemptedQuestions);
  const bookmarkTypes = useSelector((state) => state.bookmarks.bookMarkTypes);
  const bookmarkLists = useSelector((state) => state.bookmarks.bookMarkLists);

  const [remainingTime, setRemainingTime] = useState<any>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSubmitTest, setIsSubmitTest] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedBookmarkType, setSelectedBookmarkType] = useState<number>(0);
  const [showMobileSection, setShowMobileSection] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showWarningCount, setShowWarningCount] = useState(0);
  const [selectedInputValue, setSelectedInputValue] = useState('');
  const [isLeaveTestLoading, setIsLeaveTestLoading] = useState(false);

  const remainingTimeRef = useRef(remainingTime);
  const subjects = useSubjects();
  const [report, setReport] = useState<boolean>(false);
  const [bookmark, setBookmark] = useState<boolean>(false);
  const [removeBookmark, setRemoveBookmark] = useState<boolean>(false);
  const [leaveTest, setLeaveTest] = useState<boolean>(false);

  // Add these state variables to your component
  const [isSavingAnswer, setIsSavingAnswer] = useState(false);
  const [isSavingReview, setIsSavingReview] = useState(false);

  //saving attempts update
  const createAttempts = async () => {
    if (!userId || !examDetails) return;

    try {
      const questionId = Number(currentQuestion);
      const existingAnswer = attemptedQuestions.find((a) => a.questionId === questionId);
      const updatedAnswers = attemptedQuestions.map((a) => (a.questionId === questionId ? { ...a, time_taken: timeSpent } : a));

      if (!existingAnswer) {
        updatedAnswers.push({
          questionId,
          ans: '',
          mark_for_review: 0,
          time_taken: 0,
          bookmark: false
        });
      }

      dispatch(setAttemptedQuestions(updatedAnswers));

      const payload = {
        test_id: examDetails.testId,
        test_type: examDetails.testTypeId,
        student_id: String(userId),
        stream_id: selectedStreamId?.id || 0,
        attempts: {
          left_time: remainingTime || 0,
          last_section: currentSection,
          last_ques_id: questionId,
          questions: {
            question_id: questionId.toString(),
            selected_option: existingAnswer?.ans || '',
            time_spent: timeSpent,
            section_id: currentSection,
            is_review: existingAnswer?.mark_for_review === 1
          }
        }
      };

      await updateExamQuestion(payload);
    } catch {
      toast.error('Failed to create attempts');
    }
  };

  useEffect(() => {
    if (currentQuestion) {
      createAttempts();
    }
  }, [currentQuestion]);

  // Initialize exam data
  useEffect(() => {
    const initializeExam = async () => {
      if (!userId || !examDetails || !selectedStreamId || !selectedStandardId) return;
      try {
        setLoading(true);
        // Check if there's a saved test state
        const savedState = await getTestState(examDetails?.testId);
        if (savedState.status === OnlineExamination.RESUME_TEST) {
          // Resume exam
          const resumeData = await oeResumeExam(
            userId,
            examDetails.testTypeId,
            examDetails?.testId,
            selectedStreamId?.id,
            selectedStandardId?.id
          );
          if (resumeData.sectionList) {
            dispatch(setSectionsList(resumeData.sectionList));

            await saveSectionsList(examDetails.testId, resumeData.sectionList);

            setRemainingTime(resumeData.attempt.left_time);
            const lastSection = resumeData.attempt.last_section;
            dispatch(setCurrentSection(lastSection));
            const lastQuesId = resumeData.attempt.last_ques_id || savedState.last_quesId;
            dispatch(setCurrentQuestion(lastQuesId));
            // Convert attempt questions to answers format for our app
            if (resumeData.attempt.questions && resumeData.attempt.questions.length > 0) {
              const convertedAnswers = resumeData.attempt.questions.map((q: any) => ({
                questionId: Number.parseInt(q.question_id),
                ans: q.selected_option,
                mark_for_review: q.is_review ? 1 : 0,
                time_taken: q.time_spent
              }));
              dispatch(setAttemptedQuestions(convertedAnswers));
              await saveAnswers(examDetails.testId, convertedAnswers);
            }
          }
        } else if (savedState.status === OnlineExamination.RETAKE_TEST) {
          const questionsData = await oeRetakeExam(
            userId,
            examDetails.testTypeId,
            examDetails.testId,
            selectedStreamId?.id,
            selectedStandardId?.id
          );

          if (questionsData && questionsData.statusCode === 400) {
            toast.error(questionsData.message);
            return;
          }
          if (questionsData.sectionList) {
            dispatch(setSectionsList(questionsData.sectionList));
            await saveSectionsList(examDetails.testId, questionsData.sectionList);
          }

          // Initialize test state in IndexedDB
          await saveTestState(examDetails.testId, {
            ...savedState,
            last_quesId: 1,
            remaining_time: examDetails.duration * 60,
            subject_id: questionsData.sectionList[0]?.subjectId || 0,
            last_section: questionsData.sectionList[0]?.sectionId.toString() || '1',
            status: OnlineExamination.RESUME_TEST
          });
          dispatch(setCurrentSection(questionsData.sectionList[0]?.sectionId.toString() || '1'));
          dispatch(setCurrentQuestion(questionsData.sectionList[0]?.questions[0].questionId));
          setRemainingTime(examDetails.duration * 60);
        } else {
          const questionsData = await oeStartExam(
            userId,
            examDetails.testTypeId,
            examDetails.testId,
            selectedStreamId?.id,
            selectedStandardId?.id
          );
          if (questionsData && !questionsData.status) {
            toast.error(questionsData.message);
            return;
          }

          if (questionsData?.sectionList.length > 0) {
            dispatch(setSectionsList(questionsData.sectionList));
            await saveSectionsList(examDetails.testId, questionsData.sectionList);
            // Initialize test state in IndexedDB
            await saveTestState(examDetails.testId, {
              ...savedState,
              last_section: questionsData.sectionList[0]?.sectionId.toString() || '1',
              last_quesId: questionsData.sectionList[0]?.questions[0].questionId,
              status: OnlineExamination.RESUME_TEST
            });
            dispatch(setCurrentSection(questionsData.sectionList[0]?.sectionId.toString() || '1'));
            dispatch(setCurrentQuestion(questionsData.sectionList[0]?.questions[0].questionId));
            setRemainingTime(examDetails.duration * 60);
          }
        }

        // const bookmarkType = await getBookmarkTypes();
        // setBookmarkTypes(bookmarkType);
        // console.log('bookmarkTypes', bookmarkTypes);
        dispatch(getBookmarkTypes());
      } catch (error) {
        console.error('Failed to initialize exam:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeExam();
  }, [examDetails?.testId, selectedStreamId, setCurrentQuestion, setCurrentSection]);

  useEffect(() => {
    dispatch(getBookmarks({ studentId: userId, bookmarkType: 1 }));
  }, [userId]);

  // Get current section questions
  const getCurrentSectionQuestions = useCallback(() => {
    if (!sectionsData.length || !currentSection) return [];
    const section = sectionsData.find((s) => s.sectionId.toString() === currentSection);
    return section?.questions ?? [];
  }, [sectionsData, currentSection]);

  // Get current question
  const getCurrentQuestion = useCallback(() => {
    const questions = getCurrentSectionQuestions();
    return questions.find((q: any) => q.questionId === currentQuestion) || questions[0];
  }, [getCurrentSectionQuestions, currentQuestion]);

  // Handle answer selection
  const handleUpdateAnswer = async (questionId: number, optionId: string, isReview = false) => {
    try {
      if (!examDetails) return;

      // Set the appropriate loading state
      if (isReview) {
        setIsSavingReview(true);
      } else {
        setIsSavingAnswer(true);
      }
      // const timeSpent = 10; // In a real app, calculate time spent on this question

      // Update answers in state and IndexedDB
      const updatedAnswers = [...attemptedQuestions];
      const existingAnswerIndex = updatedAnswers.findIndex((a) => a.questionId === questionId);

      if (existingAnswerIndex >= 0) {
        updatedAnswers[existingAnswerIndex] = {
          ...updatedAnswers[existingAnswerIndex],
          ans: optionId,
          mark_for_review: isReview ? 1 : 0,
          time_taken: timeSpent
        };
      } else {
        updatedAnswers.push({
          questionId,
          ans: optionId,
          mark_for_review: isReview ? 1 : 0,
          time_taken: timeSpent,
          bookmark: false
        });
      }
      const attemptsResponse = await updateExamQuestion({
        test_id: examDetails.testId,
        test_type: examDetails.testTypeId,
        student_id: String(userId),
        stream_id: selectedStreamId?.id,
        attempts: {
          left_time: remainingTime,
          last_section: currentSection,
          last_ques_id: questionId,
          questions: {
            question_id: questionId.toString(),
            selected_option: optionId,
            time_spent: timeSpent,
            section_id: currentSection,
            is_review: isReview
          }
        }
      });

      if (attemptsResponse?.statusCode !== HttpStatus.OK) {
        toast.error('Failed to update answer.');
        return;
      }

      // console.log('updatedAnswers', updatedAnswers);
      dispatch(setAttemptedQuestions(updatedAnswers));
      await saveAnswers(examDetails.testId, updatedAnswers);
      handleNextQuestion();
      setTimeSpent(0);
    } catch (error) {
      console.error('Failed to update answer:', error);
      toast.error("Next question couldn't be loaded");
    } finally {
      // Reset loading states
      setIsSavingAnswer(false);
      setIsSavingReview(false);
    }
  };

  // Handle clear answer
  const handleClearAnswer = async (questionId: number) => {
    if (!examDetails) return;
    // console.log('questionId', questionId);
    try {
      // Update answers in state and IndexedDB
      const updatedAnswers = [...attemptedQuestions];
      const existingAnswerIndex = updatedAnswers.findIndex((a) => a.questionId === questionId);

      if (existingAnswerIndex >= 0) {
        updatedAnswers[existingAnswerIndex] = {
          ...updatedAnswers[existingAnswerIndex],
          ans: ''
        };

        // console.log('updatedAnswers', updatedAnswers);
        dispatch(setAttemptedQuestions(updatedAnswers));
        await saveAnswers(examDetails.testId, updatedAnswers);
      }
    } catch (error) {
      console.error('Failed to clear answer:', error);
    }
  };

  // Handle navigation to next section
  const handleNextSection = useCallback(() => {
    if (sectionsData && selectedSubject?.id) {
      const subjects = sectionsData.filter((section) => section.subjectId === selectedSubject?.id);
      const currentIndex = subjects.findIndex((section) => section.sectionId.toString() === currentSection);
      if (currentIndex < subjects.length - 1) {
        dispatch(setCurrentSection(subjects[currentIndex + 1].sectionId.toString()));
        dispatch(setCurrentQuestion(subjects[currentIndex + 1].questions[0].questionId));
      }
    }
  }, [currentSection, sectionsData, dispatch]);

  // Handle navigation to previous section
  const handlePrevSection = useCallback(() => {
    if (sectionsData && selectedSubject?.id) {
      const subjects = sectionsData.filter((section) => section.subjectId === selectedSubject?.id);
      const currentIndex = subjects.findIndex((section) => section.sectionId.toString() === currentSection);
      if (currentIndex > 0) {
        dispatch(setCurrentSection(subjects[currentIndex - 1].sectionId.toString()));
        dispatch(setCurrentQuestion(subjects[currentIndex - 1].questions[0].questionId));
      }
    }
  }, [currentSection, sectionsData, dispatch]);

  // Handle navigation to next question
  const handleNextQuestion = () => {
    const questions = getCurrentSectionQuestions();
    const currentIndex = questions.findIndex((q: any) => q.questionId === currentQuestion);

    if (currentIndex < questions.length - 1) {
      dispatch(setCurrentQuestion(questions[currentIndex + 1].questionId));
    } else {
      // Move to next section if available
      const currentSectionIndex = sectionsData.findIndex((s) => s.sectionId.toString() === currentSection);
      if (currentSectionIndex < sectionsData.length - 1) {
        dispatch(setCurrentSection(sectionsData[currentSectionIndex + 1].sectionId.toString()));
        dispatch(setCurrentQuestion(sectionsData[currentSectionIndex + 1].questions[0].questionId));
      }
    }
  };

  // Handle navigation to previous question
  const handlePrevQuestion = () => {
    const questions = getCurrentSectionQuestions();
    const currentIndex = questions.findIndex((q: any) => q.questionId === currentQuestion);

    if (currentIndex > 0) {
      dispatch(setCurrentQuestion(questions[currentIndex - 1].questionId));
    } else {
      // Move to previous section if available
      const currentSectionIndex = sectionsData.findIndex((s) => s.sectionId.toString() === currentSection);

      if (currentSectionIndex > 0) {
        dispatch(setCurrentSection(sectionsData[currentSectionIndex - 1].sectionId.toString()));
        const prevSectionQuestions = sectionsData[currentSectionIndex - 1].questions;
        dispatch(setCurrentQuestion(prevSectionQuestions[prevSectionQuestions.length - 1].questionId));
      }
    }
    // setSelectedOption('');
    // setSelectedInputValue('');
  };

  // Handle submit test
  const handleSubmitTest = async () => {
    setIsSubmitTest(true);
    if (!userId || !examDetails || !selectedStreamId || !selectedStandardId) return;
    try {
      const savedState = await getTestState(examDetails?.testId);

      if (!savedState) return;
      const submitTestRes = await submitTest(String(userId), savedState.testype_Id, examDetails.testId, selectedStreamId?.id);

      if (submitTestRes.statusCode !== HttpStatus.OK) {
        toast.error(submitTestRes.message || 'Failed to submit test');
        return;
      }

      // Calculate marks
      const marksCalculateRes = await markCalculate(
        String(userId),
        savedState.testype_Id,
        examDetails.testId,
        selectedStreamId?.id,
        selectedStandardId?.id
      );

      if (marksCalculateRes.statusCode !== HttpStatus.CREATED) {
        toast.error(marksCalculateRes.message || 'Failed to calculate marks');
        return;
      }

      //calculate overall response
      const overallCalculateResponse = await overallAnalysisCalculate(
        String(userId),
        selectedStreamId?.id,
        savedState.testype_Id,
        examDetails.testId
      );

      if (overallCalculateResponse.statusCode !== HttpStatus.OK) {
        toast.error(overallCalculateResponse.message || 'Failed to calculate marks');
        return;
      }

      dispatch(setExamDetails(null));
      dispatch(setSectionsList([]));
      dispatch(setAttemptedQuestions([]));
      dispatch(setSelectedSubjects(null));
      dispatch(setCurrentSection(''));
      dispatch(setCurrentQuestion(''));
      clearDB();
      router.push(`test/result/${examDetails?.testId}/${userId}?testTypeId=${examDetails?.testTypeId}`);
      toast.success('Test submitted successfully.');
    } catch (error) {
      toast.error('Submit test failed.');
    } finally {
      setIsSubmitTest(false);
      setShowWarning(false);
      setShowSubmitModal(false);
    }
  };

  useEffect(() => {
    if (!selectedSubject?.id) return;
    const sectionIndex = sectionsData.findIndex((sec) => sec.subjectId === selectedSubject.id);
    const section = sectionsData[sectionIndex];
    if (section) {
      dispatch(setCurrentSection(section.sectionId.toString()));
      dispatch(setCurrentQuestion(section.questions[0].questionId));
    }
  }, [sectionsData, dispatch, selectedSubject?.id]);

  const question = getCurrentQuestion();

  useEffect(() => {
    if (question) {
      const attempts = attemptedQuestions.find((a) => a.questionId === question.questionId);
      if (attempts) {
        setSelectedOption(attempts.ans || '');
        setSelectedInputValue(attempts.ans || '');
        // dispatch(setTimeSpent(attempts.time_taken));
      } else {
        setSelectedOption('');
        setSelectedInputValue('');
      }
    }
  }, [question, attemptedQuestions]);

  const currentSectionData = useMemo(
    () => sectionsData.find((s) => s.sectionId.toString() === currentSection),
    [sectionsData, currentSection]
  );

  const currentQuestionNumber = useMemo(
    () =>
      (currentSectionData &&
        currentQuestion &&
        currentSectionData.questions.findIndex((q: any) => q.questionId === currentQuestion) + 1) ||
      1,
    [currentSectionData, currentQuestion]
  );

  // //bookarks check
  // const hasBookbark = bookmarks.find((b) => b.questionId === question.questionId);

  // Update the getSummaryData function to work with the new structure
  const getSummaryData = useCallback(() => {
    // Initialize counters
    let notVisited = 0;
    let skipped = 0;
    let answered = 0;
    let markedForReview = 0;
    let answeredAndMarkedForReview = 0;

    // Calculate total questions across all sections
    const totalQuestions = sectionsData.reduce((total, section) => total + section.questions.length, 0);

    // Count attempted questions
    const attemptedQuestionIds = new Set();

    // Process each section's attempts
    attemptedQuestions.forEach((attempt) => {
      attemptedQuestionIds.add(attempt.questionId);

      if (attempt.ans === '' && attempt.mark_for_review === 0) {
        skipped++;
      } else if (attempt.ans !== '' && attempt.mark_for_review === 0) {
        answered++;
      } else if (attempt.ans === '' && attempt.mark_for_review === 1) {
        markedForReview++;
      } else if (attempt.ans !== '' && attempt.mark_for_review === 1) {
        answeredAndMarkedForReview++;
      }
    });

    // Calculate not visited (total questions minus attempted questions)
    notVisited = totalQuestions - attemptedQuestionIds.size;

    return {
      notVisited,
      skipped,
      answered,
      markedForReview,
      answeredAndMarkedForReview
    };
  }, [sectionsData, attemptedQuestions]);

  // Timer effect
  useEffect(() => {
    if (loading || !examDetails || remainingTime === null) return;

    if (remainingTime <= 0) return;

    const timer = setInterval(() => {
      setRemainingTime((rt: any) => {
        const updatedTime = rt - 1;
        remainingTimeRef.current = updatedTime;
        return updatedTime;
      });
      setTimeSpent((ts) => ts + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, remainingTime, examDetails]);

  // Auto-submit when time is up
  useEffect(() => {
    if (remainingTime !== null && remainingTime <= 0) {
      // Auto-submit the test when time is up
      toast.success('Time is up! Test submitted automatically.');
      handleSubmitTest();
    }
  }, [remainingTime]);

  // Update server every 5 seconds
  useEffect(() => {
    if (loading || !examDetails || !userId || remainingTimeRef.current !== null) return;

    const interval = setInterval(async () => {
      try {
        if (currentSection && currentQuestion) {
          const payload = {
            test_id: examDetails.testId,
            test_type: examDetails.testTypeId,
            student_id: String(userId),
            stream_id: selectedStreamId?.id,
            attempts: {
              left_time: remainingTimeRef.current ?? 0,
              last_section: currentSection,
              last_ques_id: currentQuestion
            }
          };
          // debugger;
          // console.log('Sending payload:', payload);
          await updateTestEachSecond(payload);
        }
      } catch (error) {
        console.error('Failed to update test state:', error);
        toast.error('Failed to update test state.');
      }
    }, 5000); // Trigger every 5 seconds

    return () => {
      clearInterval(interval);
    };
  }, [loading, examDetails, userId, currentSection, currentQuestion]);

  // to check tab is active or not and clearing the examTimerId
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setShowWarning(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // // Handle warning count for tab switching
  useEffect(() => {
    if (showWarning) {
      if (showWarningCount >= 1) {
        handleSubmitTest();
      }
      setShowWarningCount((prv) => prv + 1);
    }
  }, [showWarning]);

  const handleCloseSubmitModal = useCallback(() => {
    setShowSubmitModal(false);
  }, []);

  //handle the leave test
  const handleLeaveTest = useCallback(async () => {
    if (!examDetails || !userId) return;
    setIsLeaveTestLoading(true);
    try {
      if (currentSection && currentQuestion) {
        const payload = {
          test_id: examDetails.testId,
          test_type: examDetails.testTypeId,
          student_id: String(userId),
          stream_id: selectedStreamId?.id,
          attempts: {
            left_time: remainingTimeRef.current,
            last_section: currentSection,
            last_ques_id: currentQuestion
          }
        };

        const updateResponse = await updateTestEachSecond(payload);

        if (updateResponse.statusCode !== HttpStatus.OK) {
          toast.error('Leave Test Failed');
          return;
        }

        await dispatch(setExamDetails(null));
        await dispatch(setSectionsList([]));
        await dispatch(setAttemptedQuestions([]));
        await dispatch(setSelectedSubjects(null));
        await dispatch(setCurrentSection(''));
        await dispatch(setCurrentQuestion(''));
        await dispatch(setExamStatus([]));
        await clearDB();
      }
    } catch {
      toast.error('Leave Test Failed');
    } finally {
      setIsLeaveTestLoading(false);
    }
  }, [examDetails, userId, currentSection, currentQuestion]);

  const handleBookMarkShow = useCallback(() => {
    const isBookmarked = bookmarkLists.some((item: any) => item.questionId === Number(currentQuestion));
    if (!isBookmarked) {
      setBookmark(true);
    } else {
      setRemoveBookmark(true);
    }
  }, [bookmarkLists, currentQuestion]);

  const isNextQuestionDisabled = useMemo(() => {
    return sectionsData.length > 0 && sectionsData[sectionsData.length - 1].questions.length === currentQuestionNumber;
  }, [sectionsData, currentQuestionNumber]);

  const isPrevQuestionDisabled = useMemo(() => {
    return currentQuestionNumber === 1;
  }, [currentQuestionNumber]);
  return (
    <div className="flex h-screen flex-col bg-white">
      {isMd ? (
        <OEMobileHeader
          startExamTime={remainingTime}
          onLeaveTest={() => setLeaveTest((prev) => !prev)}
          onSectionChange={() => setShowMobileSection(true)}
          onShowSubmitModal={() => setShowSubmitModal(true)}
        />
      ) : (
        <OEExamWebHeader
          startExamTime={remainingTime}
          onLeaveTest={() => setLeaveTest((prev) => !prev)}
          showButton={true}
          examName={examDetails?.name}
        />
      )}
      <Separator className="container" />

      {loading ? (
        <div className="flex min-h-screen items-center justify-center">
          <LucideLoader className="h-5 w-5 text-primary" />
        </div>
      ) : sectionsData && sectionsData.length > 0 ? (
        <div className="container flex-grow overflow-y-auto">
          <div className="my-8 flex">
            <div className={isMd ? 'w-full' : 'w-3/4'} style={{ flexGrow: 1 }}>
              {question && (
                <OEQuestion
                  currentQuestion={question}
                  onReport={() => setReport(true)}
                  onBookmark={handleBookMarkShow}
                  selectedOption={selectedOption}
                  setSelectedOption={setSelectedOption}
                  currentQuestionNumber={currentQuestionNumber}
                  selectedInputValue={selectedInputValue}
                  setSelectedInputValue={(value) => setSelectedInputValue(value)}
                />
              )}
            </div>
            {!isMd && (
              <div className="w-1/3 space-y-4">
                {subjects.length > 0 && (
                  <OESubjectDropdown
                    options={subjects}
                    handleClearOption={() => {
                      setSelectedOption('');
                      setSelectedInputValue('');
                    }}
                    className="h-10 w-full !rounded-lg border-none !bg-[#000080] p-4 text-base font-medium text-white md:text-lg lg:h-12 lg:text-xl"
                    examination={true}
                  />
                )}

                {!isMd && currentSectionData && (
                  <OESections
                    sectionData={currentSectionData}
                    handleNextSection={handleNextSection}
                    handlePrevSection={handlePrevSection}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-grow items-center justify-center">No Questions are available</div>
      )}

      <div className="container mt-auto">
        {isMd ? (
          <OEMobileFooter
            // answerLoader={answerLoader}
            selectedOption={selectedOption || selectedInputValue}
            currentQuestion={currentQuestion}
            updateAttempts={handleUpdateAnswer}
            disableNext={isNextQuestionDisabled}
            disablePrev={isPrevQuestionDisabled}
            handleNextQuestion={handleNextQuestion}
            handlePrevQuestion={handlePrevQuestion}
            handleClearOption={() => handleClearAnswer(question.questionId)}
            isSavingAnswer={isSavingAnswer}
            isSavingReview={isSavingReview}
          />
        ) : (
          <OEWbFooter
            selectedOption={selectedOption || selectedInputValue}
            currentQuestion={currentQuestion}
            currentQuestionNumber={currentQuestionNumber}
            totalQuestionsCount={currentSectionData?.questions.length || 0}
            handleNextQuestion={handleNextQuestion}
            handlePrevQuestion={handlePrevQuestion}
            disableNext={isNextQuestionDisabled}
            disablePrev={isPrevQuestionDisabled}
            updateAttempts={handleUpdateAnswer}
            onShowSubmitModal={() => setShowSubmitModal(true)}
            handleClearOption={() => handleClearAnswer(question.questionId)}
            isSavingAnswer={isSavingAnswer}
            isSavingReview={isSavingReview}
          />
        )}
      </div>
      {showMobileSection && currentSectionData && isMd && (
        <Dialog open={showMobileSection} onOpenChange={setShowMobileSection}>
          <DialogContent
            onOpenAutoFocus={(e) => e.preventDefault()}
            className="!m-0 max-h-[90vh] w-[90%] gap-0 overflow-y-auto !rounded-xl border-none !p-0 md:max-w-[576px]"
            showCloseIcon={false}
          >
            <DialogHeader className="flex flex-row items-center justify-between p-1">
              <DialogTitle>Section</DialogTitle>
              <DialogClose asChild>
                <Button type="button" className="h-7 w-7 rounded-full border border-primary !p-0 font-medium">
                  <Icon icon="heroicons-outline:x-mark" />
                </Button>
              </DialogClose>
              {/* <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription> */}
            </DialogHeader>

            <OESections
              sectionData={currentSectionData}
              handleNextSection={handleNextSection}
              handlePrevSection={handlePrevSection}
              showClose={() => setShowMobileSection(false)}
            />
          </DialogContent>
        </Dialog>
      )}
      {report && question && (
        <FeedbackForm
          questionId={question.questionId}
          userId={userId}
          roleId={role.id}
          isOpen={report}
          onClose={() => setReport(false)}
        />
      )}
      {/* bookmark modal */}
      {bookmark && userId && question && (
        <BookmarkForm
          questionId={question.questionId}
          studentId={userId}
          testType={examDetails?.testTypeId}
          bookmarkTypes={bookmarkTypes}
          selectedBookmarkType={selectedBookmarkType}
          changeBookmarkType={(id: number) => setSelectedBookmarkType(id)}
          isOpen={bookmark}
          onClose={() => setBookmark(false)}
          showCloseButton={false}
        />
      )}

      {/* remove bookmark */}
      {removeBookmark && userId && question && (
        <BookmarkRemoveDialog
          questionId={question.questionId}
          studentId={userId}
          selectedBookmarkType={selectedBookmarkType}
          isOpen={true}
          onClose={() => setRemoveBookmark(false)}
        />
      )}

      {/* leave modal */}
      {leaveTest && (
        <LeaveTestModal
          isOpen={leaveTest}
          onClose={() => setLeaveTest(false)}
          showCloseIcon={false}
          handleLeaveTest={handleLeaveTest}
        />
      )}

      {/* submit modal */}
      {showSubmitModal && (
        <ExamSummary
          loading={isSubmitTest}
          examSummary={getSummaryData()}
          handleSubmit={handleSubmitTest}
          isOpen={showSubmitModal}
          closeModal={handleCloseSubmitModal}
        />
      )}

      {/* Malcious warning  */}
      {showWarning && <MaliciousModal isOpen={true} onClose={() => setShowWarning(false)} />}

      {isLeaveTestLoading && <BackdropLoader isLoading={isLeaveTestLoading} text="" />}
    </div>
  );
};

export default OnlineExaminationComponent;
