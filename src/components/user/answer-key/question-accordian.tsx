'use client';
import React, { memo } from 'react';
import QuestionCard from './question-card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Icon } from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { AnswerKey, QuestionsProps } from '@/types/exams';
import { useMediaQuery } from '@/hooks/use-media-query';
import { getBadgeStyles, getMinutesAndSeconds } from './utils';
import { AnsweredTypes } from '@/types/enum';

interface QuestionAccordianProps {
  qData: AnswerKey;
  onReport: (questionId: number) => void;
  onBookmark: (questionId: number) => void;
  defaultOpen?: boolean; // New prop to control initial state
  value: string; // Unique value for this accordion item
  bookmarks?: any[];
}

const QuestionAccordian = ({ qData, onReport, onBookmark, value, bookmarks }: QuestionAccordianProps) => {
  const isMobile = useMediaQuery('(min-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1280px)');

  const bookmarkedSet = new Set(bookmarks && bookmarks.map((b) => b.questionId));

  return (
    <AccordionItem value={value} className="rounded-md border-none">
      <AccordionTrigger className="border border-borderad bg-white px-4 py-2 text-left !normal-case text-[#4B4B4B]">
        <p className="text-base font-medium uppercase tracking-wide text-B2Cgray lg:text-lg">{qData.sectionName}</p>
        <Icon
          icon={'eva:arrow-down-fill'}
          className="easy-in-out shrink-0 text-xl text-B2Cgray transition-transform duration-200"
        />
      </AccordionTrigger>
      {/* Accordion Content */}
      <AccordionContent className="!m-0 bg-[#FBFBFD]">
        <ScrollArea className="max-h-[650px] overflow-y-auto px-0">
          {qData.questions.map((question, index: number) => (
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

                  {question.status !== AnsweredTypes.LEFT && (
                    <Badge
                      className={`border border-dashed ${getBadgeStyles(question.paceTag as 'Too Fast' | 'Ideal' | 'Overtime')} text-sm font-medium lg:px-4 lg:py-2 lg:text-base`}
                      rounded="md"
                    >
                      {getMinutesAndSeconds(question.timeSpent)} {question.paceTag}
                    </Badge>
                  )}
                </div>
                {question.correctByPercentage > 0 && (
                  <Badge
                    className="hidden border border-success/40 bg-[#00A86B1F] text-sm font-medium text-success lg:flex lg:text-base"
                    rounded="md"
                  >
                    Correct By {question.correctByPercentage.toFixed(2)}%
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
        </ScrollArea>
      </AccordionContent>
    </AccordionItem>
  );
};

export default memo(QuestionAccordian);
