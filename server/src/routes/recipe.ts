import { Hono } from 'hono';
import { createRecipe, getRecipe } from '../models/recipe.ts';
import { zValidator } from '@hono/zod-validator';
import { recpipeValidator } from '../../validators/index.ts';

const _RECIPES = [
  {
    name: 'Scrambled Eggs',
    ingredients: ['Eggs', 'Olive Oil'],
    instructions: [
      'Crack the eggs into a medium bowl. Whisk until smooth and combined, with no streaks of egg white remaining.',
      'Brush a small nonstick skillet with olive oil, or melt a little butter in a small nonstick skillet. Bring to medium heat.',
      'Pour in the eggs, and let them cook for a few seconds without stirring. Pull a rubber spatula across the bottom of the pan to form large, soft curds of scrambled eggs.',
      'Continue cooking over medium-low heat, folding and stirring the eggs every few seconds. Scrape the spatula along the bottom and sides of the pan often to form more curds and to prevent any part of the eggs from drying out.',
      'Remove the pan from the heat when the eggs are mostly set, but a little liquid egg remains. Season to taste with salt and pepper.',
    ],
  },
  {
    name: 'Boiled Eggs',
    ingredients: ['Eggs'],
    instructions: [
      'Crack the eggs into a medium bowl. Whisk until smooth and combined, with no streaks of egg white remaining.',
      'Brush a small nonstick skillet with olive oil, or melt a little butter in a small nonstick skillet. Bring to medium heat.',
    ],
  },
  {
    name: 'Foo',
    ingredients: ['Bar', 'Sum'],
    instructions: ['Lorem ipsum'],
  },
];

const recipes = new Hono()
  .get('/', (c) => {
    return c.json(_RECIPES);
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
    const formData = c.req.valid('form');

    const recipe = await createRecipe(
      formData.recipeName,
      formData.ingredients,
      formData.instructions
    );
    return c.json(recipe, 201);
  });

export type RecipeType = typeof recipes;

export default recipes;
