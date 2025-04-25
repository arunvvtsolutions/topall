import { z } from 'zod';

export const AcademicYearSchema = z.object({
  stream: z.number({ message: 'Select a Stream' }).min(1, { message: 'Select a stream' }),
  standard: z.union([z.number().min(1, { message: 'Select a Standard' }), z.null()]).optional(),
  startDate: z.union([
    z.string().nullable(),
    z.date().nullable()
  ]).refine((date) => date !== null, { message: 'Start date is required' }),
  endDate: z.union([
    z.string().nullable(),
    z.date().nullable()
  ]).refine((date) => date !== null, { message: 'End date is required' })
}).refine(
  (data) => data.endDate && data.startDate && new Date(data.endDate) > new Date(data.startDate),
  {
    message: 'End date must be after the start date',
    path: ['endDate']
  }
);


export type AcademicFormValues = z.infer<typeof AcademicYearSchema>;
