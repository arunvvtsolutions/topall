import React, { memo } from 'react';
import { LucideLoader } from '@/components/common/LucideLoader';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { ButtonNames } from '@/types/enum';

interface OEWbFooterProps {
  currentQuestion: string | number;
  currentQuestionNumber: number;
  totalQuestionsCount: number;
  selectedOption: string;
  handleNextQuestion: () => void;
  handlePrevQuestion: () => void;
  disableNext: boolean;
  disablePrev: boolean;
  handleClearOption: () => void;
  updateAttempts: (questionId: number, optionId: string, isReview: boolean) => void;
  onShowSubmitModal: () => void;
  isSavingAnswer: boolean;
  isSavingReview: boolean;
}

const OEWbFooter: React.FC<OEWbFooterProps> = ({
  currentQuestion,
  totalQuestionsCount,
  selectedOption,
  currentQuestionNumber,
  handleNextQuestion,
  handlePrevQuestion,
  disableNext,
  disablePrev,
  handleClearOption,
  updateAttempts,
  onShowSubmitModal,
  isSavingAnswer,
  isSavingReview
}) => {
  // const currentQuesiton = useSelector((state) => state.onlineExamination.currentQuestion);
  return (
    <div className={`flex w-full flex-wrap items-center justify-between pb-8 pt-2`}>
      <Button
        variant="outline"
        color="primary"
        className="text-base font-normal hover:bg-white hover:text-[#000080]"
        onClick={handleClearOption}
      >
        {ButtonNames.CLEAR}
      </Button>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="default"
          color="primary"
          className="gap-2 text-base font-normal text-white"
          onClick={() => updateAttempts(Number(currentQuestion), selectedOption, true)}
          disabled={isSavingReview}
        >
          {isSavingReview && <LucideLoader />}
          {selectedOption ? ButtonNames.SAVE_AND_MARK_FOR_REVIEW : ButtonNames.MARK_FOR_REVIEW}
        </Button>
        <Button
          variant="default"
          color="success"
          className="gap-2 text-base font-normal text-white"
          onClick={() => updateAttempts(Number(currentQuestion), selectedOption, false)}
          disabled={!selectedOption || isSavingAnswer}
        >
          {isSavingAnswer && <LucideLoader />}
          {ButtonNames.SAVE_AND_NEXT}
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          <Button className="rounded-full border border-primary !p-2" onClick={handlePrevQuestion} disabled={disablePrev}>
            <Icon icon="quill:arrow-left" className="text-primary" fontSize={24} />
          </Button>
          <Button className="rounded-full border border-primary !p-2" onClick={handleNextQuestion} disabled={disableNext}>
            <Icon icon="quill:arrow-right" className="text-primary" fontSize={24} />
          </Button>
        </div>
        <span className="text-base font-semibold text-primary">
          {currentQuestionNumber}/<span className="text-xs">{totalQuestionsCount}</span>
        </span>
      </div>
      <Button variant="default" color="destructive" className="text-base font-normal text-white" onClick={onShowSubmitModal}>
        {ButtonNames.SUBMIT_TEST}
      </Button>
    </div>
  );
};

export default memo(OEWbFooter);
