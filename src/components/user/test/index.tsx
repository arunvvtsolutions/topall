'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import TestInstructions from './instructions';
import OnlineExaminationComponent from './online-exammination';
import { OnlineExamination } from '@/types/online-exams';
import { useDispatch, useSelector } from '@/store';
import {
  getChapterWiseDetails,
  getConceptWiseDetails,
  getExamDetails,
  getExamStatus,
  getGenerateTestDetails
} from '@/store/slice/onlineExamSlice';
import { toast } from 'sonner';
import { TosterMessages } from '@/types/enum';
import { LucideLoader } from '@/components/common/LucideLoader';
import { getUserProfile } from '@/store/slice/user/userProfileSlice';
import { useSession } from 'next-auth/react';
import MaliciousModal from '@/components/test/malicious-activities';
import { decryptId } from '@/utils/crypto';
import { getTestState, initializeTestState, saveTestState } from '@/services/indexed-db';
import { ALL_INDIA_MOCK_TEST, CHAPTER_WISE_TEST, CONCEPT_WISE_TEST, GENERATE_TEST, PREVIOUS_YEAR_TEST } from '@/types/constants';
// import { saveQuestions } from '@/services/indexed-db';

const OEExamLandingPage = () => {
  const searchParams = useSearchParams();
  const { data } = useSession();
  const dispatch = useDispatch();
  const encryptedIdParams = searchParams.get('id') as string;
  const userProfile = useSelector((state) => state.userProfile);
  const examDetails = useSelector((state) => state.onlineExamination.examDetails);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [onlineCurrentView, setOnlineCurrentView] = useState<OnlineExamination.INSTRUCTION | OnlineExamination.EXAM | false>(
    false
  );

  const testId = decryptId(decodeURIComponent(encryptedIdParams));
  const requestFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
  }, []);

  // Load user profile
  useEffect(() => {
    // Load user profile if session exists
    if (data?.user && data?.user?.mobileNumber) {
      getUserProfile(data?.user?.mobileNumber || '');
    }
  }, [data?.user?.mobileNumber, dispatch]);

  // Load test state and details
  useEffect(() => {
    const loadTestState = async () => {
      if (!testId) {
        setIsLoading(false);
        setError(TosterMessages.SOMETHING_WENT_WRONG);
        return;
      }

      try {
        // Get or initialize test state
        let testState = await getTestState(testId);

        if (!testState) {
          // Initialize with test type from URL
          await initializeTestState(testId, { testype_Id: testState.testype_Id });
          testState = await getTestState(testId);
        }

        // Set current view from stored state
        if (testState?.onlineCurrentView) {
          setOnlineCurrentView(testState.onlineCurrentView);
        }

        // Load test details based on test type
        if (testState?.testype_Id) {
          switch (testState.testype_Id) {
            case CHAPTER_WISE_TEST:
              await dispatch(getChapterWiseDetails(String(testId)));
              break;
            case CONCEPT_WISE_TEST:
              if (testState.studentId && testState.streamId && testState.subjectId && testState.chapterId && testState.topicId) {
                await dispatch(
                  getConceptWiseDetails(
                    testState.studentId,
                    testState.streamId,
                    testState.subjectId,
                    testState.chapterId,
                    testState.topicId
                  )
                );
              }
              break;
            case GENERATE_TEST:
              await dispatch(getGenerateTestDetails(String(testId)));
              break;
            default:
              await dispatch(getExamDetails(String(testId)));
          }
        }
      } catch (error) {
        console.error('Error loading test state:', error);
        toast.error(TosterMessages.SOMETHING_WENT_WRONG);
        setError(TosterMessages.SOMETHING_WENT_WRONG);
      } finally {
        setIsLoading(false);
      }
    };

    setIsLoading(true);
    loadTestState();
  }, [testId, dispatch]);

  const handleContinue = useCallback(
    async (type: OnlineExamination.INSTRUCTION | OnlineExamination.EXAM | false) => {
      try {
        const currentTestState = await getTestState(testId);
        // Update test state with new view
        await saveTestState(testId, {
          ...currentTestState,
          onlineCurrentView: type
        });

        // Update local state
        setOnlineCurrentView(type);
        // Request fullscreen for exam mode
        if (type === OnlineExamination.EXAM) {
          requestFullscreen();
        }
      } catch (error) {
        console.error('Error in handleContinue:', error);
        toast.error(TosterMessages.SOMETHING_WENT_WRONG);
      }
    },
    [userProfile, examDetails, testId]
  );

  // debugger;
  // Render loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-default">
        <LucideLoader className="h-5 w-5 text-primary" />
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="max-w-md rounded-lg border border-red-200 bg-red-50 p-6">
          <h2 className="mb-2 text-xl font-bold text-red-700">Error</h2>
          <p className="text-red-600">{error}</p>
          <button className="mt-4 rounded-md bg-primary px-4 py-2 text-white" onClick={() => window.history.back()}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {onlineCurrentView === OnlineExamination.EXAM ? (
        <OnlineExaminationComponent />
      ) : (
        <TestInstructions onContinue={handleContinue} />
      )}
    </>
  );
};

export default OEExamLandingPage;
