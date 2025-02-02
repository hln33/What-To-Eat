import { eq } from 'drizzle-orm';
import {
  db,
  recipes,
  ingredients as ingredientsTable,
  recipesToIngredients,
} from '../db/schema.ts';

type Recipe = {
  name: string;
  ingredients: string[];
};

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

    return await db
      .insert(recipesToIngredients)
      .values({ recipeId: newRecipe.id, ingredientId })
      .returning();
  });
};

export const getRecipe = async (id: number): Promise<Recipe | null> => {
  const rows = await db
    .select({ name: recipes.name, ingredient: ingredientsTable.name })
    .from(recipes)
    .where(eq(recipes.id, id))
    .innerJoin(
      recipesToIngredients,
      eq(recipesToIngredients.recipeId, recipes.id)
    )
    .innerJoin(
      ingredientsTable,
      eq(ingredientsTable.id, recipesToIngredients.ingredientId)
    );

  if (rows.length === 0) {
    return null;
  } else {
    return {
      name: rows[0].name,
      ingredients: rows.map((row) => row.ingredient),
    };
  }
};
