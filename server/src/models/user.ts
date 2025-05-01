import * as argon2 from 'argon2';
import { type InferSelectModel, and, eq } from 'drizzle-orm';
import {
  db,
  ingredientTable,
  userIngredientsTable,
  userRecipeFavoritesTable,
  userTable,
} from '../db/schema.ts';

export type User = InferSelectModel<typeof userTable>;

export const createUser = async (
  username: string,
  password: string
): Promise<User> => {
  const hashedPassword = await argon2.hash(password);

  const res = await db
    .insert(userTable)
    .values({ username, passwordHash: hashedPassword })
    .returning();
  if (res.length === 0) {
    console.error('Error inserting user into table.');
  }

  const newUser = res[0];
  return newUser;
};

export const userExists = async (username: string): Promise<boolean> => {
  const res = await db
    .select()
    .from(userTable)
    .where(eq(userTable.username, username));
  return res.length > 0;
};

export const getUser = async (username: string): Promise<User | null> => {
  const res = await db
    .select()
    .from(userTable)
    .where(eq(userTable.username, username));
  if (res.length === 0) {
    return null;
  }

  return res[0];
};

export const verifyPassword = async (
  username: string,
  password: string
): Promise<boolean> => {
  const res = await db
    .select()
    .from(userTable)
    .where(eq(userTable.username, username));
  if (res.length === 0) {
    return false;
  }

  const user = res[0];
  return await argon2.verify(user.passwordHash, password);
};

export const getFavoritedRecipeIds = async (
  userId: number
): Promise<{ recipeId: number }[]> => {
  const res = await db
    .select({ recipeId: userRecipeFavoritesTable.recipeId })
    .from(userRecipeFavoritesTable)
    .where(eq(userRecipeFavoritesTable.userId, userId));
  return res;
};

export const addRecipeToFavorites = async (
  userId: number,
  recipeId: number
): Promise<void> => {
  await db.insert(userRecipeFavoritesTable).values({ userId, recipeId });
};

export const removeRecipeFromFavorites = async (
  userId: number,
  recipeId: number
): Promise<void> => {
  await db
    .delete(userRecipeFavoritesTable)
    .where(
      and(
        eq(userRecipeFavoritesTable.userId, userId),
        eq(userRecipeFavoritesTable.recipeId, recipeId)
      )
    );
};

export const addUserIngredients = async (
  userId: number,
  ingredientNames: string[]
): Promise<void> => {
  /**
   * Update ingredients by simply deleting them all and inserting them again.
   * There will not be many ingredients for a user so the
   * computation cost is low and the code is simple.
   */
  await db
    .delete(userIngredientsTable)
    .where(eq(userIngredientsTable.userId, userId));

  for (const ingredientName of ingredientNames) {
    const [ingredient] = await db
      .select()
      .from(ingredientTable)
      .where(eq(ingredientTable.name, ingredientName));

    await db
      .insert(userIngredientsTable)
      .values({ userId, ingredientId: ingredient.id })
      .onConflictDoNothing();
  }
};

export const getUserIngredientNames = async (
  userId: number
): Promise<string[]> => {
  const ingredients = await db
    .select({ name: ingredientTable.name })
    .from(userIngredientsTable)
    .where(eq(userIngredientsTable.userId, userId))
    .innerJoin(
      ingredientTable,
      eq(ingredientTable.id, userIngredientsTable.ingredientId)
    );

  return ingredients.map((ingredient) => ingredient.name);
};
