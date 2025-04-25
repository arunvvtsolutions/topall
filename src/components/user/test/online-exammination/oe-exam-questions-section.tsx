'use client';
import React, { memo, useEffect, useState } from 'react';
import { Icon } from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { useMediaQuery } from '@/hooks/use-media-query';
import OEQuestions from './oe-exam-question';
import OEQuestionOptions from './oe-exam-question-options';
import { OEExamItems } from '@/types/enum';
import { CurrentAttempt, Question } from '@/types/online-exams';
import { useDispatch, useSelector } from '@/store';
import { Button } from '@/components/ui/button';
import { BackdropLoader } from '@/components/backdrop-loader';
import { getBookmarks } from '@/store/slice/user/bookmarks';
import IntegerKeybord from './integer-keybord';

interface OEQuestionSectionProps {
  currentQuestion: Question;
  onReport: any;
  onBookmark: any;
  currentQuestionNumber: number;
  selectedOption: string;
  setSelectedOption: (value: string) => void;
  setSelectedInputValue: (value: string) => void;
  selectedInputValue: string;
}

const OEQuestionSection: React.FC<OEQuestionSectionProps> = ({
  currentQuestionNumber,
  onReport,
  onBookmark,
  selectedOption,
  setSelectedOption,
  selectedInputValue,
  setSelectedInputValue,
  currentQuestion
}) => {
  const bookmarks = useSelector((state) => state.bookmarks.bookMarkLists);
  const currentqId = useSelector((state) => state.onlineExamination.currentQuestion);
  const isMd = useMediaQuery('(max-width: 1232px)');
  const [refreshLoading, setRefreshLoading] = useState(false);

  const handleOptionSelect = (value: string) => {
    setSelectedOption(value);
  };

  const handleMathJaxRender = () => {
    setRefreshLoading(false);
  };

  useEffect(() => {
    if (refreshLoading) {
      const timer = setTimeout(() => handleMathJaxRender(), 1000);
      return () => clearTimeout(timer);
    }
  }, [refreshLoading]);

  const isBookmarked = bookmarks.some((b: any) => b.questionId === Number(currentqId));

  return (
    <div className={`${isMd ? 'pr-0' : 'pr-10'}`}>
      <div className="mb-4 flex w-full flex-wrap items-center justify-between md:mb-6 lg:mb-8">
        <div className="flex items-center gap-4">
          <span className="flex size-8 items-center justify-center rounded-sm bg-[#000080] font-medium text-white sm:text-base md:size-10 md:text-lg md:font-semibold lg:size-12 lg:text-xl">
            {currentQuestionNumber}
          </span>
          {!isMd && (
            <Card className="mr-2 hidden h-12 items-center rounded-sm border border-dashed border-primary bg-[#00008008] px-2 md:flex">
              <h3 className="text-sm font-medium text-primary sm:text-base md:text-lg">
                {currentQuestion.questionType ? OEExamItems.INTEGER_QUESTIONS : OEExamItems.MULTIPLE_CHOICE_QUESTIONS}
              </h3>
            </Card>
          )}
        </div>
        <div className="flex items-center">
          <Button onClick={onReport} className="flex cursor-pointer flex-col items-center">
            <Icon icon="mynaui:danger-waves-solid" className="text-[#FF4747]" fontSize={24} />
            <span className="text-xs text-[#222222] md:mt-1">{OEExamItems.REPORT}</span>
          </Button>
          <Button onClick={onBookmark} className="flex cursor-pointer flex-col items-center">
            <Icon
              icon={isBookmarked ? 'mynaui:bookmark-plus-solid' : 'mynaui:bookmark-plus'}
              className={isBookmarked ? 'text-primary' : 'text-[#6F6F6F]'}
              fontSize={24}
            />
            <span className="text-xs text-[#222222] md:mt-1">{OEExamItems.BOOKMARK}</span>
          </Button>
          <Button className="flex cursor-pointer flex-col items-center" onClick={() => setRefreshLoading(true)}>
            <Icon icon="mage:refresh" className="text-[#6F6F6F]" fontSize={24} />
            <span className="text-xs text-[#222222] md:mt-1">{OEExamItems.REFRESH}</span>
          </Button>
        </div>
      </div>
      <div>
        <OEQuestions question={currentQuestion?.question} questionImage={currentQuestion?.questionImage} />
      </div>
      {currentQuestion.options ? (
        currentQuestion.questionType !== 1 ? (
          currentQuestion.options.map((option, index) => (
            <OEQuestionOptions
              key={option.optionId}
              index={index}
              option={option}
              isSelectOption={selectedOption === option.optionId}
              onOptionSelect={handleOptionSelect}
            />
          ))
        ) : (
          <IntegerKeybord value={selectedInputValue} setValue={setSelectedInputValue} />
        )
      ) : null}
      {refreshLoading && <BackdropLoader isLoading={refreshLoading} />}
    </div>
  );
};

export default memo(OEQuestionSection);
