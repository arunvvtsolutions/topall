import { z } from 'zod';

export const stanardSchema = z.object({
  is_active: z.boolean(),
  stream: z.number().min(1, { message: 'Select a stream' }),
  name: z.string().min(1, { message: 'Standard name cannot be empty' }),
  description: z.string().min(1, { message: 'Description cannot be empty' }),
  image: z.any().nullable()
});

export type StandardFormValues = z.infer<typeof stanardSchema>;
