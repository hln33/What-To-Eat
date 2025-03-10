import {
  createSignal,
  ErrorBoundary,
  Suspense,
  type Component,
} from "solid-js";
import Dialog from "@/components/Dialog";
import NewRecipeForm from "@/features/recipes/components/NewRecipeForm";
import Recipes from "@/features/recipes/components/Recipes";
import { createQuery } from "@tanstack/solid-query";
import { getAllIngredients } from "@/features/ingredients/api";
import Combobox from "@/components/Combobox";
import Skeleton from "@/components/Skeleton";

const HomePage: Component = () => {
  const [ingredients, setIngredients] = createSignal<string[]>([]);

  const ingredientsQuery = createQuery(() => ({
    queryKey: ["ingredients"],
    queryFn: getAllIngredients,
    select: (ingredients) => ingredients.map((i) => i.name),
  }));

  return (
    <div class="flex flex-col justify-around gap-16">
      <ErrorBoundary fallback={<div>{ingredientsQuery.error?.message}</div>}>
        <Suspense fallback={<Skeleton height={40} />}>
          <Combobox
            controlled
            label="Ingredients"
            placeholder="Search ingredients"
            options={ingredientsQuery.data ?? []}
            value={ingredients()}
            onChange={setIngredients}
          />
        </Suspense>
      </ErrorBoundary>

      <Dialog
        triggerTitle="New Recipe"
        dialogTitle="New Recipe"
      >
        <NewRecipeForm />
      </Dialog>

      <Recipes providedIngredients={new Set(ingredients())} />
    </div>
  );
};

export default HomePage;
