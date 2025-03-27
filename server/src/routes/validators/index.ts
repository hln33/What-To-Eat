import { z } from 'zod';

export const recpipeValidator = z.object({
  recipeName: z.string(),
  ingredients: z
    .union([z.string(), z.string().array()])
    .transform((val) => (Array.isArray(val) ? val : [val])),
  instructions: z
    .union([z.string(), z.string().array()])
    .transform((val) => (Array.isArray(val) ? val : [val])),
});

export const userValidator = z.object({
  username: z.string(),
  password: z.string(),
});
