import 'dotenv/config';
import { fileURLToPath } from 'node:url';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger } from 'hono/logger';

import recipeRoutes from './routes/recipe.ts';
import users from './routes/user.ts';
import ingredients from './routes/ingredient.ts';
import images from './routes/images.ts';

const api = new Hono()
  .basePath('/api')
  .route('/recipes', recipeRoutes)
  .route('/ingredients', ingredients)
  .route('/users', users)
  .route('/images', images);
export const app = new Hono().use(logger()).route('/', api);

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const PORT = 3001;
  serve({
    fetch: app.fetch,
    port: PORT,
  });
  console.log(`Server is running on http://localhost:${PORT}`);
}

export type ApiRoutes = typeof api;
