import { createSignal, type Component } from "solid-js";

import SelectIngredients from "../../features/recipe-search/components/SelectIngredients";
import RecipeList from "../../features/recipe-search/components/RecipeList";

const App: Component = () => {
  const [essentialIngredients, setEssentialIngredients] = createSignal(
    new Set(["Garlic"]),
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
    <div class="flex justify-around gap-16 border border-slate-600 p-12">
      <div class="flex flex-none basis-1/3 flex-col gap-10">
        <SelectIngredients
          categoryName="Essentials"
          value={essentialIngredients()}
          onChange={setEssentialIngredients}
          options={
            new Set([
              "Butter",
              "Milk",
              "Garlic",
              "Onion",
              "Olive Oil",
              "Garlic Powder",
              "White Rice",
            ])
          }
        />

        <SelectIngredients
          categoryName="Meats"
          value={meatIngredients()}
          onChange={setMeatIngredients}
          options={
            new Set(["Pork Belly", "Steak", "Chicken Breast", "Chicken Thigh"])
          }
        />

        <SelectIngredients
          categoryName="Seafood"
          value={seafoodIngredients()}
          onChange={setSeafoodIngredients}
          options={new Set(["Shrimp", "Salmon", "Prawns", "Crab"])}
        />
      </div>

      <div class="flex-none basis-1/2">
        <RecipeList providedIngredients={allIngredients()} />
      </div>
    </div>
  );
};

export default App;
