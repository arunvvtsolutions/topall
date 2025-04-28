'use client';

import { useEffect, useRef, useState } from 'react';
import { swiperResponsiveClass } from './swiper-slides-utlis';
import AnalysisCard from '@/components/common/analysis-card';
import SwiperNavigator from '@/components/common/swiper-navigator';
import SubjectTimeAnalysisCard from './subject-time-analysis-card';

import type { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import { useDispatch, useSelector } from '@/store';
import { fetchTimeAnalysis } from '@/store/slice/user/overall-analysis';

export default function SubjectTimeAnalysis() {
  const dispatch = useDispatch();

  const { timeAnalysis } = useSelector((state) => state.overAllAnallysis);
  const { stream } = useSelector((state) => state.stream);
  const { userId } = useSelector((state) => state.userProfile);

  const swiperRef = useRef<SwiperType>();
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const handleNext = () => swiperRef.current?.slideNext();
  const handlePrev = () => swiperRef.current?.slidePrev();

  useEffect(() => {
    if (userId && stream?.id) {
      dispatch(fetchTimeAnalysis(userId, stream?.id));
    }
  }, [userId, stream]);

  const hasData = timeAnalysis && timeAnalysis.length > 0;

  return (
    <AnalysisCard
      className="rounded-2xl bg-default p-6 !px-6 pt-2 shadow-none"
      title="Overall Subject Time Analysis"
      dataTestId="overall-subject-Time-analysis"
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
          {timeAnalysis?.map((subject, index) => (
            <SwiperSlide key={index}>
              <SubjectTimeAnalysisCard subject={subject} />
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
}
