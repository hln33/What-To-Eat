import 'dotenv/config';
import * as fs from 'node:fs';
import path from 'node:path';
import {
  recipes as recipesTable,
  recipesToIngredients as recipesToIngredientsTable,
  ingredients as ingredientsTable,
  db,
  steps as stepsTable,
  userTable,
} from '../src/db/schema.ts';
import { createRecipe } from '../src/models/recipe.ts';
import { createUser } from '../src/models/user.ts';

/**
 * Run `npx tsx scripts/seedDatabase.ts`
 */
const seedDatabase = async () => {
  const adminUser = await createUser('admin', 'admin');

  const pathToJSONFile = path.join(import.meta.dirname, 'recipeData.json');
  for (const { name, ingredients, steps } of JSON.parse(
    fs.readFileSync(pathToJSONFile, 'utf-8')
  )) {
    await createRecipe(adminUser.id, name, ingredients, steps);
  }

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
