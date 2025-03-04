import { int, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { drizzle } from 'drizzle-orm/libsql';

export const db = drizzle(process.env.DB_FILE_NAME!);

export const recipes = sqliteTable('recipes', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
});

export const recipesToIngredients = sqliteTable(
  'recipes_to_ingredients',
  {
    recipeId: int('recipe_id')
      .references(() => recipes.id)
      .notNull(),
    ingredientId: int('ingredient_id')
      .references(() => ingredients.id)
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.recipeId, table.ingredientId] })]
);

export const ingredients = sqliteTable('ingredients', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull().unique(),
});

export const steps = sqliteTable('steps', {
  id: int().primaryKey({ autoIncrement: true }),
  stepNumber: int().notNull(),
  instruction: text().notNull(),
  recipeId: int('recipe_id')
    .references(() => recipes.id)
    .notNull(),
});
