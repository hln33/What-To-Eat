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
  await db.delete(sessionTable);
  await db.delete(userTable);
  await db.delete(recipeTable);
  await db.delete(stepTable);
  await db.delete(ingredientTable);
};

/**
 * Make sure that there is a `.env.test` file that specifies the name of the test database.
 * This will be the database created and used for tests.
 *
 * NOTE:
 * Tests may fail unexpectedly after a hot module reload.
 * I.e., after modifying a file and saving it while in watch mode.
 *
 * This is suspected to happen because the process does not have time to fully
 * release the database lock before the next one starts.
 * However, when a "fresh" test run is initiated, there is enough time to release any locks.
 *
 * To workaround this, simply rerun the tests manually by pressing `r` or `a`.
 * Possible future solutions may be to:
 *   1. provide each individual test with its own db file or in-memory db.
 *      This can be combined with dependency injection to make sure right db is being used.
 */
beforeAll(() => {
  console.log(
    `------ Creating test database called ${process.env.DB_FILE_NAME}...`
  );
  const drizzePushResult = execSync('npx drizzle-kit push');
  console.log(drizzePushResult.toString());
  console.log(
    `------ Finished creating test database called ${process.env.DB_FILE_NAME}...`
  );
});

beforeEach(async () => {
  console.log('------ Seeding test database...');
  await seedDatabase();
  console.log('------ Finished seeding test database...');
});

afterEach(async () => {
  console.log('------ Cleaning up test database tables...');
  await clearAllTables();
  console.log('------ Finished cleaning up test database tables...');
});

afterAll(() => {
  console.log('------ Tearing down test database...');
  const testDbName = process.env.DB_FILE_NAME!.replace('file:', '');
  const pathToTestDb = path.join(
    fileURLToPath(import.meta.url),
    `../../${testDbName}`
  );
  fs.unlinkSync(pathToTestDb);
  console.log('------ Finished tearing down test database...');
});
