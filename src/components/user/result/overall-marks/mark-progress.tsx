import { PROGRESS_VARIANTS } from '@/types/constants';
import React from 'react';

interface Props {
  value: number;
  color: keyof typeof PROGRESS_VARIANTS.colors;
  size?: keyof typeof PROGRESS_VARIANTS.sizes;
}

const MarkProgress = ({ value, color, size = 'lg' }: Props) => {
  const rotation = -90;
  const { colors, sizes } = PROGRESS_VARIANTS;
  const { stroke, track, background } = colors[color];
  return (
    <div className={`relative ${sizes[size]}`}>
      {/* SVG Circular Progress with rounded stroke */}
      <svg className="size-full" viewBox="0 0 100 100" style={{ transform: `rotate(${rotation}deg)` }}>
        {/* Background track */}
        <circle className={`fill-none ${track} `} strokeWidth="6" cx="50" cy="50" r="40" />
        {/* Progress circle */}
        <circle
          className={`fill-none ${stroke}`}
          strokeWidth="6"
          strokeLinecap="round"
          cx="50"
          cy="50"
          r="40"
          strokeDasharray={`${value * 2.51}, 251`}
          // 251 is approximately the circumference of the circle (2 * π * 40)
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {/* <span className="text-2xl font-bold">{percentage}%</span> */}
        <div className={`flex size-9/12 items-center justify-center rounded-full p-4 ${background}`}>
          {/* <div className="flex size-full items-center justify-center rounded-full bg-default"> */}
          <div className="flex size-14 items-center justify-center rounded-full bg-default opacity-100 lg:size-10 xl:size-16">
            <p className="text-sm font-bold text-B2Cgray"> {value}%</p>
          </div>
          {/* </div> */}
        </div>
      </div>
    </div>
  );
};

export default MarkProgress;
