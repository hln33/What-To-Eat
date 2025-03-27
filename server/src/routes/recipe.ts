import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { getCookie } from 'hono/cookie';
import { zValidator } from '@hono/zod-validator';
import {
  createRecipe,
  deleteRecipe,
  getAllRecipes,
  getRecipe,
} from '../models/recipe.ts';
import { recpipeValidator } from './validators/index.js';
import { getSessionCookie } from './cookies/index.ts';
import { validateSessionToken } from '../models/session.ts';

const recipes = new Hono()
  .get('/', async (c) => {
    const recipes = await getAllRecipes();

    return c.json(recipes);
  })
  .get('/:id', async (c) => {
    const id = Number(c.req.param('id'));
    const recipe = await getRecipe(id);

    if (recipe === null) {
      return c.json({}, 404);
    }
    return c.json(recipe);
  })
  .post('/', zValidator('form', recpipeValidator), async (c) => {
    const sessionToken = getSessionCookie(c);
    const { user } = await validateSessionToken(sessionToken);
    if (!user) {
      throw new HTTPException(401, { message: 'Invalid session.' });
    }

    const { recipeName, ingredients, instructions } = c.req.valid('form');
    const recipe = await createRecipe(
      user.id,
      recipeName,
      ingredients,
      instructions
    );

    return c.json(recipe, 201);
  })
  .delete('/:id', async (c) => {
    const id = Number(c.req.param('id'));

    try {
      await deleteRecipe(id);
    } catch (e) {
      console.error(e);
      throw new HTTPException(422, { message: 'Recipe deletion failed.' });
    }

    return c.json({ message: 'Recipe successfully deleted.' }, 200);
  });

export default recipes;
