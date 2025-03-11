import { Recipe, RecipeTableData } from "./types";

export const INGREDIENT_STATUSES = {
  missingAll: "Missing all ingredients",
  ready: "Ready to cook",
};

const getIngredientStatus = (
  requiredIngredients: Set<string>,
  providedIngredients: Set<string>,
) => {
  const numMissingIngredients =
    requiredIngredients.difference(providedIngredients).size;

  if (numMissingIngredients === 0) {
    return INGREDIENT_STATUSES.ready;
  } else if (numMissingIngredients === requiredIngredients.size) {
    return INGREDIENT_STATUSES.missingAll;
  } else {
    const isPlural = numMissingIngredients > 1;
    return `Missing ${numMissingIngredients} ingredient${isPlural ? "s" : ""}`;
  }
};

export const getRecipesWithIngredientStatus = (
  recipes: Recipe[],
  providedIngredients: Set<string>,
): RecipeTableData[] => {
  return recipes.map((recipe) => {
    const requiredIngredients = new Set(recipe.ingredients);
    const statusText = getIngredientStatus(
      requiredIngredients,
      providedIngredients,
    );
    const missingIngredients =
      requiredIngredients.difference(providedIngredients);

    return {
      ...recipe,
      ingredientStatus: { statusText, missingIngredients },
    };
  });
};
