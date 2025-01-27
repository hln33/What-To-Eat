import { A, useParams } from "@solidjs/router";
import {
  createEffect,
  createResource,
  Index,
  Show,
  type Component,
} from "solid-js";
import { Separator } from "@kobalte/core/separator";
import { hc } from "hono/client";
import { RecipeType } from "../../../../server/src/routes/recipes";

const recipeEndpoint = hc<RecipeType>("http://localhost:3001/recipes/");
const fetchRecipe = async (id: string) => {
  const res = await recipeEndpoint[":id"].$get({ param: { id } });
  return res.json();
};

const RecipePage: Component = () => {
  const params = useParams();

  const [recipe] = createResource(params.id, fetchRecipe);
  createEffect(() => {
    if (recipe.error) {
      console.error(recipe.error);
    }
  });

  return (
    <div class="w-96 space-y-10">
      <A
        class="flex self-start text-left text-lg underline"
        href="/"
      >
        Go Back
      </A>

      <Show
        when={recipe()}
        fallback={
          <div class="space-y-6">
            <div class="animate-skeleton-fade h-12 rounded-lg bg-slate-300" />
            <div class="animate-skeleton-fade h-32 rounded-lg bg-slate-300" />
            <div class="animate-skeleton-fade h-52 rounded-lg bg-slate-300" />
          </div>
        }
      >
        {(recipe) => (
          <section class="space-y-12 text-left">
            <div class="space-y-5">
              <h2 class="text-5xl">{recipe().name}</h2>
              <Separator />
            </div>

            <section class="space-y-3">
              <h3 class="text-3xl">Ingredients</h3>
              <ul class="list-inside list-disc">
                <Index each={recipe().ingredients}>
                  {(ingredient, _index) => <li>{ingredient()}</li>}
                </Index>
              </ul>
            </section>

            <section class="space-y-3">
              <h3 class="text-3xl">Instructions</h3>
              <ul class="list-outside list-decimal space-y-5">
                <Index each={recipe().instructions}>
                  {(instruction, _index) => <li>{instruction()}</li>}
                </Index>
              </ul>
            </section>
          </section>
        )}
      </Show>
    </div>
  );
};

export default RecipePage;
