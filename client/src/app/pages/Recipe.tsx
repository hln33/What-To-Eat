import { ErrorBoundary, For, Index, Suspense, type Component } from "solid-js";
import { A, useParams } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import { Separator } from "@kobalte/core/separator";
import StarIcon from "~icons/fe/star";

import { getRecipe } from "@/features/recipes/api";
import DeleteRecipeDialog from "@/features/recipes/components/DeleteRecipeDialog";
import Skeleton from "@/components/ui/Skeleton";

const RecipePage: Component = () => {
  const params = useParams();

  const recipeQuery = createQuery(() => ({
    queryKey: ["recipe", params.id],
    queryFn: () => getRecipe(params.id),
  }));

  const MAX_RATING = 5;
  const rating = 3;

  return (
    <div class="space-y-10">
      <nav class="flex items-center justify-between">
        <A
          class="text-lg underline"
          href="/"
        >
          Go Back
        </A>
        <DeleteRecipeDialog recipeId={params.id} />
      </nav>

      <ErrorBoundary fallback={<div>{recipeQuery.error?.message}</div>}>
        <Suspense
          fallback={
            <div class="space-y-6">
              <Skeleton height={40} />
              <Skeleton height={128} />
              <Skeleton height={208} />
            </div>
          }
        >
          <section class="space-y-12 text-left">
            <div class="space-y-5">
              <h2 class="text-5xl">{recipeQuery.data?.name}</h2>
              <div
                class="flex"
                aria-label={`Rating: ${rating} out of ${MAX_RATING} stars`}
              >
                <For each={Array(rating)}>
                  {() => <StarIcon>rating</StarIcon>}
                </For>
                <For each={Array(MAX_RATING - rating)}>
                  {() => <StarIcon class="text-slate-500">rating</StarIcon>}
                </For>
              </div>
              <Separator />
            </div>

            <section class="space-y-3">
              <h3 class="text-3xl">Ingredients</h3>
              <ul class="list-inside list-disc">
                <Index each={recipeQuery.data?.ingredients}>
                  {(ingredient) => <li>{ingredient()}</li>}
                </Index>
              </ul>
            </section>

            <section class="space-y-3">
              <h3 class="text-3xl">Instructions</h3>
              <ul class="list-inside list-decimal space-y-5">
                <Index each={recipeQuery.data?.instructions}>
                  {(instruction) => <li>{instruction()}</li>}
                </Index>
              </ul>
            </section>
          </section>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default RecipePage;
