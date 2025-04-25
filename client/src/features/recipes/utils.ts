import { Recipe } from "@server/src/models/recipe";
import { IngredientStatusText, RecipeTableData } from "./types";

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
    // const isPlural = numMissingIngredients > 1;
    // return `Missing ${numMissingIngredients} ingredient${isPlural ? "s" : ""}`;
  }
};

export const getRecipesWithIngredientStatus = (
  recipes: Recipe[],
  providedIngredients: Set<string>,
): RecipeTableData[] => {
  return recipes.map((recipe) => {
    const requiredIngredients = new Set(recipe.ingredients);
    const statusText = getIngredientStatusText(
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
