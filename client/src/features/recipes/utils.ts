import { FetchedRecipe, IngredientStatusText, RecipeTableData } from "./types";

export const INGREDIENT_STATUSES = {
  missingAll: "Missing all ingredients",
  ready: "Ready to cook",
};

const getIngredientStatusText = (
  requiredIngredients: Set<string>,
  providedIngredients: Set<string>,
): IngredientStatusText => {
  const numMissingIngredients =
    requiredIngredients.difference(providedIngredients).size;

  if (numMissingIngredients === 0) {
    return "Ready";
  } else if (numMissingIngredients === requiredIngredients.size) {
    return "MissingAll";
  } else {
    return "MissingSome";
  }
};

export const getRecipeTableData = (
  recipes: FetchedRecipe[],
  providedIngredients: Set<string>,
  favoritedRecipeIds: number[],
): RecipeTableData[] => {
  return recipes.map((recipe) => {
    const requiredIngredientNames = recipe.ingredients.map(
      (ingredient) => ingredient.name,
    );

    const requiredIngredients = new Set(requiredIngredientNames);
    const statusText = getIngredientStatusText(
      requiredIngredients,
      providedIngredients,
    );
    const missingIngredients =
      requiredIngredients.difference(providedIngredients);

    return {
      ...recipe,
      isFavorited: favoritedRecipeIds.includes(recipe.id),
      ingredientStatus: { statusText, missingIngredients },
    };
  });
};
