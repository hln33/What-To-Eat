import { int, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { drizzle } from 'drizzle-orm/libsql';

/**
 * To apply db changes, run `npx drizzle-kit push`
 */
export const db = drizzle(process.env.DB_FILE_NAME!);

/* RECIPES */
export const recipes = sqliteTable('recipes', {
  id: int().primaryKey({ autoIncrement: true }),
  userId: int('user_id')
    .references(() => userTable.id, { onDelete: 'cascade' })
    .notNull(),
  name: text().notNull(),
  /**
   * name used to fetch from S3 bucket
   */
  imageName: text(),
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
    amount: int().notNull(),
    unit: text({ enum: ['g', 'kg', 'oz', 'lb'] }).notNull(),
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
    .references(() => recipes.id, { onDelete: 'cascade' })
    .notNull(),
});

/* USERS & SESSIONS */
export const userTable = sqliteTable('user', {
  id: int().primaryKey({ autoIncrement: true }),
  username: text().unique().notNull(),
  passwordHash: text('password_hash').notNull(),
});

export const sessionTable = sqliteTable('session', {
  id: text().primaryKey(),
  userId: int('user_id')
    .notNull()
    .references(() => userTable.id),
  expiresAt: int('expires_at', {
    mode: 'timestamp',
  }).notNull(),
});
