import { eq } from 'drizzle-orm';
import {
  db,
  recipes,
  ingredients as ingredientsTable,
  recipesToIngredients,
} from '../db/schema.ts';

export const createRecipe = async (name: string, ingredients: string[]) => {
  const [newRecipe] = await db.insert(recipes).values({ name }).returning();

  ingredients.forEach(async (name) => {
    const existingIngredient = await db
      .select()
      .from(ingredientsTable)
      .where(eq(ingredientsTable.name, name))
      .limit(1);

    let ingredientId;
    if (existingIngredient.length === 0) {
      const [newIngredient] = await db
        .insert(ingredientsTable)
        .values({ name })
        .returning();
      ingredientId = newIngredient.id;
    } else {
      ingredientId = existingIngredient[0].id;
    }

    await db
      .insert(recipesToIngredients)
      .values({ recipeId: newRecipe.id, ingredientId });
  });
};

export const getRecipe = async (id: number) => {
  const [recipe] = await db.select().from(recipes).where(eq(recipes.id, id));
  if (!recipe) {
    return null;
  }

  // const ingredients = await db
  //   .select({ id: ingredientsTable.id, name: ingredientsTable.name })

  return recipe;
};
