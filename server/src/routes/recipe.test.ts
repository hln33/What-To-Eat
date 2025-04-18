import { describe, expect, test } from 'vitest';
import { testClient } from 'hono/testing';

import { db, recipeTable } from '../db/schema.ts';
import { app } from '../index.ts';

const getRandomRecipe = async () => {
  const [res] = await db.select().from(recipeTable).limit(1);
  return res;
};

describe('Recipe routes', () => {
  const client = testClient(app);

  describe('DELETE /:id', () => {
    test('returns 401 when no session token is provided', async () => {
      const { id } = await getRandomRecipe();
      const res = await client.api.recipes[':id'].$delete({
        param: { id: id.toString() },
      });

      expect(res.status).toBe(401);
    });

    test('returns 404 when recipe cannot be found', async () => {
      const loginResponse = await client.api.users.login.$post({
        form: { username: 'admin', password: 'admin' },
      });
      const [sessionCookie] = loginResponse.headers.getSetCookie();

      const res = await client.api.recipes[':id'].$delete(
        {
          param: { id: '-1' },
        },
        {
          headers: {
            Cookie: sessionCookie,
          },
        }
      );

      expect(res.status).toBe(404);
    });

    test('returns 403 when user does not own the recipe', async () => {
      const loginResponse = await client.api.users.login.$post({
        form: { username: 'harry', password: 'password123' },
      });
      const [sessionCookie] = loginResponse.headers.getSetCookie();

      const { id } = await getRandomRecipe();
      const res = await client.api.recipes[':id'].$delete(
        {
          param: { id: id.toString() },
        },
        {
          headers: {
            Cookie: sessionCookie,
          },
        }
      );

      expect(res.status).toBe(403);
    });
  });
});
