import React, { useState } from 'react';
import StarIcon from '../../chapter-wise-test/star-icon';

interface StarRatingProps {
  label?: string;
  maxStars?: number;
  defaultRating?: number;
  onChange?: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ label = 'Rate Us', maxStars = 5, defaultRating = 0, onChange }) => {
  const [rating, setRating] = useState(defaultRating);

  const handleRating = (newRating: number) => {
    setRating(newRating);
    if (onChange) onChange(newRating);
  };

  return (
    <div className="">
      {/* Label */}
      <span className="text-[0.875rem] font-medium text-B2Cgray">{label}</span>

      {/* Star Icons */}
      <div className="flex gap-[10px] mt-2">
        {Array.from({ length: maxStars }, (_, index) => {
          const starValue = index + 1;
          return (
            <button key={starValue} onClick={() => handleRating(starValue)} className="focus:outline-none">
              <StarIcon width={16} height={16} fill={starValue <= rating ? '#F59E0B' : '#D1D5DB'} />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StarRating;
