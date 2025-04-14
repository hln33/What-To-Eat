import { type InferSelectModel, eq } from 'drizzle-orm';
import { db, ingredientTable } from '../db/schema.ts';

type Ingredient = InferSelectModel<typeof ingredientTable>;

export const getAllIngredients = async (): Promise<Ingredient[]> => {
  const res = await db.select().from(ingredientTable);
  return res;
};

export const getIngredient = async (
  ingredientName: string
): Promise<Ingredient | null> => {
  const res = await db
    .select()
    .from(ingredientTable)
    .where(eq(ingredientTable.name, ingredientName))
    .limit(1);

  return res.at(0) ?? null;
};

export const addIngredient = async (
  ingredientName: string
): Promise<Ingredient> => {
  const res = await db
    .insert(ingredientTable)
    .values({ name: ingredientName })
    .returning();
  return res[0];
};
