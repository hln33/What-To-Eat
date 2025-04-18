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

import { useUserContext } from "@/contexts/UserContext";
import { getRecipe, updateRecipe } from "@/features/recipes/api";
import { Recipe } from "@/features/recipes/types";
import DeleteRecipeDialog from "@/features/recipes/components/DeleteRecipeDialog";
import EditRecipeNameDialog from "@/features/recipes/components/EditRecipeDialogs/EditRecipeNameDialog";
import EditInstructionsDialog from "@/features/recipes/components/EditRecipeDialogs/EditRecipeInstructionsDialog";
import EditIngredientsDialog from "@/features/recipes/components/EditRecipeDialogs/EditRecipeIngredientsDialog";
import Skeleton from "@/components/ui/Skeleton";
import Rating from "@/components/ui/Rating";
import Image from "@/components/ui/Image";
import { toast } from "@/components/ui/Toast";

const RecipeView: Component = () => {
  const queryClient = useQueryClient();
  const params = Route.useParams()();
  const user = useUserContext();

  const recipeQuery = createQuery(() => ({
    queryKey: ["recipe", params.recipeId],
    queryFn: () => getRecipe(params.recipeId),
  }));
  const updateRecipeMutation = createMutation(() => ({
    mutationFn: updateRecipe,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["recipe", params.recipeId] }),
  }));

  const [rating, setRating] = createSignal(3);

  const handleRecipeFieldUpdate = (
    updatedField: "name" | "ingredients" | "instructions",
    updatedRecipe: Recipe,
  ) => {
    if (!recipeQuery.data) {
      console.error("Nothing to edit; no recipe loaded.");
      return;
    }

    const recipeWithUpdatedField = {
      recipeId: params.recipeId,
      recipe: updatedRecipe,
    };
    updateRecipeMutation.mutate(recipeWithUpdatedField, {
      onSuccess: () => toast.success(`Recipe ${updatedField} updated.`),
      onError: () =>
        toast.error(
          `Failed to update recipe ${updatedField}. Please try again.`,
        ),
    });
  };

  const isAbleToEdit = () =>
    recipeQuery.data !== undefined &&
    user.info.isLoggedIn &&
    parseInt(user.info.id) === recipeQuery.data.creatorId;

  return (
    <div class="space-y-10">
      <nav class="flex items-center justify-between">
        <Link
          to="/"
          class="text-lg underline"
        >
          Go Back
        </Link>
        <Show when={isAbleToEdit()}>
          <DeleteRecipeDialog recipeId={params.recipeId} />
        </Show>
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
              <div class="flex gap-2">
                <h2 class="text-5xl">{recipeQuery.data?.name}</h2>
                <Show when={isAbleToEdit()}>
                  <EditRecipeNameDialog
                    initialName={recipeQuery.data!.name}
                    onSubmit={(values) =>
                      handleRecipeFieldUpdate("name", {
                        ...recipeQuery.data!,
                        name: values.name,
                      })
                    }
                  />
                </Show>
              </div>
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
                <Show when={isAbleToEdit()}>
                  <EditIngredientsDialog
                    initialIngredients={recipeQuery.data!.ingredients}
                    onSubmit={(values) =>
                      handleRecipeFieldUpdate("ingredients", {
                        ...recipeQuery.data!,
                        ingredients: values.ingredients,
                      })
                    }
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
                <Show when={isAbleToEdit()}>
                  <EditInstructionsDialog
                    initialInstructions={recipeQuery.data!.instructions}
                    onSubmit={(values) =>
                      handleRecipeFieldUpdate("instructions", {
                        ...recipeQuery.data!,
                        instructions: values.instructions,
                      })
                    }
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
  component: RecipeView,
});
