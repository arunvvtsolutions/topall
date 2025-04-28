'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMediaQuery } from '@/hooks/use-media-query';
import SubscriptionModal from './subscription-modal';
import PricingPlanCard from './pricing-plan-card';
import { useDispatch, useSelector } from '@/store';
import { Packages, Subscription } from '@/types';
import { setStreamSelectionSuccess } from '@/store/slice/user/stream-slice';

// const examTypes = ['NEET', 'JEE', 'CBSE'];

export default function PricingPlans() {
  const dispatch = useDispatch();
  const currentStandard = useSelector((state) => state.userProfile.standard);
  const currentStreams = useSelector((state) => state.userProfile.currentExams);
  const userPacakgePlan = useSelector((state) => state.userPacakgePlan.packagePlan);
  const isDesktop = useMediaQuery('(min-width: 1280px)');
  const [selectedStream, setSelectedStream] = useState<number | null>(null);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);

  useEffect(() => {
    if (currentStreams.length === 0) return;
    setSelectedStream(currentStreams[0]?.id);
    dispatch(setStreamSelectionSuccess({ stream: currentStreams[0], standards: currentStandard }));
  }, [currentStreams]);

  // Function to handle plan selection
  const planSelecterHandler = (plan: Subscription[]) => {
    setSelectedSubscription(plan);
    setOpenModal(true);
  };

  const handleStreamChange = (value: string) => {
    const stream = currentStreams.find((s) => s.id === Number(value));
    setSelectedStream(Number(value));
    dispatch(setStreamSelectionSuccess({ stream, standards: currentStandard }));
  };

  // Function to calculate subscription amount
  const calculateSubscriptionAmount = (plan: Packages) => {
    const sub = plan.subscriptions.find((s) => s.subscriptionAmountData[0].duration_type.short_name === '2026')
      ?.subscriptionAmountData[0];
    return sub ? sub?.actual_price - sub?.discount_price : 0;
  };

  return (
    <div className="flex flex-col items-center py-10">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-xl font-semibold text-[#222222] md:text-2xl lg:text-[32px]">Choose Your Plan</h1>
        <p className="text-sm font-normal text-[#6F6F6F] md:text-lg lg:text-xl">
          Select the perfect plan for your needs. Update at any Time
        </p>
      </div>

      {/* Tabs for Exam Selection */}
      {currentStreams.length > 0 && selectedStream && (
        <Tabs defaultValue={selectedStream.toString()} className="mb-8" onValueChange={handleStreamChange}>
          <TabsList className="flex w-[200px] flex-row gap-0 rounded-lg border border-borderad bg-[#F6F6F6] p-0">
            {currentStreams.map((s) => (
              <TabsTrigger
                key={s.id}
                value={s.id.toString()}
                className={cn(
                  'flex-1 rounded-lg !px-2 py-1.5 text-base font-medium transition-all md:text-lg',
                  'data-[state=active]:bg-white data-[state=active]:text-primary',
                  'data-[state=inactive]:text-[#6F6F6F]'
                )}
              >
                {s.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      {/* Pricing Plans */}
      <div className="flex max-w-5xl flex-wrap items-stretch justify-center gap-6">
        {userPacakgePlan.map((plan) => {
          return (
            <PricingPlanCard
              key={plan.id}
              plan={plan}
              planAmount={calculateSubscriptionAmount(plan)}
              onSelect={() => planSelecterHandler(plan.subscriptions)}
            />
          );
        })}
      </div>

      {/* Subscription Modal */}
      {openModal && (
        <SubscriptionModal
          data={selectedSubscription}
          open={openModal}
          title={currentStreams.find((s) => s.id === selectedStream)?.name || ''}
          onClose={() => setOpenModal(false)}
        />
      )}
    </div>
  );
}
