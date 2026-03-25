import { z } from 'zod';

export const FeedbackFormSchema = z.object({
    title: z
        .string()
        .min(5, { message: 'Title should at least be 5 characters long' })
        .regex(/[a-zA-Z]/, { message: 'Must contain at least one letter' })
        .trim(),
    source: z
        .string()
        .min(3, 'Source should contain at least 3 characters')
        .optional()
        .or(z.literal('')),
    description: z
        .string()
        .min(10, 'Please provide a valid message')
        .optional()
        .or(z.literal('')),
});
