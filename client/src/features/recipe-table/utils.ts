export const getIngredientStatus = (
  requiredIngredients: Set<string>,
  providedIngredients: Set<string>,
) => {
  const numMissingIngredients =
    requiredIngredients.difference(providedIngredients).size;

  if (numMissingIngredients === 0) {
    return "You have all ingredients";
  } else if (numMissingIngredients === requiredIngredients.size) {
    return "You are missing all ingredients";
  } else {
    const isPlural = numMissingIngredients > 1;
    return `You are missing ${numMissingIngredients} ingredient${isPlural ? "s" : ""}`;
  }
};
