'use client';

import { useRef, useState } from 'react';
import { swiperResponsiveClass } from './proficiency-analysis-utils';
import AnalysisCard from '@/components/common/analysis-card';
import SwiperNavigator from '@/components/common/swiper-navigator';
import SubjectProficiencyCard from './subject-proficiency-card';

import type { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useSelector } from '@/store';

export default function ProficiencyAnalysis() {
  const { subjectWiseAnalysis } = useSelector((state) => state.overAllAnallysis);

  const swiperRef = useRef<SwiperType>();
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const handleNext = () => {
    swiperRef.current?.slideNext();
  };

  const handlePrev = () => {
    swiperRef.current?.slidePrev();
  };

  const hasData = subjectWiseAnalysis && subjectWiseAnalysis.length > 0;

  return (
    <AnalysisCard
      className="h-full rounded-2xl bg-default p-6 pt-2 shadow-none"
      title="Overall Subject Proficiency Analysis"
      dataTestId="overall-subject-proficiency-analysis"
      actions={
        hasData ? (
          <SwiperNavigator isBeginning={isBeginning} isEnd={isEnd} handleNext={handleNext} handlePrev={handlePrev} />
        ) : null
      }
      separatorClassName={hasData ? 'mt-1' : 'mt-2'}
    >
      {hasData ? (
        <Swiper
          spaceBetween={20}
          slidesPerView={3}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={() => {
            if (swiperRef.current) {
              setIsBeginning(swiperRef.current.isBeginning);
              setIsEnd(swiperRef.current.isEnd);
            }
          }}
          className="mySwiper h-72"
          breakpoints={swiperResponsiveClass}
        >
          {subjectWiseAnalysis.map((subject, index) => (
            <SwiperSlide key={index}>
              <SubjectProficiencyCard subject={subject} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="mt-7 flex h-72 w-full items-center justify-center text-base text-gray-600">
          <p>No data Found</p>
        </div>
      )}
    </AnalysisCard>
  );
}
