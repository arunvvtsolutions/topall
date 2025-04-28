'use client';

import { HeadersTitle, ResultTitle } from '@/types/enum';
import { useRef, useState } from 'react';
import LeaderCard from './leader-card';
import SwiperNavigator from '@/components/common/swiper-navigator';

import type { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import { useSelector } from '@/store';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { LucideLoader } from '@/components/common/LucideLoader';

const Leaderboard = ({ isLoading }: { isLoading: boolean }) => {
  const swiperRef = useRef<SwiperType>();
  const learderboardData = useSelector((state) => state.overAllResult.leaderboard);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  //navigator
  const handleNext = () => swiperRef.current?.slideNext();
  const handlePrev = () => swiperRef.current?.slidePrev();

  return (
    <div>
      <h2 className="pb-6 text-xl font-medium">{HeadersTitle.LEADERBOARD}</h2>
      <div className="rounded-[1rem] border bg-white px-4 py-5 lg:px-8 lg:py-6">
        <div className="flex items-center justify-between border-b border-borderad pb-6">
          <h2 className="flex-1 text-center text-sm font-semibold text-B2CAgrayn md:text-center md:text-[1.125rem]">
            {ResultTitle.LEADERBOARD_SUBTITLE}
          </h2>
          <SwiperNavigator isBeginning={isBeginning} isEnd={isEnd} handleNext={handleNext} handlePrev={handlePrev} />
        </div>

        {isLoading ? (
          <div className="flex min-h-56 items-center justify-center">
            <LucideLoader />
          </div>
        ) : learderboardData && learderboardData.length > 0 && !isLoading ? (
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
            style={{ width: '100%', height: 'max-content' }}
            className="mySwiper mt-6"
            breakpoints={{
              320: {
                slidesPerView: 1.1,
                spaceBetween: 3
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 4
              },
              900: {
                slidesPerView: 3,
                spaceBetween: 5
              },

              1600: {
                slidesPerView: 4,
                spaceBetween: 10
              },

              2300: {
                slidesPerView: 5,
                spaceBetween: 10
              }
            }}
          >
            {learderboardData?.map((data, index) => (
              <SwiperSlide key={index}>
                <LeaderCard key={index} index={index} data={data} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="text-center text-B2CAgray">No data found</div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
