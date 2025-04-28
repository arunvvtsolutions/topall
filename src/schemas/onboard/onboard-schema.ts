import { z } from 'zod';

export const targetYearScores = z.object({
  id: z.number(),
  name: z.string(),
  targetYear: z.number().min(1, 'Target Year is required'),
  targetScore: z.string().min(1, 'Target Score is required')
});

export const onboardFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  state: z.nullable(z.number().min(1, 'State is required')),
  referralCode: z.string(),
  streamIds: z.array(z.number()).min(1, 'Please select at least one stream'),
  standardId: z.string().min(1, 'Please select at Standard'),
  targets: z.array(targetYearScores)
});

export type OnboardFormValues = z.infer<typeof onboardFormSchema>;

export type targetYearScores = z.infer<typeof targetYearScores>;
