'use client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import React, { useEffect, useState } from 'react';
import ExamCard from './exam-card';
import { Icon } from '@/components/ui/icon';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Swiper, SwiperSlide } from 'swiper/react';
import examsData from './exams.json';
import { GenericType } from '@/types';
import { useDispatch, useSelector } from '@/store';
import { fetchUpcomingTests } from '@/utils/api/user/dashboard';
import { UpcomingTests } from '@/types/user/dashboard';
import { HttpStatus } from '@/types/constants';
import { toast } from 'sonner';
import { TosterMessages } from '@/types/enum';

export type ExamTypes = {
  id: number;
  name: string;
  startDate: string;
  subjects: GenericType[];
};

const UpcomingExams = () => {
  const { stream, standard } = useSelector((state) => state.stream);
  const isMobile = useMediaQuery('(min-width: 768px)');

  const [upcomingTests, setUpcomingTests] = useState<UpcomingTests[]>([]);

  useEffect(() => {
    const getUpcomingTests = async () => {
      if (stream?.id && standard?.id) {
        try {
          const response = await fetchUpcomingTests(stream.id, standard.id);
          if (response.status !== HttpStatus.OK) {
            toast.error(TosterMessages.UPCOMING_TEST_FETCH_FAIL);
          } else {
            setUpcomingTests(response.data);
          }
        } catch (error) {
          toast.error(TosterMessages.UPCOMING_TEST_FETCH_FAIL);
          console.log('error', error);
        }
      }
    };
    getUpcomingTests();
  }, [stream?.id, standard?.id]);

  if (upcomingTests.length === 0) return null;

  return (
    <Card className="mb-4 overflow-hidden border border-borderad py-4 shadow-none">
      <CardHeader className="flex-row items-center gap-2 space-y-0 px-4 py-0 text-start">
        <Icon icon="heroicons:play-16-solid" />
        <h2 className="text-base font-medium text-B2CAgrayn lg:text-xl">Upcoming Test</h2>
      </CardHeader>
      <Separator className="my-4" />
      <CardContent className="mb-2 space-y-2 px-4 py-0">
        {!isMobile ? (
          <Swiper
            slidesPerView={1}
            spaceBetween={30}
            className="mySwiper"
            breakpoints={{
              320: {
                slidesPerView: 1.1,
                spaceBetween: 8
                // height: 100
              },
              387: {
                slidesPerView: 1.1,
                spaceBetween: 10
                // height: 100
              },
              420: {
                slidesPerView: 1.1,
                spaceBetween: 12
              }
            }}
          >
            {upcomingTests.map((exam: UpcomingTests) => (
              <SwiperSlide>
                <ExamCard exam={exam} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 min-[2000px]:grid-cols-4">
            {upcomingTests.map((exam: UpcomingTests) => (
              <ExamCard exam={exam} key={exam.id} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingExams;
