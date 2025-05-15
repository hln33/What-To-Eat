import { Recipe } from "@server/src/models/recipe";
import { Ingredient } from "../ingredients/types";

export type FetchedRecipe = Omit<Recipe, "imageName"> & {
  imageUrl: string | null;
};

export type RecipeTableData = FetchedRecipe & {
  isFavorited: boolean;
  ingredientStatus: IngredientStatus;
};

export type RecipeForm = Omit<Recipe, "ingredients" | "creator" | "id"> & {
  ingredients: Array<Ingredient>;
};

export type SubmittedRecipeForm = Omit<Recipe, "creator" | "id"> & {
  uploadedImageName: string | null;
};

export type IngredientStatusText = "Ready" | "MissingAll" | "MissingSome";

type IngredientStatus = {
  statusText: IngredientStatusText;
  missingIngredients: Set<string>;
};
