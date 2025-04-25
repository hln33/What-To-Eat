import { Component, ErrorBoundary, Show, Suspense } from "solid-js";
import Skeleton from "@/components/ui/Skeleton";

import { createAllRecipesQuery } from "../queries";
import RecipeTable from "./RecipeTable";

const Recipes: Component<{
  class?: string;
  providedIngredients: Set<string>;
}> = (props) => {
  const recipesQuery = createAllRecipesQuery();

  return (
    <section class={props.class}>
      <div class="space-y-4">
        <ErrorBoundary
          fallback={(e) => <div>Error loading recipes: {e.toString()}</div>}
        >
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
