import { z } from 'zod';

export const subjectSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Subject name must be at least 3 characters' })
    .refine((value) => value.trim() !== '', { message: 'Subject name cannot be empty or spaces' }),

  description: z
    .string()
    .min(3, { message: 'Description must be at least 3 characters' })
    .refine((value) => value.trim() !== '', { message: 'Description cannot be empty or spaces' }),

  image: z.any().nullable(),
  is_active: z.boolean().optional()
});

export type SubjectFormValues = z.infer<typeof subjectSchema>;
