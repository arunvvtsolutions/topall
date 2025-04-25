import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CardBoxProps {
  title: string;
  secondaryTitle?: string;
  selectOptions?: string[];
  actions?: React.ReactNode;
  children?: React.ReactNode;
  dataTestId?: string;
  textColor?: boolean;
  button?: React.ReactNode;
}

const MainCard: React.FC<CardBoxProps> = ({
  title,
  secondaryTitle,
  selectOptions,
  actions,
  children,
  dataTestId,
  button,
  textColor
}) => {
  return (
    <Card
      className="!border-[rgba(16, 16, 16, 0.15)] ml-3 mr-3 overflow-hidden rounded-lg border-[1px] opacity-100"
      data-test-id={`${dataTestId}-card`}
    >
      <CardHeader className="flex flex-row flex-wrap items-center justify-between p-4">
        <div className="flex flex-col sm:text-left">
          <CardTitle
            className={`font-inter text-base font-medium ${
              textColor ? 'text-[#222222]' : 'text-gray-900'
            } sm:mr-3 sm:text-base md:text-lg lg:text-lg`}
          >
            {title}
          </CardTitle>
          {secondaryTitle && <div className="text-sm text-gray-600">{secondaryTitle}</div>}
        </div>
        <div className="hidden md:flex gap-6">
          {actions && <div className="flex w-auto items-center space-x-4 pb-2">{actions}</div>}
          {button && <div className="flex w-auto items-center space-x-4 pb-2">{button}</div>}
        </div>

        {button && (
          <div className=" md:hidden">
            <div className="flex w-auto items-center">{button}</div>
          </div>
        )}
        {actions && (
          <div className="md:hidden">
            <div className="flex w-auto items-center">{actions}</div>
          </div>
        )}
      </CardHeader>
      <CardContent className="h-full px-0 py-0 text-sm sm:text-base md:text-lg lg:text-xl">{children}</CardContent>
    </Card>
  );
};

export default MainCard;
