import { api } from "@/api";
import { FetchedRecipe, SubmittedRecipeForm } from "./types";
import { Recipe } from "@server/src/models/recipe";

export const getAllRecipes = async (): Promise<FetchedRecipe[]> => {
  const res = await api.recipes.$get();
  return res.json();
};

type RecipeWithPresignedImageUrl = Recipe & { imageUrl: string | null };
export const getRecipe = async (
  id: string,
): Promise<RecipeWithPresignedImageUrl> => {
  const res = await api.recipes[":id"].$get({ param: { id } });
  if (!res.ok) {
    throw new Error(`Recipe with id ${id} does not exist`);
  }
  return res.json();
};

export const postRecipeImage = async (
  file: File,
): Promise<{ imageName: string }> => {
  const res = await api.images.$post({
    form: { file },
  });
  return res.json();
};

export const postNewRecipe = async ({
  name,
  uploadedImageName,
  ingredients,
  instructions,
  servings,
}: SubmittedRecipeForm): Promise<Recipe> => {
  const res = await api.recipes.$post({
    json: {
      recipeName: name,
      servings,
      ingredients,
      instructions,
      uploadedImageName,
    },
  });
  return res.json();
};

export const updateRecipe = async ({
  recipeId,
  recipe,
}: {
  recipeId: string;
  recipe: SubmittedRecipeForm;
}) => {
  const res = await api.recipes[":id"].$put({
    param: { id: recipeId },
    json: {
      recipeName: recipe.name,
      servings: recipe.servings,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      uploadedImageName: recipe.uploadedImageName,
    },
  });
  if (!res.ok) {
    throw new Error("Server error.");
  }
};

export const deleteRecipe = async (id: string) => {
  const res = await api.recipes[":id"].$delete({
    param: { id },
  });
  if (!res.ok) {
    throw new Error("Server error.");
  }
  return res.json();
};
