import { z } from 'zod';

export const formSchema = z.object({
  fileName: z.string().min(1, 'File name is required'),
  standard: z.number().min(1, 'Standard is required'),
  files: z.instanceof(File, { message: 'File is required' }).optional()
});

export type FormValues = z.infer<typeof formSchema>;
