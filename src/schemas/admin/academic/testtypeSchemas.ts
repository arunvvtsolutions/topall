import { z } from 'zod';

export const testtypeSchema = z.object({
  id: z.number().optional(),
  imageUrl: z.any().optional(),
  isActive: z.boolean().optional(), 
  stream: z.number().min(1, { message: 'Please select a stream' }),
  testTypeListId: z.number().min(1, { message: 'Please select a test type' }),
  description: z.string().min(1, { message: 'Description cannot be empty' })
});

export type TestFormValues = z.infer<typeof testtypeSchema>;
