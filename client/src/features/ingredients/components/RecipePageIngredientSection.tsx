import { Component, createSignal, Show } from "solid-js";

import EditIngredientsDialog from "@/features/recipes/components/EditRecipeDialogs/EditRecipeIngredientsDialog";
import { Ingredient, IngredientUnit } from "@/features/ingredients/types";
import RecipePageIngredientSectionSettings from "./RecipePageIngredientSectionSettings.tsx";
import RecipePageIngredientSectionIngredientList from "./RecipePageIngredientSectionIngredientList.jsx";

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

      <RecipePageIngredientSectionIngredientList
        ingredients={props.ingredients}
        weightUnit={finalConversionUnit()}
      />
    </section>
  );
};

export default RecipePageIngredientSection;
