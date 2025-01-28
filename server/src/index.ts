import 'dotenv/config';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import recipes from './routes/recipes.ts';
import { drizzle } from 'drizzle-orm/libsql';
import {
  recipes as recipesTable,
  recipesToIngredients as recipesToIngredientsTable,
  ingredients as ingredientsTable,
  db,
} from './db/schema.ts';
import { createRecipe } from './models/recipe.ts';

// const seedDatabase = async () => {
//   await createRecipe('boiled eggs', ['eggs']);
//   await createRecipe('scrambled eggs', ['eggs', 'olive oil']);
//   await createRecipe('foo', ['bar']);

//   const recipes = await db.select().from(recipesTable);
//   const ingredients = await db.select().from(ingredientsTable);
//   const recipesToIngredients = await db
//     .select()
//     .from(recipesToIngredientsTable);
//   console.log('database seeded!');
//   console.log(recipes);
//   console.log(ingredients);
//   console.log(recipesToIngredients);
// };
// seedDatabase();

const app = new Hono();

// CORS middleware
app.use(async (c, next) => {
  c.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  await next();
});

app.get('/', (c) => {
  return c.text('Hello Hono!');
});
app.route('/recipes', recipes);

const port = 3001;
console.log(`Server is running on http://localhost:${port}`);
serve({
  fetch: app.fetch,
  port,
});
