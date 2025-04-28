import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import { Packages, Subscription } from '@/types';
import { ButtonNames } from '@/types/enum';
import React, { useState } from 'react';

interface PricingPlanProps {
  planAmount: number;
  plan: Packages;
  onSelect: () => void;
}

const PricingPlanCard: React.FC<PricingPlanProps> = ({ planAmount, plan, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex min-h-[460px] w-full min-w-[280px] sm:w-[45%] lg:w-[30%]">
      <div
        className={cn(
          'relative flex-grow rounded-lg transition-transform duration-300 ease-in-out hover:scale-105 hover:border hover:border-primary'
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Card className="flex h-full min-h-[1px] flex-col shadow-sm">
          {/* <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">
            Most Popular
          </div> */}

          <CardHeader className="text-center">
            <h3 className="text-base font-medium sm:text-lg md:text-xl lg:text-2xl">{plan.name}</h3>
            <div className="mt-2 flex items-baseline justify-center">
              <span className="text-3xl font-bold">₹{planAmount}</span>
              <span className="ml-1 text-muted-foreground">/Month</span>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-3">
              {plan.description.map((desc, i) => (
                <li key={i} className="flex items-start">
                  <Icon icon="rivet-icons:check" className="mr-2 h-5 w-5 shrink-0 text-primary" />
                  <span className="text-sm">{desc}</span>
                </li>
              ))}
            </ul>
          </CardContent>

          <CardFooter className="mt-auto">
            {plan.subscriptions.length > 0 && (
              <Button
                className="w-full text-sm font-medium md:text-base"
                variant={isHovered ? 'default' : 'outline'}
                color="primary"
                onClick={onSelect}
              >
                {ButtonNames.SELECT_PLAN}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PricingPlanCard;
