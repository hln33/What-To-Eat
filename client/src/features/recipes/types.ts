export type Recipe = {
  id: number;
  creator: string;
  name: string;
  ingredients: string[];
  instructions: string[];
};

export type RecipeTableData = Recipe & {
  ingredientStatus: IngredientStatus;
};

export type RecipeForm = {
  name: string;
  ingredients: { amount: number; unit: string; name: string }[];
  instructions: string[];
};

export type IngredientStatusText = "Ready" | "MissingAll" | "MissingSome";

export type IngredientStatus = {
  statusText: IngredientStatusText;
  missingIngredients: Set<string>;
};
