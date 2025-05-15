import { Component, createEffect, Index } from "solid-js";
import { createQuery } from "@tanstack/solid-query";

import { Ingredient, IngredientUnit } from "@/features/ingredients/types";
import { userQueries } from "@/features/users/queries.js";
import { useUserContext } from "@/contexts/UserContext";

const convertWeightUnits = (
  value: number,
  originalUnit: IngredientUnit,
  finalUnit: IngredientUnit,
) => {
  const conversionFactorsToGrams = {
    g: 1,
    kg: 1000,
    oz: 28.3495,
    lb: 453.592,
  };

  const valueInGrams = value * conversionFactorsToGrams[originalUnit];
  const convertedValue = valueInGrams / conversionFactorsToGrams[finalUnit];
  return convertedValue.toFixed(4);
};

const getIngredientTextColor = (
  userIngredients: string[],
  ingredient: string,
) => {
  if (userIngredients.length === 0) {
    return "";
  }
  return userIngredients.includes(ingredient)
    ? "text-green-500"
    : "text-red-500";
};

const RecipePageIngredientSectionIngredientList: Component<{
  ingredients: Ingredient[] | undefined;
  weightUnit: IngredientUnit | null;
}> = (props) => {
  const user = useUserContext();

  const userIngredientsQuery = createQuery(() =>
    userQueries.ingredientsList(user.info),
  );
  const userIngredients = () => userIngredientsQuery.data ?? [];

  return (
    <ul class="list-inside list-disc text-slate-100">
      <Index each={props.ingredients}>
        {(ingredient) => (
          <li
            class={getIngredientTextColor(userIngredients(), ingredient().name)}
          >
            {props.weightUnit === null
              ? `${ingredient().amount} ${ingredient().unit} ${ingredient().name}`
              : `${convertWeightUnits(ingredient().amount, ingredient().unit, props.weightUnit!)} ${props.weightUnit} ${ingredient().name}`}
          </li>
        )}
      </Index>
    </ul>
  );
};

export default RecipePageIngredientSectionIngredientList;
