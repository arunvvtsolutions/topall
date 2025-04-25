import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnsweredTypes } from '@/types/enum';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { chartOptions } from './proficiency-analysis-utils';

import dynamic from 'next/dynamic';
import { calculatePercentage } from '../utils';
import { SubjectWiseAnalysis } from '@/types/user/overall-analysis';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const SubjectProficiencyCard = ({ subject }: { subject: SubjectWiseAnalysis }) => {
  const { correct, wrong, left } = calculatePercentage(subject.correct, subject.wrong, subject.left);
  return (
    <Card className="flex h-full flex-col rounded-2xl border !p-2">
      <CardHeader className="py-2">
        <CardTitle className="text-base font-semibold text-[#000080]">{subject.subject}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between">
        <div className="flex !h-full max-h-[90px] w-full justify-center">
          <Chart
            options={{
              ...chartOptions,
              chart: {
                ...chartOptions.chart,
                height: '70%'
              }
            }}
            series={[correct, wrong, left]}
            type="donut"
            height={145}
          />
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#6F6F6F]">{AnsweredTypes.CORRECT}</span>
            <span className="text-sm font-semibold text-[#00A86B]">{correct}%</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#6F6F6F]">{AnsweredTypes.WRONG}</span>
            <span className="text-sm font-semibold text-[#E31717CC]">{wrong}%</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#6F6F6F]">{AnsweredTypes.LEFT}</span>
            <span className="text-sm font-semibold text-[#FFAD43]">{left}%</span>
          </div>
          <Separator />
        </div>
      </CardContent>
    </Card>
  );
};

export default SubjectProficiencyCard;
