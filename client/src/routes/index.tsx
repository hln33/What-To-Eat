import { ErrorBoundary, Suspense, type Component } from "solid-js";
import { createFileRoute, Link } from "@tanstack/solid-router";

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
      <h2 class="text-4xl">Recipes</h2>

      <Link
        to="/recipes/new"
        class="rounded border p-4 text-3xl"
      >
        New Recipe
      </Link>

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
