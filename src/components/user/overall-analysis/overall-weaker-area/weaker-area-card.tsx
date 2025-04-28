import { CardContent } from '@/components/ui/card';
import { ButtonNames } from '@/types/enum';
import { WeakerAreaAnalysis } from '@/types/user/overall-analysis';
import React from 'react';

const WeakerAreaCard = ({ section }: { section: WeakerAreaAnalysis }) => {
  return (
    <CardContent className="px-2 pl-0 pr-0 sm:pl-3">
      <h3 className="mb-4 text-[12px] font-semibold text-[#222222] sm:text-base md:text-base lg:text-base">{section.topic}</h3>
      <div className="grid grid-cols-4 sm:gap-7">
        <div className="space-y-1">
          <div className="text-center text-[12px] font-medium capitalize text-[#6F6F6F] sm:text-base md:text-base lg:text-base">
            {ButtonNames.CORRECT}
          </div>
          <div className="text-center text-[12px] font-semibold text-[#00A86B] sm:text-base md:text-base lg:text-base">
            {section.correctQues.length}
          </div>
        </div>
        <div className="space-y-1">
          <div className="items-end text-center text-[12px] font-medium capitalize text-[#6F6F6F] sm:text-base md:text-base lg:text-base">
            {ButtonNames.WRONG}
          </div>
          <div className="text-center text-[12px] font-semibold text-[#FF4747] sm:text-base md:text-base lg:text-base">
            {section.wrongQues.length}
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-center text-[12px] font-medium capitalize text-[#6F6F6F] sm:text-base md:text-base lg:text-base">
            {ButtonNames.LEFT}
          </div>
          <div className="text-center text-[12px] font-semibold text-[#FFAD43] sm:text-base md:text-base lg:text-base">
            {section.leftQues.length}
          </div>
        </div>
        <div className="space-y-1">
          <div className="ml-0 items-end text-center text-[12px] font-medium capitalize text-[#6F6F6F] sm:text-base md:text-base lg:text-base">
            {ButtonNames.ACCURACY}
          </div>
          <div className="text-center text-[12px] font-semibold text-[#000080] sm:ml-0 sm:text-center sm:text-base md:ml-0 md:text-center md:text-base lg:ml-0 lg:text-base">
            {section.accuracy ? section.accuracy.toFixed(2) : 0}%
          </div>
        </div>
      </div>
    </CardContent>
  );
};

export default WeakerAreaCard;
