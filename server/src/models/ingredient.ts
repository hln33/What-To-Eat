import type { InferSelectModel } from 'drizzle-orm';
import { db, ingredientTable } from '../db/schema.ts';

type Ingredient = Omit<InferSelectModel<typeof ingredientTable>, 'id'>;

export const getAllIngredients = async (): Promise<Ingredient[]> => {
  const res = await db
    .select({ name: ingredientTable.name })
    .from(ingredientTable);
  return res;
};
