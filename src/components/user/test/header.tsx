import React, { memo } from 'react';
import Logo from './logo';
import { Button } from '@/components/ui/button';
import OETimer from './online-exammination/oe-exam-timer';
import { ButtonNames } from '@/types/enum';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Pause } from 'lucide-react';
import { useSelector } from '@/store';

interface OEExamWebHeaderProps {
  showButton: boolean;
  onLeaveTest?: any;
  examName?: string;
  startExamTime: number;
}

const OEExamWebHeader: React.FC<OEExamWebHeaderProps> = ({ showButton, onLeaveTest, examName, startExamTime }) => {
  const isMd = useMediaQuery('(max-width: 1402px)');
  return (
    <div className="container mx-auto flex w-full items-center justify-between px-0 py-4">
      <div className="hidden items-center gap-2 sm:flex">
        <Logo />
      </div>
      <div className="flex-1">
        {examName && (
          <h4
            className={`text-center text-base font-semibold text-[#222222] sm:pr-28 sm:text-lg md:pr-28 md:text-xl ${showButton ? 'lg:pr-0' : 'lg:pr-36'} lg:text-2xl`}
          >
            {examName}
          </h4>
        )}
      </div>
      {showButton && (
        <div className={`${isMd ? 'mr-2' : 'mr-0'} flex items-center gap-3`}>
          {startExamTime > 0 && (
            <OETimer
              iconClassName={`mr-1 text-${startExamTime > 300 ? 'primary' : 'destructive'}`}
              timerClassName={'text-lg text-B2CAgrayn'}
              className={`border !px-4 border-${startExamTime > 300 ? 'primary' : 'destructive'}`}
              startExamTime={startExamTime}
            />
          )}

          <Button
            onClick={onLeaveTest}
            variant="default"
            className="!rounded-sm bg-primary !text-base text-white hover:bg-primary"
          >
            <Pause />
            {ButtonNames.PAUSE_AND_EXIT}
          </Button>
        </div>
      )}
    </div>
  );
};

export default memo(OEExamWebHeader);
