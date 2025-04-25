'use client';
import React, { useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import SubscriptionHeader from './subscription-header';
import PricingPlans from './pricing-plans';
import { useDispatch, useSelector } from '@/store';
import { getUserPackagePlan } from '@/store/slice/user/package-plan';

const Subscription = () => {
  const dispatch = useDispatch();
  const selectedStream = useSelector((state) => state.stream.stream);
  const selectedStandard = useSelector((state) => state.stream.standard);

  useEffect(() => {
    if (!selectedStream || !selectedStandard) return;

    const fetchPackagePlan = async () => {
      dispatch(getUserPackagePlan(selectedStream.id, selectedStandard.id));
    };
    fetchPackagePlan();
  }, [selectedStream, selectedStandard]);

  return (
    <div className="container px-5 sm:px-8 md:px-12 lg:px-16 xl:px-36">
      <SubscriptionHeader />
      <Separator className="bg-[#10101026]" />
      <PricingPlans />
    </div>
  );
};

export default Subscription;
