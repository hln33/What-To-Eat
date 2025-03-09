import 'dotenv/config';
import {
  recipes as recipesTable,
  recipesToIngredients as recipesToIngredientsTable,
  ingredients as ingredientsTable,
  db,
  steps as stepsTable,
  userTable,
} from '../src/db/schema.ts';

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
