import {
  Component,
  createEffect,
  createResource,
  For,
  Suspense,
} from "solid-js";
import { hc } from "hono/client";
import RecipeListCard from "./RecipeListCard";
import { RecipeType } from "../../../../../server/src/routes/recipes";
import { Skeleton } from "@kobalte/core/skeleton";

const recipeEndpoint = hc<RecipeType>("http://localhost:3001/recipes/");
const fetchAllRecipes = async () => {
  const res = await recipeEndpoint.index.$get();
  return res.json();
};

const RecipeList: Component<{ providedIngredients: Set<string> }> = (props) => {
  const [recipes] = createResource(fetchAllRecipes);
  createEffect(() => {
    if (recipes.error) {
      console.error(`Error fetching recipes: ${recipes.error}`);
    }
  });

  return (
    <section>
      <h2 class="mb-5 text-4xl">Recipe List</h2>

      <div class="space-y-4">
        <Suspense
          fallback={
            <Skeleton
              class="rounded bg-gray-400"
              height={30}
            />
          }
        >
          <For each={recipes()}>
            {(item, index) => (
              <RecipeListCard
                id={index()}
                name={item.name}
                requiredIngredients={new Set(item.ingredients)}
                providedIngredients={props.providedIngredients}
              />
            )}
          </For>
        </Suspense>
      </div>
    </section>
  );
};

export default RecipeList;
