import { count, eq } from 'drizzle-orm';

import {
  db,
  recipeTable,
  ingredientTable,
  recipeToIngredientTable,
  stepTable,
  userTable,
} from '../db/schema.ts';
import type { z } from 'zod';
import type { ingredientSchema } from '../routes/validators/index.ts';

type Ingredient = z.infer<typeof ingredientSchema>;

type Recipe = {
  id: number;
  creator: string;
  imageName: string | null;
  name: string;
  ingredients: Ingredient[];
  instructions: string[];
};

export const getAllRecipes = async (): Promise<Recipe[]> => {
  const recipeRows = await db
    .select()
    .from(recipeTable)
    .innerJoin(
      recipeToIngredientTable,
      eq(recipeToIngredientTable.recipeId, recipeTable.id)
    )
    .innerJoin(
      ingredientTable,
      eq(ingredientTable.id, recipeToIngredientTable.ingredientId)
    );

  const recipes: { [key: number]: Recipe } = {};
  for (const row of recipeRows) {
    const recipeId = row.recipes.id;

    if (!recipes[recipeId]) {
      const recipeName = row.recipes.name;
      recipes[recipeId] = {
        id: recipeId,
        creator: await getCreatorName(recipeId, recipeName),
        imageName: row.recipes.imageName,
        name: recipeName,
        ingredients: [],
        instructions: [],
      };
    }
    recipes[recipeId].ingredients.push({
      unit: row.recipes_to_ingredients.unit,
      amount: row.recipes_to_ingredients.amount,
      name: row.ingredients.name,
    });

    const steps = await db
      .select({
        order: stepTable.stepNumber,
        instruction: stepTable.instruction,
      })
      .from(stepTable)
      .where(eq(stepTable.recipeId, recipeId))
      .innerJoin(recipeTable, eq(recipeTable.id, stepTable.recipeId));

    recipes[recipeId].instructions = steps
      .toSorted((a, b) => a.order - b.order)
      .map((step) => step.instruction);
  }

  return Object.values(recipes);
};

export const getRecipe = async (id: number): Promise<Recipe | null> => {
  const recipe = (
    await db.select().from(recipeTable).where(eq(recipeTable.id, id)).limit(1)
  ).at(0);
  if (recipe === undefined) {
    return null;
  }

  const ingredients = await db
    .select({
      name: ingredientTable.name,
      unit: recipeToIngredientTable.unit,
      amount: recipeToIngredientTable.amount,
    })
    .from(ingredientTable)
    .innerJoin(
      recipeToIngredientTable,
      eq(recipeToIngredientTable.ingredientId, ingredientTable.id)
    )
    .where(eq(recipeToIngredientTable.recipeId, id));
  if (ingredients.length === 0) {
    return null;
  }

  const steps = await db
    .select({ instruction: stepTable.instruction })
    .from(stepTable)
    .innerJoin(recipeTable, eq(recipeTable.id, stepTable.recipeId))
    .where(eq(stepTable.recipeId, id));
  if (steps.length === 0) {
    return null;
  }

  return {
    id: recipe.id,
    creator: await getCreatorName(recipe.id, recipe.name),
    imageName: recipe.imageName,
    name: recipe.name,
    ingredients,
    instructions: steps.map((step) => step.instruction),
  };
};

export const createRecipe = async ({
  userId,
  name,
  imageName,
  ingredients,
  instructions: steps,
}: Omit<Recipe, 'creator' | 'id'> & { userId: number }): Promise<Recipe> => {
  const [newRecipe] = await db
    .insert(recipeTable)
    .values({
      userId,
      name,
      imageName,
    })
    .returning();

  for (const ingredient of ingredients) {
    const existingIngredient = (
      await db
        .select()
        .from(ingredientTable)
        .where(eq(ingredientTable.name, ingredient.name))
        .limit(1)
    ).at(0);

    let ingredientId;
    if (!existingIngredient) {
      const [newIngredient] = await db
        .insert(ingredientTable)
        .values({ name: ingredient.name })
        .returning();
      ingredientId = newIngredient.id;
    } else {
      ingredientId = existingIngredient.id;
    }

    await db.insert(recipeToIngredientTable).values({
      recipeId: newRecipe.id,
      ingredientId,
      unit: ingredient.unit,
      amount: ingredient.amount,
    });
  }

  for (const [index, step] of steps.entries()) {
    await db.insert(stepTable).values({
      stepNumber: index,
      instruction: step,
      recipeId: newRecipe.id,
    });
  }

  // guranteed to not be null because we just created the recipe in the db
  return (await getRecipe(newRecipe.id))!;
};

export const updateRecipe = async (values: {
  recipeId: number;
  recipeName: string;
}) => {
  // await db
  //   .update(recipeTable)
  //   .set({ name: values.recipeName })
  //   .where(eq(recipeTable.id, values.recipeId));

  // 1. find ingredients for recipe
  // 2. find the diff the old ingredients between and new ingredients
  // 3. remove and add ingredients accordingly

  const res = await db
    .select()
    .from(recipeToIngredientTable)
    .innerJoin(
      ingredientTable,
      eq(
        recipeToIngredientTable.ingredientId,
        recipeToIngredientTable.ingredientId
      )
    )
    .where(eq(recipeTable.id, values.recipeId));
};

export const deleteRecipe = async (recipeId: number) => {
  const associatedIngredients = await db
    .select({ ingredientId: recipeToIngredientTable.ingredientId })
    .from(recipeToIngredientTable)
    .where(eq(recipeToIngredientTable.recipeId, recipeId));
  if (associatedIngredients.length === 0) {
    throw new Error(
      'Recipe should have ingredients associated with it, but none were found.'
    );
  }

  await db
    .delete(recipeToIngredientTable)
    .where(eq(recipeToIngredientTable.recipeId, recipeId));

  // delete any ingredients that no longer have associations with any recipe
  for (const { ingredientId } of associatedIngredients) {
    const recipeAssociations = await db
      .select({ count: count() })
      .from(recipeToIngredientTable)
      .where(eq(recipeToIngredientTable.ingredientId, ingredientId));

    if (recipeAssociations[0].count === 0) {
      await db
        .delete(ingredientTable)
        .where(eq(ingredientTable.id, ingredientId));
    }
  }

  await db.delete(recipeTable).where(eq(recipeTable.id, recipeId));
};

const getCreatorName = async (
  recipeId: number,
  recipeName: string
): Promise<string> => {
  const recipeUserRows = await db
    .select()
    .from(userTable)
    .innerJoin(recipeTable, eq(recipeTable.userId, userTable.id))
    .where(eq(recipeTable.id, recipeId))
    .limit(1);
  if (recipeUserRows.length === 0) {
    throw new Error(`Recipe: ${recipeName} has no creator`);
  }
  return recipeUserRows[0].user.username;
};
