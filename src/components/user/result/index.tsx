'use client';
import React, { use, useEffect, useState } from 'react';
import OverAllMarksCard from './overall-marks/marks-card';
import ResultHeader from './result-header';
import { Separator } from '@/components/ui/separator';
import OverallMarks from './overall-marks';
import ChapterWiseAnalysis, { ChapterwiseResultProps } from './chapter-wise-analysis/chapter-wise-analysis';
import TimeAnalysis from './time-analysis';
import SubjectWiseMarks, { SubjectData, subjectwiseResultApiProps } from './subject-wisemarks/subject-wise-marks';
import Leaderboard from './leaderboard';
import DifficultyPerformance from './difficulty-wise-analysis';
// import SubjectWiseMarks from './subject-wisemarks';
import ConceptWiseAnalysis, { ConceptwiseResultProps } from './concept-wish-analysis';
import { useSession } from 'next-auth/react';
import { getChapterwiseResultApi, getConceptwiseResultApi, getSubjectwiseResultApi } from '@/utils/api/examination/result';
import { useDispatch, useSelector } from '@/store';
import {
  getChapterWiseDetails,
  getConceptWiseDetails,
  getExamDetails,
  getGenerateTestDetails
} from '@/store/slice/onlineExamSlice';
import { useSearchParams } from 'next/navigation';
import { CHAPTER_WISE_TEST, CONCEPT_WISE_TEST, GENERATE_TEST } from '@/types/constants';
import { getLeaderboard } from '@/store/slice/user/overall-result';
import { toast } from 'sonner';

const ExamResults = ({ testId }: { testId: number }) => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const attemptId = searchParams.get('attemptId') as string;
  const testTypeParams = searchParams.get('testTypeId') as string;
  const userId = useSelector((state) => state.userProfile.userId);
  const selectedStream = useSelector((state) => state.stream.stream);
  const selectedStandard = useSelector((state) => state.stream.standard);
  const examDetails = useSelector((state) => state.onlineExamination.examDetails);

  const [subjectwiseResult, setSubjectwiseResult] = useState<subjectwiseResultApiProps[]>([]);
  const [chapterwiseResult, setChapterwiseResult] = useState<ChapterwiseResultProps[]>([]);
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [conceptwiseResult, setConceptwiseResult] = useState<ConceptwiseResultProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const testTypeId = testTypeParams ? parseInt(testTypeParams) : 0;

  const isChapterWise = testTypeId === CHAPTER_WISE_TEST;
  const isConceptWise = testTypeId === CONCEPT_WISE_TEST;
  const isGeneratedTest = testTypeId === GENERATE_TEST;

  // // Fetch exam details
  useEffect(() => {
    if (!testId || !testTypeId) return;
    if (isChapterWise) {
      dispatch(getChapterWiseDetails(String(testId)));
    } else if (isConceptWise) {
      // dispatch(getConceptWiseDetails(userId, String(testId)));
    } else if (isGeneratedTest) {
      dispatch(getGenerateTestDetails(String(testId)));
    } else {
      dispatch(getExamDetails(String(testId)));
    }
  }, [testId, testTypeId]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!userId || !testTypeId || !testId || !selectedStream?.id || !selectedStandard?.id) return;

      setIsLoading(true);
      try {
        const subjectwiseResultResponse = await getSubjectwiseResultApi(
          userId,
          testTypeId,
          testId,
          selectedStream?.id,
          selectedStandard?.id,
          attemptId
        );

        const chapterwiseResultResponse = await getChapterwiseResultApi(
          userId,
          testTypeId,
          testId,
          selectedStream?.id,
          selectedStandard?.id,
          attemptId
        );

        await dispatch(getLeaderboard(testId, selectedStream?.id, testTypeId, userId));

        if (subjectwiseResultResponse.statusCode !== 404) {
          setSubjectwiseResult(subjectwiseResultResponse.data);
          setSubjects(subjectwiseResultResponse.data.map((sub) => sub.subjectData));
        }

        if (chapterwiseResultResponse.statusCode !== 404) {
          setChapterwiseResult(chapterwiseResultResponse);
        }

        if (!isConceptWise) {
          const conceptwiseResultResponse = await getConceptwiseResultApi(
            userId,
            testTypeId,
            testId,
            selectedStream?.id,
            selectedStandard?.id,
            attemptId
          );

          if (conceptwiseResultResponse.statusCode !== 404) {
            setConceptwiseResult(conceptwiseResultResponse);
          }
        }
      } catch (error) {
        console.error(error);
        toast.error('Error fetching results');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [userId, selectedStream, selectedStandard, attemptId, testTypeId, testId]);

  return (
    <div className="space-y-4 pb-10">
      <ResultHeader />
      <Separator className="!mt-0 bg-borderad" />
      <h2 className="pt-4 text-base font-semibold text-B2CAgrayn lg:text-2xl">
        Well Done! <span className="font-normal">Your result is here </span>
        {examDetails?.name && <span className="text-success">{examDetails?.name}</span>}
      </h2>
      <div className="mb-8 flex w-full">{/* <ChapterWiseAnalysis /> */}</div>
      <OverallMarks />

      {!isChapterWise && !isConceptWise && (
        <>
          <Leaderboard isLoading={isLoading} />
          <SubjectWiseMarks sectionData={subjectwiseResult} subjectData={subjects} isLoading={isLoading} />
          <ChapterWiseAnalysis isLoading={isLoading} chapterwiseResult={chapterwiseResult} subjectData={subjects} />
        </>
      )}

      {!isConceptWise && (
        <ConceptWiseAnalysis
          isLoading={isLoading}
          subjectData={subjects}
          conceptwiseData={conceptwiseResult}
          chapterwiseResult={chapterwiseResult}
        />
      )}

      <div className={`mb-8 grid grid-cols-1 gap-5 lg:grid-cols-2`}>
        <DifficultyPerformance />
        <TimeAnalysis />
      </div>
    </div>
  );
};

export default ExamResults;
