import {
  createSignal,
  ErrorBoundary,
  Index,
  Show,
  Suspense,
  type Component,
} from "solid-js";
import { createFileRoute, Link } from "@tanstack/solid-router";
import {
  createMutation,
  createQuery,
  useQueryClient,
} from "@tanstack/solid-query";
import { Separator } from "@kobalte/core/separator";

import { getRecipe, updateRecipe } from "@/features/recipes/api";
import DeleteRecipeDialog from "@/features/recipes/components/DeleteRecipeDialog";
import EditIngredientsDialog, {
  EditIngredientsFormValues,
} from "@/features/recipes/components/EditRecipeIngredientsDialog";
import EditInstructionsDialog, {
  EditInstructionsFormValues,
} from "@/features/recipes/components/EditRecipeInstructionsDialog";
import Skeleton from "@/components/ui/Skeleton";
import Rating from "@/components/ui/Rating";
import Image from "@/components/ui/Image";
import { toast } from "@/components/ui/Toast";

const Recipe: Component = () => {
  const queryClient = useQueryClient();
  const params = Route.useParams()();

  const [rating, setRating] = createSignal(3);

  const recipeQuery = createQuery(() => ({
    queryKey: ["recipe", params.recipeId],
    queryFn: () => getRecipe(params.recipeId),
  }));
  const updateRecipeMutation = createMutation(() => ({
    mutationFn: updateRecipe,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["recipe", params.recipeId] }),
  }));

  const onEditIngredientsSubmit = (values: EditIngredientsFormValues) => {
    if (!recipeQuery.data) {
      console.error("Nothing to edit; no recipe loaded.");
      return;
    }

    const recipeWithNewIngredients = {
      recipeId: params.recipeId,
      recipe: {
        ...recipeQuery.data,
        ingredients: values.ingredients,
      },
    };
    updateRecipeMutation.mutate(recipeWithNewIngredients, {
      onSuccess: () => toast.success("Recipe ingredients updated."),
      onError: () =>
        toast.error("Failed to update recipe ingredients. Please try again."),
    });
  };

  const onEditInstructionsSubmit = (values: EditInstructionsFormValues) => {
    if (!recipeQuery.data) {
      console.error("Nothing to edit; no recipe loaded.");
      return;
    }

    const recipeWithNewInstructions = {
      recipeId: params.recipeId,
      recipe: {
        ...recipeQuery.data,
        instructions: values.instructions,
      },
    };
    updateRecipeMutation.mutate(recipeWithNewInstructions, {
      onSuccess: () => toast.success("Recipe instructions updated."),
      onError: () =>
        toast.error("Failed to update recipe instructions. Please try again."),
    });
  };

  return (
    <div class="space-y-10">
      <nav class="flex items-center justify-between">
        <Link
          to="/"
          class="text-lg underline"
        >
          Go Back
        </Link>
        <DeleteRecipeDialog recipeId={params.recipeId} />
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
              <div class="flex items-center gap-2">
                <h3 class="text-3xl">Instructions</h3>
                <Show when={recipeQuery.data?.ingredients}>
                  <EditInstructionsDialog
                    initialInstructions={recipeQuery.data!.instructions}
                    onSubmit={onEditInstructionsSubmit}
                  />
                </Show>
              </div>
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

export const Route = createFileRoute("/recipes/$recipeId")({
  component: Recipe,
});
