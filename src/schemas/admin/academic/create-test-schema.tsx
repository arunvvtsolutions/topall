import { z } from 'zod';

export const createTestSchema = ({ isEdit, startDate }: { isEdit: boolean; startDate: Date | undefined }) =>
  z
    .object({
      streamId: z
        .number({
          required_error: 'Please select a stream'
        })
        .refine((value) => value !== 0, {
          message: 'Please select a stream'
        }),
      testTypeId: z
        .number({
          required_error: 'Please select a test type'
        })
        .refine((value) => value !== 0, {
          message: 'Please select a test type'
        }),
      standardId: z
        .number({
          required_error: 'Please select a standard'
        })
        .refine((value) => value !== 0, {
          message: 'Please select a standard'
        }),
      name: z.string().min(1, 'Name is required'),
      startTime: z
        .any({
          required_error: 'Start date is required'
        })
        .refine(
          (startTime) => {
            if (startTime instanceof Date) {
              return !isNaN(startTime.getTime());
            }
            if (typeof startTime === 'string') {
              return startTime.trim().length > 0;
            }
            return false;
          },
          { message: 'Start date is required' }
        )
        .refine(
          (startTime) => {
            if (isEdit) return true;
            const currentDate = new Date();
            if (startTime instanceof Date) {
              return startTime >= currentDate;
            }
            if (typeof startTime === 'string') {
              const startDate = new Date(startTime);
              return startDate >= currentDate;
            }
            return true;
          },
          { message: 'Start date must be greater than current time' }
        ),
      endTime: z
        .any({
          required_error: 'Start date is required'
        })
        .refine(
          (endTime) => {
            if (endTime instanceof Date) {
              return !isNaN(endTime.getTime());
            }
            if (typeof endTime === 'string') {
              return endTime.trim().length > 0;
            }
            return false;
          },
          { message: 'End date is required' }
        )
        .refine(
          (data) => {
            if (!startDate) {
              return false;
            }

            if (!data) {
              return false;
            }

            if (new Date(data) <= new Date(startDate)) {
              return false;
            }

            return true;
          },
          {
            message: 'End time must be greater than start time' // Proper error message
          }
        ),
      duration: z
        .string()
        .min(1, 'Duration is required')
        .refine((value) => Number(value) > 0, {
          message: 'Duration must be greater than 0'
        }),
      marks: z
        .string()
        .min(1, 'Marks is required')
        .refine((value) => Number(value) > 0, {
          message: 'Marks must be greater than 0'
        }),
      packageId: z.array(z.number()).min(1, 'Please select at least one package'),
      allowResume: z.boolean().default(false).optional(),
      allowRetake: z.boolean().default(false).optional(),
      showSyllabus: z.boolean().default(false).optional(),
      instantResult: z.boolean().default(false).optional()
    })
    .refine(
      (data) => {
        if (data.startTime && data.endTime) {
          return new Date(data.endTime) >= new Date(data.startTime);
        }
        return true;
      },
      {
        message: 'End time must not be less than start time',
        path: ['endTime']
      }
    );

export type CreateTestFormData = z.infer<ReturnType<typeof createTestSchema>>;
