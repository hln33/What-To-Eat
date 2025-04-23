import { describe, expect, test } from 'vitest';

import {
  createRecipe,
  deleteRecipe,
  getRecipe,
  updateRecipe,
} from './recipe.ts';
import { db, userTable } from '../db/schema.ts';

const getUser = async () => {
  const [res] = await db.select().from(userTable).limit(1);
  return res;
};

const createTestRecipe = async () => {
  return await createRecipe({
    creatorId: (await getUser()).id,
    name: 'test recipe',
    imageName: 'placeholderImageName',
    ingredients: [
      {
        amount: 100,
        unit: 'g',
        name: 'apples',
      },
      { amount: 1, unit: 'lb', name: 'eggs' },
      { amount: 10, unit: 'oz', name: 'banana' },
    ],
    instructions: ['boil eggs', 'chop apples', 'enjoy'],
  });
};

describe('Recipe model', () => {
  test('Able to create recipe', async () => {
    const createdRecipe = await createTestRecipe();

    const fetchedRecipe = await getRecipe(createdRecipe.id);
    expect(createdRecipe).toStrictEqual(fetchedRecipe);
  });

  test('Able to update recipe', async () => {
    const createdRecipe = await createTestRecipe();
    const newRecipeName = 'salty blueberries';
    const newIngredients = [
      {
        amount: 120,
        unit: 'oz' as const,
        name: 'blueberries',
      },
      { amount: 100, unit: 'kg' as const, name: 'salt' },
    ];
    const newInstructions = ['this is the only instruction now'];

    await updateRecipe({
      recipeId: createdRecipe.id,
      recipeName: newRecipeName,
      newIngredients,
      newInstructions,
      newImageName: null,
    });

    const fetchedRecipe = await getRecipe(createdRecipe.id);
    expect(fetchedRecipe).toStrictEqual({
      ...createdRecipe,
      name: newRecipeName,
      ingredients: newIngredients,
      instructions: newInstructions,
    });
  });

  test('Able to delete a recipe', async () => {
    const createdRecipe = await createTestRecipe();

    await deleteRecipe(createdRecipe.id);

    const fetchedRecipe = await getRecipe(createdRecipe.id);
    expect(fetchedRecipe).toBeNull();
  });
});
