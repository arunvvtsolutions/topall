import { z } from 'zod';

export const facultySchema = z.object({
  facultyName: z.string().min(1, 'Faculty Name is required'),
  countryCode: z.string().min(1, 'Country code is required'),
  mobileNumber: z
  .string()
  .regex(/^\d{10}$/, 'Number must be exactly 10 digits'),
  stream: z
  .array(z.number())
  .min(1, 'Please select at least one stream'), 
  subjectAuthorised: z
  .string({
    required_error: 'Kindly select any subject',
    invalid_type_error: 'Kindly select any subject',
  })
  .min(1, 'Kindly select any subject'),
  expertFaculty: z.boolean().default(false), 
  profilePicture: z.union([z.instanceof(File), z.string(), z.null()]).optional(),
});

export type FacultyFormValues = z.infer<typeof facultySchema>;
