import 'dotenv/config';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import recipes from './routes/recipe.ts';
import {
  recipes as recipesTable,
  recipesToIngredients as recipesToIngredientsTable,
  ingredients as ingredientsTable,
  db,
  steps as stepsTable,
} from './db/schema.ts';
import { createRecipe, getRecipe } from './models/recipe.ts';

const seedDatabase = async () => {
  // await createRecipe('boiled eggs', ['eggs'], ['get water']);
  // await createRecipe('scrambled eggs', ['eggs', 'olive oil']);
  // await createRecipe('foo', ['bar']);

  const recipes = await db.select().from(recipesTable);
  const ingredients = await db.select().from(ingredientsTable);
  const recipesToIngredients = await db
    .select()
    .from(recipesToIngredientsTable);
  const steps = await db.select().from(stepsTable);

  console.log('database seeded!');
  console.log(recipes);
  console.log(ingredients);
  console.log(recipesToIngredients);
  console.log(steps);
};
seedDatabase();

const app = new Hono()
  // CORS middleware
  .use(async (c, next) => {
    c.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    await next();
  })
  .route('/recipes', recipes);

const port = 3001;
console.log(`Server is running on http://localhost:${port}`);
serve({
  fetch: app.fetch,
  port,
});

export type AppType = typeof app;
