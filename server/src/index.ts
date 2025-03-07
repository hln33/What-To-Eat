import 'dotenv/config';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import recipes from './routes/recipe.ts';
import {
  recipes as recipesTable,
  recipesToIngredients as recipesToIngredientsTable,
  ingredients as ingredientsTable,
  db,
  steps as stepsTable,
  userTable,
} from './db/schema.ts';
import users from './routes/user.ts';
import { cors } from 'hono/cors';

const seedDatabase = async () => {
  // await db.insert(userTable).values({ id: 1 });

  const recipes = await db.select().from(recipesTable);
  const ingredients = await db.select().from(ingredientsTable);
  const recipesToIngredients = await db
    .select()
    .from(recipesToIngredientsTable);
  const steps = await db.select().from(stepsTable);

  const users = await db.select().from(userTable);

  console.log('database seeded!');
  console.log(recipes);
  console.log(ingredients);
  console.log(recipesToIngredients);
  console.log(steps);

  console.log(users);
};
seedDatabase();

const app = new Hono()
  .use(logger())
  .use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  )
  .route('/recipes', recipes)
  .route('/users', users);

const port = 3001;
console.log(`Server is running on http://localhost:${port}`);
serve({
  fetch: app.fetch,
  port,
});

export type AppType = typeof app;
