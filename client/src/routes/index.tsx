import { createFileRoute, Link } from "@tanstack/solid-router";

import {
  createSignal,
  ErrorBoundary,
  Suspense,
  type Component,
} from "solid-js";

import { createIngredientNamesQuery } from "@/features/ingredients/queries";
import Recipes from "@/features/recipes/components/Recipes";
import MultiSelect from "@/components/ui/MultiSelect";
import Skeleton from "@/components/ui/Skeleton";

const Index: Component = () => {
  const [ingredients, setIngredients] = createSignal<string[]>([]);

  const ingredientsQuery = createIngredientNamesQuery();

  return (
    <div class="flex flex-col justify-around gap-8">
      <h2 class="text-4xl">Recipes</h2>

      <Link
        to="/recipes/new"
        class="rounded border p-4 text-3xl"
      >
        New Recipe
      </Link>

      <ErrorBoundary fallback={<div>{ingredientsQuery.error?.message}</div>}>
        <Suspense fallback={<Skeleton height={40} />}>
          <MultiSelect
            controlled
            label="Your Ingredients"
            placeholder="Pick or type ingredients"
            options={ingredientsQuery.data ?? []}
            onChange={setIngredients}
          />
        </Suspense>
      </ErrorBoundary>
      <Recipes providedIngredients={new Set(ingredients())} />
    </div>
  );
};

export const Route = createFileRoute("/")({
  component: Index,
});
