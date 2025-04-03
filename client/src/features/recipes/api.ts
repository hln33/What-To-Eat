import { api } from "@/api";
import { Recipe, RecipeForm } from "./types";

export const getRecipe = async (id: string): Promise<Recipe> => {
  const res = await api.recipes[":id"].$get({ param: { id } });

  if (!res.ok) {
    throw new Error(`Recipe with id ${id} does not exist`);
  }
  return res.json();
};

export const getAllRecipes = async (): Promise<Recipe[]> => {
  const res = await api.recipes.$get();
  return res.json();
};

export const postNewRecipe = async ({
  name,
  ingredients,
  instructions,
}: RecipeForm): Promise<Recipe | null> => {
  const res = await api.recipes.$post(
    {
      json: {
        recipeName: name,
        ingredients,
        instructions,
      },
    },
    { init: { credentials: "include" } },
  );
  return res.json();
};

export const deleteRecipe = async (id: string) => {
  const res = await api.recipes[":id"].$delete({
    param: { id },
  });
  return res.json();
};
