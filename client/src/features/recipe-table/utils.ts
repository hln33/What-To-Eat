export const getIngredientStatus = (
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
