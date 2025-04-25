import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import clsx from 'clsx';
import { Separator } from '@/components/ui/separator';
import { Button } from '../ui/button';
import { Icon } from '../ui/icon';

interface AnalysisCardProps {
  title: string;
  secondaryTitle?: string;
  children?: React.ReactNode;
  dataTestId: string;
  className?: string;
  actions?: React.ReactNode;
  separatorClassName?: string;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({
  title,
  secondaryTitle,
  children,
  dataTestId,
  className,
  actions,
  separatorClassName
}) => {
  return (
    <Card
      data-test-id={`${dataTestId}-card`}
      className={clsx(
        '!border-[rgba(16, 16, 16, 0.15)] overflow-hidden rounded-2xl border-[1px] bg-default p-6 pt-2 opacity-100 shadow-none',
        className
      )}
    >
      <CardHeader className="flex flex-row flex-nowrap items-center justify-between !p-0">
        <div className="flex flex-col sm:text-left">
          <CardTitle className="font-inter mr-3 text-base font-medium text-[#222222] sm:mr-3 sm:text-base md:text-lg lg:text-lg">
            {title}
          </CardTitle>
          {secondaryTitle && <div className="text-sm text-gray-600">{secondaryTitle}</div>}
        </div>

        {actions && <div className="flex w-auto items-center space-x-4 pb-2">{actions}</div>}
      </CardHeader>
      <Separator className={clsx('mb-4', separatorClassName)} />
      <CardContent className="h-full px-0 py-0 text-sm sm:text-base md:text-lg lg:text-xl">{children}</CardContent>
    </Card>
  );
};
export default AnalysisCard;
