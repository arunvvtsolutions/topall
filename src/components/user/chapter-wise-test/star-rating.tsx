'use client';

import React from 'react';
import StarIcon from './star-icon';

interface StarRatingProps {
  level: number | null | undefined;
}

const StarRating: React.FC<StarRatingProps> = ({ level }) => {
  const totalStars = 5;
  const rating = level ?? 1;

  return (
    <div className="flex items-center">
      {Array.from({ length: totalStars }).map((_, index) => (
        <React.Fragment key={index}>
          <StarIcon fill={index < rating ? '#F59E0B' : 'rgba(111, 111, 111, 0.3)'} />
          {index < totalStars - 1 && <span className="mx-3 block w-7 border-b border-b-[1px] border-[#10101026]"></span>}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StarRating;
