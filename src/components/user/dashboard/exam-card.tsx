import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { Clock } from 'lucide-react';
import React from 'react';
import { ExamTypes } from './upcoming-test';
import { UpcomingTests } from '@/types/user/dashboard';
import { formatDateTimeParts } from '@/lib/utils';

const ExamCard = ({ exam }: { exam: UpcomingTests }) => {
  const { date, time } = formatDateTimeParts(exam.scheduledAt);
  return (
    <Card className="h-full overflow-hidden border border-borderad py-4 shadow-none">
      <CardHeader className="space-y-0 px-4 py-0 text-start">
        <div className="flex items-center justify-between">
          <h2 className="truncate text-sm font-medium uppercase text-black">{exam.name}</h2>
          <Badge className="border-transparent bg-[#F3F4F6] text-B2Cgray" rounded="full">
            Upcoming
          </Badge>
        </div>
      </CardHeader>
      <Separator className="my-4" />
      <CardContent className="mb-2 space-y-3 px-4 py-0">
        <div className="flex items-center gap-2 text-sm text-B2Cgray">
          <Icon icon="solar:calendar-linear" className="mx-2 size-4 text-inherit" />
          <span className="text-inherit">{date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-B2Cgray">
          <Clock className="mx-2 size-4 text-inherit" />
          <span className="text-inherit">{time}</span>
        </div>
        <Separator className="my-4" />
      </CardContent>
      <CardFooter className="flex-wrap gap-2 !p-0 !px-4">
        {exam.subjects.map((subject) => (
          <Badge className="border-transparent bg-[#F8F8FF] text-xs font-medium text-primary" rounded="full">
            {subject.name}
          </Badge>
        ))}
      </CardFooter>
    </Card>
  );
};

export default ExamCard;
