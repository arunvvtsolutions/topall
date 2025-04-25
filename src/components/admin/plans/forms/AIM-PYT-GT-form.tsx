'use client';

import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MainDialog } from '@/components/common/MainDialog';
import SelectDropdown from '@/components/common/Select';
import type { GenericType } from '@/types';
import { toast } from 'sonner';
import { type AIM_PYT_GT_FormValues, AIM_PYT_GT_Schema } from '../schemas';
import { useMediaQuery } from '@/hooks/use-media-query';
import { createTestPlan, gerDurationType } from '@/utils/api/packages';
import { TosterMessages } from '@/types/enum';
import { HttpStatus } from '@/types/constants';

export function AIM_PYT_GT_Form({
  name,
  onClose,
  testTypeId,
  planId,
  viewMode = false,
  existingPlan = null
}: {
  name: string | null;
  onClose: () => void;
  testTypeId: number;
  planId: number;
  viewMode?: boolean;
  existingPlan?: any;
}) {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [periods, setPeriods] = useState<GenericType[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<GenericType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<AIM_PYT_GT_FormValues>({
    resolver: zodResolver(AIM_PYT_GT_Schema),
    defaultValues: {
      usageRestriction: 'unlimited',
      period: 0,
      maxTestCount: undefined
    },
    mode: 'onChange'
  });

  // Function to fetch duration types
  const fetchDurationTypes = async () => {
    try {
      const response = await gerDurationType();
      const filtered = response.filter((item: any) => item.is_active).map((item: any) => ({ name: item.name, id: item.id }));
      setPeriods(filtered);
    } catch (error) {
      toast.error(TosterMessages.ADMIN_COMMON_ERROR);
      console.log('error', error);
    }
  };

  // Fetch duration types on component mount
  useEffect(() => {
    fetchDurationTypes();
  }, []);

  // Set form values based on existing plan when in view mode
  useEffect(() => {
    if (existingPlan && periods.length > 0) {
      form.setValue('usageRestriction', existingPlan.limit === 'unlimited' ? 'unlimited' : 'limited');
      form.setValue('maxTestCount', Number.parseInt(existingPlan.limit));

      if (existingPlan.durationTypeId) {
        const periodObj = periods.find((p) => p.id === existingPlan.durationTypeId);
        if (periodObj) {
          form.setValue('period', periodObj.id);
          setSelectedPeriod(periodObj);
        }
      }
    }
  }, [existingPlan, form, periods]);

  const usageRestriction = form.watch('usageRestriction');

  useEffect(() => {
    // Skip resetting on initial render if needed
    if (!form.getValues('usageRestriction')) return;

    // Reset the entire form whenever usageRestriction changes
    form.reset({
      usageRestriction: usageRestriction,
      period: 0,
      maxTestCount: undefined
    });

    // Optional: clear selected period from state
    setSelectedPeriod(null);
  }, [usageRestriction]);

  // Form Submit Handler
  async function onSubmit(data: AIM_PYT_GT_FormValues) {
    if (viewMode) {
      // In view mode, just close the modal
      onClose();
      return;
    }
    setLoading(true);

    const isUnlimited = usageRestriction === 'unlimited';

    const payload = {
      limit: isUnlimited ? 'unlimited' : String(data.maxTestCount),
      testTypeId,
      packagePlanId: planId,
      durationTypeId: selectedPeriod?.id
    };

    try {
      const response = await createTestPlan(payload);
      if (response.statusCode === HttpStatus.OK) {
        toast.success(TosterMessages.PLAN_CREATE_SUCCESS);
      } else {
        toast.error(TosterMessages.PLAN_CREATE_FAIL);
      }
    } catch (error) {
      toast.error(TosterMessages.PLAN_CREATE_FAIL);
      console.error('error', error);
    } finally {
      setLoading(false);
      onClose();
    }
  }

  // Period Selection Handler
  const handleSelectPeriod = (item: GenericType) => {
    if (!viewMode) {
      form.setValue('period', item.id);
      setSelectedPeriod(item);

      // Reset maxTestCount when period changes
      form.setValue('maxTestCount', undefined, { shouldValidate: true });
    }
  };

  useEffect(() => {
    const fetchDurationTypes = async () => {
      try {
        const response = await gerDurationType();
        const filtered = response.filter((item: any) => item.is_active).map((item: any) => ({ name: item.name, id: item.id }));
        setPeriods(filtered);
      } catch (error) {
        toast.error(TosterMessages.ADMIN_COMMON_ERROR);
        console.log('error', error);
      }
    };
    fetchDurationTypes();
  }, []);

  return (
    <MainDialog isOpen={true} onOpenChange={onClose} title={viewMode ? 'View Usage Restriction' : 'Set Usage Restriction'}>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-base font-medium text-[#4B4B4B]">Test Type</h3>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:space-x-6">
                <FormItem className="flex-1">
                  <FormControl>
                    <Input value={name!} className="text-sm font-normal text-[#4B4B4B]" readOnly />
                  </FormControl>
                </FormItem>

                {/* Radio Buttons for Usage Restriction */}
                <FormField
                  control={form.control}
                  name="usageRestriction"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-4">
                      <FormControl>
                        <RadioGroup
                          onValueChange={!viewMode ? field.onChange : undefined}
                          value={field.value}
                          className="flex space-x-4"
                          disabled={viewMode}
                        >
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem
                                color="primary"
                                value="limited"
                                id="r-limited"
                                checked={field.value === 'limited'}
                                disabled={viewMode || loading}
                              />
                            </FormControl>
                            <FormLabel className="!mt-0 cursor-pointer text-base font-medium text-[#4B4B4B]" htmlFor="r-limited">
                              Limited
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem
                                color="primary"
                                value="unlimited"
                                id="r-unlimited"
                                checked={field.value === 'unlimited'}
                                disabled={viewMode || loading}
                              />
                            </FormControl>
                            <FormLabel
                              className="!mt-0 cursor-pointer text-base font-medium text-[#4B4B4B]"
                              htmlFor="r-unlimited"
                            >
                              Unlimited
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Conditional Fields for Limited Access */}
              {usageRestriction === 'limited' && (
                <div className="w-full space-y-4">
                  <h3 className="text-sm font-medium">
                    Test Accessible<span className="text-red-500">*</span>
                  </h3>

                  <div className="flex w-full items-center overflow-hidden rounded-lg">
                    <FormField
                      control={form.control}
                      name="period"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <SelectDropdown
                              className="!rounded-r-none"
                              data={periods}
                              onChange={(item) => {
                                handleSelectPeriod(item);
                                if (!viewMode) field.onChange(item.id);
                              }}
                              value={selectedPeriod}
                              placeholder={isMobile ? 'Period' : 'Select Period'}
                              name="period-selector"
                              width="w-full"
                              size="md"
                              placeholderColor="text-[#4B4B4B]"
                              primaryIcon={false}
                              fontWeight="font-normal"
                              fontsize="text-xs"
                              disabled={viewMode || loading}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="maxTestCount"
                      render={({ field, fieldState }) => (
                        <FormItem className="w-full flex-1 sm:w-auto">
                          <FormControl>
                            <Input
                              autoComplete="off"
                              placeholder="Enter Test Count"
                              className="h-[40px] rounded-l-none rounded-r-lg text-primary"
                              {...field}
                              onChange={(e) => {
                                if (viewMode) return;

                                const value = e.target.value;
                                if (/^\d*$/.test(value)) {
                                  // Allow only numeric values
                                  form.setValue('maxTestCount', value === '' ? null : Number(value), {
                                    shouldValidate: true
                                  });
                                } else {
                                  form.setError('maxTestCount', {
                                    type: 'manual',
                                    message: 'Enter a valid number'
                                  });
                                }
                              }}
                              value={field.value === undefined ? '' : field.value}
                              readOnly={viewMode}
                              disabled={loading}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Error Messages for both inputs */}
                  <div className="flex gap-9">
                    <FormField
                      control={form.control}
                      name="period"
                      render={({ fieldState }) => (
                        <>{fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}</>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="maxTestCount"
                      render={({ fieldState }) => (
                        <>{fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}</>
                      )}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end">
              <Button
                type={viewMode ? 'button' : 'submit'}
                variant="default"
                color="primary"
                size="md"
                className="text-sm font-normal"
                onClick={viewMode ? onClose : undefined}
                disabled={loading}
              >
                {viewMode ? 'Close' : 'Add'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </MainDialog>
  );
}
