export type RecipeTableData = Recipe & {
  ingredientStatus: IngredientStatus;
};

export type Recipe = {
  id: number;
  name: string;
  ingredients: string[];
  instructions: string[];
};

export type IngredientStatus = {
  statusText: "Missing all ingredients" | "All ingredients" | string;
  missingIngredients: Set<string>;
};
