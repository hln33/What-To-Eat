import { Hono } from 'hono';
import { getAllIngredients } from '../models/ingredient.ts';

const ingredients = new Hono()
  //
  .get('/all', async (c) => {
    const ingredients = await getAllIngredients();

    return c.json(ingredients);
  });

export default ingredients;
