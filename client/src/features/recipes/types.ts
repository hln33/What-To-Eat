export type RecipeTableData = Recipe & {
  ingredientStatus: IngredientStatus;
};

export type Recipe = {
  id: number;
  name: string;
  ingredients: string[];
  instructions: string[];
};

export type IngredientStatusText = "Ready" | "MissingAll" | "MissingSome";

export type IngredientStatus = {
  statusText: IngredientStatusText;
  missingIngredients: Set<string>;
};
