import React from 'react';
import { Button } from '../ui/button';
import { Icon } from '../ui/icon';

interface ISwiperNavigatorProps {
  handleNext: () => void;
  handlePrev: () => void;
  isBeginning: boolean;
  isEnd: boolean;
}

const SwiperNavigator = ({ handleNext, handlePrev, isBeginning, isEnd }: ISwiperNavigatorProps) => {
  return (
    <div className="flex gap-2">
      <Button
        variant="default"
        size="icon"
        onClick={handlePrev}
        disabled={isBeginning}
        className="rounded-full p-2 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Icon icon="material-symbols:arrow-left-rounded" className="h-10 min-h-10 w-20 min-w-[80px] text-[80px]" />
      </Button>
      <Button
        variant="default"
        size="icon"
        onClick={handleNext}
        disabled={isEnd}
        className="rounded-full p-2 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Icon icon="material-symbols:arrow-right-rounded" className="h-10 min-h-10 w-20 min-w-[80px] text-[80px]" />
      </Button>
    </div>
  );
};

export default SwiperNavigator;
