import { z } from 'zod';

// Package Plan Schema
export const packagePlanSchema = z.object({
  name: z
    .string()
    .min(1, 'Plan Name is required')
    .refine((val) => val.trim().length > 0, {
      message: 'Plan Name cannot be empty spaces'
    }),
  standardList: z.array(z.number()).nonempty('At least one standard is required'),
  description: z.string().optional()
});

export type FormValues = z.infer<typeof packagePlanSchema>;

// AIM PYT GT Schema
export const AIM_PYT_GT_Schema = z
  .object({
    usageRestriction: z.enum(['limited', 'unlimited']),
    period: z.number().optional(),
    maxTestCount: z.preprocess(
      (val) => (val === '' || val === undefined ? undefined : Number(val)),
      z
        .number({
          required_error: 'Max test count is required',
          invalid_type_error: 'Enter a valid number'
        })
        .min(1, 'Enter a valid number')
        .nullable()
        .optional()
    )
  })
  .superRefine((data, ctx) => {
    if (data.usageRestriction === 'limited') {
      if (!data.period || data.period < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Period is required',
          path: ['period']
        });
      }
      if (data.maxTestCount === undefined || data.maxTestCount === null || data.maxTestCount < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Max test count is required',
          path: ['maxTestCount']
        });
      }
    }
  });

export type AIM_PYT_GT_FormValues = z.infer<typeof AIM_PYT_GT_Schema>;

// Chapter Wise Schema
export const chapterWiseSchema = z.object({
  usageRestriction: z.enum(['limited', 'unlimited']),
  accessType: z.enum(['allChapterLevelAccess', 'selectChaptersForAllLevelAccess']).optional(),
  levels: z.array(z.number()).optional(),
  subjects: z.array(z.number()).optional()
});

export type ChapterWiseFormValues = z.infer<typeof chapterWiseSchema>;

// Concept Wise Schema
export const conceptWiseFormSchema = z.object({
  usageRestriction: z.enum(['limited', 'unlimited']),
  accessType: z.enum(['conceptCountForAllChapters', 'allConceptsForSelectedChapters']).optional(),
  count: z
    .union([z.string(), z.number()])
    .optional()
    .refine((val) => typeof val === 'number' || !isNaN(Number(val)), {
      message: 'Count must be a valid number'
    }),
  subjects: z.array(z.number()).optional()
});

export type ConceptWiseFormValues = z.infer<typeof conceptWiseFormSchema>;
