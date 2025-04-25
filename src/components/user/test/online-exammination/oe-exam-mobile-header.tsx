import React from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import OESubjectDropdown from './oe-exam-subject-dropdown';
import OETimer from './oe-exam-timer';
import { ButtonNames } from '@/types/enum';
import useSubjects from './use-subject';
import { Pause } from 'lucide-react';
import { useSelector } from '@/store';

interface OEMobileHeaderProps {
  onLeaveTest: any;
  startExamTime: number;
  onSectionChange: () => void;
  onShowSubmitModal: () => void;
}

const OEMobileHeader: React.FC<OEMobileHeaderProps> = ({ startExamTime, onLeaveTest, onSectionChange, onShowSubmitModal }) => {
  const isMd = useMediaQuery('(max-width: 640px)');
  const isSm = useMediaQuery('(max-width: 375px)');
  const subjects = useSubjects();
  const selectedSubject = useSelector((state) => state.onlineExamination.selectedSubject);

  // console.log('startExamTime', startExamTime);
  return (
    <div className="mb-2">
      <div className="mb-2">
        {selectedSubject && (
          <OETimer
            startExamTime={startExamTime}
            className={`!h-10 w-full !rounded-none text-default ${startExamTime > 300 ? 'bg-primary' : 'bg-destructive'}`}
            iconClassName="mr-2"
          />
        )}
      </div>
      <div className="flex justify-between px-2 md:container">
        <div className="flex items-center">
          <Button size="md" className="mr-3 flex items-center justify-center" onClick={onLeaveTest}>
            <Icon icon="solar:arrow-left-linear" fontSize={isMd ? 24 : 30} />
          </Button>
          {subjects.length > 0 && (
            <Button size="md" className="rounded-sm border border-primary font-medium" onClick={onSectionChange}>
              {selectedSubject?.name}
            </Button>
          )}
        </div>

        <Button
          size="md"
          variant="default"
          color="destructive"
          className="text-base font-normal text-white"
          onClick={onShowSubmitModal}
        >
          Submit
        </Button>
        {/* {isSm ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" className="text-white" color="destructive">
                  <Icon icon="uil:exit" fontSize={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="rounded-md bg-gray-900 p-2 text-white">{ButtonNames.LEAVE_TEST}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          // <Button onClick={onLeaveTest} variant="default" color="destructive" className="!h-9 !rounded-sm sm:!h-10">
          //   {ButtonNames.LEAVE_TEST}
          // </Button>
          <Button
            onClick={onLeaveTest}
            variant="default"
            className="!rounded-sm bg-primary text-white hover:bg-primary md:!text-base"
          >
            <Pause />
            {ButtonNames.PAUSE_AND_EXIT}
          </Button>
        )} */}
      </div>
    </div>
  );
};

export default OEMobileHeader;
