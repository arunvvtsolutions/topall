import { Icon } from '@/components/ui/icon';
import React, { memo, use } from 'react';
import { Card } from '@/components/ui/card';
import { OEExamItems } from '@/types/enum';
import OEQuestionNumber from './oe-exam-question-number';
import { useMediaQuery } from '@/hooks/use-media-query';
import clsx from 'clsx';
import { useDispatch, useSelector } from '@/store';
import { CurrentAttempt, ExamSecBtnType, Question, SectionData } from '@/types/online-exams';
import { Button } from '@/components/ui/button';
import { setCurrentQuestion } from '@/store/slice/onlineExamSlice';

interface OEQuestionSectionProps {
  sectionData: SectionData;
  showClose?: () => void;
  className?: string;
  handleNextSection: () => void;
  handlePrevSection: () => void;
}

const OESections: React.FC<OEQuestionSectionProps> = ({
  sectionData,
  showClose,
  className,
  handleNextSection,
  handlePrevSection
}) => {
  const dispatch = useDispatch();
  const isMd = useMediaQuery('(max-width: 1232px)');
  const isBreaking = useMediaQuery('(max-width: 1300px)');
  const currentQuestion = useSelector((state) => state.onlineExamination.currentQuestion);
  const attemptedQuestions = useSelector((state) => state.onlineExamination.attemptedQuestions);

  const handleNextQuestion = (questionId: number) => {
    dispatch(setCurrentQuestion(questionId));
    showClose && showClose();
  };

  // Get question status
  const getQuestionStatus = (questionId: number) => {
    const answer = attemptedQuestions.find((a) => a.questionId === questionId);

    if (!answer) {
      return 'not-visited';
    }

    if (answer.ans === '') {
      return answer.mark_for_review === 1 ? 'mark-for-review' : 'not-answered';
    }

    return answer.mark_for_review === 1 ? 'answered-and-marked' : 'answered';
  };

  return (
    <div className={className}>
      {sectionData?.sectionName && (
        <div className="flex h-12 items-center justify-between rounded-lg rounded-b-none bg-primary px-6 lg:h-14">
          <Button
            onClick={handlePrevSection}
            className="!h-auto cursor-pointer rounded-full border border-white bg-transparent !p-0 hover:bg-transparent"
          >
            <Icon icon="iconamoon:arrow-left-2-light" className="text-primary" fontSize={22} style={{ color: 'white' }} />
          </Button>
          <h1 className="text-lg font-medium text-white md:text-xl lg:text-2xl">{sectionData?.sectionName}</h1>
          <Button
            onClick={handleNextSection}
            className="!h-auto cursor-pointer rounded-full border border-white bg-transparent !p-0 hover:bg-transparent"
          >
            <Icon icon="iconamoon:arrow-right-2-light" className="text-primary" fontSize={22} style={{ color: 'white' }} />
          </Button>
        </div>
      )}

      <div className="rounded-lg rounded-t-none border p-4">
        <div className={`${isBreaking && !isMd ? 'block' : 'mb-4 grid grid-cols-2 gap-y-3'}`}>
          <div className="flex items-center gap-2">
            <div className="size-4 rounded-sm bg-[#6F6F6F]"></div>
            <span className="text-base font-medium text-[#6F6F6F] md:text-base">{OEExamItems.NOT_VISITED}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-4 rounded-sm bg-[#FF4747]"></div>
            <span className="text-base font-medium text-[#6F6F6F] md:text-base">{OEExamItems.NOT_ANSWERED}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-4 rounded-sm bg-[#935AFD]"></div>
            <span className="text-base font-medium text-[#6F6F6F] md:text-base">{OEExamItems.MARK_FOR_REVIEW}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-4 rounded-sm bg-[#00A86B]"></div>
            <span className="text-base font-medium text-[#6F6F6F] md:text-base">{OEExamItems.ANSWERED}</span>
          </div>
          <div className="col-span-2 flex items-start gap-2">
            <div className="mt-1 size-4 rounded-sm bg-[#FF6800]"></div>
            <span className="text-base font-medium text-[#6F6F6F] md:text-base">{OEExamItems.ANSWRD_AND_MRKD_FOR_REVIEW}</span>
          </div>
        </div>
        <div className="my-8 grid grid-cols-6 justify-items-center gap-2">
          {sectionData.questions.map((question, index) => {
            return (
              <OEQuestionNumber
                key={question.questionId}
                answerType={getQuestionStatus(question.questionId)}
                questionNumber={index + 1}
                questionId={question.questionId}
                currentQuestion={Number(currentQuestion) === Number(question.questionId)}
                handleChange={handleNextQuestion}
              />
            );
          })}
        </div>
      </div>

      {!isMd && (
        <Card className="opacity-3 mt-4 w-full rounded-lg border border-dashed border-primary bg-[#00008008] p-4">
          <h3 className="mb-2 text-base font-medium text-[#000080] md:text-lg">{OEExamItems.NOTE}</h3>
          <p className="text-base font-normal text-[#6F6F6F] md:text-lg">{OEExamItems.REFRESH_THW_PAGE_INSTRUCTION}</p>
        </Card>
      )}

      {showClose && (
        <div onClick={() => {}} className="mr-6 mt-3 flex items-center justify-end">
          <span className="font-md text-lg text-[#000080] underline">Close</span>
        </div>
      )}
    </div>
  );
};

export default memo(OESections);
