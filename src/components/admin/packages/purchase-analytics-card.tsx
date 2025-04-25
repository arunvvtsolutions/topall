import type React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/icon';

interface PurchaseCardProps {
  title: string;
  value: number;
  percentageChange: number;
  showIcon?: boolean;
  index: number;
  totalItems: number;
  className?: string;
  seperatorClass?: string;
  status: boolean;
}

const PurchaseCard: React.FC<PurchaseCardProps> = ({
  title,
  value,
  percentageChange,
  showIcon = false,
  index,
  totalItems,
  className,
  seperatorClass,
  status
}) => {
  const changeColor = status ? 'text-[#0F9D58]' : 'text-[#FF4747]';

  return (
    <div className={cn('flex h-full items-center justify-between px-8 py-6', className)}>
      <div className={cn('flex w-full items-center', showIcon ? 'space-x-4' : '')}>
        {showIcon && (
          <div className="flex flex-shrink-0 items-center justify-center rounded-full bg-[#0000800F] p-3">
            <ShoppingCart className="text-primary" size={24} />
          </div>
        )}

        {/* Content should take the remaining space */}
        <div className="flex flex-1 flex-col">
          <p className="text-sm font-medium uppercase text-[#222222] md:text-base">{title}</p>
          <h2 className="text-base font-bold text-[#222222] md:text-lg">{value.toLocaleString()}</h2>
          <p className={cn('flex items-center text-sm', changeColor)}>
            <Icon
              icon={status ? 'stash:chart-trend-up' : 'uil:chart-down'}
              className={cn('mr-1', changeColor, status ? 'size-4' : 'size-3')} // Increase size for trend-up icon
            />
            {percentageChange}% <span className="ml-1 text-sm font-normal text-[#222222]">Last Month</span>
          </p>
        </div>
      </div>

      {/* Only show separator on larger screens and not for the last item */}
      {index < totalItems - 1 && (
        <Separator orientation="vertical" className={cn('mr-10 hidden h-[90%] w-[2px] bg-gray-300 lg:block', seperatorClass)} />
      )}
    </div>
  );
};

export default PurchaseCard;
