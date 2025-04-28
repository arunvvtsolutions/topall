import React from 'react';
import { ChevronRight } from 'lucide-react';
import CircleArrow from '@/components/icons/CircleArrow';

type CardProps = {
  title: string;
  prompt: string;
  id: string | number;
  onSendMessage: (message: string) => void;
};

const FeatureCard: React.FC<CardProps> = ({ title, prompt, onSendMessage }) => {
  const handleCardClick = () => {
    onSendMessage(title);
  };
  return (
    // <div
    //   onClick={handleCardClick}
    //   className="group flex w-full cursor-pointer items-center justify-between rounded-lg border bg-white p-4 transition-all hover:border-gray-200"
    // >
    //   <div className="min-w-0 flex-1">
    //     <h3 className="mb-0.5 text-base font-semibold">{title}</h3>
    //     <p className="break-words text-sm">{prompt}</p>
    //   </div>
    //   {/* <ChevronRight className="ml-4 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-600" /> */}
    //   <CircleArrow color="currentColor" />
    // </div>
    <div
      onClick={handleCardClick}
      className="rounded-[10px] border bg-[#fff] dark:bg-[#101010] lg:rounded-[8px]"
    >
      <div className="mx-[0px]">
        <div className="flex flex-shrink-0 cursor-grab items-center gap-1 rounded-md p-3 px-3 lg:gap-3 lg:py-4">
          <div className="flex w-full flex-col justify-between">
            {title && (
              <h3 className="multi-line-truncate !hidden cursor-pointer text-start  !text-[#101010] dark:!text-[#FFF] lg:!block">
                {title}
              </h3>
            )}
            <p className="multi-line-truncate cursor-pointer !text-[13px] !leading-[22px] tracking-[0.36px] !text-[#101010] dark:!text-[#ffffffa3] lg:text-[14px]">
              {prompt}
            </p>
          </div>
          <div className="ml-3 cursor-pointer">
            <CircleArrow color="currentColor" />
          </div>
        </div>
      </div>
    </div>
  );
};

type CardGridProps = {
  cards: CardProps[];
  onSendMessage: (message: string) => void;
};

const CardGrid: React.FC<CardGridProps> = ({ cards, onSendMessage }) => {
  return (
    <div className="mx-auto grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-2">
      {cards.slice(0, 5).map((card, idx) => (
        <FeatureCard key={card.id || idx} {...card} onSendMessage={onSendMessage} />
      ))}
    </div>
  );
};

export default CardGrid;
