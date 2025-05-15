import { ErrorBoundary, Show, Suspense, type Component } from "solid-js";
import { createFileRoute, Link } from "@tanstack/solid-router";
import { createQuery } from "@tanstack/solid-query";
import PlusIcon from "~icons/lucide/plus";

import { userQueries } from "@/features/users/queries";
import UserIngredientsInput from "@/features/ingredients/components/UserIngredientsInput";
import RecipeList from "@/features/recipes/components/RecipeList";
import { recipeQueries } from "@/features/recipes/queries";
import Skeleton from "@/components/ui/Skeleton";
import { useUserContext } from "@/contexts/UserContext";

const Index: Component = () => {
  const user = useUserContext();

  const userIngredientsQuery = createQuery(() =>
    userQueries.ingredientsList(user.info),
  );
  const recipesQuery = createQuery(() => recipeQueries.all);

  return (
    <>
      <div class="mb-14 space-y-5 text-balance rounded-3xl bg-blue-400/25 px-8 py-10">
        <h1 class="text-5xl font-bold">
          What you can make, with what you have
        </h1>
        <p>
          Put in ingredients you currently have and we'll find out what you can
          make with them.
        </p>
      </div>

      <div class="mb-5 flex justify-between">
        <h2 class="text-4xl">Recipes</h2>
        <Link
          to="/recipes/new"
          class="flex items-center gap-2 rounded border px-3 py-2 text-lg"
        >
          <PlusIcon />
          Create Recipe
        </Link>
      </div>
      <section class="space-y-4">
        <ErrorBoundary fallback={<div>Error occurred</div>}>
          <Suspense
            fallback={
              <>
                <Skeleton height={120} />
                <Skeleton height={200} />
                <Skeleton height={200} />
                <Skeleton height={200} />
                <Skeleton height={200} />
                <Skeleton height={200} />
              </>
            }
          >
            <Show when={userIngredientsQuery.data !== undefined}>
              <UserIngredientsInput
                initialUserIngredients={userIngredientsQuery.data as string[]}
              />
            </Show>
            <Show
              when={recipesQuery.data?.length ?? 0 > 0}
              fallback={<div>No Recipes to Show</div>}
            >
              <div class="space-y-4">
                <RecipeList
                  recipes={recipesQuery.data ?? []}
                  providedIngredients={new Set(userIngredientsQuery.data ?? [])}
                />
              </div>
            </Show>
          </Suspense>
        </ErrorBoundary>
      </section>
    </>
  );
};

export const Route = createFileRoute("/")({
  component: Index,
});
