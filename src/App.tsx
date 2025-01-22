import { createSignal, type Component } from "solid-js";

import SelectIngredients from "./components/SelectIngredients";
import RecipeList from "./components/RecipeList";

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
    <div class="min-h-screen bg-slate-900 p-20 text-center text-white">
      <header class="py-20">
        <h1 class="text-6xl">What to Eat?</h1>
      </header>

      <main class="flex justify-around gap-16 border border-slate-600 bg-slate-800 p-10">
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
              new Set([
                "Pork Belly",
                "Steak",
                "Chicken Breast",
                "Chicken Thigh",
              ])
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
      </main>
    </div>
  );
};

export default App;
