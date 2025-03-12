import { Component, ErrorBoundary, Show, Suspense } from "solid-js";
import Skeleton from "@/components/ui/Skeleton";
import { createQuery } from "@tanstack/solid-query";
import { getAllRecipes } from "../api";
import RecipeTable from "./RecipeTable";

const Recipes: Component<{
  class?: string;
  providedIngredients: Set<string>;
}> = (props) => {
  const recipesQuery = createQuery(() => ({
    queryKey: ["recipes"],
    queryFn: getAllRecipes,
  }));

  return (
    <section class={props.class}>
      <div class="space-y-4">
        <ErrorBoundary fallback={<div>Error loading recipes</div>}>
          <Suspense
            fallback={
              <>
                <Skeleton height={40} />
                <Skeleton height={40} />
                <Skeleton height={40} />
                <Skeleton height={40} />
                <Skeleton height={40} />
              </>
            }
          >
            <Show
              when={recipesQuery.data?.length ?? 0 > 0}
              fallback={<div>No Recipes to Show</div>}
            >
              <RecipeTable
                recipes={recipesQuery.data ?? []}
                providedIngredients={props.providedIngredients}
              />
            </Show>
          </Suspense>
        </ErrorBoundary>
      </div>
    </section>
  );
};

export default Recipes;
