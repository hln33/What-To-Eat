import { eq } from 'drizzle-orm';
import {
  db,
  recipes as recipesTable,
  ingredients as ingredientsTable,
  recipesToIngredients,
  steps as stepsTable,
} from '../db/schema.ts';

type Recipe = {
  name: string;
  ingredients: string[];
  instructions: string[];
};

export const createRecipe = async (
  name: string,
  ingredients: string[],
  steps: string[]
): Promise<Recipe | null> => {
  const [newRecipe] = await db
    .insert(recipesTable)
    .values({ name })
    .returning();

  for (const ingredientName of ingredients) {
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
  }

  for (const [index, step] of steps.entries()) {
    await db.insert(stepsTable).values({
      stepNumber: index,
      instruction: step,
      recipeId: newRecipe.id,
    });
  }

  return await getRecipe(newRecipe.id);
};

export const getRecipe = async (id: number): Promise<Recipe | null> => {
  const recipe = (
    await db
      .select({ name: recipesTable.name })
      .from(recipesTable)
      .where(eq(recipesTable.id, id))
      .limit(1)
  ).at(0);
  if (recipe === undefined) {
    return null;
  }

  const ingredients = await db
    .select({ name: ingredientsTable.name })
    .from(ingredientsTable)
    .innerJoin(
      recipesToIngredients,
      eq(recipesToIngredients.ingredientId, ingredientsTable.id)
    )
    .where(eq(recipesToIngredients.recipeId, id));
  if (ingredients.length === 0) {
    return null;
  }

  const steps = await db
    .select({ instruction: stepsTable.instruction })
    .from(stepsTable)
    .innerJoin(recipesTable, eq(recipesTable.id, stepsTable.recipeId))
    .where(eq(stepsTable.recipeId, id));
  if (steps.length === 0) {
    return null;
  }

  return {
    name: recipe.name,
    ingredients: ingredients.map((ingredient) => ingredient.name),
    instructions: steps.map((step) => step.instruction),
  };
};
