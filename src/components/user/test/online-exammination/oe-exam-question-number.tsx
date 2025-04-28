import { Button } from '@/components/ui/button';
import { ExamSecBtnType } from '@/types/online-exams';
import React from 'react';

interface IOEQuestionNumber {
  questionNumber: number;
  questionId: number;
  currentQuestion: boolean;
  handleChange: (index: number) => void;
  answerType: string;
}

const bgColor: any = {
  is_visited: 'bg-destructive text-white hover:bg-destructive/90 hover:ring-0',
  is_answered: 'bg-success text-success-foreground hover:bg-success/90 hover:ring-0',
  not_visited: 'bg-[#EEEEEE] hover:bg-[#e7e7e7] text-[#6F6F6F]',
  is_answered_and_marked_for_review: 'bg-[#FF6800] text-white hover:bg-orange/90 hover:ring-orange',
  is_marked_for_review: 'bg-[#935AFD] text-white hover:bg-pink/90 hover:ring-pink',
  error: 'bg-[#FF4747] text-default hover:bg-[#FF4747]'
};
// Get status class
const getStatusClass = (status: string) => {
  switch (status) {
    case 'not-visited':
      return 'bg-[#EEEEEE] hover:bg-[#e7e7e7] text-[#6F6F6F]';
    case 'not-answered':
      return 'bg-destructive text-white hover:bg-destructive/90 hover:ring-0';
    case 'mark-for-review':
      return 'bg-[#935AFD] text-white hover:bg-pink/90 hover:ring-pink';
    case 'answered':
      return 'bg-success text-success-foreground hover:bg-success/90 hover:ring-0';
    case 'answered-and-marked':
      return 'bg-[#FF6800] text-white hover:bg-orange/90 hover:ring-orange';
    default:
      return 'bg-[#EEEEEE] hover:bg-[#e7e7e7] text-[#6F6F6F]';
  }
};

const OEQuestionNumber = ({ questionId, answerType, currentQuestion, handleChange, questionNumber }: IOEQuestionNumber) => {
  return (
    <Button
      variant="default"
      size="icon"
      className={`!md:size-11 rounded-full ${currentQuestion ? 'border-2 border-primary' : ''} ${getStatusClass(answerType)} font-medium md:text-lg`}
      onClick={() => handleChange(questionId)}
    >
      {questionNumber}
    </Button>
  );
};

export default OEQuestionNumber;
