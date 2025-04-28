import { QuestionsProps } from '@/types/exams';
import React from 'react';
import QuestionCard from './question-card';
import { Badge } from '@/components/ui/badge';
import { useMediaQuery } from '@/hooks/use-media-query';
import { getBadgeStyles, getMinutesAndSeconds } from './utils';
import { AnsweredTypes } from '@/types/enum';

interface QuestionWithoutAccordionProps {
  qData: QuestionsProps[];
  onReport: (questionId: number) => void;
  onBookmark: (questionId: number) => void;
  bookmarks: any[];
}

const QuestionWithoutAccordion: React.FC<QuestionWithoutAccordionProps> = ({ qData, onReport, onBookmark, bookmarks }) => {
  const isMobile = useMediaQuery('(min-width: 768px)');

  const bookmarkedSet = new Set(bookmarks.map((b) => b.questionId));

  return (
    <div>
      {qData.map((question, index) => (
        <React.Fragment key={index}>
          <div className="flex items-stretch justify-between py-4">
            <div className="flex items-stretch gap-2">
              <div className="flex h-8 w-10 items-center justify-center rounded-sm bg-primary text-default lg:h-10 lg:w-12">
                {index + 1}
              </div>
              <Badge
                className="border border-dashed border-primary bg-[#0D068E0A] text-sm font-medium text-primary lg:px-4 lg:py-2 lg:text-base"
                rounded="md"
              >
                {question.questionType === 0
                  ? isMobile
                    ? 'Multiple Choice Questions'
                    : 'MCQ'
                  : question.questionType === 1
                    ? isMobile
                      ? 'Integer Choice Questions'
                      : 'Integer'
                    : null}
              </Badge>

              {question?.status !== AnsweredTypes.LEFT && question?.timeSpent && (
                <Badge
                  className={`border border-dashed ${getBadgeStyles(question.paceTag as 'Too Fast' | 'Ideal' | 'Overtime')} text-sm font-medium lg:px-4 lg:py-2 lg:text-base`}
                  rounded="md"
                >
                  {getMinutesAndSeconds(question.timeSpent)} {question.paceTag}
                </Badge>
              )}
            </div>
            {question?.correctByPercentage > 0 && (
              <Badge
                className="hidden border border-success/40 bg-[#00A86B1F] text-sm font-medium text-success lg:flex lg:text-base"
                rounded="md"
              >
                Correct By {question?.correctByPercentage?.toFixed(2)}%
              </Badge>
            )}
          </div>
          <QuestionCard
            onReport={onReport}
            onBookmark={onBookmark}
            index={index}
            question={question}
            isBookmarked={bookmarkedSet.has(question.questionId)}
          />
        </React.Fragment>
      ))}
    </div>
  );
};

export default QuestionWithoutAccordion;
