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
import StockImageIcon from "~icons/lucide/image";

import { useUserContext } from "@/contexts/UserContext";
import { getRecipe, updateRecipe } from "@/features/recipes/api";
import { SubmittedRecipeForm } from "@/features/recipes/types";
import DeleteRecipeDialog from "@/features/recipes/components/DeleteRecipeDialog";
import EditRecipeNameDialog from "@/features/recipes/components/EditRecipeDialogs/EditRecipeNameDialog";
import EditInstructionsDialog from "@/features/recipes/components/EditRecipeDialogs/EditRecipeInstructionsDialog";
import EditRecipeImageDialog from "@/features/recipes/components/EditRecipeDialogs/EditRecipeImageDialog";
import RecipePageIngredientSection from "@/features/ingredients/components/RecipePageIngredientSection";
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
    updatedField: "image" | "name" | "ingredients" | "instructions",
    updatedRecipe: SubmittedRecipeForm,
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

  const recipeTemplate = (): SubmittedRecipeForm => ({
    ...recipeQuery.data!,
    uploadedImageName: null,
  });

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
            <div class="space-y-5">
              <div class="relative -ml-5 flex h-72 w-screen">
                <div class="absolute z-10 size-full">
                  <div class="size-full opacity-50">
                    <Show
                      when={
                        recipeQuery.data !== undefined &&
                        recipeQuery.data.imageUrl !== null
                      }
                      fallback={
                        <div class="flex size-full items-center justify-center bg-slate-500 pb-12">
                          <StockImageIcon class="size-40" />
                        </div>
                      }
                    >
                      <Image
                        src={recipeQuery.data!.imageUrl!}
                        fallbackWidth={900}
                        fallbackHeight={280}
                      />
                    </Show>
                  </div>
                  <Show when={isAbleToEdit()}>
                    <div class="absolute right-2 top-2">
                      <EditRecipeImageDialog
                        onImageSave={(uploadedImageName) => {
                          handleRecipeFieldUpdate("image", {
                            ...recipeTemplate(),
                            uploadedImageName,
                          });
                        }}
                      />
                    </div>
                  </Show>
                </div>

                <div class="z-20 flex self-end p-4">
                  <h2 class="text-5xl drop-shadow-2xl">
                    {recipeQuery.data?.name}
                  </h2>
                  <Show when={isAbleToEdit()}>
                    <EditRecipeNameDialog
                      initialName={recipeQuery.data!.name}
                      onSubmit={(values) =>
                        handleRecipeFieldUpdate("name", {
                          ...recipeTemplate(),
                          name: values.name,
                        })
                      }
                    />
                  </Show>
                </div>
              </div>

              <div class="text-3xl">By: {recipeQuery.data?.creator}</div>
              <Rating
                value={rating}
                onChange={(rating) => setRating(rating)}
              />
              <Separator />
            </div>

            <RecipePageIngredientSection
              ingredients={recipeQuery.data?.ingredients}
              userOwnsRecipe={isAbleToEdit()}
              handleIngredientsUpdate={(updatedIngredients) =>
                handleRecipeFieldUpdate("ingredients", {
                  ...recipeTemplate(),
                  ingredients: updatedIngredients,
                })
              }
            />

            <section class="space-y-3">
              <div class="flex items-center gap-2">
                <h3 class="text-3xl">Instructions</h3>
                <Show when={isAbleToEdit()}>
                  <EditInstructionsDialog
                    initialInstructions={recipeQuery.data!.instructions}
                    onSubmit={(values) =>
                      handleRecipeFieldUpdate("instructions", {
                        ...recipeTemplate(),
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
