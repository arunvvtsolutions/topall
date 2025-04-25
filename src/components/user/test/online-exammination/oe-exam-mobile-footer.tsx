import { LucideLoader } from '@/components/common/LucideLoader';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { useMediaQuery } from '@/hooks/use-media-query';
import { ButtonNames } from '@/types/enum';
import React, { memo } from 'react';

interface OEMobileFooterProps {
  selectedOption: string;
  currentQuestion: string | number;
  handleNextQuestion: () => void;
  handlePrevQuestion: () => void;
  updateAttempts: (questionId: number, optionId: string, isReview: boolean) => void;
  handleClearOption: () => void;
  disablePrev: boolean;
  disableNext: boolean;
  isSavingAnswer: boolean;
  isSavingReview: boolean;
}

const OEMobileFooter: React.FC<OEMobileFooterProps> = ({
  selectedOption,
  currentQuestion,
  handleNextQuestion,
  handlePrevQuestion,
  updateAttempts,
  handleClearOption,
  disablePrev,
  disableNext,
  isSavingAnswer,
  isSavingReview
}) => {
  const isMd = useMediaQuery('(max-width: 640px)');

  return (
    <div className="mb-4 border-t">
      <div className="my-4 flex w-full items-center justify-between">
        <Button
          className="h-auto cursor-pointer rounded-full border border-[#000080] p-1 md:p-2"
          disabled={disablePrev}
          onClick={handlePrevQuestion}
        >
          <Icon icon="quill:arrow-left" className="text-[#000080]" fontSize={18} />
        </Button>
        {isMd && (
          <Button
            variant="default"
            className="h-9 bg-[#000080] text-base font-normal text-white hover:bg-[#000080] hover:text-white sm:h-10 sm:w-auto md:h-11"
            onClick={() => updateAttempts(Number(currentQuestion), selectedOption, true)}
            disabled={isSavingReview}
          >
            {isSavingReview && <LucideLoader />}
            {selectedOption ? ButtonNames.SAVE_AND_MARK_FOR_REVIEW : ButtonNames.MARK_FOR_REVIEW}
          </Button>
        )}

        <Button
          className="h-auto cursor-pointer rounded-full border border-[#000080] p-1 md:p-2"
          disabled={disableNext}
          onClick={handleNextQuestion}
        >
          <Icon icon="quill:arrow-right" className="text-[#000080]" fontSize={18} />
        </Button>
      </div>
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          color="primary"
          className="h-9 hover:bg-white hover:text-[#000080] sm:h-10 md:h-11"
          onClick={handleClearOption}
        >
          {ButtonNames.CLEAR}
        </Button>
        {!isMd && (
          <Button
            variant="default"
            className="h-9 bg-[#000080] text-base font-normal text-white hover:bg-[#000080] hover:text-white sm:h-10 sm:w-auto md:h-11"
            onClick={() => updateAttempts(Number(currentQuestion), selectedOption, true)}
            disabled={isSavingReview}
          >
            {isSavingReview && <LucideLoader />}
            {selectedOption ? ButtonNames.SAVE_AND_MARK_FOR_REVIEW : ButtonNames.MARK_FOR_REVIEW}
          </Button>
        )}

        <Button
          variant="default"
          className="h-9 bg-[#00A86B] text-base font-normal text-white hover:bg-[#00A86B] sm:h-10 md:h-11"
          onClick={() => updateAttempts(Number(currentQuestion), selectedOption, false)}
          disabled={!selectedOption || isSavingAnswer}
        >
          {isSavingAnswer && <LucideLoader />}
          {ButtonNames.SAVE_AND_NEXT}
        </Button>
      </div>
    </div>
  );
};

export default memo(OEMobileFooter);
