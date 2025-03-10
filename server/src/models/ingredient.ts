import type { InferSelectModel } from 'drizzle-orm';
import { db, ingredients as ingredientTable } from '../db/schema.ts';

export type Ingredient = Omit<InferSelectModel<typeof ingredientTable>, 'id'>;

export const getAllIngredients = async (): Promise<Ingredient[]> => {
  const res = await db
    .select({ name: ingredientTable.name })
    .from(ingredientTable);
  return res;
};
