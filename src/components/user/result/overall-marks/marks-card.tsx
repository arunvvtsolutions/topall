'use client';
import React from 'react';
import { RadialProgress } from '@/components/common/circle-progress-bar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { useMediaQuery } from '@/hooks/use-media-query';
import OverAllProgress from './overall-progress';
import { useParams, useRouter } from 'next/navigation';
import { ExamResult } from './index';

interface MarksCardProps {
  data: ExamResult | null;
  attemptId?: string;
}
const MarksCard = ({ data, attemptId }: MarksCardProps) => {
  const router = useRouter();
  const { testId, studentId } = useParams();
  const isMobile = useMediaQuery('(min-width: 768px)');

  // Extracting required values from API response
  const totalMarks = data?.totalMark || 0;
  const maxMarks = data?.maxMark || 0;
  const percentage = data?.percentage || 0;
  const subjects = data?.subjects || [];

  const handleAnswerKey = () => {
    const answerKeyPath = `/test/result/answer-key/${testId}/${studentId}`;
    const query = attemptId ? `?attemptId=${attemptId}` : '';
    router.push(`${answerKeyPath}${query}`);
  };

  return (
    <Card className="border border-borderad p-3 pb-6 shadow-none">
      <div className="flex justify-between">
        <CardTitle className="flex items-center gap-1 text-lg font-medium text-B2CAgrayn">
          <Icon icon="solar:clipboard-text-linear" />
          <span className="text-inherit">Marks</span>
        </CardTitle>
        <Button variant="default" color="primary" size="sm" className="font-medium" onClick={handleAnswerKey}>
          Answer Key
          <Icon icon="heroicons:chevron-right" className="text-lg" />
        </Button>
      </div>

      <CardContent className="mt-6 grid grid-cols-1 gap-4 p-0 lg:grid-cols-2">
        <div className="grid grid-cols-2 border-t pt-2 lg:border-r lg:border-t-0 lg:border-borderad">
          <div className="flex items-center justify-center">
            <OverAllProgress value={percentage} color="success" size="lg" rotation="flipped" />
          </div>
          <div className="border-l border-borderad px-4 pt-2 lg:border-l-0">
            <p className="text-center text-base font-medium text-B2Cgray">Marks Scored</p>
            <p className="mt-2 text-center text-xl font-bold text-success">{maxMarks}</p>
            <Separator className="mx-auto my-3 max-w-lg" />
            <p className="text-center text-base font-medium text-B2Cgray">Total Marks</p>
            <p className="mt-2 text-center text-xl font-bold text-primary">{totalMarks}</p>
          </div>
        </div>
        <div className="space-y-4 pl-4">
          <div className="grid grid-cols-3">
            <div className="text-sm font-medium text-B2CAgrayn md:text-base lg:text-base">Subject</div>
            <div className="text-center text-sm font-medium text-B2CAgrayn md:text-base lg:text-base">Marks</div>
            <div className="text-center text-sm font-medium text-B2CAgrayn md:text-base lg:text-base">Percentage</div>
          </div>

          {/* Dynamically render subjects */}
          {subjects.map((subject: any) => (
            <div className="grid grid-cols-3" key={subject.id}>
              <div className="text-sm font-medium text-B2Cgray">{subject.name}</div>
              <div className="text-center text-sm font-semibold text-primary md:text-base">{subject.totalMarks}</div>
              <div className="text-center text-sm font-semibold text-primary md:text-base">{subject.percentage}%</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MarksCard;
