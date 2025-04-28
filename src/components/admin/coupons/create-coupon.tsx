'use client';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { MainDialog } from '@/components/common/MainDialog';
import { GenerateTestProps } from '@/types/exams';
import { Errors } from '@/types/enum';
import { useSession } from 'next-auth/react';
import { generateTest, getExamPreData } from '@/utils/api/generate-test';
import { useDispatch } from '@/store';
import { getSubjects } from '@/store/slice/admin/academic';
import { getChapterList } from '@/utils/api/exams';
import { HttpStatusCode } from 'axios';
import { MultiSelect } from '@/components/common/MultiSelect';
import DateRangePicker from '@/components/date-range-picker';
import { format } from 'date-fns';
import { generateSchema } from '@/schemas/generate/generate-schema';
import { AddCouponSchema } from '@/schemas/admin/coupon/add-coupon';
import SelectDropdown from '@/components/common/Select';

export interface AddCouponProps {
  couponCode: string;
  couponValue: string;
  templateName: number;
  couponLimit: string;
  influencer: number;
  startDate: string;
  endDate: string;
  isLimitted: number;
  typeOfCouponValue: number;
}

interface CouponModal {
  open: boolean;
  title: string;
  onClose: () => void;
}

const couponTemplates = [
  { id: 1, name: 'New Year Discount' },
  { id: 2, name: 'Black Friday Sale' },
  { id: 3, name: 'Cyber Monday Deal' },
  { id: 4, name: 'Holiday Special' },
  { id: 5, name: 'Summer Sale' },
  { id: 6, name: 'Back to School Offer' },
  { id: 7, name: 'Flash Sale' },
  { id: 8, name: 'VIP Customer Discount' },
  { id: 9, name: 'Referral Bonus' },
  { id: 10, name: 'Limited Time Offer' }
];

const influencerCoupons = [
  { id: 1, name: 'Social Media Exclusive' },
  { id: 2, name: 'Instagram Special' },
  { id: 3, name: 'YouTube Subscriber Deal' },
  { id: 4, name: 'TikTok Promo Code' },
  { id: 5, name: 'Twitter/X Discount' },
  { id: 6, name: 'Influencer Collab Offer' },
  { id: 7, name: 'Exclusive Fan Discount' },
  { id: 8, name: 'Limited-Time Creator Code' },
  { id: 9, name: 'Early Access Promo' },
  { id: 10, name: 'VIP Follower Discount' }
];

const CreateCouponModal: React.FC<CouponModal> = ({ open, title, onClose }) => {
  const { data } = useSession();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const form = useForm<AddCouponProps>({
    resolver: zodResolver(AddCouponSchema()),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    defaultValues: {
      couponCode: '',
      couponValue: '',
      templateName: 0,
      couponLimit: '',
      influencer: 0,
      startDate: '',
      endDate: ''
    }
  });

  const { handleSubmit, control, setValue } = form;

  const onSubmit = async (formData: AddCouponProps) => {};

  return (
    <MainDialog className={'text-[16px] lg:!text-[18px]'} title={title} isOpen={open} onOpenChange={onClose} size="md">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="border-t-[rgba(111, 111, 111, 1)] grid w-full gap-2 border-t pt-2 md:pt-4">
            {/* Section Name and Choose Subject in Flex */}
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              {/* Name Input Field */}
              <FormField
                control={control}
                name="couponCode"
                render={({ field }) => (
                  <FormItem className="w-full flex-1 sm:w-auto">
                    <FormLabel className="text-[12px] !font-[600] !text-[#4B4B4B] md:text-[14px]">
                      COUPON CODE<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        placeholder="Enter Coupon code"
                        className="rounded-lg text-primary"
                        disabled={loading}
                        {...field}
                        size={24}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="couponValue"
                render={({ field }) => (
                  <FormItem className="w-full flex-1 sm:w-auto">
                    <FormLabel className="text-[12px] !font-[600] !text-[#4B4B4B] md:text-[14px]">
                      COUPON VALUE<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="flex">
                        {' '}
                        <SelectDropdown
                          className="w-[100px] !rounded-r-none border-[1px] border-[#222222] sm:w-[150px]"
                          data={[
                            { id: 1, name: '₹' },
                            { id: 2, name: '%' }
                          ]}
                          onChange={(item) => {
                            form.setValue('typeOfCouponValue', item.id);
                            form.trigger();
                          }}
                          placeholder="Select value"
                          name="stream-selector"
                          size="md"
                          placeholderColor="text-[#4B4B4B]"
                          primaryIcon={false}
                        />
                        <Input
                          autoComplete="off"
                          placeholder="Enter Coupon Value"
                          className="h-[40px] rounded-l-none rounded-r-lg text-primary"
                          disabled={loading}
                          {...field}
                          size={24}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <FormField
                control={control}
                name="templateName"
                render={({ field }) => (
                  <FormItem className="w-full flex-1 sm:w-auto">
                    <FormLabel className="text-[12px] !font-[600] !text-[#4B4B4B] md:text-[14px]">
                      TEMPLATE NAME<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <SelectDropdown
                        data={[{ id: 0, name: 'Select Tempate' }, ...couponTemplates]}
                        onChange={(item) => {
                          form.setValue('templateName', item.id);
                          form.trigger();
                        }}
                        placeholder="Select Template"
                        value={couponTemplates.find((c) => c.id === Number(form.getValues('templateName')))}
                        name="stream-selector"
                        width="w-full"
                        size="md"
                        placeholderColor="text-[#4B4B4B]"
                        primaryIcon={false}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="couponLimit"
                render={({ field }) => (
                  <FormItem className="w-full flex-1 sm:w-auto">
                    <FormLabel className="text-[12px] !font-[600] !text-[#4B4B4B] md:text-[14px]">
                      COUPON LIMIT<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="flex">
                        {' '}
                        <SelectDropdown
                          className="w-[100px] !rounded-r-none border-[1px] border-[#222222] sm:w-[150px]"
                          data={[
                            { id: 1, name: 'Limited' },
                            { id: 2, name: 'Unlimited  ' }
                          ]}
                          onChange={(item) => {
                            form.setValue('isLimitted', item.id);
                            form.trigger();
                          }}
                          placeholder="Select value"
                          name="stream-selector"
                          size="md"
                          placeholderColor="text-[#4B4B4B]"
                          primaryIcon={false}
                        />
                        <Input
                          autoComplete="off"
                          type="number"
                          placeholder="Enter Coupon Limit"
                          className="h-[40px] rounded-l-none rounded-r-lg text-primary"
                          disabled={loading}
                          {...field}
                          size={24}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <FormField
                control={control}
                name="influencer"
                render={({ field }) => (
                  <FormItem className="w-full flex-1 sm:w-auto">
                    <FormLabel className="text-[12px] !font-[600] !text-[#4B4B4B] md:text-[14px]">
                      INFLUENCER<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <SelectDropdown
                        data={[{ id: 0, name: 'Select Influencer' }, ...influencerCoupons]}
                        onChange={(item) => {
                          form.setValue('influencer', item.id);
                          form.trigger();
                        }}
                        placeholder="Select Influencer"
                        value={influencerCoupons?.find((item) => item.id === field.value) || null}
                        name="stream-selector"
                        width="w-full"
                        size="md"
                        placeholderColor="text-[#4B4B4B]"
                        primaryIcon={false}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="mb-2">
                      <FormLabel className="text-[12px] !font-[600] !text-[#4B4B4B] md:text-[14px]">Start Date</FormLabel>
                      <FormControl>
                        <DateRangePicker
                          dateFormat="LLL, y"
                          placeHolder="Select Start Date"
                          date={form.getValues('startDate')}
                          setDate={(date) => {
                            form.setValue('startDate', format(date, 'LLL dd, y'));
                            form.trigger();
                          }}
                          dateMode="single"
                          iconPosition="right"
                          className=""
                          buttonClassName="border p-0 rounded-[8px] h-[40px] flex justify-between items-center w-full  !px-[.75rem]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="mb-2">
                    <FormLabel className="text-[12px] !font-[600] !text-[#4B4B4B] md:text-[14px]">End Date</FormLabel>
                    <FormControl>
                      <DateRangePicker
                        dateFormat="LLL, y"
                        placeHolder="Select End Date"
                        date={form.getValues('endDate')}
                        setDate={(date) => {
                          form.setValue('endDate', format(date, 'LLL dd, y'));
                          form.trigger();
                        }}
                        dateMode="single"
                        iconPosition="right"
                        className=""
                        buttonClassName="border p-0 rounded-[8px] h-[40px] flex justify-between items-center w-full !px-[.75rem]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-4 flex justify-end">
            <Button
              disabled={loading}
              className="h-[36px] w-max md:h-[48px]"
              style={{
                backgroundColor: loading ? '#6f6f6f' : '#000080',
                color: loading ? 'white' : 'white'
              }}
              type="submit"
            >
              {loading ? (
                <div className="animate-spin">
                  <Loader2 className="w-5" />
                </div>
              ) : (
                'Add'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </MainDialog>
  );
};

export default CreateCouponModal;
