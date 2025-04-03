import { z } from 'zod';

export const ingredientSchema = z.object({
  amount: z.number().positive(),
  unit: z.enum(['g', 'kg', 'oz', 'lb']),
  name: z.string().min(1),
});

export const recpipeValidator = z.object({
  recipeName: z.string().min(1),
  ingredients: z.array(ingredientSchema),
  instructions: z
    .union([z.string(), z.string().array()])
    .transform((val) => (Array.isArray(val) ? val : [val])),
});

export const userValidator = z.object({
  username: z.string(),
  password: z.string(),
});
