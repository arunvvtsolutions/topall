import { z } from 'zod';

// Validation Schema
export const profileSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string(),
  mobileNumber: z.string(),
  gender: z.string(),
  dob: z.string().optional(),
  // dob: z
  // .string()
  // .refine((val) => {
  //   const selectedDate = new Date(val);
  //   const today = new Date();
  //   // Set time to 00:00:00 to avoid timezone issues
  //   selectedDate.setHours(0, 0, 0, 0);
  //   today.setHours(0, 0, 0, 0);
  //   return selectedDate <= today;
  // }, {
  //   message: "Date of birth cannot be in the future",
  // }),
  loginCountry: z.string(),
  stateId: z.number().or(z.null()),
  city: z.number().or(z.null()),
  address: z.string(),
  zipcode: z.string()
});

export type ProfileFormValues = {
  name: string;
  email: string;
  mobileNumber: string;
  gender: string;
  standard: string;
  loginCountry: string;
  stateId: number | null;
  city: number | null;
  zipcode: string;
  address: string;
  dob: string;
};
