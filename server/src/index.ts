import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import recipes from './routes/recipes.ts';

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
