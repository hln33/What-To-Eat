import { queryOptions } from "@tanstack/solid-query";

import { getAllIngredientNames } from "./api";

export const ingredientQueries = {
  all: queryOptions({
    queryKey: ["ingredients"],
    queryFn: getAllIngredientNames,
    select: (ingredients) =>
      ingredients.map((ingredient) => ingredient.name).toSorted(),
  }),
};
