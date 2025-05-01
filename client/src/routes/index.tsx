import { ErrorBoundary, Suspense, type Component } from "solid-js";
import { createFileRoute, Link } from "@tanstack/solid-router";
import PlusIcon from "~icons/lucide/plus";

import { createUserIngredientsQuery } from "@/features/users/queries";
import UserIngredientsInput from "@/features/ingredients/components/UserIngredientsInput";
import { createIngredientNamesQuery } from "@/features/ingredients/queries";
import Recipes from "@/features/recipes/components/Recipes";
import Skeleton from "@/components/ui/Skeleton";

const Index: Component = () => {
  const ingredientsQuery = createIngredientNamesQuery();
  const userIngredientsQuery = createUserIngredientsQuery();

  return (
    <div class="flex flex-col justify-around gap-8">
      <div class="flex justify-between">
        <h2 class="text-4xl">Recipes</h2>
        <Link
          to="/recipes/new"
          class="flex items-center gap-2 rounded border px-3 py-2 text-lg"
        >
          <PlusIcon />
          Create Recipe
        </Link>
      </div>

      <ErrorBoundary fallback={<div>{ingredientsQuery.error?.message}</div>}>
        <Suspense fallback={<Skeleton height={40} />}>
          <UserIngredientsInput />
        </Suspense>
      </ErrorBoundary>

      <Recipes providedIngredients={new Set(userIngredientsQuery.data ?? [])} />
    </div>
  );
};

export const Route = createFileRoute("/")({
  component: Index,
});
