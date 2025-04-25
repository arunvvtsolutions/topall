'use client';
import React, { useEffect, useState } from 'react';
import MarksCard from './marks-card';
import { ScoreCard } from './score-card';
import TimeCard from '../time-taken';
// import { getOverallResult } from '@/utils/api/user/exam-result';
import { useDispatch, useSelector } from '@/store';
import { getOverallResult } from '@/store/slice/user/overall-result';
import { useParams, useSearchParams } from 'next/navigation';

export interface ExamResult {
  totalMark: number;
  maxMark: number;
  percentage: number;
  totalTime: number;
  timeTaken: number;
  avgTimePerQuestion: number;
  accuracy: number;
  totalQuestions: number;
  correctQuestions: string[];
  wrongQuestions: string[];
  leftQuestions: string[];
  subjects: SubjectDetails[];
}

export interface SubjectDetails {
  id: number;
  name: string;
  percentage: number;
  totalMarks: number;
}

const OverallMarks = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const testTypeParams = searchParams.get('testTypeId') as string;
  const attemptId = searchParams.get('attemptId') as string;
  const { studentId, testId } = useParams();
  const selectedStream = useSelector((state) => state.stream.stream);
  const selectedStandard = useSelector((state) => state.stream.standard);
  const overallData = useSelector((state) => state.overAllResult.overallResult);
  const examDetail = useSelector((state) => state.onlineExamination.examDetails);
  const totalQuestions = overallData?.totalQuestions || 0;
  const correctPercentage = overallData?.correctQuestions && (overallData?.correctQuestions.length / totalQuestions) * 100;
  const wrongPercentage = overallData?.wrongQuestions && (overallData?.wrongQuestions.length / totalQuestions) * 100;
  const leftPercentage = overallData?.leftQuestions && (overallData?.leftQuestions.length / totalQuestions) * 100;
  const accuracyPercentage = overallData?.accuracy;
  const testTypeId = testTypeParams ? parseInt(testTypeParams) : 0;

  // console.log('selectedStandard', selectedStandard);
  useEffect(() => {
    if (testTypeId && studentId && testId && selectedStandard?.id && selectedStream) {
      // console.log('examDetail', examDetail);
      const resultPayload = {
        studentId: studentId,
        testType: testTypeId,
        testId: testId,
        streamId: selectedStream?.id || 0,
        standardId: selectedStandard?.id || 0,
        attemptId: attemptId
      };

      dispatch(getOverallResult(resultPayload));
    }
  }, [dispatch, testId, studentId, selectedStandard, selectedStream, testTypeId, attemptId]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="basis-full lg:basis-8/12">
          <MarksCard attemptId={attemptId} data={overallData && overallData} />
        </div>
        <div className="basis-full lg:basis-4/12">
          <TimeCard data={overallData && overallData} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ScoreCard
          score={overallData?.correctQuestions.length}
          percentage={correctPercentage}
          total={totalQuestions}
          color="success"
        />
        <ScoreCard
          score={overallData?.wrongQuestions.length}
          percentage={wrongPercentage}
          total={totalQuestions}
          color="destructive"
        />
        <ScoreCard score={overallData?.leftQuestions.length} percentage={leftPercentage} total={totalQuestions} color="warning" />
        <ScoreCard score={accuracyPercentage} percentage={accuracyPercentage} total={100} color="primary" />
      </div>
    </div>
  );
};

export default OverallMarks;
