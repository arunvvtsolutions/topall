import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import OverAllProgress from '../../result/overall-marks/overall-progress';

const SubjectAccuracyCard = ({ subject, accuracy }: { subject: string; accuracy: number }) => {
  return (
    <Card className="flex h-full flex-col rounded-2xl border !p-2 shadow-none">
      <CardHeader className="py-2">
        <CardTitle className="text-center text-base font-semibold uppercase text-primary">{subject}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between p-0">
        <div className="flex  items-center justify-center">
          <OverAllProgress value={accuracy} color="success" />
        </div>
      </CardContent>
    </Card>
  );
};

export default SubjectAccuracyCard;
