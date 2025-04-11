import {
  createSignal,
  ErrorBoundary,
  Index,
  Show,
  Suspense,
  type Component,
} from "solid-js";
import { A, useParams } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import { Separator } from "@kobalte/core/separator";
import { createForm } from "@modular-forms/solid";
import { DialogTriggerProps } from "@kobalte/core/dialog";
import PencilIcon from "~icons/lucide/pencil";

import { getRecipe } from "@/features/recipes/api";
import DeleteRecipeDialog from "@/features/recipes/components/DeleteRecipeDialog";
import { RecipeForm } from "@/features/recipes/types";
import RecipeInputIngredients from "@/features/recipes/components/RecipeInputIngredients";
import Skeleton from "@/components/ui/Skeleton";
import Rating from "@/components/ui/Rating";
import Image from "@/components/ui/Image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";

const EditIngredientsDialog: Component = () => {
  const [open, setOpen] = createSignal(false);

  const [form, { Form }] = createForm<RecipeForm>({
    initialValues: {
      ingredients: [{ amount: 0, unit: undefined, name: "" }],
    },
  });

  return (
    <Dialog
      open={open()}
      setOpen={setOpen}
    >
      <DialogTrigger
        as={(props: DialogTriggerProps) => (
          <Button
            variant="subtle"
            {...props}
          >
            <PencilIcon />
          </Button>
        )}
      />

      <DialogContent title="Ingredients">
        <Form>
          <RecipeInputIngredients form={form} />
          <div class="mt-8 flex justify-end gap-4">
            <Button
              variant="subtle"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              color="blue"
              variant="filled"
              onClick={() => setOpen(false)}
            >
              Save
            </Button>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const RecipePage: Component = () => {
  const params = useParams();

  const recipeQuery = createQuery(() => ({
    queryKey: ["recipe", params.id],
    queryFn: () => getRecipe(params.id),
  }));

  const [rating, setRating] = createSignal(3);

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
                <EditIngredientsDialog />
              </div>
              <ul class="list-inside list-disc">
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
