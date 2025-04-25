import { z } from 'zod';

const chapterSchema = z
  .object({
    id: z.number().optional(),
    name: z.string().optional(),
    ePercentage: z.string(),
    mPercentage: z.string(),
    hPercentage: z.string(),
    totalQues: z.string(),
    timePerQues: z.string(),
    isPreviousYear: z.boolean().optional(),
    acceptPercentage: z.string()
  })
  .refine(
    (value) => {
      const { ePercentage, mPercentage, hPercentage } = value;
      if (Number(ePercentage) + Number(mPercentage) + Number(hPercentage) > 100) {
        return false;
      }
      return true;
    },
    { message: 'Total of easy medium hard cannot be more than 100' }
  );

const generateSchema = z.object({
  // timeSlot: z.array(z.number()),
  // questionSlot: z.array(z.number()),
  // correctMarks: z.string(),
  // wrongMarks: z.string(),
  // leftMarks: z.string()
  timeSlot: z.array(z.number()).min(1, { message: 'Please select at least one time slot.' }),
  questionSlot: z.array(z.number()).min(1, { message: 'Please select at least one Question slot.' }),
  correctMarks: z.string().min(1, { message: 'Correct Marks is required' }),
  wrongMarks: z.string().min(1, { message: 'Wrong Marks is required' }),
  leftMarks: z.string().min(1, { message: 'Left Marks is required' })
});

const conceptSchema = z.object({
  topicWiseTimePerQuestion: z.string(),
  topicWiseTotalQuestion: z.string()
});

export const steamSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Stream is required'),
  description: z.string().min(1, 'Description is required'),
  imageFile: z.any().optional(),
  subjectIds: z.array(z.number()).min(1).nonempty('Please select at least one subject.'),
  questionTypes: z.array(z.number()).min(1).nonempty('Please select at least one type.'),
  totalScore: z.string().min(1, { message: 'Total score is required' }),
  totalDuration: z.string().min(1, 'Duration is required'),
  is_active: z.boolean().optional(),
  generateTest: generateSchema,
  chapterWiseTest: z.array(chapterSchema),
  conceptWiseTest: conceptSchema
});

export type StreamFormValues = z.infer<typeof steamSchema>;

export type ChapterFormValues = z.infer<typeof chapterSchema>;
// export type ChapterFormValues = {
//   id?: string | number;
//   name?: string;
//   ePercentage: string;
//   mPercentage: string;
//   hPercentage: string;
//   totalQuestions: string;
//   timePerQuestion: string;
//   acceptPercentage: string;
// };
