import { PROGRESS_VARIANTS } from '@/types/constants';
import React from 'react';

interface Props {
  value: number;
  color: keyof typeof PROGRESS_VARIANTS.colors;
  size?: keyof typeof PROGRESS_VARIANTS.sizes;
  rotation?: keyof typeof PROGRESS_VARIANTS.rotationAngle;
}

const OverAllProgress = ({ value, color = 'success', size = 'lg', rotation = 'default' }: Props) => {
  const { colors, sizes, rotationAngle } = PROGRESS_VARIANTS;

  // const rotation = -180 - 90; // -90 to account for SVG's default orientation
  return (
    <div className={`relative ${sizes[size]}`}>
      {/* SVG Circular Progress with rounded stroke */}
      <svg className="size-full" viewBox="0 0 100 100" style={{ transform: `rotate(${rotationAngle[rotation]}deg)` }}>
        {/* Background track */}
        <circle className="fill-none stroke-[#f2f2f2]" strokeWidth="8" cx="50" cy="50" r="40" />
        {/* Progress circle */}
        <circle
          className={`fill-none ${colors[color].stroke}`}
          strokeWidth="8"
          strokeLinecap="round"
          cx="50"
          cy="50"
          r="40"
          strokeDasharray={`${value * 2.51}, 251`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {/* <span className="text-2xl font-bold">{percentage}%</span> */}
        <div className="flex size-7/12 items-center justify-center rounded-full bg-[#F1F6FF] p-2">
          <div className="flex size-full items-center justify-center rounded-full bg-[#E2EEFF]">
            <div className="text-lg font-bold lg:text-xl">{value}%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverAllProgress;
