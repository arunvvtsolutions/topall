import { z } from "zod";

export const subscriptionSchema = z.object({
  academicYear: z.string().min(1, "Academic Year is required"),
  templateName: z.string().min(1, "Subscription Name is required"),
  exam: z.string().min(1, "Exam is required"),
  targetYear: z.string().min(1, "Target Year is required"),
  packageType: z.string().min(1, "Package Type is required"),
  actualPrice: z.string().min(0, "Actual Price is required"),
  discountedPrice: z.string().min(0, "Discounted Price is required"),
  noOfDays: z.string().min(1, "No of Days is required"),
  endDate: z.string().min(1, "End Date is required"),
  stream: z.string().min(1, "Stream is required"),
  standard: z.string().min(1, "Standard is required")
});

export type SubscriptionFormValues = z.infer<typeof subscriptionSchema>;
