import { z } from 'zod';

export const generateSchema = () =>
  z
    .object({
      name: z.string().min(1, { message: 'Name is required' }).max(100, { message: 'Name should not exceed 100 characters' }),

      subjects: z.array(z.string()).min(1, { message: 'Please select at least one subject' }),

      chapters: z
        .record(z.array(z.string()).nonempty(), { message: 'Chapters cannot be empty' })
        .refine((chapters) => Object.values(chapters).every((chapter) => chapter.length > 0), {
          message: 'Each selected subject must have at least one chapter'
        }),

      // Changed validation for level to only check on form submission
      level: z
        .string()
        .transform((val) => Number(val))
        .optional(),

      // Added individual validation for difficulty levels
      easy: z.number().int().min(0).max(100),
      medium: z.number().int().min(0).max(100),
      hard: z.number().int().min(0).max(100),

      questions: z.number().int().positive({ message: 'Please select the number of questions' }),

      time: z.number().int().positive({ message: 'Please select the test time' })
    })
    .refine(
      (data) => {
        const { subjects, chapters } = data;
        // Ensure each selected subject has at least one chapter
        return subjects.every((subject) => chapters[subject] && chapters[subject].length > 0);
      },
      { message: 'Each selected subject must have at least one chapter' }
    )
    .refine(
      (data) => {
        // Validate that easy + medium + hard = 100%
        const total = (data.easy || 0) + (data.medium || 0) + (data.hard || 0);
        return total === 100;
      },
      { message: 'The Easy, Medium, and Hard difficulty levels must add up to exactly 100%', path: ['level'] }
    );
