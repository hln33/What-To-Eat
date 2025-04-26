import {
  createSignal,
  ErrorBoundary,
  Index,
  Show,
  Suspense,
  type Component,
} from "solid-js";
import { createFileRoute, Link } from "@tanstack/solid-router";
import { Separator } from "@kobalte/core/separator";
import StockImageIcon from "~icons/lucide/image";
import HeartIcon from "~icons/lucide/heart";

import { useUserContext } from "@/contexts/UserContext";
import { SubmittedRecipeForm } from "@/features/recipes/types";
import {
  createRecipeQuery,
  createUpdateRecipeMutation,
} from "@/features/recipes/queries";
import {
  createUserFavoriteRecipeMutation,
  createUserFavoriteRecipesQuery,
  createUserUnfavoriteRecipeMutation,
} from "@/features/users/queries";
import DeleteRecipeDialog from "@/features/recipes/components/DeleteRecipeDialog";
import EditInstructionsDialog from "@/features/recipes/components/EditRecipeDialogs/EditRecipeInstructionsDialog";
import EditRecipeImageAndNameDialog from "@/features/recipes/components/EditRecipeDialogs/EditRecipeImageAndNameDialog";
import RecipePageIngredientSection from "@/features/ingredients/components/RecipePageIngredientSection";
import Skeleton from "@/components/ui/Skeleton";
import Rating from "@/components/ui/Rating";
import Image from "@/components/ui/Image";
import { toast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";

const FavoriteRecipeButton: Component<{ recipeId: string }> = (props) => {
  const user = useUserContext();

  const favoriteRecipesQuery = createUserFavoriteRecipesQuery();
  const favoriteRecipeMutation = createUserFavoriteRecipeMutation();
  const unfavoriteRecipeMutation = createUserUnfavoriteRecipeMutation();

  const isRecipeFavorited = (): boolean => {
    if (favoriteRecipesQuery.data === undefined) {
      return false;
    }
    return favoriteRecipesQuery.data
      .map((entry) => entry.recipeId)
      .includes(parseInt(props.recipeId));
  };
  return (
    <Button
      aria-label={`${isRecipeFavorited() ? "Remove from favorites" : "Add to favorites"}`}
      onClick={() => {
        const userId = parseInt(user.info.id!);
        const recipeId = parseInt(props.recipeId);
        if (isRecipeFavorited()) {
          unfavoriteRecipeMutation.mutate({
            userId,
            recipeId,
          });
        } else {
          favoriteRecipeMutation.mutate({
            userId,
            recipeId,
          });
        }
      }}
    >
      <HeartIcon class={`${isRecipeFavorited() ? "text-pink-500" : ""}`} />
    </Button>
  );
};

const RecipeView: Component = () => {
  const [rating, setRating] = createSignal(3);

  const params = Route.useParams()();
  const user = useUserContext();

  const recipeQuery = createRecipeQuery(params.recipeId);
  const updateRecipeMutation = createUpdateRecipeMutation(params.recipeId);

  const handleRecipeUpdate = (
    updatedField:
      | "image"
      | "name"
      | "ingredients"
      | "instructions"
      | "multiple",
    updatedRecipe: SubmittedRecipeForm,
  ) => {
    const mutationValues = {
      recipeId: params.recipeId,
      recipe: updatedRecipe,
    };
    updateRecipeMutation.mutate(mutationValues, {
      onSuccess: () =>
        toast.success(
          updatedField === "multiple"
            ? "Recipe updated."
            : `Recipe ${updatedField} updated.`,
        ),
      onError: () =>
        toast.error(
          updatedField === "multiple"
            ? "Failed to update recipe. Please try again."
            : `Failed to update recipe ${updatedField}. Please try again.`,
        ),
    });
  };

  const isAbleToEdit = () =>
    recipeQuery.data !== undefined &&
    user.info.isLoggedIn &&
    parseInt(user.info.id) === recipeQuery.data.creatorId;
  const recipeTemplate = (): SubmittedRecipeForm => ({
    ...recipeQuery.data!,
    uploadedImageName: null,
  });

  return (
    <div>
      <nav class="mb-5 flex items-center justify-between">
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
                    <div class="absolute right-2 top-2 flex gap-2">
                      <FavoriteRecipeButton recipeId={params.recipeId} />

                      <EditRecipeImageAndNameDialog
                        initialName={recipeQuery.data!.name}
                        onSubmit={(values) => {
                          handleRecipeUpdate("multiple", {
                            ...recipeTemplate(),
                            name: values.name,
                            uploadedImageName: values.uploadedImageName,
                          });
                        }}
                      />
                    </div>
                  </Show>
                </div>

                <h2 class="z-20 flex self-end p-4 text-5xl drop-shadow-2xl">
                  {recipeQuery.data?.name}
                </h2>
              </div>

              <div>
                <div class="text-3xl">By: {recipeQuery.data?.creator}</div>
                <div class="text-slate-200">
                  Servings: {recipeQuery.data?.servings}
                </div>
                <Rating
                  value={rating}
                  onChange={(rating) => setRating(rating)}
                />
              </div>
              <Separator />
            </div>

            <RecipePageIngredientSection
              ingredients={recipeQuery.data?.ingredients}
              userOwnsRecipe={isAbleToEdit()}
              handleIngredientsUpdate={(updatedIngredients) =>
                handleRecipeUpdate("ingredients", {
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
                      handleRecipeUpdate("instructions", {
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
