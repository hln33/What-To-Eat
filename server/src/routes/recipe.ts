import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

import {
  createRecipe,
  deleteRecipe,
  getAllRecipes,
  getRecipe,
  updateRecipe,
} from '../models/recipe.ts';
import { ingredientSchema } from './validators/index.js';
import { getSessionCookie } from './cookies/index.ts';
import { validateSessionToken } from '../models/session.ts';
import { createPresignedUrl } from './imageUtils/index.ts';

const recipeSchema = z.object({
  recipeName: z.string().min(1),
  uploadedImageName: z.string().nullable(),
  ingredients: z.array(ingredientSchema),
  instructions: z
    .union([z.string(), z.string().array()])
    .transform((val) => (Array.isArray(val) ? val : [val])),
});

const recipes = new Hono()
  .get('/', async (c) => {
    const recipes = await getAllRecipes();

    const recipesWithImages = await Promise.all(
      recipes.map(async (recipe) => ({
        ...recipe,
        imageUrl:
          recipe.imageName !== null
            ? await createPresignedUrl(recipe.imageName)
            : null,
      }))
    );
    return c.json(recipesWithImages);
  })
  .get('/:id', async (c) => {
    const id = Number(c.req.param('id'));
    const recipe = await getRecipe(id);
    if (recipe === null) {
      return c.json({}, 404);
    }

    const imageUrl =
      recipe.imageName !== null
        ? await createPresignedUrl(recipe.imageName)
        : null;
    return c.json({ ...recipe, imageUrl });
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
      userId: user.id,
      name: recipeName,
      imageName: uploadedImageName ?? null,
      ingredients,
      instructions,
    });

    return c.json({ ...recipe, imageUrl: null }, 201);
  })
  .put(
    '/:id',
    zValidator('json', recipeSchema.omit({ uploadedImageName: true })),
    async (c) => {
      const sessionToken = getSessionCookie(c);
      const { user } = await validateSessionToken(sessionToken);
      console.log(user);

      if (!user) {
        throw new HTTPException(401, { message: 'Invalid session.' });
      }

      const id = Number(c.req.param('id'));
      const { recipeName, ingredients, instructions } = c.req.valid('json');
      await updateRecipe({
        recipeId: id,
        recipeName,
        newIngredients: ingredients,
        newInstructions: instructions,
      });

      return c.json({ message: 'Recipe successfully updated' }, 200);
    }
  )
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
