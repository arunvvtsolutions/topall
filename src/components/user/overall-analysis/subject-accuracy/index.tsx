'use client';

import React, { useRef, useState } from 'react';
import AnalysisCard from '@/components/common/analysis-card';
import SubjectAccuracyCard from './subject-card';
import SwiperNavigator from '@/components/common/swiper-navigator';

// swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { swiperResponsiveClass } from '../subject-proficiency/proficiency-analysis-utils';
import { useSelector } from '@/store';
import { calculateSubjectAccuracy } from '../utils';

const SubjectAccuracy = () => {
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
      className="rounded-2xl bg-default p-6 pt-2 shadow-none"
      title="Overall Subject Accuracy"
      dataTestId="overall-subject-proficiency-analysis"
      actions={
        hasData ? (
          <SwiperNavigator isBeginning={isBeginning} isEnd={isEnd} handleNext={handleNext} handlePrev={handlePrev} />
        ) : null
      }
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
          className="mySwiper h-[260px]"
          breakpoints={swiperResponsiveClass}
        >
          {subjectWiseAnalysis?.map((subject, index) => (
            <SwiperSlide key={index}>
              <SubjectAccuracyCard
                subject={subject.subject}
                accuracy={calculateSubjectAccuracy(subject.correct, subject.wrong)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="flex h-72 w-full items-center justify-center text-base text-gray-600">
          <p>No data Found</p>
        </div>
      )}
    </AnalysisCard>
  );
};

export default SubjectAccuracy;
