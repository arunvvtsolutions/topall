import React, { useState } from 'react';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import PriceHistory from './price-history';
import { Badge } from '@/components/ui/badge';
import { MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface SubscriptionCardProps {
  examName: string;
  targetYear: string;
  planName: string;
  price: string;
  expiryDate: string;
  notificationCount?: number;
  active: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onInactive: (id: number) => void;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  examName,
  targetYear,
  planName,
  price,
  expiryDate,
  notificationCount = 0,
  active,
  onEdit,
  onDelete,
  onInactive
}) => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const handleHistoryOpen = () => setIsHistoryOpen(true);
  const handleHistoryClose = () => setIsHistoryOpen(false);
  const id=1
  return (
    <div className="w-full rounded-[8px] border border-borderad bg-white">
      {/* Header */}
      <div className="border-b p-6">
        <div className="flex w-full items-center justify-between">
          <div className="flex gap-2">
            <h4 className="border-r-2 border-[#4B4B4B] pr-2 text-sm font-medium">{examName}</h4>
            <h4 className="text-sm font-medium text-[#4B4B4B]">{targetYear}</h4>
          </div>
          {/* Decorative Icon */}
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default" size="icon" className="text-muted-foreground">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {active && <DropdownMenuItem onClick={() => onEdit(id)}>Edit </DropdownMenuItem>}
            <DropdownMenuItem onClick={() => onDelete(id)}>Delete </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onInactive(id)}>{active ? 'Inactive' : 'Active'}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
          {/* <Icon icon={'entypo:dots-three-vertical'} aria-hidden="true" /> */}
        </div>

        <h4 className="mb-3 mt-2 text-sm font-medium">
          TILL {targetYear} EXAM ({examName})
        </h4>

        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-2">
            <h4 className="border-r-2 border-[#4B4B4B] pr-2 text-sm font-medium text-primary">{planName}</h4>
            <h4 className="flex items-center justify-center text-sm font-medium text-[#4B4B4B]">
              <Icon icon="ion:logo-usd" className="-mt-[2px] mr-1 text-sm text-[#4B4B4B]" />
              {price}
            </h4>
          </div>
          <Badge className={`rounded-full text-right ${active ? 'bg-[#ECFDF3] text-[#0F9D58]' : 'bg-[#6F6F6F33] text-gray-600'}`}>
            <Icon icon={'stash:circle-duotone'} className="mr-1 text-xs" />

            <span className={active ? 'text-[#0F9D58]' : 'text-red-500'}>{active ? 'ACTIVE' : 'INACTIVE'}</span>
          </Badge>
        </div>
      </div>

      {/* Footer Section */}
      <div className="flex items-center justify-between p-6 pb-2">
        {/* Expiry Date (Improved Semantic Markup with <time>) */}
        <time className="text-sm font-medium text-[#E31717]" dateTime={expiryDate}>
          Expires on {expiryDate}
        </time>

        {/* Buttons Section */}
        <div className="flex gap-2">
          {/* History Button */}
          <div className="flex !h-8 !w-8 items-center justify-center rounded-full border border-borderad bg-white">
            <Button
              className="flex !h-6 !w-6 items-center justify-center rounded-full bg-primary !p-0 text-white transition-all duration-200 hover:bg-primary/90"
              aria-label="View history"
              onClick={handleHistoryOpen}
            >
              <Icon icon="garden:history-fill-12" className="text-[14px] text-white" aria-hidden="true" />
            </Button>
          </div>

          {/* People Button with Notification Badge */}
          <div className="relative flex !h-8 !w-8 items-center justify-center rounded-full border border-borderad bg-white">
            <Button
              className="flex !h-6 !w-6 items-center justify-center rounded-full bg-primary !p-0 text-white transition-all duration-200 hover:bg-primary/90"
              aria-label="View people"
            >
              <Icon icon="fluent:people-28-filled" className="text-[14px] text-white" aria-hidden="true" />
            </Button>
            {/* Notification Badge */}
            {notificationCount > 0 && (
              <span
                className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white"
                role="status"
                aria-label={`${notificationCount} new notifications`}
              >
                {notificationCount}
              </span>
            )}
          </div>
        </div>
      </div>
      {/* PriceHistory Modal */}
      <PriceHistory isOpen={isHistoryOpen} onClose={handleHistoryClose} />
    </div>
  );
};

export default SubscriptionCard;
