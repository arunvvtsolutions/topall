import MathJaxRender from '@/components/MathJaxRender';
import { QB_IMAGE_URL } from '@/config';
import Image from 'next/image';
import React from 'react';

interface IOEQuestionsProps {
  questionId?: string;
  question: string;
  questionImage: string;
}

const OEQuestions = ({ questionId, question, questionImage }: IOEQuestionsProps) => {
  return (
    <div className="mb-4">
      {question && (
        <p className="text-sm font-medium text-[#222222] sm:text-lg md:text-xl">
          <MathJaxRender data={question} />
        </p>
      )}

      {questionImage && questionImage !== '#' && (
        <div className="mt-4 max-w-full overflow-x-auto pb-2">
          <Image
            src={`${QB_IMAGE_URL}/${questionImage}`}
            width={200}
            height={200}
            alt="Question"
            style={{ maxWidth: '100%!important' }}
          />
        </div>
      )}
    </div>
  );
};

export default OEQuestions;
