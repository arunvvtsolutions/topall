import { z } from 'zod';

// Schema
export const sectionSchema = z
  .object({
    examId: z.string().optional(),
    maxAttempts: z
      .string()
      .min(1, { message: 'Maximum attempts must be at least 1' })
      .refine((val) => !isNaN(parseInt(val, 10)) && parseInt(val, 10) > 0, {
        message: 'Maximum attempts must be at least 1'
      }),
    name: z.string().min(1, { message: 'Section name is required' }),
    cMark: z
      .string()
      .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
        message: 'Correct marks must be greater than 0',
      }),
    wMark: z
      .string()
      .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
        message: 'Wrong marks cannot be empty and must be a non-negative number',
      }),
    lMark: z
      .string()
      .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
        message: 'Left marks cannot be empty and must be a non-negative number',
      }),
    totalQuestions: z
      .string()
      .min(1, { message: 'Total questions must be at least 1' })
      .refine((val) => !isNaN(parseInt(val, 10)) && parseInt(val, 10) > 0, {
        message: 'Total questions must be at least 1'
      }),
    questionType: z.number().min(0, { message: 'Question type is required and must be a valid number' }),
    staffId: z
      .number().optional(),
    subjectId: z.number().min(1, { message: 'Subject is required' })
  })
  .refine((data) => parseInt(data.maxAttempts, 10) <= parseInt(data.totalQuestions, 10), {
    path: ['maxAttempts'],
    message: 'Maximum attempts must be less than or equal to Total Questions'
  })
  .refine((data) => parseFloat(data.wMark) <= parseFloat(data.cMark), {
    path: ['wMark'],
    message: 'Wrong marks must be less than or equal to Correct marks'
  })
  .refine((data) => parseFloat(data.lMark) <= parseFloat(data.cMark), {
    path: ['lMark'],
    message: 'Left marks must be less than or equal to Correct marks'
  });

export type SectionFormValues = z.infer<typeof sectionSchema>;
