'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { useDispatch, useSelector } from '@/store';
import { getTimeAnalysis } from '@/store/slice/user/overall-result';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function TimeAnalysis() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const attemptId = searchParams.get('attemptId') as string;
  const testTypeParams = searchParams.get('testTypeId') as string;
  const studentId = useParams().studentId as string;
  const testId = useParams().testId as string;
  const timeAnalysis = useSelector((state) => state.overAllResult.timeAnalysis);
  const examDetail = useSelector((state) => state.onlineExamination.examDetails);
  const selectedStream = useSelector((state) => state.stream.stream);
  const selectedStandard = useSelector((state) => state.stream.standard);
  const testTypeId = testTypeParams ? parseInt(testTypeParams) : 0;

  useEffect(() => {
    if (studentId && testId && selectedStream?.id && selectedStandard?.id) {
      const timeAnalysisPayload = {
        studentId: studentId,
        testType: testTypeId,
        testId: testId,
        streamId: selectedStream.id,
        standardId: selectedStandard.id,
        attemptId
      };
      dispatch(getTimeAnalysis(timeAnalysisPayload));
    }
  }, [studentId, testId, dispatch, attemptId, selectedStream, selectedStandard]);

  // Function to count correct and wrong answers per pace category
  const getPaceData = (paceTag: string) => {
    if (!timeAnalysis || !Array.isArray(timeAnalysis)) {
      return { correct: 0, wrong: 0 };
    }
    const filtered = timeAnalysis.filter((item: any) => item.paceTag === paceTag);
    return {
      correct: filtered.filter((q: any) => q.status === 'correct').length,
      wrong: filtered.filter((q: any) => q.status === 'wrong').length
    };
  };

  // Updated analysis data with calculated values
  const analysisData = [
    { icon: 'ion:flash-sharp', color: 'text-green-500', label: 'Too Fast', ...getPaceData('Too Fast') },
    { icon: 'si:check-circle-fill', color: 'text-[#FFAD43]', label: 'Ideal', ...getPaceData('Ideal') },
    { icon: 'ic:baseline-info', color: 'text-[#FF4747] transform scale-y-[-1]', label: 'Overtime', ...getPaceData('Overtime') }
  ];

  return (
    <Card className="w-full rounded-[16px]">
      <CardHeader>
        <CardTitle className="text-start text-[16px] font-medium text-[#222222] sm:text-lg md:text-lg lg:text-lg xl:text-lg">
          Time Analysis
        </CardTitle>
      </CardHeader>
      <div className="w-full border-b border-[#10101026] p-0"></div>
      <div className="grid grid-cols-3 justify-start gap-2 px-5 py-4 text-center text-[12px] font-medium text-[#222222] sm:gap-4 sm:text-base md:gap-4 md:text-base lg:gap-4 lg:text-base xl:text-base">
        <div className="text-start">Answering Pace</div>
        <div>Correct</div>
        <div>Wrong</div>
      </div>
      <div className="w-full border-b border-[#10101026] p-0"></div>
      <CardContent className="p-4 sm:px-5 sm:py-3">
        <div className="grid gap-5">
          {analysisData.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-3 items-center gap-2 border-b border-[#10101026] py-3 pb-4 text-center last:border-b-0 sm:gap-4"
            >
              <div className="flex items-center justify-start gap-1 sm:gap-2">
                <Icon
                  icon={item.icon}
                  className={`h-3 w-3 sm:h-5 sm:w-5 md:h-5 md:w-5 lg:h-5 lg:w-5 xl:h-5 xl:w-5 ${item.color} flex-shrink-0`}
                />
                <span className="truncate text-[12px] font-medium text-[#6F6F6F] sm:text-base md:text-base lg:text-base xl:text-base">
                  {item.label}
                </span>
              </div>
              <div className="text-[12px] font-bold text-[#00A86B] sm:text-lg md:text-lg lg:text-lg xl:text-lg">
                {item.correct}
              </div>
              <div className="text-[12px] font-semibold text-[#FF4747] sm:text-lg md:text-lg lg:text-lg xl:text-lg">
                {item.wrong}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
