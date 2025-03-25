import { count, eq } from 'drizzle-orm';
import {
  db,
  recipes as recipesTable,
  ingredients as ingredientsTable,
  recipesToIngredients,
  steps as stepsTable,
} from '../db/schema.ts';

type Recipe = {
  id: number;
  name: string;
  ingredients: string[];
  instructions: string[];
};

export const createRecipe = async (
  userId: number,
  name: string,
  ingredients: string[],
  steps: string[]
): Promise<Recipe | null> => {
  const [newRecipe] = await db
    .insert(recipesTable)
    .values({ userId, name })
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
      .select({ id: recipesTable.id, name: recipesTable.name })
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
    id: recipe.id,
    name: recipe.name,
    ingredients: ingredients.map((ingredient) => ingredient.name),
    instructions: steps.map((step) => step.instruction),
  };
};

export const getAllRecipes = async (): Promise<Recipe[]> => {
  const recipeRows = await db
    .select()
    .from(recipesTable)
    .innerJoin(
      recipesToIngredients,
      eq(recipesToIngredients.recipeId, recipesTable.id)
    )
    .innerJoin(
      ingredientsTable,
      eq(ingredientsTable.id, recipesToIngredients.ingredientId)
    );

  const recipes: { [key: number]: Recipe } = {};
  for (const row of recipeRows) {
    const recipeId = row.recipes.id;
    const recipeName = row.recipes.name;

    if (!recipes[recipeId]) {
      recipes[recipeId] = {
        id: recipeId,
        name: recipeName,
        ingredients: [],
        instructions: [],
      };
    }
    recipes[recipeId].ingredients.push(row.ingredients.name);

    const steps = await db
      .select({
        order: stepsTable.stepNumber,
        instruction: stepsTable.instruction,
      })
      .from(stepsTable)
      .where(eq(stepsTable.recipeId, recipeId))
      .innerJoin(recipesTable, eq(recipesTable.id, stepsTable.recipeId));

    recipes[recipeId].instructions = steps
      .toSorted((a, b) => a.order - b.order)
      .map((step) => step.instruction);
  }

  return Object.values(recipes);
};

export const deleteRecipe = async (recipeId: number) => {
  const associatedIngredients = await db
    .select({ ingredientId: recipesToIngredients.ingredientId })
    .from(recipesToIngredients)
    .where(eq(recipesToIngredients.recipeId, recipeId));
  if (associatedIngredients.length === 0) {
    throw new Error(
      'Recipe should have ingredients associated with it, but none were found.'
    );
  }

  await db
    .delete(recipesToIngredients)
    .where(eq(recipesToIngredients.recipeId, recipeId));

  // delete any ingredients that no longer have associations with any recipe
  for (const { ingredientId } of associatedIngredients) {
    const recipeAssociations = await db
      .select({ count: count() })
      .from(recipesToIngredients)
      .where(eq(recipesToIngredients.ingredientId, ingredientId));

    if (recipeAssociations[0].count === 0) {
      await db
        .delete(ingredientsTable)
        .where(eq(ingredientsTable.id, ingredientId));
    }
  }

  await db.delete(recipesTable).where(eq(recipesTable.id, recipeId));
};
