import { describe, expect, test } from 'vitest';
import { testClient } from 'hono/testing';

import { db, recipeTable } from '../db/schema.ts';
import { app } from '../index.ts';

const getRandomRecipe = async () => {
  const [res] = await db.select().from(recipeTable).limit(1);
  return res;
};

const sampleRecipeJsonPayload = {
  recipeName: 'cookies',
  ingredients: [
    { amount: 250, unit: 'g' as const, name: 'flour' },
    { amount: 1, unit: 'oz' as const, name: 'sugar' },
    { amount: 100, unit: 'g' as const, name: 'chocolate chip' },
    { amount: 250, unit: 'g' as const, name: 'flour' },
  ],
  instructions: [],
  servings: 24,
  uploadedImageName: null,
};

describe('Recipe routes', () => {
  const client = testClient(app);

  const generateSessionCookie = async (credentials: {
    username: string;
    password: string;
  }) => {
    const { username, password } = credentials;
    const loginResponse = await client.api.users.login.$post({
      form: { username, password },
    });
    const [sessionCookie] = loginResponse.headers.getSetCookie();
    return sessionCookie;
  };

  describe('POST', () => {
    test('returns 401 when session cookie is not present in payload', async () => {
      const res = await client.api.recipes.$post({
        json: { ...sampleRecipeJsonPayload },
      });

      expect(res.status).toBe(401);
    });

    test('returns 400 when no recipe name is provided', async () => {
      const sessionCookie = await generateSessionCookie({
        username: 'admin',
        password: 'admin',
      });

      const res = await client.api.recipes.$post(
        {
          json: {
            ...sampleRecipeJsonPayload,
            recipeName: '',
          },
        },
        { headers: { Cookie: sessionCookie } }
      );

      expect(res.status).toBe(400);
    });

    test('returns 400 when duplicate ingredient names are provided', async () => {
      const sessionCookie = await generateSessionCookie({
        username: 'admin',
        password: 'admin',
      });

      const res = await client.api.recipes.$post(
        {
          json: {
            ...sampleRecipeJsonPayload,
            ingredients: [
              { amount: 250, unit: 'g', name: 'flour' },
              { amount: 1, unit: 'oz', name: 'sugar' },
              { amount: 100, unit: 'g', name: 'chocolate chip' },
              { amount: 250, unit: 'g', name: 'flour' },
            ],
          },
        },
        { headers: { Cookie: sessionCookie } }
      );

      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /:id', () => {
    test('returns 401 when no session token is provided', async () => {
      const { id } = await getRandomRecipe();
      const res = await client.api.recipes[':id'].$delete({
        param: { id: id.toString() },
      });

      expect(res.status).toBe(401);
    });

    test('returns 404 when recipe cannot be found', async () => {
      const sessionCookie = await generateSessionCookie({
        username: 'admin',
        password: 'admin',
      });

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
      const sessionCookie = await generateSessionCookie({
        username: 'harry',
        password: 'password123',
      });

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
