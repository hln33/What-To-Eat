import { z } from 'zod';

export const ingredientSchema = z.object({
  amount: z.number().positive(),
  unit: z.enum(['g', 'kg', 'oz', 'lb']),
  name: z.string().min(1),
});

export const userValidator = z.object({
  username: z.string(),
  password: z.string(),
});
