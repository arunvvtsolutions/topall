'use client';
import { MainDialog } from '@/components/common/MainDialog';
import SelectDropdown from '@/components/common/Select';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { BenefitsFormValues, referralBenefitsSchema } from '@/schemas/admin/referral/referralSchema';
import { FormType, ReferralItems } from '@/types/enum';
import {
  createReferral,
  getReferralBenefitsHistory,
  getReferralBenefitsList,
  getReferralLevels,
  updateReferral
} from '@/utils/api/referral';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const AddBenefitsForm = ({ isOpen, onClose, initialData,refreshData }: { isOpen: boolean; onClose: () => void; initialData: any;refreshData: () => void; }) => {
  const action = initialData ? FormType.UPDATE : FormType.ADD;
  const [levelOptions, setLevelOptions] = useState<{ id: number; name: string }[]>([]);
  const dateInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch dynamic referral levels
  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const response = await getReferralLevels();
        setLevelOptions(response || []);
      } catch (error) {
        console.error('Failed to fetch referral levels:', error);
      }
    };

    fetchLevels();
  }, []);

  const defaultValues: BenefitsFormValues = initialData
    ? {
        level: Number(initialData?.level) || 0,
        referrerDays: initialData.referrerBenefitedDays.toString(),
        refereeDays: initialData.refereeBenefitedDays.toString(),
        referrerTests: initialData.referrerBenefitedTests.toString(),
        refereeTests: initialData.refereeBenefitedTests.toString(),
        endDate: initialData.expiredDate?.split('T')[0] || ''
      }
    : {
        level: 0,
        referrerDays: '',
        refereeDays: '',
        referrerTests: '',
        refereeTests: '',
        endDate: ''
      };
  const form = useForm<BenefitsFormValues>({
    resolver: zodResolver(referralBenefitsSchema),
    defaultValues
  });

  const onSubmit = async (data: BenefitsFormValues) => {
    const payload = {
      level: data.level,
      benefitDaysReferrer: Number(data.referrerDays),
      benefitTestsReferrer: Number(data.referrerTests),
      benefitDaysReferee: Number(data.refereeDays),
      benefitTestsReferee: Number(data.refereeTests),
      endDate: data.endDate
    };

    try {
      if (initialData) {
        await updateReferral(initialData.id, payload);
        toast.success('Referral updated successfully');
      } else {
        await createReferral(payload);
        toast.success('Referral created successfully');
      }
      refreshData();
      onClose();
    } catch (error: any) {
      if (error?.response?.status === 409) {
        toast.error(error?.response?.data?.message || 'Already exists');
      } else {
        toast.error('Error submitting referral');
        console.error('Error submitting referral:', error);
      }
    }
  };

  return (
    <MainDialog
      title={initialData ? ReferralItems.EDIT_BENEFITS : ReferralItems.ADD_BENEFITS}
      isOpen={isOpen}
      onOpenChange={onClose}
      size="default"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-4 mt-4">
            <div className="w-full">
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-[#4B4B4B]">{ReferralItems.LEVEL}</FormLabel>
                    <FormControl>
                      <SelectDropdown
                        name="level"
                        data={levelOptions}
                        value={levelOptions.find((opt) => opt.id === field.value) || null} // Ensure it's the full object
                        onChange={(selected) => field.onChange(selected.id)}
                        placeholder="Select Level"
                        width="w-full"
                        height="h-10"
                        placeholderColor="!text-[#4B4B4B]"
                        color="text-#4B4B4B"
                        borderRadius="!rounded-[4px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="mb-4 mt-4 flex flex-col items-center justify-between gap-2 md:flex-row">
            <div className="w-full">
              <FormField
                control={form.control}
                name="referrerDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-[#4B4B4B]">{ReferralItems.BENEFITTING_REFERRER}</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Days Count"
                        color="secondary"
                        className="text-[#4B4B4B] placeholder:text-[#4B4B4B]"
                        size="md"
                        autoComplete="off"
                        value={field.value}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '');

                          field.onChange(value);
                        }}
                        // disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full">
              <FormField
                control={form.control}
                name="refereeDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-[#4B4B4B]">{ReferralItems.BENEFITTING_REFEREE}</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Days Count"
                        color="secondary"
                        className="text-[#4B4B4B] placeholder:text-[#4B4B4B]"
                        size="md"
                        autoComplete="off"
                        value={field.value}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '');

                          field.onChange(value);
                        }}
                        // disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="mb-4 mt-4 flex flex-col items-center justify-between gap-2 md:flex-row">
            <div className="w-full">
              <FormField
                control={form.control}
                name="referrerTests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-[#4B4B4B]">{ReferralItems.TESTS_REFERRER}</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Tests Count"
                        color="secondary"
                        className="text-[#4B4B4B] placeholder:text-[#4B4B4B]"
                        size="md"
                        autoComplete="off"
                        value={field.value}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '');

                          field.onChange(value);
                        }}
                        // disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full">
              <FormField
                control={form.control}
                name="refereeTests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-[#4B4B4B]">{ReferralItems.TESTS_REFEREE}</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Tests Count"
                        color="secondary"
                        className="text-[#4B4B4B] placeholder:text-[#4B4B4B]"
                        size="md"
                        autoComplete="off"
                        value={field.value}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '');

                          field.onChange(value);
                        }}
                        // disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="mb-4 mt-4">
            <div className="w-full">
              {/* Subject Authorised Dropdown */}
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mb-2 text-sm font-semibold text-[#4B4B4B]">{ReferralItems.END_DATE}</FormLabel>
                    <FormControl>
                      <div className="relative w-full">
                        {/* Custom Placeholder */}
                        {!field.value && (
                          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#4B4B4B]">
                            Select End Date
                          </span>
                        )}

                        {/* Date Input */}
                        <Input
                          type="date"
                          id="endDate"
                          {...field}
                          ref={dateInputRef} // Your own ref
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value)}
                          className={`h-10 w-full rounded-sm border border-border pr-12 text-sm font-medium text-B2CAgrayn ${
                            !field.value ? 'text-transparent' : 'text-gray-900'
                          } md:text-base [&::-webkit-calendar-picker-indicator]:hidden`}
                        />

                        {/* Calendar Icon */}
                        <img
                          src="/images/calendar.svg"
                          alt="Calendar Icon"
                          className="absolute right-4 top-1/2 h-6 w-6 -translate-y-1/2 cursor-pointer"
                          onClick={() => {
                            dateInputRef.current?.showPicker(); // This works safely
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              // disabled={loading}
              size="default"
              variant="default"
              color="primary"
              data-testid="testtype-submit-btn"
              className="h-auto py-2"
            >
              {/* {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} */}
              {/* {type === FormType.EDIT ? FormType.UPDATE : FormType.ADD} */}
              {action}
            </Button>
          </div>
        </form>
      </Form>
    </MainDialog>
  );
};
export default AddBenefitsForm;
