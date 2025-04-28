import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import { ChartBar } from './chartbar';
import { formatTime } from '../utils';
import { TimeAnalysis } from '@/types/user/overall-analysis';

const SubjectTimeAnalysisCard = ({ subject }: { subject: TimeAnalysis | any }) => {
  return (
    <Card className="flex h-full flex-col rounded-2xl border shadow-none">
      <CardHeader className="mt-2 py-1 pt-2 text-center">
        <CardTitle className="text-base font-semibold text-[#000080]">{subject.name}</CardTitle>
      </CardHeader>
      <div className="mt-4 w-[100%] px-4">
        <ChartBar correct={subject.correct} wrong={subject.wrong} left={subject.left} />
      </div>
      <CardContent className="mt-8 flex flex-1 flex-col justify-between px-[16px]">
        <div className="space-y-4 text-sm">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-[#222222]">Correct</span>
            <span className="text-sm font-medium text-[#6F6F6F]">{formatTime(subject.correct)}</span>
          </div>
          <div className="my-4 w-full border-t border-dashed border-[#10101026]"></div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-[#222222]">Wrong</span>
            <span className="text-sm font-medium text-[#6F6F6F]">{formatTime(subject.wrong)}</span>
          </div>
          <div className="my-4 w-full border-t border-dashed border-[#10101026]"></div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-[#222222]">Left</span>
            <span className="text-sm font-medium text-[#6F6F6F]">{formatTime(subject.left)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubjectTimeAnalysisCard;
