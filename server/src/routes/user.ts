import { Hono, type Context } from 'hono';
import { deleteCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

import {
  checkSessionExists,
  createSession,
  generateSessionToken,
  invalidateSession,
  validateSessionToken,
} from '../models/session.ts';
import {
  addRecipeToFavorites,
  addUserIngredients,
  createUser,
  getFavoritedRecipeIds,
  getUser,
  getUserIngredientNames,
  removeRecipeFromFavorites,
  userExists,
  verifyPassword,
} from '../models/user.ts';
import { userValidator } from './validators/index.js';
import {
  getSessionCookie,
  SESSION_COOKIE_NAME,
  setSessionCookie,
} from './cookies/index.ts';
import { getAllIngredients } from '../models/ingredient.ts';

const getUserFromSessionCookie = async (c: Context) => {
  const sessionToken = getSessionCookie(c);
  const { session, user } = await validateSessionToken(sessionToken);
  if (!session || !user) {
    throw new HTTPException(401, { message: 'Invalid session.' });
  }
  return user;
};

const users = new Hono()
  /**
   *  Authentication
   */
  .post('/login', zValidator('form', userValidator), async (c) => {
    const { username, password } = c.req.valid('form');
    const user = await getUser(username);

    if (user === null || !(await verifyPassword(username, password))) {
      throw new HTTPException(401, {
        message:
          'Incorrect credentials. Either username or password was incorrect.',
      });
    }

    const token = generateSessionToken();
    const session = await createSession(token, user.id);
    setSessionCookie(c, token, session);

    return c.json({
      message: 'Login successful.',
      userId: user.id.toString(),
      username: user.username,
    });
  })
  .post('/logout', async (c) => {
    const sessionToken = getSessionCookie(c);
    deleteCookie(c, SESSION_COOKIE_NAME);

    if (!(await checkSessionExists(sessionToken))) {
      return c.json({ error: 'Session does not exist.' }, 404);
    }
    await invalidateSession(sessionToken);

    return c.json({ message: 'Session invalidated.' });
  })
  .post('/register', zValidator('form', userValidator), async (c) => {
    const { username, password } = c.req.valid('form');
    if (await userExists(username)) {
      throw new HTTPException(409, { message: 'Username already taken' });
    }

    const newUser = await createUser(username, password);
    const token = generateSessionToken();
    const session = await createSession(token, newUser.id);
    setSessionCookie(c, token, session);

    return c.json({ message: 'Registration successful.' });
  })
  .get('/session', async (c) => {
    const sessionToken = getSessionCookie(c);
    const { session, user } = await validateSessionToken(sessionToken);
    if (!session || !user) {
      throw new HTTPException(401, { message: 'Invalid session.' });
    }

    return c.json({
      message: 'Session exists.',
      userId: user.id.toString(),
      username: user.username,
    });
  })
  /**
   * Owned Resources
   */
  .get('/:id/favorites', async (c) => {
    const { id: userId } = c.req.param();

    const recipeIds = await getFavoritedRecipeIds(parseInt(userId));

    return c.json(recipeIds);
  })
  .post(
    '/:id/favorites',
    zValidator('json', z.object({ recipeId: z.number() })),
    async (c) => {
      const user = await getUserFromSessionCookie(c);

      const { recipeId } = c.req.valid('json');
      await addRecipeToFavorites(user.id, recipeId);

      return c.json({ message: 'Recipe successfully added to favorites.' });
    }
  )
  .delete(
    '/:id/favorites',
    zValidator('json', z.object({ recipeId: z.number() })),
    async (c) => {
      const user = await getUserFromSessionCookie(c);

      const { recipeId } = c.req.valid('json');
      await removeRecipeFromFavorites(user.id, recipeId);

      return c.json({ message: 'Recipe successfully removed from favorites.' });
    }
  )
  .get('/:id/ingredients', async (c) => {
    const user = await getUserFromSessionCookie(c);

    const ingredientNames = await getUserIngredientNames(user.id);

    return c.json(ingredientNames);
  })
  .post(
    '/:id/ingredients',
    zValidator(
      'json',
      z.object({ ingredientNames: z.array(z.string().min(1)) })
    ),
    async (c) => {
      const user = await getUserFromSessionCookie(c);

      const { ingredientNames } = c.req.valid('json');
      const allIngredients = await getAllIngredients();
      const allIngredientNames = allIngredients.map(
        (ingredient) => ingredient.name
      );

      for (const ingredientName of ingredientNames) {
        if (allIngredientNames.includes(ingredientName) === false) {
          throw new HTTPException(400, {
            message: `Ingredient "${ingredientName}" does not exist in the system.`,
          });
        }
      }

      await addUserIngredients(user.id, ingredientNames);

      return c.json({ message: 'User ingredient successfully added.' }, 200);
    }
  );
export default users;
