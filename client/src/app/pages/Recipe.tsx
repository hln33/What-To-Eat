import { A, useParams } from "@solidjs/router";
import {
  createEffect,
  createResource,
  Index,
  Show,
  type Component,
} from "solid-js";
import { hc } from "hono/client";
import { RecipeType } from "../../../../server/src/routes/recipes";

const recipeEndpoint = hc<RecipeType>("http://localhost:3001/recipes/");

const fetchRecipe = async () => {
  const res = await recipeEndpoint[":id"].$get({ param: { id: "1" } });
  return res.json();
};

const RecipePage: Component = () => {
  const params = useParams();

  const [recipe] = createResource(fetchRecipe);
  createEffect(() => {
    if (recipe.error) {
      console.error(recipe.error);
    }
  });

  return (
    <div class="flex justify-center">
      <div class="flex flex-col items-start gap-6">
        <A
          class="text-lg underline"
          href="/"
        >
          Go Back
        </A>

        {/* display id for testing purposes */}
        <p>id:{params.id}</p>

        <Show when={recipe()}>
          {(recipe) => (
            <>
              <h2 class="text-5xl">{recipe().name}</h2>

              <section>
                <h3 class="text-left text-3xl">Ingredients</h3>
                <ul class="list-inside list-disc text-left">
                  <Index each={recipe().ingredients}>
                    {(item, _index) => <li>{item()}</li>}
                  </Index>
                </ul>
              </section>

              <section class="space-y-2">
                <h3 class="text-left text-3xl">Instructions</h3>
                <ul class="list-outside list-decimal space-y-2 text-left">
                  <Index each={recipe().instructions}>
                    {(item, _index) => <li>{item()}</li>}
                  </Index>
                </ul>
              </section>
            </>
          )}
        </Show>
      </div>
    </div>
  );
};

export default RecipePage;
