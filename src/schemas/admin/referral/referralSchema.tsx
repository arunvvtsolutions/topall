import { z } from 'zod';

export const referralBenefitsSchema = z.object({
  level: z.number().min(1, 'Level is required'),
  endDate: z.string().min(1, 'End Date is required'),
  referrerDays: z.string().min(1, 'Referrer benefiting days are required'),
  refereeDays: z.string().min(1, 'Referee benefiting days are required'),
  referrerTests: z.string().min(1, 'Referrer benefiting tests are required'),
  refereeTests: z.string().min(1, 'Referee benefiting tests are required'),
});

export type BenefitsFormValues = z.infer<typeof referralBenefitsSchema>;
