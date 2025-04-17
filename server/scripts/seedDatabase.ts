import 'dotenv/config';
import * as fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  recipeTable,
  recipeToIngredientTable,
  ingredientTable,
  db,
  stepTable,
  userTable,
} from '../src/db/schema.ts';
import { createRecipe } from '../src/models/recipe.ts';
import { createUser } from '../src/models/user.ts';

/**
 * Run `npx tsx scripts/seedDatabase.ts`
 * Also make sure you are in the `server` directory
 */
export const seedDatabase = async () => {
  const adminUser = await createUser('admin', 'admin');

  const pathToJSONFile = path.join(import.meta.dirname, 'recipeData.json');
  for (const { name, ingredients, instructions } of JSON.parse(
    fs.readFileSync(pathToJSONFile, 'utf-8')
  )) {
    await createRecipe({
      userId: adminUser.id,
      imageName: null,
      name,
      ingredients,
      instructions,
    });
  }

  const recipes = await db.select().from(recipeTable);
  const ingredients = await db.select().from(ingredientTable);
  const recipesToIngredients = await db.select().from(recipeToIngredientTable);
  const steps = await db.select().from(stepTable);
  const users = await db.select().from(userTable);

  console.log('database seeded!');
  console.log(recipes);
  console.log(ingredients);
  console.log(recipesToIngredients);
  console.log(steps);

  console.log(users);
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedDatabase();
}
