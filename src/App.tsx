import { createSignal, type Component } from "solid-js";

import SelectEssentials from "./components/SelectEssentials";
import RecipeList from "./components/RecipeList";

const App: Component = () => {
  const [ingredients, setIngredients] = createSignal(new Set(["garlic"]));

  return (
    <div class="min-h-screen bg-slate-900 p-20 text-center text-white">
      <header class="py-20">
        <h1 class="text-6xl">What to Eat?</h1>
      </header>

      <main class="flex justify-around gap-16 border p-10">
        <div class="flex flex-none basis-1/3 flex-col">
          <SelectEssentials
            values={ingredients()}
            onChange={(value) => setIngredients(value)}
          />
        </div>

        <div class="flex-none basis-1/2">
          <RecipeList providedIngredients={ingredients()} />
        </div>
      </main>
    </div>
  );
};

export default App;
