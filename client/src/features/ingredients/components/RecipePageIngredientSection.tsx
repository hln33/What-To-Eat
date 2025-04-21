import { Component, createSignal, Index, Show } from "solid-js";

import EditIngredientsDialog from "@/features/recipes/components/EditRecipeDialogs/EditRecipeIngredientsDialog";
import { Ingredient, IngredientUnit } from "@/features/ingredients/types";
import IngredientUnitSettings from "./IngredientUnitSettings";

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

const RecipePageIngredientSection: Component<{
  ingredients: Ingredient[] | undefined;
  userOwnsRecipe: boolean;
  handleIngredientsUpdate: (updatedIngredients: Ingredient[]) => void;
}> = (props) => {
  const [weightUnit, setWeightUnit] = createSignal<IngredientUnit | null>(null);

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
        <IngredientUnitSettings onWeightUnitChange={setWeightUnit} />
      </div>

      <ul class="list-inside list-disc text-slate-100">
        <Index each={props.ingredients}>
          {(ingredient) => (
            <li>
              {weightUnit() === null ? (
                <>
                  {ingredient().amount} {ingredient().unit}
                </>
              ) : (
                <>
                  {convertWeightUnits(
                    ingredient().amount,
                    ingredient().unit,
                    weightUnit()!,
                  )}{" "}
                  {weightUnit()!}
                </>
              )}{" "}
              {ingredient().name}
            </li>
          )}
        </Index>
      </ul>
    </section>
  );
};

export default RecipePageIngredientSection;
