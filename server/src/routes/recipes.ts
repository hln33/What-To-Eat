import { Hono } from 'hono';

const recipes = new Hono()
  .get('/', (c) => {
    return c.text('eggs');
  })
  .get('/:id', (c) => {
    const id = c.req.param('id');

    return c.json({
      name: 'Scrambled Eggs',
      ingredients: ['3 Eggs', 'Olive Oil / Butter'],
      instructions: [
        'Crack the eggs into a medium bowl. Whisk until smooth andcombined, with no streaks of egg white remaining.',
        'Brush a small nonstick skillet with olive oil, or melt a little butter in a small nonstick skillet. Bring to medium heat.',
        'Pour in the eggs, and let them cook for a few seconds without stirring. Pull a rubber spatula across the bottom of the pan to form large, soft curds of scrambled eggs.',
        'Continue cooking over medium-low heat, folding and stirring the eggs every few seconds. Scrape the spatula along the bottom and sides of the pan often to form more curds and to prevent any part of the eggs from drying out.',
        'Remove the pan from the heat when the eggs are mostly set, but a little liquid egg remains. Season to taste with salt and pepper.',
      ],
    });
  });

export type RecipeType = typeof recipes;

export default recipes;
