import {
  createSignal,
  ErrorBoundary,
  Index,
  Show,
  Suspense,
  type Component,
} from "solid-js";
import { A, useParams } from "@solidjs/router";
import { createMutation, createQuery } from "@tanstack/solid-query";
import { Separator } from "@kobalte/core/separator";

import { getRecipe, updateRecipe } from "@/features/recipes/api";
import DeleteRecipeDialog from "@/features/recipes/components/DeleteRecipeDialog";
import EditIngredientsDialog, {
  EditIngredientsFormValues,
} from "@/features/recipes/components/EditRecipeDialog";
import Skeleton from "@/components/ui/Skeleton";
import Rating from "@/components/ui/Rating";
import Image from "@/components/ui/Image";

const RecipePage: Component = () => {
  const params = useParams();

  const recipeQuery = createQuery(() => ({
    queryKey: ["recipe", params.id],
    queryFn: () => getRecipe(params.id),
  }));

  const [rating, setRating] = createSignal(3);

  const updateRecipeMutation = createMutation(() => ({
    mutationFn: updateRecipe,
  }));

  const onEditIngredientsSubmit = (values: EditIngredientsFormValues) => {
    if (!recipeQuery.data) {
      console.error("Nothing to edit; no recipe loaded.");
      return;
    }

    updateRecipeMutation.mutate({
      recipeId: params.id,
      recipe: { ...recipeQuery.data, ingredients: values.ingredients },
    });
  };

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
          <section class="flex flex-col space-y-8 text-left">
            <Show
              when={
                recipeQuery.data !== undefined &&
                recipeQuery.data.imageUrl !== null
              }
            >
              <Image
                class="h-72 w-96 self-center"
                src={recipeQuery.data!.imageUrl!}
                fallbackWidth={380}
                fallbackHeight={250}
              />
            </Show>

            <div class="space-y-5">
              <h2 class="text-5xl">{recipeQuery.data?.name}</h2>
              <div class="text-3xl">By: {recipeQuery.data?.creator}</div>
              <Rating
                value={rating}
                onChange={(rating) => setRating(rating)}
              />
              <Separator />
            </div>

            <section class="space-y-3">
              <div class="flex items-center gap-2">
                <h3 class="text-3xl">Ingredients</h3>
                <Show when={recipeQuery.data?.ingredients}>
                  <EditIngredientsDialog
                    initialIngredients={recipeQuery.data!.ingredients}
                    onSubmit={onEditIngredientsSubmit}
                  />
                </Show>
              </div>
              <ul class="list-inside list-disc text-slate-100">
                <Index each={recipeQuery.data?.ingredients}>
                  {(ingredient) => (
                    <li>
                      {ingredient().amount} {ingredient().unit}{" "}
                      {ingredient().name}
                    </li>
                  )}
                </Index>
              </ul>
            </section>

            <section class="space-y-3">
              <h3 class="text-3xl">Instructions</h3>
              <ul class="list-inside list-decimal space-y-5 text-slate-100">
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
