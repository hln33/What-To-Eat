import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

import {
  createRecipe,
  deleteRecipe,
  getAllRecipes,
  getRecipe,
} from '../models/recipe.ts';
import { ingredientSchema } from './validators/index.js';
import { getSessionCookie } from './cookies/index.ts';
import { validateSessionToken } from '../models/session.ts';

const recipeSchema = z.object({
  recipeName: z.string().min(1),
  uploadedImageName: z.string().optional(),
  ingredients: z.array(ingredientSchema),
  instructions: z
    .union([z.string(), z.string().array()])
    .transform((val) => (Array.isArray(val) ? val : [val])),
});

const recipes = new Hono()
  .get('/', async (c) => {
    const recipes = await getAllRecipes();

    return c.json(recipes.map((recipe) => ({ ...recipe, imageUrl: null })));
  })
  .get('/:id', async (c) => {
    const id = Number(c.req.param('id'));
    const recipe = await getRecipe(id);

    if (recipe === null) {
      return c.json({}, 404);
    }
    return c.json({ ...recipe, imageUrl: 'testing' });
  })
  .post('/', zValidator('json', recipeSchema), async (c) => {
    const sessionToken = getSessionCookie(c);
    const { user } = await validateSessionToken(sessionToken);
    if (!user) {
      throw new HTTPException(401, { message: 'Invalid session.' });
    }

    const { recipeName, uploadedImageName, ingredients, instructions } =
      c.req.valid('json');
    const recipe = await createRecipe({
      id: user.id,
      name: recipeName,
      imageName: uploadedImageName ?? null,
      ingredients,
      instructions,
    });

    return c.json({ ...recipe, imageUrl: null }, 201);
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
