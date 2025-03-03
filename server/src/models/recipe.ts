import { eq } from 'drizzle-orm';
import {
  db,
  recipes,
  ingredients as ingredientsTable,
  recipesToIngredients,
  steps as stepsTable,
} from '../db/schema.ts';

type Recipe = {
  name: string;
  ingredients: string[];
  steps: string[];
};

export const createRecipe = async (
  name: string,
  ingredients: string[],
  steps: string[]
): Promise<void> => {
  const [newRecipe] = await db.insert(recipes).values({ name }).returning();

  ingredients.forEach(async (ingredientName) => {
    const existingIngredient = (
      await db
        .select()
        .from(ingredientsTable)
        .where(eq(ingredientsTable.name, ingredientName))
        .limit(1)
    ).at(0);

    let ingredientId;
    if (!existingIngredient) {
      const [newIngredient] = await db
        .insert(ingredientsTable)
        .values({ name: ingredientName })
        .returning();
      ingredientId = newIngredient.id;
    } else {
      ingredientId = existingIngredient.id;
    }

    await db
      .insert(recipesToIngredients)
      .values({ recipeId: newRecipe.id, ingredientId });
  });

  steps.forEach(async (step, index) => {
    await db.insert(stepsTable).values({
      stepNumber: index,
      instruction: step,
      recipeId: newRecipe.id,
    });
  });
};

export const getRecipe = async (id: number): Promise<Recipe | null> => {
  const rows = await db
    .select({
      name: recipes.name,
      ingredient: ingredientsTable.name,
      instruction: stepsTable.instruction,
    })
    .from(recipes)
    .where(eq(recipes.id, id))
    .innerJoin(
      recipesToIngredients,
      eq(recipesToIngredients.recipeId, recipes.id)
    )
    .innerJoin(
      ingredientsTable,
      eq(ingredientsTable.id, recipesToIngredients.ingredientId)
    )
    .innerJoin(stepsTable, eq(stepsTable.recipeId, recipes.id));

  if (rows.length === 0) {
    return null;
  }
  return {
    name: rows[0].name,
    ingredients: rows.map((row) => row.ingredient),
    steps: rows.map((row) => row.instruction),
  };
};
