'use client';

import { Card } from '@/components/ui/card';
import Image from 'next/image';

interface BannerCardProps {
  className?: string;
  imageUrl?: string;
  alt?: string;
}

const BannerCard = ({ className, imageUrl, alt = 'Banner' }: BannerCardProps) => {
  return (
    <Card className={`relative flex h-full w-full overflow-hidden rounded-lg bg-white ${className}`}>
      {imageUrl ? (
        <div className="relative w-full pt-[56.25%]">
          {' '}
          {/* 16:9 Aspect Ratio */}
          <Image
            src={imageUrl || '/placeholder.svg'}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center p-4">
          <span className="text-sm font-medium text-primary">Banner</span>
        </div>
      )}
    </Card>
  );
};

export default BannerCard;
