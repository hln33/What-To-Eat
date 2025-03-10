import { api } from "@/api";
import { Recipe } from "./types";

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
}: Omit<Recipe, "id">): Promise<Recipe | null> => {
  const res = await api.recipes.$post({
    form: { recipeName: name, ingredients, instructions },
  });
  return res.json();
};
