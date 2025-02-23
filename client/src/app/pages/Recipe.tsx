import { A, useParams } from "@solidjs/router";
import {
  createEffect,
  createResource,
  Index,
  Suspense,
  type Component,
} from "solid-js";
import { Separator } from "@kobalte/core/separator";
import { hc } from "hono/client";
import { RecipeType } from "../../../../server/src/routes/recipes";
import Skeleton from "../../components/Skeleton";

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
    <div class="space-y-10">
      <A
        class="flex text-left text-lg underline"
        href="/"
      >
        Go Back
      </A>

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
            <h2 class="text-5xl">{recipe()?.name}</h2>
            <Separator />
          </div>

          <section class="space-y-3">
            <h3 class="text-3xl">Ingredients</h3>
            <ul class="list-inside list-disc">
              <Index each={recipe()?.ingredients}>
                {(ingredient, _index) => <li>{ingredient()}</li>}
              </Index>
            </ul>
          </section>

          <section class="space-y-3">
            <h3 class="text-3xl">Instructions</h3>
            <ul class="list-outside list-decimal space-y-5">
              <Index each={recipe()?.instructions}>
                {(instruction, _index) => <li>{instruction()}</li>}
              </Index>
            </ul>
          </section>
        </section>
      </Suspense>
    </div>
  );
};

export default RecipePage;
