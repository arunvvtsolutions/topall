'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { AnsweredTypes, OEExamItems } from '@/types/enum';
import MathJaxRender from '@/components/MathJaxRender';
import { useMediaQuery } from '@/hooks/use-media-query';
import parse from 'html-react-parser';
import { useState } from 'react';
import Image from 'next/image';
import { QB_IMAGE_URL } from '@/config';

interface QuestionCardProps {
  question: any;
  qCardType?: 'bookmark';
  index: number;
  onReport?: (questionId: number) => void;
  onBookmark?: (questionId: number) => void;
  isBookmarked?: boolean;
}

const QuestionCard = ({ question, qCardType, index, onReport, onBookmark, isBookmarked }: QuestionCardProps) => {
  const isMobile = useMediaQuery('(min-width: 768px)');
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  const handleShowAnswer = () => {
    setShowAnswer((prev) => !prev);
  };

  // Function to determine the border class for each option
  const getBorderClass = (optionNumber: string) => {
    const isUnattempted =
      (!question.selectedOption || question.selectedOption === '') && (question.status === undefined || question.status === null);

    // Case: User attempted the question
    if (question.selectedOption) {
      if (optionNumber === question.selectedOption) {
        return question.selectedOption === question.correctOption ? 'border-success' : 'border-destructive';
      }

      if (optionNumber === question.correctOption) {
        return 'border-success';
      }
    }

    // Case: status is LEFT and selectedOption is empty string
    if (question.status === AnsweredTypes.LEFT && optionNumber === question.correctOption) {
      return 'border-success';
    }

    // Case: Truly unattempted (no selectedOption or status)
    if (isUnattempted && optionNumber === question.correctOption) {
      return 'border-success';
    }

    // Default
    return 'border-borderad';
  };

  return (
    <Card className="border border-borderad p-3 shadow-none">
      <CardTitle className="flex items-center justify-between gap-1 px-0 pt-0 text-lg font-medium text-B2CAgrayn lg:px-4">
        <div>
          {qCardType === 'bookmark' ? (
            <div className="flex items-center gap-2 text-sm sm:text-base md:text-base">
              <div className="font-base flex h-8 w-8 items-center justify-center rounded bg-primary text-white"> {index + 1}</div>
              <div className="rounded-md border border-dashed border-primary bg-[#0D068E0A] px-3 py-1 font-medium text-primary">
                {isMobile ? 'Multiple Choice Questions' : 'MCQ'}
              </div>
            </div>
          ) : (
            <Badge
              className={`px-4 py-2 text-sm font-medium lg:text-base ${
                question.status === AnsweredTypes.CORRECT
                  ? 'border-success/40 bg-[#00A86B1F] text-success'
                  : question.status === AnsweredTypes.WRONG
                    ? 'border-destructive/40 bg-[#FF47471F] text-destructive'
                    : 'border-[#A16207]/40 bg-[#FBF9DF] text-[#A16207]'
              }`}
              rounded="md"
            >
              {question.status === AnsweredTypes.CORRECT ? 'Correct' : question.status === AnsweredTypes.WRONG ? 'Wrong' : 'Left'}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 lg:gap-4">
          <span className="self-center">
            <Badge
              className={`text-sm font-medium lg:px-4 lg:py-1 lg:text-base ${question.difficulty == '1' ? 'border-success/40 bg-[#00A86B1F] text-success' : question.difficulty == '2' ? 'border-[#A16207]/40 bg-[#FBF9DF] text-[#A16207]' : 'border-destructive/40 bg-[#FF47471F] text-destructive'}`}
              rounded="md"
            >
              {question.difficulty == '1' ? 'Easy' : question.difficulty == '2' ? 'Medium' : 'Hard'}
            </Badge>
          </span>
          <div className="flex cursor-pointer flex-col items-center lg:py-1" onClick={() => onReport?.(question.questionId)}>
            <Icon icon="mynaui:danger-waves-solid" className="text-[#FF4747]" fontSize={20} />
            <span className="hidden text-xs text-[#222222] md:mt-1 lg:block">{OEExamItems.REPORT}</span>
          </div>
          <div className="flex cursor-pointer flex-col items-center" onClick={() => onBookmark?.(question.questionId)}>
            <Icon
              icon={isBookmarked ? 'mage:bookmark-plus-fill' : 'mage:bookmark-plus'}
              fontSize={20}
              className={`text-primary transition-transform duration-300 ease-out ${isBookmarked ? 'scale-125' : 'scale-100'} `}
            />
            <span className="hidden text-xs text-[#222222] md:mt-1 lg:block">{OEExamItems.BOOKMARK}</span>
          </div>
        </div>
      </CardTitle>

      <CardContent className="mt-4 p-0 lg:mt-0 lg:p-6">
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-B2CAgrayn lg:text-lg">
            <MathJaxRender data={question.question} />
          </h2>
          {question.questionImage && question.questionImage !== '#' && (
            <div className="mt-4 max-w-full overflow-x-auto pb-2">
              <Image
                src={`${QB_IMAGE_URL}/${question.questionImage}`}
                width={isMobile ? 200 : 150}
                height={isMobile ? 200 : 150}
                alt="Question"
                style={{ maxWidth: '100%!important' }}
              />
            </div>
          )}
          {question.questionType === 0 ? (
            // Multiple choice options (existing code)
            <div className="space-y-4">
              <div
                className={`flex flex-col rounded-md border ${getBorderClass('1')} px-3 py-2 font-normal text-B2Cgray lg:text-base`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-inherit">A.</span>
                  <div className="border-l border-borderad">
                    <p className="border-borderad pl-2 text-inherit">
                      <MathJaxRender data={question.option1} />
                    </p>
                    {question.option1Image && question.option1Image !== '#' && (
                      <div className="mt-4 max-w-full overflow-x-auto pb-2 pl-2">
                        <Image
                          src={`${QB_IMAGE_URL}/${question.option1Image}`}
                          width={isMobile ? 200 : 150}
                          height={isMobile ? 200 : 150}
                          alt="option-img"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div
                className={`flex flex-col rounded-md border ${getBorderClass('2')} px-3 py-2 font-normal text-B2Cgray lg:text-base`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-inherit">B.</span>
                  <div className="border-l border-borderad">
                    <p className="border-borderad pl-2 text-inherit">
                      <MathJaxRender data={question.option2} />
                    </p>
                    {question.option2Image && question.option2Image !== '#' && (
                      <div className="mt-4 max-w-full overflow-x-auto pb-2 pl-2">
                        <Image
                          src={`${QB_IMAGE_URL}/${question.option2Image}`}
                          width={isMobile ? 200 : 150}
                          height={isMobile ? 200 : 150}
                          alt="option-img"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div
                className={`flex flex-col rounded-md border ${getBorderClass('3')} px-3 py-2 font-normal text-B2Cgray lg:text-base`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-inherit">C.</span>
                  <div className="border-l border-borderad">
                    <p className="border-borderad pl-2 text-inherit">
                      <MathJaxRender data={question.option3} />
                    </p>
                    {question.option3Image && question.option3Image !== '#' && (
                      <div className="mt-4 max-w-full overflow-x-auto pb-2 pl-2">
                        <Image
                          src={`${QB_IMAGE_URL}/${question.option3Image}`}
                          width={isMobile ? 200 : 150}
                          height={isMobile ? 200 : 150}
                          alt="option-img"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div
                className={`flex flex-col rounded-md border ${getBorderClass('4')} px-3 py-2 font-normal text-B2Cgray lg:text-base`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-inherit">D.</span>
                  <div className="border-l border-borderad">
                    <p className="border-borderad pl-2 text-inherit">
                      <MathJaxRender data={question.option4} />
                    </p>
                    {question.option4Image && question.option4Image !== '#' && (
                      <div className="mt-4 max-w-full overflow-x-auto pb-2 pl-2">
                        <Image
                          src={`${QB_IMAGE_URL}/${question.option4Image}`}
                          width={isMobile ? 200 : 150}
                          height={isMobile ? 200 : 150}
                          alt="option-img"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Integer type question (new code)
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                {question.status !== 'left' && (
                  <div
                    className={`rounded-md ${question.status === 'correct' ? 'border-primary' : 'border-destructive'} border px-4 py-2`}
                  >
                    <span
                      className={`text-sm font-medium ${question.status === 'correct' ? 'text-primary' : 'text-destructive'} lg:text-base`}
                    >
                      Your Answer : {question.option1 || '-'}
                    </span>
                  </div>
                )}
                <div className="bg-success/3 rounded-md border border-success px-4 py-2">
                  <span className="text-sm font-medium text-success lg:text-base">Correct Answer : {question.correctOption}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-0 lg:px-6">
        <div className="space-y-2 pt-2 lg:pt-0">
          <p className="text-sm font-semibold text-B2CAgrayn lg:text-base">
            Chapter:<span className="pl-1 text-sm font-medium text-B2Cgray lg:text-base">{question.chapterName}</span>
          </p>
          <p className="text-sm font-semibold text-B2CAgrayn lg:text-base">
            Concept:<span className="pl-1 text-sm font-medium text-B2Cgray lg:text-base">{question.conceptName}</span>
          </p>
          <div className="flex items-center">
            <p className="text-sm font-semibold text-B2CAgrayn lg:text-base">Explanation:</p>
            <Button
              variant="default"
              size="icon"
              className="transform text-B2CAgray"
              onClick={handleShowAnswer}
              aria-label={showAnswer ? 'Hide Answer' : 'Show Answer'}
            >
              <Icon icon={showAnswer ? 'ant-design:eye-filled' : 'ant-design:eye-invisible-filled'} fontSize={22} />
            </Button>
          </div>
          {showAnswer && (
            <div>
              <p className="text-sm text-B2Cgray lg:text-base">
                <MathJaxRender data={question.explanation} />
              </p>
              {question.explanationImage && question.explanationImage !== '#' && (
                <div className="mt-4 max-w-full overflow-x-auto pb-2 pl-2">
                  <Image
                    src={`${QB_IMAGE_URL}/${question.explanationImage}`}
                    width={isMobile ? 200 : 150}
                    height={isMobile ? 200 : 150}
                    alt="option-img"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default QuestionCard;
