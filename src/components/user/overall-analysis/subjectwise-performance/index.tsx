'use client';
import { useDispatch, useSelector } from '@/store';
import CardCarousel from './card-carousel';
import SubjectWisePerformanceCard from './subject-wise-performance-card';
import { useEffect, useState } from 'react';
import { fetchChapterConceptAnalysis, fetchSubjectWiseAnalysis } from '@/store/slice/user/overall-analysis';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { CardCarouselSkeleton, SubjectWisePerformanceCardSkeleton } from './skeletons';

const SubjectwisePerformance = () => {
  const dispatch = useDispatch();
  const { subjectWiseAnalysis, loading } = useSelector((state) => state.overAllAnallysis);
  const { stream } = useSelector((state) => state.stream);
  const { userId } = useSelector((state) => state.userProfile);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (userId && stream?.id) {
      dispatch(fetchSubjectWiseAnalysis(userId, stream?.id));
      dispatch(fetchChapterConceptAnalysis(userId, stream?.id));
      setInitialLoad(false);
    }
  }, [userId, stream?.id]);

  // Loading State For To Display The Skeleton
  const isDataLoading = loading && !subjectWiseAnalysis && initialLoad;
  // Create an array of 4 items for skeleton loading
  const skeletonArray = Array(4).fill(null);

  if (loading && subjectWiseAnalysis?.length === 0) return;

  return (
    <div className="w-full">
      {/* Desktop Grid View */}
      <div className="!border-[rgba(16, 16, 16, 0.15)] !hidden flex-row gap-5 overflow-x-auto rounded-[16px] border bg-[#fff] p-[16px] md:border-none md:bg-transparent md:p-0 lg:!grid lg:grid-cols-4 xl:grid-cols-4">
        {isDataLoading
          ? skeletonArray.map((_, index) => <SubjectWisePerformanceCardSkeleton key={`skeleton-${index}`} />)
          : subjectWiseAnalysis?.map((item) => <SubjectWisePerformanceCard key={item.subjectId} subject={item} />)}
      </div>

      {/* Mobile Carousel View */}
      {!isDataLoading && subjectWiseAnalysis?.length === 0 ? null : (
        <Carousel className="!border-[rgba(16, 16, 16, 0.15)] mx-auto w-full rounded-[16px] !border-[0.5px] bg-white p-[16px] lg:hidden">
          <CarouselContent className="m-0 w-full gap-2">
            {isDataLoading
              ? skeletonArray.map((_, index) => (
                  <CarouselItem key={`skeleton-${index}`} className="max-w-[90%] p-0 sm:max-w-[50%]">
                    <CardCarouselSkeleton />
                  </CarouselItem>
                ))
              : subjectWiseAnalysis?.map((item) => <CardCarousel key={item.subjectId} subject={item} />)}
          </CarouselContent>
        </Carousel>
      )}
    </div>
  );
};

export default SubjectwisePerformance;
