import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Icon } from '@/components/ui/icon';
import Link from 'next/link';
import React from 'react';
import { OverAllSubectPerformance } from '@/types/enum';
import CircularProgress from '../../result/leaderboard/circle-progress';
import { calculateAccuracy } from '../utils';
import { SubjectWiseAnalysis } from '@/types/user/overall-analysis';

const CardCarousel = ({ subject }: { subject: SubjectWiseAnalysis }) => {
  return (
    <CarouselItem className="max-w-[90%] p-0 sm:max-w-[50%]">
      <div className="!border-[rgba(16, 16, 16, 0.15)] mx-auto w-full rounded-[16px] !border-[0.5px] bg-white p-[16px]">
        <div className="!border-[rgba(16, 16, 16, 0.15)] pb-[8px] md:border-b md:pb-[16px]">
          <p className="text-center text-[16px] font-[500] text-[#222222] md:text-[18px]">{subject.subject}</p>
        </div>
        <div className="cols-12 grid grid-cols-1">
          <div className="cols-12 flex items-center justify-center py-[16px]">
            <CircularProgress value={calculateAccuracy(subject.correct, subject.wrong, subject.left)} />
          </div>
          <div className="cols-12 grid grid-cols-1 md:col-span-5">
            <div className="cols-12 flex items-center justify-between border-b border-dashed border-[rgba(16,16,16,0.15)] py-[12px]">
              <p className="text-[14px] font-[500] leading-[16.94px] text-[#6F6F6F]">{OverAllSubectPerformance.CORRECT}</p>
              <p className="text-[14px] font-[600] leading-[16.94px] text-[#00A86B]">{subject.correct}</p>
            </div>

            <div className="cols-12 flex items-center justify-between border-b border-dashed border-[rgba(16,16,16,0.15)] py-[12px]">
              <p className="text-[14px] font-[500] leading-[16.94px] text-[#6F6F6F]">{OverAllSubectPerformance.WRONG}</p>
              <p className="text-[14px] font-[600] leading-[16.94px] text-[#E31717CC]">{subject.wrong}</p>
            </div>

            <div className="cols-12 flex items-center justify-between border-b border-dashed border-[rgba(16,16,16,0.15)] py-[12px]">
              <p className="text-[14px] font-[500] leading-[16.94px] text-[#6F6F6F]">{OverAllSubectPerformance.LEFT}</p>
              <p className="text-[14px] font-[600] leading-[16.94px] text-[#FFAD43]">{subject.left}</p>
            </div>
          </div>
        </div>
        <Link
          href={`/overall-analysis/${subject.subjectId}/chapter-concept-analysis`}
          className="!border-[rgba(16, 16, 16, 0.15)] mt-[15px] flex items-center justify-center border-t pt-[8px] md:pt-[16px]"
        >
          <p className="text-center text-[12px] font-[500] leading-[14.52px] text-[#000080]">View Chapter & Concept Wise</p>
          <Icon icon="iconamoon:arrow-right-2-light" width="24" height="24" color="#000080" />
        </Link>
      </div>
    </CarouselItem>
  );
};

export default CardCarousel;
