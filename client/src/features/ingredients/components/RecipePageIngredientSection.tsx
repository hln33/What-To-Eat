import { Component, createSignal, Index, Show } from "solid-js";

import EditIngredientsDialog from "@/features/recipes/components/EditRecipeDialogs/EditRecipeIngredientsDialog";
import { Ingredient, IngredientUnit } from "@/features/ingredients/types";
import RecipePageIngredientSectionSettings from "./RecipePageIngredientSectionSettings.tsx";
import { createUserIngredientsQuery } from "@/features/users/queries.js";

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

const IngredientList: Component<{
  ingredients: Ingredient[] | undefined;
  weightUnit: IngredientUnit | null;
}> = (props) => {
  const userIngredientsQuery = createUserIngredientsQuery();
  const userIngredients = () => userIngredientsQuery.data ?? [];

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

const RecipePageIngredientSection: Component<{
  ingredients: Ingredient[] | undefined;
  userOwnsRecipe: boolean;
  handleIngredientsUpdate: (updatedIngredients: Ingredient[]) => void;
}> = (props) => {
  const [finalConversionUnit, setFinalConversionUnit] =
    createSignal<IngredientUnit | null>(null);

  return (
    <section class="space-y-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <h3 class="text-3xl">Ingredients</h3>
          <Show when={props.userOwnsRecipe && props.ingredients !== undefined}>
            <EditIngredientsDialog
              initialIngredients={props.ingredients!}
              onSubmit={(values) =>
                props.handleIngredientsUpdate(values.ingredients)
              }
            />
          </Show>
        </div>
        <RecipePageIngredientSectionSettings
          selectedUnit={finalConversionUnit}
          onSelectedUnitChange={setFinalConversionUnit}
        />
      </div>

      <IngredientList
        ingredients={props.ingredients}
        weightUnit={finalConversionUnit()}
      />
    </section>
  );
};

export default RecipePageIngredientSection;
