'use client';
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useSelector } from '@/store';
import { fetchCarouselList } from '@/utils/api/carousels';
import { toast } from 'sonner';
import { TosterMessages } from '@/types/enum';
import Image from 'next/image';

const mockSlide = {
  id: 'mock',
  desktopImage: '/images/banner/desktop-banner.jpg',
  title: 'Default Banner',
  link: '#'
};

const BannerSlide = () => {
  const { stream } = useSelector((state) => state.stream);
  const { standard } = useSelector((state) => state.userProfile);

  const [carousels, setCarousels] = useState<any[]>([]);
  const [slides, setSlides] = useState<any[]>([]);

  const getCarouselList = async () => {
    try {
      const response = await fetchCarouselList();

      if (!Array.isArray(response) || response.length === 0) {
        setCarousels([{ streamId: stream?.id, carousels: [mockSlide] }]);
      } else {
        setCarousels(response);
      }
    } catch (error) {
      toast.error(TosterMessages.ADMIN_COMMON_ERROR);
      setCarousels([{ streamId: stream?.id, carousels: [mockSlide] }]);
    }
  };

  useEffect(() => {
    const stds = standard?.map((std: any) => std.standard.id) || [];

    const filteredCarousels = carousels
      .filter((item: any) => item.streamId === stream?.id)
      .flatMap(
        (item: any) =>
          item.carousels?.filter((carousel: any) => carousel.standardList?.some((std: any) => stds.includes(std.id))) || []
      );

    setSlides(filteredCarousels.length > 0 ? filteredCarousels : [mockSlide]);
  }, [standard, stream?.id, carousels]);

  useEffect(() => {
    getCarouselList();
  }, []);

  return (
    <div className="w-full">
      <Swiper
        slidesPerView={1}
        spaceBetween={0}
        loop={true}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        modules={[Autoplay, Pagination]}
        className="mySwiper w-full"
      >
        {slides.map((slide: any) => (
          <SwiperSlide key={slide.id}>
            <a href={slide.link || '#'} target="_blank" rel="noopener noreferrer" className="block w-full">
              <div className="relative aspect-[4/1] max-h-[240px] w-full sm:max-h-[280px] md:max-h-[320px] lg:max-h-[350px]">
                <img
                  src={slide.desktopImage || '/placeholder.svg'}
                  alt={slide.title || 'Carousel image'}
                  className="h-full w-full object-cover"
                />
              </div>
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BannerSlide;
