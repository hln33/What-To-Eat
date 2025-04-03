export type Recipe = {
  id: number;
  creator: string;
  name: string;
  ingredients: Ingredient[];
  instructions: string[];
};

export type RecipeTableData = Recipe & {
  ingredientStatus: IngredientStatus;
};

export type RecipeForm = Omit<Recipe, "ingredients" | "creator" | "id"> & {
  ingredients: Array<Omit<Ingredient, "unit"> & { unit?: Ingredient["unit"] }>;
};

export type SubmittedRecipeForm = Omit<Recipe, "creator" | "id">;

type Ingredient = {
  amount: number;
  unit: "g" | "kg" | "lb" | "oz";
  name: string;
};

export type IngredientStatusText = "Ready" | "MissingAll" | "MissingSome";

export type IngredientStatus = {
  statusText: IngredientStatusText;
  missingIngredients: Set<string>;
};
