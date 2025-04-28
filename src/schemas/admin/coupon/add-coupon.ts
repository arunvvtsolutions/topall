import { z } from 'zod';

export const AddCouponSchema = () =>
  z.object({
    couponCode: z
      .string()
      .min(1, { message: 'Coupon code is required' })
      .max(100, { message: 'Coupon code should not exceed 100 characters' }),
    couponValue: z.string().min(1, { message: 'Coupon value is required' }),
    templateName: z
      .number({
        required_error: 'Please select a template'
      })
      .min(1, { message: 'Please select a template' }),
    couponLimit: z.string().min(1, { message: 'Coupon limit is required' }),
    influencer: z
      .number({
        required_error: 'Please select a influencer'
      })
      .refine((value) => Number(value) !== 0, {
        message: 'Please select a influencer'
      }),
    startDate: z
      .string()
      .min(1, { message: 'Start date is required' })
      .max(100, { message: 'Start date should not exceed 100 characters' }),
    endDate: z
      .string()
      .min(1, { message: 'End date is required' })
      .max(100, { message: 'End date should not exceed 100 characters' })
  });
