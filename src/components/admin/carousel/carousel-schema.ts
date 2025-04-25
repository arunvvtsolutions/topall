import { z } from 'zod';

export const carouselSchema = z
  .object({
    title: z.string().min(1, 'Title is required'),
    link: z
      .string()
      .min(1, 'Link is required')
      .refine((val) => val === '' || z.string().url().safeParse(val).success, {
        message: 'Please enter a valid URL'
      }),
    description: z.string().min(1, 'Description is required'),
    standard: z.array(z.number().min(1, 'Please select at least one standard')).min(1, 'Please select at least one standard'),

    desktopImage: z
      .union([z.instanceof(File), z.string().url()])
      .optional()
      .nullable(),
    phoneImage: z
      .union([z.instanceof(File), z.string().url()])
      .optional()
      .nullable()
  })
  .refine((data) => data.desktopImage !== undefined && data.desktopImage !== null, {
    message: 'Desktop image is required',
    path: ['desktopImage']
  })
  .refine((data) => data.phoneImage !== undefined && data.phoneImage !== null, {
    message: 'Phone image is required',
    path: ['phoneImage']
  });

export type CarouselFormValues = z.infer<typeof carouselSchema>;
