import { z } from 'zod';

export const recpipeValidator = z.object({
  recipeName: z.string(),
  ingredients: z
    .union([z.string(), z.string().array()])
    .transform((val) => (Array.isArray(val) ? val : [val])),
  steps: z
    .union([z.string(), z.string().array()])
    .transform((val) => (Array.isArray(val) ? val : [val])),
});
