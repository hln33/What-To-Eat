import { createSignal, type Component } from "solid-js";
import { Collapsible } from "@kobalte/core/collapsible";
import { Dialog } from "@kobalte/core/dialog";

import SelectIngredients from "../../features/recipe-search/components/SelectIngredients";
import RecipeList from "../../features/recipe-search/components/RecipeList";
import SelectIngredientsMenu from "../../features/recipe-search/components/SelectIngredientsMenu";

const HomePage: Component = () => {
  const [essentialIngredients, setEssentialIngredients] = createSignal(
    new Set(["Eggs", "Olive Oil"]),
  );
  const [meatIngredients, setMeatIngredients] = createSignal(new Set([""]));
  const [seafoodIngredients, setSeafoodIngredients] = createSignal(
    new Set([""]),
  );

  const allIngredients = () =>
    [essentialIngredients(), meatIngredients(), seafoodIngredients()].reduce(
      (acc, set) => acc.union(set),
    );

  return (
    <div class="flex flex-col justify-around gap-16 md:flex-row">
      <div class="flex flex-none basis-1/3 flex-col gap-5">
        <SelectIngredientsMenu
          categories={[
            {
              name: "Essentials",
              ingredients: essentialIngredients(),
              onIngredientsChange: setEssentialIngredients,
              options: new Set([
                "Butter",
                "Milk",
                "Eggs",
                "Garlic",
                "Onion",
                "Olive Oil",
                "Garlic Powder",
                "White Rice",
              ]),
            },
            {
              name: "Meats",
              ingredients: meatIngredients(),
              onIngredientsChange: setMeatIngredients,
              options: new Set([
                "Pork Belly",
                "Steak",
                "Chicken Breast",
                "Chicken Thigh",
              ]),
            },
            {
              name: "Seafood",
              ingredients: seafoodIngredients(),
              onIngredientsChange: setSeafoodIngredients,
              options: new Set(["Shrimp", "Salmon", "Prawns", "Crab"]),
            },
          ]}
        />
      </div>

      <div class="flex-none basis-1/2">
        <RecipeList providedIngredients={allIngredients()} />
      </div>
    </div>
  );
};

export default HomePage;
