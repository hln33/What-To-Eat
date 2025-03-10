import { Recipe } from "./types";

const getIngredientStatus = (
  requiredIngredients: Set<string>,
  providedIngredients: Set<string>,
) => {
  const numMissingIngredients =
    requiredIngredients.difference(providedIngredients).size;

  if (numMissingIngredients === 0) {
    return "All ingredients";
  } else if (numMissingIngredients === requiredIngredients.size) {
    return "Missing all ingredients";
  } else {
    const isPlural = numMissingIngredients > 1;
    return `Missing ${numMissingIngredients} ingredient${isPlural ? "s" : ""}`;
  }
};

export const getRecipesWithIngredientStatus = (
  recipes: Recipe[],
  providedIngredients: Set<string>,
) => {
  return recipes.map((recipe) => {
    const requiredIngredients = new Set(recipe.ingredients);
    const status = getIngredientStatus(
      requiredIngredients,
      providedIngredients,
    );
    return { ...recipe, status };
  });
};
