import { Hono } from 'hono';
import {
  createRecipe,
  deleteRecipe,
  getAllRecipes,
  getRecipe,
} from '../models/recipe.ts';
import { zValidator } from '@hono/zod-validator';
import { recpipeValidator } from '../validators/index.js';
import { HTTPException } from 'hono/http-exception';

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
    const { recipeName, ingredients, instructions } = c.req.valid('form');
    const recipe = await createRecipe(recipeName, ingredients, instructions);

    return c.json(recipe, 201);
  })
  .delete('/:id', async (c) => {
    throw new HTTPException(422, { message: 'Recipe deletion failed.' });

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
