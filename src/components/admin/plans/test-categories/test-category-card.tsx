'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Plus } from 'lucide-react';
import type React from 'react';

interface TestCategoryProps {
  category: {
    id: number;
    name: string;
    iconPath: string;
    plan: string;
  };
  onCreate: (type: string, id: number) => void;
  onView?: (type: string, id: number) => void; // New prop for viewing existing plans
  created: any;
  limit: string;
}

const TestCategoryCard: React.FC<TestCategoryProps> = ({ category, onCreate, onView, created, limit }) => {

  const normalizedLimit = limit?.toString().trim().toLowerCase() || null;
  const isNumeric = !isNaN(Number(normalizedLimit));

  const shouldShowPlan = created && (normalizedLimit === 'unlimited' || normalizedLimit === null || isNumeric);

  // Tooltip text based on your logic
  const fullLabel = created
    ? normalizedLimit === 'unlimited'
      ? `${category.name} • Unlimited`
      : normalizedLimit === null || isNumeric
        ? `${category.name} • Limited`
        : category.name
    : category.name;

  // Handle card click for viewing existing plans
  const handleCardClick = () => {
    if (created && onView) {
      onView(category.name, category.id);
    }
  };

  return (
    <Card
      className={`flex items-center justify-between p-4 transition-shadow hover:shadow-md ${created ? 'cursor-pointer' : ''}`}
      onClick={created ? handleCardClick : undefined}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <img
          src={category.iconPath || '/placeholder.svg'}
          alt={category.name}
          className="size-8 shrink-0 rounded-full bg-primary p-[5px]"
        />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex min-w-0 items-center gap-2 overflow-hidden">
                <span className="overflow-hidden text-ellipsis whitespace-nowrap text-base font-normal text-[#222222]">
                  {category.name}
                </span>

                {/* Show plan only if created and limit is 'unlimited' or null */}
                {shouldShowPlan && (
                  <>
                    <Separator orientation="vertical" className="h-5 shrink-0 bg-[#4B4B4B]" />

                    <span className="overflow-hidden text-ellipsis whitespace-nowrap text-base font-normal text-[#4B4B4B]">
                      {normalizedLimit === 'unlimited' ? 'Unlimited' : 'Limited'}
                    </span>

                    <Icon icon={'si:chevron-right-alt-fill'} className="size-5 shrink-0 text-base transition-all" />
                  </>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{fullLabel}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {!created && (
        <Button
          size="icon"
          variant="default"
          className="ml-2 h-8 w-8 shrink-0 rounded-full bg-primary text-white hover:bg-primary hover:text-white"
          onClick={(e) => {
            e.stopPropagation();
            onCreate(category.name, category.id);
          }}
        >
          <Plus className="size-5" />
        </Button>
      )}
    </Card>
  );
};

export default TestCategoryCard;
