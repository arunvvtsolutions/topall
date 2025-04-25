import React from 'react';
import MathJaxRender from '@/components/MathJaxRender';
import Image from 'next/image';
import { QB_IMAGE_URL } from '@/config';

interface Option {
  letter: string;
  isCorrect: boolean;
  text: string;
  image?: string;
}

const Option = ({ letter, isCorrect, text, image }: Option) => (
  <div className="flex items-center gap-2">
    <div>
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-md border border-default-200 text-sm font-medium md:h-10 md:w-10 md:text-base ${
          isCorrect ? 'bg-primary text-default' : 'text-foreground'
        }`}
      >
        {letter}
      </span>
    </div>
    {text && (
      <p className="text-sm font-medium md:text-base">
        <MathJaxRender data={text} />
      </p>
    )}
    {image && image !== '#' && (
      <div className="h-auto max-w-full">
        <Image
          src={`${QB_IMAGE_URL}/${image}`}
          width={100}
          height={100}
          style={{ maxWidth: '100%!important' }}
          alt={`Option ${letter}`}
        />
      </div>
    )}
  </div>
);

export default Option;
