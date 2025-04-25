'use client';
import React, { CSSProperties, memo, useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react'; // Import Iconify Icon component
import { useMediaQuery } from '@/hooks/use-media-query';
import { QuestionsProps } from '@/types/exams';
import MathJaxRender from '@/components/MathJaxRender';
import Image from 'next/image';
import StatsBadge from './stats-badge';
import ActionButtons from './action-buttons';
import Option from './options';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { QB_IMAGE_URL } from '@/config';
import { toast } from 'sonner';
import { TosterMessages } from '@/types/enum';

interface IQuestionCard {
  index: number;
  questionId: number;
  questionData: QuestionsProps;
  summaryTitle?: string;
  isSelected?: boolean;
  handleSelectQues?: (id: number) => void;
  onShowDelete?: (id: number) => void;
  onShowUsageHistory?: (id: number) => void;
  onReportFeedback?: (id: number) => void;
  showDraggable?: boolean;
  isDragged?: boolean;
  maximumQuestionExceeds?: boolean;
  showDelete?: boolean;
  published?: boolean;
}

const QuestionCard = ({
  index,
  questionId,
  questionData,
  summaryTitle,
  isSelected,
  handleSelectQues,
  onShowDelete,
  onShowUsageHistory,
  onReportFeedback,
  showDraggable = false,
  isDragged,
  maximumQuestionExceeds,
  showDelete = true,
  published
}: IQuestionCard) => {
  const {
    question,
    questionImage,
    option1,
    option2,
    option3,
    option4,
    option1Image,
    option2Image,
    option3Image,
    option4Image,
    solution,
    solutionImage,
    correctOption,
    usageHistory,
    difficulty,
    correctAttempt,
    attemptBy,
    questionType
  } = questionData;
  const [expanded, setExpanded] = useState<boolean>(false);
  const isMobile = useMediaQuery('(min-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1280px)');

  const { isDragging, attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: questionId });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? '0.5' : '1',
    boxShadow: isDragging ? 'rgba(0, 0, 0, 0.15) 0px 5px 15px 0px' : 'none'
  };

  //expand handler
  const handleExpand = useCallback(
    (e: React.SyntheticEvent) => {
      e.stopPropagation();
      setExpanded(!expanded);
    },
    [expanded]
  );

  //delete handler
  const handleDelete = useCallback(
    (e: React.SyntheticEvent) => {
      e.stopPropagation();
      onShowDelete && onShowDelete(questionId);
    },
    [onShowDelete, questionId]
  );

  //history handler
  const handleHistory = useCallback(
    (e: React.SyntheticEvent) => {
      e.stopPropagation();
      onShowUsageHistory && onShowUsageHistory(questionId);
    },
    [onShowUsageHistory, questionId]
  );

  //history handler
  const handleReport = useCallback(
    (e: React.SyntheticEvent) => {
      e.stopPropagation();
      onReportFeedback && onReportFeedback(questionId);
    },
    [onReportFeedback, questionId]
  );

  const handleSelectQuestions = useCallback(
    (e: React.SyntheticEvent) => {
      e.stopPropagation();
      if (!isSelected && maximumQuestionExceeds) toast.error(TosterMessages.ADMIN_QUESTION_LIMIT_EXCEEDS);
      handleSelectQues && handleSelectQues(questionId);
    },
    [handleSelectQues, questionId, isSelected, maximumQuestionExceeds]
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex w-full rounded-md bg-default ${isSelected ? 'border-2 border-primary' : 'border border-default-200'} ${maximumQuestionExceeds && !isSelected && 'hover:boder-2 hover:border-destructive'}`}
    >
      {isMobile && showDraggable && (
        <div className="min-w-0.5 self-center p-2">
          <Button size="icon" className={isDragged ? 'cursor-grabbing' : 'cursor-grab'} {...attributes} {...listeners}>
            <Icon icon={'material-symbols:drag-indicator'} className="text-2xl text-primary transition-all" />
          </Button>
        </div>
      )}

      <div
        className={`h-auto w-full cursor-pointer p-2 ${showDraggable ? 'border-l' : 'border-none'}`}
        onClick={(e) => handleSelectQuestions(e)}
      >
        <div className="flex gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-default-200 md:h-10 md:w-10">
            <p className="text-sm font-medium md:text-base">{index}</p>
          </span>
          <div className="flex flex-1 flex-col gap-y-4">
            <div>
              {question && (
                <p className="text-sm font-medium md:text-base">
                  <MathJaxRender data={question} />
                </p>
              )}

              {questionImage && questionImage !== '#' && (
                <div className="my-2 max-w-full overflow-x-auto pb-2">
                  <Image
                    src={`${QB_IMAGE_URL}/${questionImage}`}
                    width={100}
                    height={100}
                    alt="Question"
                    style={{ maxWidth: '100%!important' }}
                  />
                </div>
              )}
            </div>
            {questionType == 1 ? (
              <h4 className='text:primary'>Answer : {correctOption === '1'?option1:""}</h4>
            ) : (
              <div className="flow flex flex-wrap gap-2">
                <Option letter="A" isCorrect={correctOption === '1'} text={option1} image={option1Image} />
                <Option letter="B" isCorrect={correctOption === '2'} text={option2} image={option2Image} />
                <Option letter="C" isCorrect={correctOption === '3'} text={option3} image={option3Image} />
                <Option letter="D" isCorrect={correctOption === '4'} text={option4} image={option4Image} />
              </div>
            )}
          </div>

          <div className="h-auto flex-none md:flex-initial">
            <div className="flex h-full flex-col items-end justify-between">
              <div className="flex flex-nowrap items-center gap-2">
                {isTablet && (
                  <ActionButtons
                    isTablet={isTablet}
                    usageHistory={usageHistory}
                    onDelete={handleDelete}
                    onHistory={handleHistory}
                    onReport={handleReport}
                    showDelete={showDelete}
                    published={published}
                  />
                )}
                <Button size="icon" rounded="full" onClick={(e) => handleExpand(e)} data-test-id="expand-btn">
                  <Icon
                    icon={expanded ? 'ic:round-arrow-drop-up' : 'ic:round-arrow-drop-down'}
                    className="h-10 w-10 shrink-0 transition-transform duration-200 ease-in-out"
                  />
                </Button>
              </div>
              {isTablet && (
                <StatsBadge
                  questionId={questionId}
                  correctAttempt={correctAttempt}
                  attemptBy={attemptBy}
                  difficulty={difficulty}
                  isTablet={isTablet}
                />
              )}
            </div>
          </div>
        </div>
        {!isTablet && (
          <div className="mt-3 w-full flex-1">
            <div className="flex h-full flex-col items-end justify-between gap-y-2">
              <StatsBadge
                questionId={questionId}
                correctAttempt={correctAttempt}
                attemptBy={attemptBy}
                difficulty={difficulty}
                isTablet={isTablet}
              />
              <div className="item-center flex flex-nowrap gap-2">
                <ActionButtons
                  isTablet={isDesktop}
                  usageHistory={usageHistory}
                  onDelete={handleDelete}
                  onHistory={handleHistory}
                  onReport={handleReport}
                  showDelete={showDelete}
                />
              </div>
            </div>
          </div>
        )}
        <div className={`overflow-hidden transition-all duration-200 ease-in-out ${expanded ? 'block' : 'hidden'}`}>
          <div className="py-5 pl-8 md:pl-12">
            <div className="rounded-md border border-default-200 p-5">
              <p className="text-sm font-bold md:text-base">
                {summaryTitle}: <br />
                {solution && (
                  <span className="text-sm font-medium text-ButtonC md:text-base">
                    <MathJaxRender data={solution} />
                  </span>
                )}
              </p>

              {solutionImage && solutionImage !== '#' && (
                <Image
                  src={`${QB_IMAGE_URL}/${solutionImage}`}
                  width={100}
                  height={100}
                  style={{ maxWidth: '100%!important' }}
                  alt="Solution"
                  className={questionImage}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(QuestionCard);
