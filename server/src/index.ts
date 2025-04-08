import 'dotenv/config';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';

import recipes from './routes/recipe.ts';
import users from './routes/user.ts';
import ingredients from './routes/ingredient.ts';
import images from './routes/images.ts';

const app = new Hono()
  .use(logger())
  .use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  )
  .route('/recipes', recipes)
  .route('/ingredients', ingredients)
  .route('/users', users)
  .route('/images', images);

const PORT = 3001;
console.log(`Server is running on http://localhost:${PORT}`);
serve({
  fetch: app.fetch,
  port: PORT,
});

export type AppType = typeof app;
