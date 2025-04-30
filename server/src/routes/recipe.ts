import { Hono, type Context } from 'hono';
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
import { validateSessionToken } from '../models/session.ts';
import type { User } from '../models/user.ts';
import { ingredientSchema } from './validators/index.js';
import { getSessionCookie } from './cookies/index.ts';
import { createPresignedUrl } from './imageUtils/index.ts';

const recipeSchema = z.object({
  recipeName: z.string().min(1),
  uploadedImageName: z.string().nullable(),
  ingredients: z.array(ingredientSchema),
  instructions: z
    .union([z.string(), z.string().array()])
    .transform((val) => (Array.isArray(val) ? val : [val])),
  servings: z.number().positive(),
});

const getUserFromSessionCookie = async (c: Context) => {
  const sessionToken = getSessionCookie(c);
  const { user } = await validateSessionToken(sessionToken);
  if (!user) {
    throw new HTTPException(401, { message: 'Invalid session.' });
  }
  return user;
};

const verifyUserOwnsRecipe = async (user: User, recipeId: number) => {
  const recipe = await getRecipe(recipeId);
  if (recipe === null) {
    throw new HTTPException(404, { message: 'Recipe not found' });
  }
  if (recipe.creatorId !== user.id) {
    throw new HTTPException(403, {
      message: 'Unauthorized to modify this recipe',
    });
  }
};

const verifyNoDuplicateIngredientNames = (ingredientNames: string[]) => {
  const seen = new Set();
  for (const ingredient of ingredientNames) {
    if (seen.has(ingredient)) {
      throw new HTTPException(400, {
        message: 'Can not submit a recipe with duplicate ingredient names.',
      });
    }
    seen.add(ingredient);
  }
};

const recipeRoutes = new Hono()
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
  .post('/', zValidator('json', recipeSchema), async (c) => {
    const user = await getUserFromSessionCookie(c);

    const {
      recipeName,
      uploadedImageName,
      ingredients,
      instructions,
      servings,
    } = c.req.valid('json');
    verifyNoDuplicateIngredientNames(
      ingredients.map((ingredient) => ingredient.name)
    );

    const recipe = await createRecipe({
      creatorId: user.id,
      imageName: uploadedImageName ?? null,
      name: recipeName,
      servings,
      ingredients,
      instructions,
    });

    return c.json({ ...recipe, imageUrl: null }, 201);
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
  .put('/:id', zValidator('json', recipeSchema), async (c) => {
    const user = await getUserFromSessionCookie(c);

    const recipeId = Number(c.req.param('id'));
    await verifyUserOwnsRecipe(user, recipeId);

    const { recipeName, ingredients, instructions, uploadedImageName } =
      c.req.valid('json');
    verifyNoDuplicateIngredientNames(
      ingredients.map((ingredient) => ingredient.name)
    );

    await updateRecipe({
      recipeId,
      recipeName,
      newIngredients: ingredients,
      newInstructions: instructions,
      newImageName: uploadedImageName,
    });

    return c.json({ message: 'Recipe successfully updated' }, 200);
  })
  .delete('/:id', async (c) => {
    const user = await getUserFromSessionCookie(c);

    const recipeId = Number(c.req.param('id'));
    await verifyUserOwnsRecipe(user, recipeId);

    try {
      await deleteRecipe(recipeId);
    } catch (e) {
      console.error(e);
      throw new HTTPException(422, { message: 'Recipe deletion failed.' });
    }

    return c.json({ message: 'Recipe successfully deleted.' }, 200);
  });

export default recipeRoutes;
