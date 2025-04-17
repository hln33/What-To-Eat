import { execSync } from 'child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest';

import { seedDatabase } from '../scripts/seedDatabase.ts';
import {
  db,
  ingredientTable,
  recipeTable,
  recipeToIngredientTable,
  sessionTable,
  stepTable,
  userTable,
} from '../src/db/schema.ts';

const clearAllTables = async () => {
  await db.delete(recipeToIngredientTable);
  await db.delete(userTable);
  await db.delete(sessionTable);
  await db.delete(recipeTable);
  await db.delete(stepTable);
  await db.delete(ingredientTable);
};

/**
 * Make sure that there is a `.env.test` file that specifies the name of the test database.
 * This will be the database created and used for tests.
 */
beforeAll(() => {
  console.log(`creating test database called ${process.env.DB_FILE_NAME}...`);
  const drizzePushResult = execSync('npx drizzle-kit push');
  console.log(drizzePushResult.toString());
});

beforeEach(async () => {
  console.log('seeding test database...');
  await seedDatabase();
});

afterEach(async () => {
  console.log('cleaning up test database...');
  await clearAllTables();
});

afterAll(() => {
  console.log('tearing down test database...');
  const testDbName = process.env.DB_FILE_NAME!.replace('file:', '');
  const pathToTestDb = path.join(
    fileURLToPath(import.meta.url),
    `../../${testDbName}`
  );
  fs.unlinkSync(pathToTestDb);
});
