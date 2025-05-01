import { ErrorBoundary, Show, Suspense, type Component } from "solid-js";
import { createFileRoute, Link } from "@tanstack/solid-router";
import PlusIcon from "~icons/lucide/plus";

import { createUserIngredientsQuery } from "@/features/users/queries";
import UserIngredientsInput from "@/features/ingredients/components/UserIngredientsInput";
import { createIngredientNamesQuery } from "@/features/ingredients/queries";
import RecipeList from "@/features/recipes/components/RecipeList";
import { createAllRecipesQuery } from "@/features/recipes/queries";
import Skeleton from "@/components/ui/Skeleton";

const Index: Component = () => {
  const ingredientsQuery = createIngredientNamesQuery();
  const userIngredientsQuery = createUserIngredientsQuery();
  const recipesQuery = createAllRecipesQuery();

  return (
    <div class="space-y-10">
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

      <section class="space-y-8">
        <ErrorBoundary fallback={<div>{ingredientsQuery.error?.message}</div>}>
          <Suspense fallback={<Skeleton height={40} />}>
            <UserIngredientsInput />
          </Suspense>
        </ErrorBoundary>

        <div class="space-y-4">
          <ErrorBoundary
            fallback={(e) => <div>Error loading recipes: {e.toString()}</div>}
          >
            <Suspense
              fallback={
                <>
                  <Skeleton height={200} />
                  <Skeleton height={200} />
                  <Skeleton height={200} />
                  <Skeleton height={200} />
                  <Skeleton height={200} />
                </>
              }
            >
              <Show
                when={recipesQuery.data?.length ?? 0 > 0}
                fallback={<div>No Recipes to Show</div>}
              >
                <RecipeList
                  recipes={recipesQuery.data ?? []}
                  providedIngredients={new Set(userIngredientsQuery.data ?? [])}
                />
              </Show>
            </Suspense>
          </ErrorBoundary>
        </div>
      </section>
    </div>
  );
};

export const Route = createFileRoute("/")({
  component: Index,
});
