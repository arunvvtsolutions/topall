import MathJaxRender from '@/components/MathJaxRender';
import { Label } from '@/components/ui/label';
import { QB_IMAGE_URL } from '@/config';
import { Option } from '@/types/online-exams';
import Image from 'next/image';
import React, { memo } from 'react';

interface OEQuestionOptionsProps {
  index: number;
  option: Option;
  onOptionSelect: (value: string) => void;
  isSelectOption: boolean;
}

const OEQuestionOptions: React.FC<OEQuestionOptionsProps> = ({ index, option, onOptionSelect, isSelectOption }) => {
  return (
    <div
      className={`my-4 flex cursor-pointer items-center gap-5 rounded-lg border p-4 transition ${
        isSelectOption ? 'border-2 border-[#000080]' : 'border-[#10101026]'
      }`}
      onClick={() => onOptionSelect(option.optionId)}
    >
      <span
        className={`font-md flex size-7 flex-shrink-0 items-center justify-center rounded-sm text-sm md:size-10 md:text-base md:font-semibold ${isSelectOption ? 'bg-primary text-default' : 'border border-dashed border-[#000080] bg-[#00008020] text-[#000080]'}`}
      >
        {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[index]}
      </span>

      {option.option && (
        <p className="text-sm font-medium text-[#222222] sm:text-lg md:text-xl">
          <MathJaxRender data={option.option} />
        </p>
      )}

      {option.optionImage && option.optionImage !== '#' && (
        <div className="mt-4 max-w-full overflow-x-auto pb-2">
          <Image src={`${QB_IMAGE_URL}/${option.optionImage}`} width={200} height={200} alt="option-img" />
        </div>
      )}
    </div>
  );
};

export default memo(OEQuestionOptions);
